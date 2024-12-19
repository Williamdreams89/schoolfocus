import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Avatar,
  Link,
  CircularProgress,
} from "@mui/material";
import { Facebook, Twitter, LinkedIn } from "@mui/icons-material";
import axios from "axios";
import { TextInput } from "@mantine/core";
import useMediaQuery from "@mui/material/useMediaQuery";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    setError("");
    setLoading(true);
    
    try {
      const response = await axios.post("https://schoolfocusapi.onrender.com/users/login/", {
        email,
        password,
      });

      const { token } = response.data; // Adjust based on your API response
      localStorage.setItem("access_token", `${token}`); // Save the token for authenticated requests
      window.location.href = "/"; // Redirect on successful login
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isSmallDevice = useMediaQuery("(max-width:1045px)")

  return (
    <Box
      display="flex"
      height="100vh"
      width={"100vw"}
      sx={{ overflow: "hidden", position: "fixed", top: 0, bottom: 0 }}
    >
      {/* Left Column */}
      {isSmallDevice &&<Box
        flex={1}
        bgcolor="#1E88E5"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        color="white"
        padding={4}
        height={"100%"}
      >
        <Avatar
          src="/images/logo.png" // Replace with your logo path
          sx={{ width: 100, height: 100, marginBottom: 2 }}
        />
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          DREAMS INTERNATIONAL COMPLEX
        </Typography>
        <Box mt={2}>
          <Typography>📧 wdanquah@stu.ucc.edu.gh | 📞 +233543921309</Typography>
        </Box>
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Facebook fontSize="large" />
          <Twitter fontSize="large" />
          <LinkedIn fontSize="large" />
        </Box>
        <Box mt={2}>
          <Typography fontSize="small">
            Powered by{" "}
            <Link href="https://willconsult.vercel.app" color="inherit">
              DFam Consult
            </Link>
          </Typography>
        </Box>
      </Box>}

      {/* Right Column */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        padding={4}
      >
        <Box
          width="100%"
          maxWidth="400px"
          textAlign="center"
          marginBottom={3}
        >
          {/* {error?<p style={{color:'red'}}>{error}</p>:null} */}
          <Avatar sx={{ margin: "0 auto", bgcolor: "primary.main" }}>
            {/* Optional Icon */}
          </Avatar>
          <Typography variant="h5" fontWeight="bold" mt={2}>
            Admin Login
          </Typography>
        </Box>
        <Box
          width="100%"
          maxWidth="400px"
          component="form"
          onSubmit={handleLogin}
        >
          <TextInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Keep me logged in"
            sx={{ mt: 1 }}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "SIGN IN"}
          </Button>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Link href="#" underline="none">
              Forgot Password?
            </Link>
            <Link href="#" underline="none">
              Don't Have an Account?
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
