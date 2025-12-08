import { Box, Button, TextField, Typography, Paper } from "@mui/material";

const LoginPage = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: 350,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
        >
          Login
        </Typography>

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
        />

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;
