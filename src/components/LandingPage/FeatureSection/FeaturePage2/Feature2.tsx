import { Card, Grid, Stack, Typography } from "@mui/material";

export default function Feature2() {
  const responsivePadding = { xs: "3rem 1rem 10rem 1rem", sm: "3rem 3rem 10rem 3rem",md: "3rem 5rem 10rem 5rem" };
  // For grid
  const responsiveCardSizes = { xs: 12, md: 6 };

  const cards = [
    {
      title: "One app, total control",
      desc: "Manage deadlines, notes, and to-dos without the chaos.",
    },
    {
      title: "Work smarter, not harder",
      desc: "Get reminders that actually help you plan ahead.",
    },
    {
      title: "Designed for deep focus",
      desc: "No distractions, just you and your goals.",
    },
    {
      title: "Built for students, loved by achievers",
      desc: "Everything you need to stay on top and organized.",
    },
  ].map((item) => (
    <Grid size={responsiveCardSizes}>
      <Card sx={{ padding: ".5rem", height: "100%" }}>
        <Typography variant="h6" align="center" sx={{ marginBottom: 1.5 }}>
          {item.title}
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          {item.desc}
        </Typography>
      </Card>
    </Grid>
  ));

  return (
    <>
      <Grid
        container
        sx={{
          padding: responsivePadding,
          backgroundColor: "whitesmoke",
        }}
        spacing={4}
      >
        <Grid size={12}>
          <Typography variant="h4" align="center">
            Why Easyflow?
          </Typography>
        </Grid>
        {cards}
      </Grid>
    </>
  );
}
