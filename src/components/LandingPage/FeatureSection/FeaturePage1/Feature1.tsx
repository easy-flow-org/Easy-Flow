import { Stack, Typography, Card, CardContent, Box } from "@mui/material";

export default function Feature1() {
  const cardMaxWidth = "330px";

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
          <Card sx={{ minWidth: cardMaxWidth }}>
            <CardContent>
              <Typography variant="h6" align={"center"}>
                Import Your Syllabus in Seconds
              </Typography>
              <Typography variant="subtitle1" align={"center"}>
                Send class deadlines to your calendar.
              </Typography>
              <Box
                sx={{ backgroundColor: "whitesmoke" }}
                height={300}
                width={300}
                borderRadius={2}
                margin={"auto"}
                marginTop={1}
              ></Box>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: cardMaxWidth }}>
            <CardContent>
              <Typography variant="h6" align={"center"}>
                Stay on Top of Every Task
              </Typography>
              <Typography variant="subtitle1" align={"center"}>
                All your notes and to-dos in one place.
              </Typography>
              <Box
                sx={{ backgroundColor: "whitesmoke" }}
                height={300}
                width={300}
                borderRadius={2}
                margin={"auto"}
                marginTop={1}
              ></Box>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: cardMaxWidth }}>
            <CardContent>
              <Typography variant="h6" align={"center"}>
                Focus Without Distractions
              </Typography>
              <Typography variant="subtitle1" align={"center"}>
                Block noise, lock in, and get work done.
              </Typography>
              <Box
                sx={{ backgroundColor: "whitesmoke" }}
                height={300}
                width={300}
                borderRadius={2}
                margin={"auto"}
                marginTop={1}
              ></Box>
            </CardContent>
          </Card>
        </Stack>
      </Stack>
    </>
  );
}
