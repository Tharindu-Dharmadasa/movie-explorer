import { Alert, Button, Box } from "@mui/material";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <Box sx={{ my: 3 }}>
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
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
