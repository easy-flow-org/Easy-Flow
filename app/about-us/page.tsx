import { Box, Typography, Stack } from "@mui/material";
import AboutMeNav from "@/components/AboutPage/AboutMeNav";
import AboutPerson from "@/components/AboutPage/AboutPerson";

export default function AboutUsPage() {
  return (
    <Box>
      <AboutMeNav />

      <Box sx={{ padding: '2rem' }}>
        <Stack direction="column" gap="1rem" sx={{ alignItems: "center", textAlign: "center" }}>
          <Typography variant="h2" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '700px' }}>
            Welcome to the About Us page! This is where you can learn more about Easy Flow.
          </Typography>
        </Stack>

        <Stack direction="column" gap="2rem" sx={{ marginTop: "2rem", alignItems: "center" }}>
          <AboutPerson
            name="Rowby Villanueva"
            imageSrc="/default-avatar.png"
            summary="Computer Science senior at CUNY Lehman College, passionate about mobile dev."
          />
          {/* Add more team members here */}
        </Stack>
      </Box>
    </Box>
  );
}
