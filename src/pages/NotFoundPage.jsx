import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        p: 2,
      }}
    >
      <Box>
        <Typography variant="h2" fontWeight={800}>
          404
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          This page doesn't exist.
        </Typography>
        <Button component={Link} to="/" variant="contained">
          Back to home
        </Button>
      </Box>
    </Box>
  );
}
