import { Stack, Typography, Card, CardContent, Box } from "@mui/material";

export default function Feature1() {
  const cardMinWidth = { xs: 230, sm: 330 };
  const previewBoxSizes = { xs: 230, sm: 330 };
  const previewBoxMargins = { xs: "auto" };

  return (
    <>
      <Stack
        direction={"column"}
        sx={{
          padding: "4rem 1rem 7rem 1rem",
          backgroundColor: "whitesmoke",
        }}
      >
        <Typography variant="h4" align="center">
          Keep Up Effortlessly
        </Typography>
        <Stack direction={"row"} justifyContent={"center"} marginTop={4} flexWrap={"wrap"} gap={3}>
          <Card sx={{ minWidth: cardMinWidth }}>
            <CardContent>
              <Typography variant="h6" align={"center"}>
                Import Your Syllabus in Seconds
              </Typography>
              <Typography variant="body1" color="text.secondary" align={"center"}>
                Send class deadlines to your calendar.
              </Typography>
              <Box
                sx={{
                  bgcolor: "whitesmoke",
                  height: previewBoxSizes,
                  width: previewBoxSizes,
                  borderRadius: 2,
                  mx: previewBoxMargins,
                  mb: previewBoxMargins,
                  mt: 1,
                }}
              ></Box>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: cardMinWidth }}>
            <CardContent>
              <Typography variant="h6" align={"center"}>
                Stay on Top of Every Task
              </Typography>
              <Typography variant="body1" color="text.secondary" align={"center"}>
                All your notes and to-dos in one place.
              </Typography>
              <Box
                sx={{
                  bgcolor: "whitesmoke",
                  height: previewBoxSizes,
                  width: previewBoxSizes,
                  borderRadius: 2,
                  mx: previewBoxMargins,
                  mb: previewBoxMargins,
                  mt: 1,
                }}
              ></Box>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: cardMinWidth }}>
            <CardContent>
              <Typography variant="h6" align={"center"}>
                Focus Without Distractions
              </Typography>
              <Typography variant="body1" color="text.secondary" align={"center"}>
                Block noise, lock in, and get work done.
              </Typography>
              <Box
                sx={{
                  bgcolor: "whitesmoke",
                  height: previewBoxSizes,
                  width: previewBoxSizes,
                  borderRadius: 2,
                  mx: previewBoxMargins,
                  mb: previewBoxMargins,
                  mt: 1,
                }}
              ></Box>
            </CardContent>
          </Card>
        </Stack>
      </Stack>
    </>
  );
}
