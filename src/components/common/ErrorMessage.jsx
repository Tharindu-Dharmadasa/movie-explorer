import { Alert, Button, Box } from "@mui/material";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <Box sx={{ my: 3 }}>
      <Alert
        sx={{
          p: 3, // Increases padding significantly (24px)
          fontSize: "1.15rem", // Makes the text larger
          alignItems: "center", // Centers the large icon vertically with the text
          "& .MuiAlert-icon": {
            fontSize: "2.25rem", // Makes the alert icon much larger
          },
        }}
        severity="error"
        action={
          onRetry && (
            <Button color="inherit" size="large" onClick={onRetry}>
              Retry
            </Button>
          )
        }
      >
        {message}
      </Alert>
    </Box>
  );
}
