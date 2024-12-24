import { Box, Card } from "@mui/material";
import React, { useEffect, useState } from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"

import {
  Stepper,
  Step,
  StepLabel,
  TextField,
  Autocomplete,
  Modal,
  Backdrop,
  Fade,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MultiSelect, TextInput, Grid } from "@mantine/core";
import { List, ListItem, ListItemText } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { format } from 'date-fns';
import BulEnrollStudent from "./BulkEnrollStudents";
import useMediaQuery from "@mui/material/useMediaQuery";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styled } from '@mui/material/styles';

import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

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

function NavbarBreadcrumbs() {
  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">People</Typography>
      <Typography variant="body1">
        Student
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>Enrollment</Typography>
    </StyledBreadcrumbs>
  );
}

interface Parent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

// Student data type
interface StudentData {
  father_full_name	: string;
  father_email: string;
  father_phone: string;
  mother_full_name	: string;
  mother_email: string;
  mother_phone: string;
  student_email: string;
  surname: string;
  first_name: string;
  other_names: string;
  gender: "M" | "F"; // Gender field can be 'M' or 'F'
  registration_number: string;
  nationality: string;
  date_of_birth: string; // Format 'dd-mm-yyyy'
  blood_group: string;
  id_or_birth_cert_number: string;
  religion: string;
  contact_phone: string;
  province_or_state: string;
  zip_or_lga: string;
  town_of_origin: string;
  permanent_address: string;
  residential_address: string;
  parents: Parent[]; // This will hold an array of Parent objects
}

const steps = [
  "Parent/Guardian Information",
  "Student Information",
  "Contact Information",
  "Address Information",
];


const StudentEnrollment = () => {
  const [value, setValue] = React.useState("1");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<StudentData>({
    father_full_name: "",
    father_email: "",
    father_phone: "",
    mother_full_name: "",
    mother_email: "",
    mother_phone: "",
    student_email: "",
    surname: "",
    first_name: "",
    other_names: "",
    gender: "M", // default gender
    registration_number: "",
    nationality: "",
    date_of_birth: "",
    blood_group: "A+", // default blood group
    id_or_birth_cert_number: "",
    religion: "",
    contact_phone: "",
    province_or_state: "",
    zip_or_lga: "",
    town_of_origin: "",
    permanent_address: "",
    residential_address: "",
    parents: [], // for storing selected parents
  });
  const [parentsList, setParentsList] = useState<Parent[]>([]);
  const [openModal, setOpenModal] = useState(false);

  // Mock function to fetch parents already enrolled
  useEffect(() => {
    const fetchParents = async () => {
      // Here you would call your API to get the list of parents (mocked here)
      const data = [
        { id: "1", name: "John Doe" },
        { id: "2", name: "Jane Smith" },
      ];
      setParentsList(data);
    };
    fetchParents();
  }, []);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const isSmallScreen = useMediaQuery("(max-width:1045px)")
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("/images/avata.png");
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedPhoto(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result); // Only set if it's a string
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleParentSelect = (values: string[]) => {
    const selectedParents = values.map((id) =>
      parentsList.find((parent) => parent.id === id)
    );
    setFormData((prevData) => ({
      ...prevData,
      parents: selectedParents as Parent[],
    }));
  };

  const handleSubmit = () => {
    // Create a FormData object to send data with the photo file
    const submissionData = new FormData();

    // Format the date of birth
    const formattedDOB = format(new Date(formData.date_of_birth), 'yyyy-MM-dd');
    submissionData.append("dateOfBirth", formattedDOB);

    // Append all form data
    Object.keys(formData).forEach((key) => {
      if (key === "parents") {
        // For parents, stringify the array
        submissionData.append(key, JSON.stringify(formData[key]));
      } else {
        submissionData.append(key, (formData as any)[key]);
      }
    });

    // Append the uploaded photo file
    if (uploadedPhoto) {
      submissionData.append("profile_pic", uploadedPhoto);
    }

    console.log("Submitting form data with photo:");
    for (const [key, value] of submissionData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Add your form submission logic here (e.g., API call)
    axios.post('https://schoolfocusapi.onrender.com/api/enroll-student/', submissionData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => {
      console.log("Form submitted successfully", response.data);
    }).catch(error => {
      console.error("Error submitting form", error);
    });
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);


  const [activeMobileStep, setActiveMobileStep] = React.useState(0);
  const maxSteps = steps.length;

  const mobileTheme = useTheme()

  const handleMobileNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleMobileBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const mobileSteps = [
    {
      label: "Parent/Guardian Information", 
      component: <Grid>
      <Grid.Col span={12}>
        <MultiSelect
          id="parents-autocomplete"
          label="Select Parents/Guardians"
          data={parentsList.map((parent) => ({
            value: parent.id,
            label: parent.name,
          }))}
          value={formData.parents.map((parent) => parent.id)}
          onChange={handleParentSelect}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Button variant="contained" onClick={handleOpenModal}>Add New Parent/Guardian</Button>
      </Grid.Col>
    </Grid>
  }, 
  {
    label: "Student's Information",
    component: <>
    <Typography component={!isSmallScreen?"h2":'h4'} variant={!isSmallScreen?"h4":"h6"} sx={{textDecoration:'underline', mt: !isSmallScreen?'4rem':'1rem', mb:'1rem', textAlign:!isSmallScreen?'center':'left'}}>
      Student's Basic Information
    </Typography>
    <Box sx={{display:'flex', gap: "3rem", width:'100%', flexDirection: !isSmallScreen? "row":'column'}}>
    <Box style={!isSmallScreen?{width:'300px', height:'300px'}:{}}>
        <img src={imagePreview} style={{width:'200px', height:'200px', border: "1px solid grey"}} />
        <button style={{width: "200px", position:'relative'}}>+ New Photo
        <input
      type="file"
      accept="image/*"
      
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        opacity: 0,
        cursor: "pointer",
      }}
      onChange={handleImageChange}
    />
        </button>
    </Box>
    <Box sx={{display:'grid', gridTemplateColumns: !isSmallScreen?"repeat(2, minmax(200px, 1fr))":"repeat(1, minmax(200px, 1fr))", gap:'2rem', width:'100%'}}>
      <TextInput
        label="Student's Surname"
        name="surname"
        value={formData.surname}
        onChange={handleChange}
      />
      <TextInput
        label="Student's First Name"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
      />
      <TextInput
        label="Other Names"
        name="other_names"
        value={formData.other_names}
        onChange={handleChange}
      />
      <TextInput
        label="Registration Number"
        name="registration_number"
        value={formData.registration_number}
        onChange={handleChange}
      />
      <TextInput
        label="Date of Birth"
        name="date_of_birth"
        value={formData.date_of_birth}
        onChange={handleChange}
        type="date"
      />
    </Box>
  </Box>
  </>
  },
  {
    label: "Contact Information",
    component: <Grid>
    <Grid.Col span={12}>
      <TextInput
        label="Student Email"
        name="student_email"
        value={formData.student_email}
        onChange={handleChange}
      />
    </Grid.Col>
    <Grid.Col span={12}>
      <TextInput
        label="Contact Phone"
        name="contact_phone"
        value={formData.contact_phone}
        onChange={handleChange}
      />
    </Grid.Col>
  </Grid>
  },
  {
    label: "Address Information",
    component: <Grid>
    <Grid.Col span={12}>
      <TextInput
        label="Permanent Address"
        name="permanent_address"
        value={formData.permanent_address}
        onChange={handleChange}
      />
    </Grid.Col>
    <Grid.Col span={12}>
      <TextInput
        label="Residential Address"
        name="residential_address"
        value={formData.residential_address}
        onChange={handleChange}
      />
    </Grid.Col>
  </Grid>
  }
  ]

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid>
            <Grid.Col span={12}>
              <MultiSelect
                id="parents-autocomplete"
                label="Select Parents/Guardians"
                data={parentsList.map((parent) => ({
                  value: parent.id,
                  label: parent.name,
                }))}
                value={formData.parents.map((parent) => parent.id)}
                onChange={handleParentSelect}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Button variant="contained" onClick={handleOpenModal}>Add New Parent/Guardian</Button>
            </Grid.Col>
          </Grid>
        );
      case 1:
        return (
          <>
            <Typography component="h2" variant="h4" sx={{textDecoration:'underline', mt:'4rem', mb:'1rem', textAlign:'center'}}>
              Student's Basic Information
            </Typography>
            <Box sx={{display:'flex', gap: "3rem", width:'100%'}}>
            <Box style={{width:'300px', height:'300px'}}>
                <img src={imagePreview} style={{width:'200px', height:'200px', border: "1px solid grey"}} />
                <button style={{width: "200px", position:'relative'}}>+ New Photo
                <input
              type="file"
              accept="image/*"
              
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
              onChange={handleImageChange}
            />
                </button>
            </Box>
            <Box sx={{display:'grid', gridTemplateColumns:"repeat(2, minmax(200px, 1fr))", gap:'2rem', width:'100%'}}>
              <TextInput
                label="Student's Surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
              />
              <TextInput
                label="Student's First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
              <TextInput
                label="Other Names"
                name="other_names"
                value={formData.other_names}
                onChange={handleChange}
              />
              <TextInput
                label="Registration Number"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleChange}
              />
              <TextInput
                label="Date of Birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                type="date"
              />
            </Box>
          </Box>
          </>
          
        );
      case 2:
        return (
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Student Email"
                name="student_email"
                value={formData.student_email}
                onChange={handleChange}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Contact Phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
              />
            </Grid.Col>
          </Grid>
        );
      case 3:
        return (
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Permanent Address"
                name="permanent_address"
                value={formData.permanent_address}
                onChange={handleChange}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Residential Address"
                name="residential_address"
                value={formData.residential_address}
                onChange={handleChange}
              />
            </Grid.Col>
              <Button variant="contained" color="primary" >Save Student</Button>
          </Grid>
        );
      default:
        return null;
    }
  };

  const handleDownload = () => {
    // This URL assumes the file is placed in the `public` directory
    const fileUrl = "/template.xlsx";
    window.open(fileUrl, "_blank");
  };

  const [expanded, setExpanded] = useState<number | false>(false);

  const handleAccordionChange = (panel: number) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  

  return (
    <>
    <NavbarBreadcrumbs />
    {!isSmallScreen?<Card sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleTabChange} aria-label="lab API tabs example">
            <Tab
              label="Enroll a student"
              value="1"
              sx={{ width: "30%", color: "blue" }}
            />
            <Tab
              label="Bulk Enroll Students"
              value="2"
              sx={{ width: "30%", color: "blue" }}
            />
            <Tab
              label="Self Registration"
              value="3"
              sx={{ width: "30%", color: "blue" }}
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mt: 2 }}>{renderStepContent(activeStep)}</Box>

            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 3, gap:'6rem' }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="contained"
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  color="primary"
                >
                  Next
                </Button>
              )}
            </Box>

            {/* Modal to add a new parent */}
            <Dialog open={openModal} onClose={handleCloseModal}>
              <DialogTitle>Add New Parent/Guardian</DialogTitle>
              <DialogContent>
                {/* Your form for adding a new parent/guardian goes here */}
                <TextField label="Full Name" fullWidth sx={{ mb: 2 }} />
                <TextField label="Email" fullWidth sx={{ mb: 2 }} />
                <TextField label="Phone" fullWidth sx={{ mb: 2 }} />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleCloseModal} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </TabPanel>
        <TabPanel value="2">
      {/* Information Section */}
      <Box width="100%" sx={{display:'flex', gap:'3rem'}}>
        <Box>
        <Typography variant="body1" gutterBottom>
          An alternative to registering one student at a time, this enables you to prepare the list of students to be enrolled into a class (in an Excel Spreadsheet) and import the list into the class.
        </Typography>
        <Typography variant="h6" gutterBottom>
          Important To Note:
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Use the provided Excel Spreadsheet Template (downloadable from the button below) to prepare the list." />
          </ListItem>
          <ListItem>
            <ListItemText primary="If you are importing students for different classes (e.g. JSS 1-A, JSS 1-B, SSS 3-A, etc.), make a different list (the spreadsheet file) for each class. Do not combine all students of the different classes in one file." />
          </ListItem>
          <ListItem>
            <ListItemText primary="The Spreadsheet columns with yellow-colored headings are compulsory fields (the information has to be provided for each student)." />
          </ListItem>
        </List>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudDownloadIcon />}
          size="large"
          onClick={handleDownload}
        >
          Download Excel Template
        </Button>
        </Box>
        <Box width={'50%'}>
          <Typography variant="h6" gutterBottom>
            Ready to upload?
          </Typography>
          <BulEnrollStudent />
      </Box>
      </Box>

        
        </TabPanel>
        <TabPanel value="3">Coming soon</TabPanel>
      </TabContext>
    </Card>:<Card sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
    <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Enroll a Student</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
          pl: 2,
          bgcolor: 'background.default',
        }}
      >
        <Typography>{mobileSteps[activeStep].label}</Typography>
      </Paper>
      <Box sx={{ width: '100%', p: 2 }}>
        {mobileSteps[activeStep].component}
      </Box>
      <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            // disabled={activeStep === maxSteps - 1}
          >
            {activeStep === maxSteps - 1?"Save":"Next"}
            {mobileTheme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {mobileTheme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
        </AccordionDetails>
      </Accordion>
    <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Bulk Enrollment</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
    <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Self Enrollment</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Dialog open={openModal} onClose={handleCloseModal}>
              <DialogTitle>Add New Parent/Guardian</DialogTitle>
              <DialogContent>
                {/* Your form for adding a new parent/guardian goes here */}
                <TextField label="Full Name" fullWidth sx={{ mb: 2 }} />
                <TextField label="Email" fullWidth sx={{ mb: 2 }} />
                <TextField label="Phone" fullWidth sx={{ mb: 2 }} />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleCloseModal} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
      </Card>}
    </>
  );
};

export default StudentEnrollment;
