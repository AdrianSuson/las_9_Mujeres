import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../../state/api';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = ({ setLoggedIn, setUsername }) => {
  const [username, setUsernameState] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleLogin = async () => {
    setUsernameError("");
    setPasswordError("");
    if (username.trim() === "") {
      setUsernameError("Please enter your username");
      return;
    }
    if (password === "") {
      setPasswordError("Please enter a password");
      return;
    }

    try {
      const loginResponse = await loginUser({ username, password }).unwrap();
      if (loginResponse?.message === "success") {
        localStorage.setItem("user", JSON.stringify({ username, token: loginResponse.token }));
        setLoggedIn(true);
        setUsername(username);
        navigate("/dashboard");
      } else {
        setMessage("Login failed: Wrong username or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("Login failed: Wrong username or password");
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", justifyContent: "center", alignItems: "center" }}>
      <Card sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Sign in</Typography>
        <Box sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsernameState(e.target.value)}
            error={!!usernameError}
            helperText={usernameError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
            disabled={isLoading}
          >
            Sign In
          </Button>
        </Box>
      </Card>
      <Snackbar open={!!message} autoHideDuration={6000} onClose={() => setMessage("")}>
        <Alert onClose={() => setMessage("")} severity="info" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

Login.propTypes = {
  setLoggedIn: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
};

export default Login;
