import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Button } from "@mui/material";
import PinInput from "react-pin-input";
import useMediaQuery from "@mui/material/useMediaQuery"
import { useNavigate } from "react-router-dom";

// Define props for LockScreen
interface LockScreenProps {
  onUnlock: () => void; // Callback to handle unlocking
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [inactiveTime, setInactiveTime] = useState(0);
  const [pinError, setPinError] = useState(false); 
  const navigate = useNavigate()

  const correctPin = "2021"; // Correct PIN

  const handleComplete = (pin: string) => {
    console.log("Entered PIN:", pin);

    if (pin === correctPin) {
      console.log("Access granted");
      setPinError(false); // Reset the error state
      onUnlock(); // Call the onUnlock callback
      // navigate("/")
    } else {
      console.log("Incorrect PIN");
      setPinError(true); // Display error message
    }
  };

  const isSmallDevice = useMediaQuery("(max-width:1045px)")

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      marginTop={'4rem'}
    >
        <Box sx={{display:'flex', flexDirection:'column-reverse', justifyContent:'center', alignItems:'center'}}>
            <Typography variant="h6" mb={1}>
            Dreams International Complex
            </Typography>
            <img src="images/logo.png" width={40} />
        </Box>
      <Box
        padding="50px"
        boxShadow={!isSmallDevice?3:0}
        borderRadius= {isSmallDevice?0:"8px"}
        bgcolor="white"
      >
        
        <Avatar
          sx={{
            width: 80,
            height: 80,
            margin: "0 auto",
            bgcolor: "primary.main",
          }}
        />
        <Typography variant="h6" mt={2} fontWeight="bold">
          DANQUAH WILLIAM
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          System Administrator
        </Typography>
        <Typography mt={2} mb={3} color="text.secondary">
          Welcome back. Provide your PIN to continue.
        </Typography>

        <PinInput
          length={4}
          focus
          onComplete={handleComplete}
          type="numeric"
          inputStyle={{
            borderColor: pinError ? "red" : "#ccc", // Highlight border on error
            borderRadius: "5px",
            width: "50px",
            height: "50px",
            margin: "5px",
            fontSize: "1.5rem",
            textAlign: "center",
          }}
        />

        {pinError && (
          <Typography color="error" mt={1}>
            Incorrect PIN. Please try again.
          </Typography>
        )}

        <Typography mt={2} color="text.secondary">
          <a href="#" style={{ textDecoration: "none" }}>
            Forgot PIN
          </a>
        </Typography>
        <Typography mt={1} color="text.secondary">
          <a href="#" style={{ textDecoration: "none" }}>
            Log out instead
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default LockScreen;
