import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useUpdateUserMutation } from "../state/api";
import PropTypes from 'prop-types';

const ChangeCredentials = ({ setUsername = () => {} }) => {
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [updateUser] = useUpdateUserMutation();

  const userId = 1; // Ideally this should be dynamically set based on the logged-in user's ID

  const handleChangeCredentials = async () => {
    console.log("Attempting to update credentials");

    setUsernameError("");
    setPasswordError("");

    if (newUsername.trim() === "") {
      setUsernameError("New username is required");
      console.error("Validation failed: username is required");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      console.error("Validation failed: password must be at least 8 characters long");
      return;
    }

    try {
      console.log(`Sending update request for user ID ${userId}`);
      const updateResponse = await updateUser({
        userId,
        updatedData: { username: newUsername, newPassword },
      }).unwrap();

      console.log("Update response received:", updateResponse);

      if (updateResponse && updateResponse.message === "User updated successfully") {
        setMessage("Credentials updated successfully.");
        if (typeof setUsername === 'function') {
          setUsername(newUsername);
        }
        console.log("Credentials updated successfully for:", newUsername);
      } else {
        throw new Error("Update failed with message: " + updateResponse.message);
      }
    } catch (error) {
      console.error("Error updating credentials:", error);
      setMessage(error.message || "Failed to update credentials.");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          boxShadow: 'none' // This removes the shadow from the Card
        }}
      >
        <Typography component="h1" variant="h5">
          Change Credentials
        </Typography>
        <Box sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="New Username"
            autoComplete="username"
            value={newUsername}
            onChange={(e) => {
              console.log("New username set:", e.target.value);
              setNewUsername(e.target.value);
            }}
            error={!!usernameError}
            helperText={usernameError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="New Password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => {
              console.log("New password set: [HIDDEN]"); 
              setNewPassword(e.target.value);
            }}
            error={!!passwordError}
            helperText={passwordError}
          />
          <Button
            type="button"
            fullWidth
            variant="outlined"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleChangeCredentials}
          >
            Change Credentials
          </Button>
        </Box>
      </Card>
      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage("")}
      >
        <Alert
          onClose={() => setMessage("")}
          severity="info"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

ChangeCredentials.propTypes = {
  setUsername: PropTypes.func,
};

export default ChangeCredentials;
