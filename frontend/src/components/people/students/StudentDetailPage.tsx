import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList';
import { Box, Card, CardMedia, IconButton, Tab, Typography } from '@mui/material';
import React from 'react'
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import { styled } from '@mui/material/styles';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { Email, Facebook, Phone, Twitter, WhatsApp } from '@mui/icons-material';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
  } from "@mui/material";
  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
  import useMediaQuery from '@mui/material/useMediaQuery';


const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    width: '100%',
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
      color: (theme).palette.action.disabled,
      margin: 1,
    },
    [`& .${breadcrumbsClasses.ol}`]: {
      alignItems: 'left',
    },
  }));
  
  export function NavbarBreadcrumbs() {
    return (
      <StyledBreadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextRoundedIcon fontSize="small" />}
      >
        <Typography variant="body1">People</Typography>
        <Typography variant="body1">
          Student
        </Typography>
        <Typography variant="body1">View Student</Typography>
        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>William</Typography>
      </StyledBreadcrumbs>
    );
  }

const StudentDetailPage = () => {
    const [value, setValue] = React.useState("1");
    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    const isSmallDevice = useMediaQuery("(max-width:1045px)")
  return (
    <>
    <NavbarBreadcrumbs />
    {!isSmallDevice?<Box sx={{display:'flex', gap:'1rem', justifyItems:'center', width:'100%'}}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <CardMedia
            component="img"
            image={"https://via.placeholder.com/150"} // Replace with actual student image URL
            alt="Student Profile"
            sx={{ width: 190, height: 190, margin: 2, borderRadius: 1 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginLeft: 2, textTransform:'uppercase' }}>
            Danquah Kwafo William
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" gap={1}>
              <IconButton color="primary">
                <Phone />
              </IconButton>
              <IconButton color="primary">
                <WhatsApp />
              </IconButton>
              <IconButton color="primary">
                <Email />
              </IconButton>
              <IconButton color="primary">
                <Facebook />
              </IconButton>
              <IconButton color="primary">
                <Twitter />
              </IconButton>
            </Box>
          </Box>
          </Box>
        <Card sx={{width:'100%',  maxWidth: { sm: "100%", md: "1700px" }}}>
        <TabContext value={value}>
        <TabList onChange={handleTabChange} aria-label="lab API tabs example"
        
  variant="scrollable"
  scrollButtons="auto"
        >
            <Tab
              label="👤 Profile"
              value="1"
              sx={{ width: "20%", color: "blue" }}
            />
            <Tab
              label="📊 Attendance"
              value="2"
              sx={{ width: "20%", color: "blue" }}
            />
            <Tab
              label="💵 Fees"
              value="3"
              sx={{ width: "20%", color: "blue" }}
            />
            <Tab
              label="📈 Results"
              value="4"
              sx={{ width: "20%", color: "blue" }}
            />
            <Tab
              label="✍🏾 Profile Update"
              value="5"
              sx={{ width: "20%", color: "blue" }}
            />
            <Tab
              label="🔒 Account Update"
              value="6"
              sx={{ width: "20%", color: "blue" }}
            />
            <Tab
              label="🏠 Hostel"
              value="7"
              sx={{ width: "20%", color: "blue" }}
            />
            <Tab
              label="🚏 Transport"
              value="8"
              sx={{ width: "20%", color: "blue" }}
            />
          </TabList>
        </TabContext>
        </Card>
        
    </Box>: <Card sx={{width:'100%',  maxWidth: { sm: "100%", md: "1700px" }, display:'flex', flexDirection:'column', gap:'1rem'}}>
    <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="profile-content"
          id="profile-header"
        >
          <Typography sx={{ color: "blue" }}>👤 Profile</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {/* Replace this content with Profile details */}
            Profile details go here.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="attendance-content"
          id="attendance-header"
        >
          <Typography sx={{ color: "blue" }}>📊 Attendance</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {/* Replace this content with Attendance details */}
            Attendance details go here.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="fees-content"
          id="fees-header"
        >
          <Typography sx={{ color: "blue" }}>💵 Fees</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {/* Replace this content with Fees details */}
            Fees details go here.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="results-content"
          id="results-header"
        >
          <Typography sx={{ color: "blue" }}>📈 Results</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {/* Replace this content with Results details */}
            Results details go here.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="profile-update-content"
          id="profile-update-header"
        >
          <Typography sx={{ color: "blue" }}>✍🏾 Profile Update</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {/* Replace this content with Profile Update details */}
            Profile update details go here.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="account-update-content"
          id="account-update-header"
        >
          <Typography sx={{ color: "blue" }}>🔒 Account Update</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {/* Replace this content with Account Update details */}
            Account update details go here.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="hostel-content"
          id="hostel-header"
        >
          <Typography sx={{ color: "blue" }}>🏠 Hostel</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {/* Replace this content with Hostel details */}
            Hostel details go here.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="transport-content"
          id="transport-header"
        >
          <Typography sx={{ color: "blue" }}>🚏 Transport</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {/* Replace this content with Transport details */}
            Transport details go here.
          </Typography>
        </AccordionDetails>
      </Accordion>
        </Card>}
    </>
  )
}

export default StudentDetailPage