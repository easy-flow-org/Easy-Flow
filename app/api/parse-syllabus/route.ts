import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Claude API key not configured' }, { status: 500 });
    }

    const formData = await request.formData();
    // Debug: log incoming content-type and form keys to help diagnose 400 errors
    try {
      console.log('parse-syllabus: content-type=', request.headers.get('content-type'))
      console.log('parse-syllabus: form keys=', Array.from(formData.keys()))
    } catch (e) {
      console.warn('parse-syllabus: failed to log headers/form keys', e)
    }

    const file = formData.get('file') as File;
    try {
      const fAny: any = file as any
      console.log('parse-syllabus: received file', { name: fAny?.name, type: fAny?.type, size: fAny?.size })
    } catch (e) {
      console.warn('parse-syllabus: failed to log file metadata', e)
    }
    if (!file)
      return NextResponse.json(
        { error: 'No file provided', note: 'Ensure the client sends a FormData field named "file"' },
        { status: 400 }
      );

    // Extract text (support TXT and DOCX); PDF support requires pdf-parse which
    // may need native bindings in your environment. For reliable parsing, prefer DOCX or TXT uploads.
    let extractedText = '';
    try {
      if (file.type === 'text/plain') {
        extractedText = await file.text();
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // lazy-import mammoth
        const mammoth = await import('mammoth');
        const buffer = await file.arrayBuffer();
        const res = await mammoth.extractRawText({ buffer: Buffer.from(buffer) } as any);
        extractedText = res.value || '';
      } else if (file.type === 'application/pdf') {
        // Attempt pdf parsing if pdf-parse is available; otherwise return an error.
        try {
          const pdfParse = (await import('pdf-parse')) as any;
          const buffer = await file.arrayBuffer();
          const data = await pdfParse(Buffer.from(buffer));
          extractedText = data?.text || '';
        } catch (e) {
          console.warn('pdf-parse not available or failed:', e);
          return NextResponse.json({ error: 'PDF parsing not available in this environment. Please upload DOCX or TXT.' }, { status: 400 });
        }
      } else {
        const accepted = [
          'text/plain',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/pdf',
        ]
        return NextResponse.json(
          {
            error: 'Unsupported file type',
            receivedType: file.type,
            fileName: process.env.NODE_ENV !== 'production' ? (file?.name || null) : undefined,
            acceptedTypes: accepted,
            note: 'Please upload DOCX or TXT (PDF only if pdf-parse is available in this environment)'.trim(),
          },
          { status: 400 }
        )
      }
    } catch (e) {
      console.error('File extraction error:', e);
      return NextResponse.json({ error: 'Failed to extract text from file' }, { status: 400 });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        {
          error: 'No text could be extracted from file',
          receivedType: file.type,
          fileName: process.env.NODE_ENV !== 'production' ? (file?.name || null) : undefined,
          extractedLength: extractedText ? extractedText.length : 0,
          note: 'This can happen for image uploads or protected PDFs; try DOCX or plain TXT for best results.',
        },
        { status: 400 }
      )
    }

    // Truncate long texts to avoid hitting token limits
    const truncatedText = extractedText.slice(0, 50000);

    // Build the prompt for Claude
    const prompt = `You are a syllabus parser. Extract all relevant course and assignment information from the following syllabus text and return it as a JSON object.

Return EXACTLY this JSON structure (use null for missing fields, empty arrays for missing lists):
{
  "courseTitle": "course name/title",
  "meetingDays": "full day names like 'Monday, Wednesday, Friday'",
  "startTime": "HH:MM in 24-hour format",
  "endTime": "HH:MM in 24-hour format",
  "instructor": "instructor name or null",
  "location": "classroom location or null",
  "semester": "semester info or null",
  "description": "course description",
  "courseObjectives": ["array of learning objectives"],
  "assignments": [
    {
      "title": "assignment name",
      "description": "details",
      "dueDate": "YYYY-MM-DD or null",
      "weight": null
    }
  ],
  "exams": [
    {
      "title": "exam name",
      "description": "details",
      "date": "YYYY-MM-DD or null",
      "weight": null
    }
  ],
  "requirements": ["array of course requirements"],
  "gradingScale": "grading scale description or null",
  "policies": ["array of important policies"],
  "notes": "detailed syllabus notes combining all important information"
}

CRITICAL INSTRUCTIONS:
- Parse meeting days to FULL names (MWF -> Monday, Wednesday, Friday, TR -> Tuesday, Thursday)
- Return ONLY valid JSON, no markdown code blocks, no backticks, no extra text before or after
- Dates in YYYY-MM-DD format only
- Times in 24-hour HH:MM format only (e.g., 14:30 for 2:30 PM)
- For percentages/weights, return numbers or null (e.g., 25)
- Extract ALL assignments and exams with their due dates
- If you cannot find specific information, use null or empty arrays

Syllabus text:
${truncatedText}`;

    // Call Anthropic (Claude) and handle errors cleanly
    let message: any;
    try {
      message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      });
    } catch (aiError: any) {
      console.error('Anthropic API error:', aiError);
      const details = aiError?.response?.data || aiError?.message || String(aiError);
      return NextResponse.json({ error: 'AI parsing failed', details }, { status: 502 });
    }

    const responseText = message?.content && message.content[0]?.type === 'text' ? message.content[0].text : '';
    
    if (!responseText) {
      console.error('Empty response from AI');
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 });
    }

    let parsedData: any;
    try {
      // Remove markdown code blocks if present
      let cleanedResponse = responseText.trim();
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Find JSON in response
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in AI response:', responseText.substring(0, 500));
        return NextResponse.json({ error: 'Failed to parse response from AI', details: responseText.substring(0, 500) }, { status: 400 });
      }
      
      parsedData = JSON.parse(jsonMatch[0]);
      
      // Validate required fields exist
      if (!parsedData.courseTitle) {
        parsedData.courseTitle = 'Untitled Course';
      }
      if (!parsedData.meetingDays) {
        parsedData.meetingDays = 'Monday, Wednesday, Friday';
      }
      if (!parsedData.startTime) {
        parsedData.startTime = '09:00';
      }
      if (!parsedData.endTime) {
        parsedData.endTime = '10:30';
      }
      if (!parsedData.assignments) {
        parsedData.assignments = [];
      }
      if (!parsedData.exams) {
        parsedData.exams = [];
      }
      
    } catch (parseError) {
      console.error('Failed to parse JSON from AI response:', parseError);
      console.error('Response was:', responseText.substring(0, 500));
      return NextResponse.json({ error: 'Failed to parse AI response as JSON', details: responseText.substring(0, 500) }, { status: 400 });
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error parsing syllabus:', error);
    return NextResponse.json({ error: 'Failed to parse syllabus', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}