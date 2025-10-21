import { Card, Grid, Stack, Typography } from "@mui/material";

export default function Feature2() {
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
    <Grid size={6}>
      <Card sx={{ padding: ".5rem", height: "100%"}}>
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
          padding: "3rem 6rem 14rem 6rem",
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
