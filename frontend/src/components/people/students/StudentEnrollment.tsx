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
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";

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
import {
  MultiSelect,
  TextInput,
  Grid,
  Group,
  Textarea,
  NativeSelect,
  ActionIcon,
  SimpleGrid,
} from "@mantine/core";
import { List, ListItem, ListItemText } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { format } from "date-fns";
import BulEnrollStudent from "./BulkEnrollStudents";
import useMediaQuery from "@mui/material/useMediaQuery";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { styled } from "@mui/material/styles";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { APIContext } from "../../../utils/contexts/ReactContext";
import { useNavigate } from "react-router-dom";
import { Transition } from "../../../transitions/DialogTransition";
import { Class, Parent, StudentData } from "./types";
import { DateField } from "@mui/x-date-pickers";
import { CheckBox } from "@mui/icons-material";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  width: "100%",
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: theme.palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "left",
  },
}));

export function NavbarBreadcrumbs() {
  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">People</Typography>
      <Typography variant="body1">Student</Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.primary", fontWeight: 600 }}
      >
        Enrollment
      </Typography>
    </StyledBreadcrumbs>
  );
}

const steps = [
  "Parent Information",
  "Student Information",
  "Academic Information",
  "Contact Information",
  "Address Information",
];



const StudentEnrollment = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState("1");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: boolean }>({});
  const [isAutoGenerate, setIsAutoGenerate] = useState(false);
  const fetchGenRegNum = async () => {
    try {
      setStudentsManagementDetails({ isLoading: true });
      const { data } = await axios.get("http://127.0.0.1:8000/api/indexer/");
      setFormData({ ...formData, index_number: data.generated_id });
      setStudentsManagementDetails({ isLoading: false });
      alert(`generated id : ${data.generated_id}`);
    } catch (error) {
      setStudentsManagementDetails({ isLoading: false });
      alert(`error: ${error}`);
      console.log(error);
    }
  };

  const handleCheckboxChange = async (event: any) => {
    const checked = event.target.checked;
    setIsAutoGenerate(checked);

    if (checked) {
      // Fetch and set the generated ID
      await fetchGenRegNum();
    } else {
      // Reset index_number if auto-generate is unchecked
      setFormData((prev) => ({ ...prev, index_number: "" }));
    }
  };

  // Handling form validation
  const isStepValid = () => {
    return (
      !Object.values(formErrors).includes(true) &&
      steps[activeStep] in formValues &&
      formValues[steps[activeStep]].trim() !== ""
    );
  };
  const [formData, setFormData] = useState<StudentData>({
    student_email: "",
    last_name: "",
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
    place_of_origin: "",
    permanent_address: "",
    residential_address: "",
    guardian: [], // for storing selected parents
    student_class: "",
    academic_session: "",
    admission_date: "",
    index_number: "",
    class_division: "",
    tags: [],
  });
  const [parentsList, setParentsList] = useState<Parent[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [fetchingParents, setFetchingParents] = React.useState<boolean>(false);

  const [validationState, setValidationState] = useState<boolean[]>([
    false, // Step 1 validation
    false, // Step 2 validation
    false, // Step 3 validation
    false, // Step 4 validation
    false, // Step 5 validation
  ]);

  const handleNext = () => {
    // Skip validation for step 3
    if (activeStep === 3 || validateStep(activeStep)) {
      const updatedValidation = [...validationState];
      updatedValidation[activeStep] = true;
      setValidationState(updatedValidation);
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      alert("Please complete the form before proceeding.");
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Use the context created already

  const context = React.useContext(APIContext);
  if (!context) {
    throw new Error("There should be a context");
  }

  const { studentsManagementDetails, setStudentsManagementDetails } = context;

  // Mock function to fetch parents already enrolled
  const fetchParents = async () => {
    try {
      setStudentsManagementDetails({ isLoading: true });
      const { data } = await axios.get(
        "http://127.0.0.1:8000/api/parentorguardian/"
      );
      console.log("Fetched parents data:", data); // Debug log
      setParentsList(data);
      setStudentsManagementDetails({ isLoading: false });
    } catch (error) {
      console.error("Error fetching parents:", error);
      setStudentsManagementDetails({ isLoading: false });
    }
  };
  useEffect(() => {
    fetchParents();
  }, []);

  const isSmallScreen = useMediaQuery("(max-width:1045px)");
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("/images/avata.png");
  const [tags, setTags] = React.useState<{id: string; title: string} []>([])

  React.useEffect(()=>{
    const fetchTag = async () => {
      try{
        setStudentsManagementDetails({isLoading: true})
        const {data} = await axios.get("http://127.0.0.1:8000/api/tags/")
        const tagList = data.map((tag: any)=>({value: tag.id, label:tag.title}))
        setTags(data)
        setStudentsManagementDetails({isLoading: false})
      }catch(error){
        setStudentsManagementDetails({isLoading: false})
        alert(`Tags fetch failed: ${error}`)
      }
    }
    fetchTag()
  }, [])
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedPhoto(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleParentSelect = (selectedValues: string[]) => {
    setFormData({
      ...formData,
      guardian: selectedValues.map(Number), // Convert to numbers when storing in formData
    });
  };

  const handleTagsSelect = (selectedValues: string[]) => {
    setFormData({
      ...formData,
      tags: selectedValues.map(Number), // Convert to numbers when storing in formData
    });
  }; 

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const submissionData = new FormData();

    try {
      if (formData.date_of_birth) {
        const formattedDOB = format(
          new Date(formData.date_of_birth),
          "yyyy-MM-dd"
        );
        submissionData.append("date_of_birth", formattedDOB);
      }

      // Validate guardian before appending
      if (formData.guardian.length === 0) {
        alert("Please select at least one guardian.");
        return;
      }

      Object.keys(formData).forEach((key) => {
        if (key === "guardian") {
          formData.guardian.forEach(
            (guardianId) =>
              submissionData.append(
                "guardian",
                parseInt(guardianId, 10).toString()
              ) // Ensure integer PK values
          );
        } else {
          submissionData.append(key, (formData as any)[key]);
        }
      });

      if (uploadedPhoto) {
        submissionData.append("profile_pic", uploadedPhoto);
      }

      setIsLoading(true);
      setStudentsManagementDetails({ isLoading: true });

      const response = await axios.post(
        "http://127.0.0.1:8000/api/enroll-student/",
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Form submitted successfully:", response.data);
      alert("Student enrollment successful!");
      setIsLoading(false);
      setStudentsManagementDetails({ isLoading: false });

      navigate("/people/students");
    } catch (err) {
      setIsLoading(false);
      setStudentsManagementDetails({ isLoading: false });

      if (axios.isAxiosError(err)) {
        console.error("Error response data:", err.response?.data);
        alert(
          "An error occurred: " +
            (err.response?.data?.message || "Unknown error")
        );
      } else {
        console.error("Unexpected error:", err);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const [activeMobileStep, setActiveMobileStep] = React.useState(0);
  const maxSteps = steps.length;

  const mobileTheme = useTheme();

  const handleMobileNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleMobileBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return formData.guardian.length > 0;
      case 1:
        return (
          formData.last_name.trim() !== "" &&
          formData.first_name.trim() !== "" &&
          formData.registration_number.trim() !== "" &&
          formData.date_of_birth.trim() !== ""
        );
      case 2:
        return (
          formData.student_email.trim() !== "" &&
          formData.contact_phone.trim() !== ""
        );
      case 3:
        return true
      case 4:
        return (
          formData.permanent_address.trim() !== "" &&
          formData.residential_address.trim() !== ""
        );
      default:
        return false;
    }
  };

  const mobileSteps = [
    {
      label: "Parent/Guardian Information",
      component: (
        <Grid>
          <Grid.Col span={12}>
            <MultiSelect
              required
              id="parents-autocomplete"
              label="Select Parents/Guardians"
              data={parentsList.map((parent) => ({
                value: parent.id.toString(), // Convert ID to string for MultiSelect
                label: parent.full_name,
              }))}
              value={formData.guardian.map((id) => id.toString())} // Convert IDs to strings
              onChange={handleParentSelect}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Button variant="contained" onClick={handleOpenModal}>
              Add New Parent/Guardian
            </Button>
          </Grid.Col>
        </Grid>
      ),
    },
    {
      label: "Student's Information",
      component: (
        <>
          <Typography
            component={!isSmallScreen ? "h2" : "h4"}
            variant={!isSmallScreen ? "h4" : "h6"}
            sx={{
              textDecoration: "underline",
              mt: !isSmallScreen ? "4rem" : "1rem",
              mb: "1rem",
              textAlign: !isSmallScreen ? "center" : "left",
            }}
          >
            Student's Basic Information
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: "3rem",
              width: "100%",
              flexDirection: !isSmallScreen ? "row" : "column",
            }}
          >
            <Box
              style={!isSmallScreen ? { width: "300px", height: "300px" } : {}}
            >
              <img
                src={imagePreview}
                style={{ width: "200px", height: "200px" }}
                alt="some-img"
              />
              <button style={{ width: "200px", position: "relative" }}>
                + New Photo
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
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: !isSmallScreen
                  ? "repeat(2, minmax(200px, 1fr))"
                  : "repeat(1, minmax(200px, 1fr))",
                gap: "2rem",
                width: "100%",
              }}
            >
              <TextInput
                label="Student's Surname"
                name="last_name"
                value={formData.last_name}
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
      ),
    },
    {
      label: "Academic Data",
      component: (
        <SimpleGrid cols={1}>
            <NativeSelect
              label="Class"
              data={[
                "KG 1", "KG 2", "KG 3",
                "BS 1", "BS 2", "BS 3", "BS 4", "BS 5", "BS 6",
                "JHS 1", "JHS 2", "JHS 3"
            ]}
              // value={formData.class_name}
              onChange={(event: any)=>{
                setFormData({...formData, student_class: event.target.value})
              }}
              required
            />
            <NativeSelect
              label="Class Division"
              data={["select class", "A"]}
              value={formData.class_division}
              onChange={(event: any)=>{
                setFormData({...formData, class_division: event.target.value})
              }}
              required
            />
            <NativeSelect
              label="Enrolling into Academic Session"
              data={["Select Academic Session", "2025-2026"]}
              value={formData.academic_session}
              onChange={(event: any)=>{
                setFormData({...formData, academic_session: event.target.value})
              }}
              required
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row-reverse",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Button variant="outlined" size="small" sx={{ mt: "20px" }}>
                + New Tag
              </Button>
              
              <MultiSelect
              required
              label="Tags"
              data={tags.map((tag) => ({
                value: tag.id.toString(), // Convert ID to string for MultiSelect
                label: tag.title,
              }))}
              value={formData.tags.map((id) => id.toString())} // Convert IDs to strings
              onChange={handleTagsSelect}
              style={{flex:1}}
            />
            </Box>
            <TextInput
              label="Admission Date"
              type="date"
              value={formData.admission_date}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFormData({
                  ...formData,
                  admission_date: event.target.value,
                });
              }}
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <TextInput
                label="Index Number"
                value={formData.index_number}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    index_number: e.target.value,
                  }))
                }
                required
                disabled={isAutoGenerate || isLoading}
                styles={{
                  input: {
                    color: isAutoGenerate || isLoading ? 'black' : undefined, // Override disabled text color
                    backgroundColor: isAutoGenerate || isLoading ? '#f1f3f5' : undefined, // Optional: add background for disabled state
                  },
                }}
              />
              <Button variant="outlined" size="small">
                <input type="checkbox" 
                  checked={isAutoGenerate}
                  onChange={handleCheckboxChange}
                  disabled={studentsManagementDetails.isLoading}
                
                style={{ marginRight: "2rem", }} /> Auto
                Generate Index Number
              </Button>
            </Box>
          </SimpleGrid>
      ),
    },
    {
      label: "Contact Information",
      component: (
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
      ),
    },
    {
      label: "Address Information",
      component: (
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
        </Grid>
      ),
    },
  ];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid>
            <Grid.Col span={12}>
              <MultiSelect
                required
                id="parents-autocomplete"
                label="Select Parents/Guardians"
                data={parentsList.map((parent) => ({
                  value: parent.id.toString(), // Convert ID to string for MultiSelect
                  label: parent.full_name,
                }))}
                value={formData.guardian.map((id) => id.toString())} // Convert IDs to strings
                onChange={handleParentSelect}
                searchable
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Button variant="contained" onClick={handleOpenModal}>
                Add New Parent/Guardian
              </Button>
            </Grid.Col>
          </Grid>
        );
      case 1:
        return (
          <>
            <Typography
              component="h2"
              variant="h4"
              sx={{
                textDecoration: "underline",
                mt: "4rem",
                mb: "1rem",
                textAlign: "center",
              }}
            >
              Student's Basic Information
            </Typography>
            <Box sx={{ display: "flex", gap: "3rem", width: "100%" }}>
              <Box style={{ width: "300px", height: "300px" }}>
                <img
                  src={imagePreview}
                  style={{
                    width: "200px",
                    height: "200px",
                    border: ".1px solid grey",
                  }}
                  alt=""
                />
                <button style={{ width: "200px", position: "relative" }}>
                  + New Photo
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
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(200px, 1fr))",
                  gap: "2rem",
                  width: "100%",
                }}
              >
                <TextInput
                  label="Student's Surname"
                  name="last_name"
                  value={formData.last_name}
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
          <SimpleGrid cols={2}>
            <NativeSelect
              label="Class"
              data={[
                "KG 1", "KG 2", "KG 3",
                "BS 1", "BS 2", "BS 3", "BS 4", "BS 5", "BS 6",
                "JHS 1", "JHS 2", "JHS 3"
            ]}
              // value={formData.class_name}
              onChange={(event: any)=>{
                setFormData({...formData, student_class: event.target.value})
                alert(`class = ${event.target.value}`)
              }}
              required
            />
            <NativeSelect
              label="Class Division"
              data={["select class", "A"]}
              value={formData.class_division}
              onChange={(event: any)=>{
                setFormData({...formData, class_division: event.target.value})
                alert(`class div = ${event.target.value}`)
              }}
              required
            />
            <NativeSelect
              label="Enrolling into Academic Session"
              data={["Select Academic Session", "2025-2026"]}
              value={formData.academic_session}
              onChange={(event: any)=>{
                setFormData({...formData, academic_session: event.target.value})
                alert(`session = ${event.target.value}`)
              }}
              required
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row-reverse",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Button variant="outlined" size="small" sx={{ mt: "20px" }}>
                + New Tag
              </Button>
              
              <MultiSelect
              required
              label="Tags"
              data={tags.map((tag) => ({
                value: tag.id.toString(), // Convert ID to string for MultiSelect
                label: tag.title,
              }))}
              value={formData.guardian.map((id) => id.toString())} // Convert IDs to strings
              onChange={handleParentSelect}
              style={{flex:1}}
            />
            </Box>
            <TextInput
              label="Admission Date"
              type="date"
              value={formData.admission_date}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFormData({
                  ...formData,
                  admission_date: event.target.value,
                });
              }}
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <TextInput
                label="Index Number"
                value={formData.index_number}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    index_number: e.target.value,
                  }))
                }
                required
                disabled={isAutoGenerate || isLoading}
                styles={{
                  input: {
                    color: isAutoGenerate || isLoading ? 'black' : undefined, // Override disabled text color
                    backgroundColor: isAutoGenerate || isLoading ? '#f1f3f5' : undefined, // Optional: add background for disabled state
                  },
                }}
              />
              <Button variant="outlined" size="small">
                <input type="checkbox" 
                  checked={isAutoGenerate}
                  onChange={handleCheckboxChange}
                  disabled={studentsManagementDetails.isLoading}
                
                style={{ marginRight: "2rem", }} /> Auto
                Generate Index Number
              </Button>
            </Box>
          </SimpleGrid>
        );
      case 3:
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
      case 4:
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
            <Button variant="contained" color="primary">
              Save Student
            </Button>
          </Grid>
        );
      default:
        return null;
    }
  };

  const handleDownload = () => {
    // This URL assumes the file is placed in the `public` directory
    const fileUrl = "/BulkStudentsEnrollmentTemplate.xlsx";
    window.open(fileUrl, "_blank");
  };

  const [expanded, setExpanded] = useState<number | false>(false);

  const handleAccordionChange =
    (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  // Adding Parent or guardian

  interface Guardian {
    full_name: string;
    relationship: string;
    occupation: string;
    phone_number: string;
    address: string;
    email: string;
  }
  const [guardians, setGuardians] = useState<Guardian[]>([
    {
      full_name: "",
      relationship: "father",
      occupation: "",
      phone_number: "",
      address: "",
      email: "",
    },
  ]);

  const isSmallDevice = useMediaQuery("(max-width:1045px)");
  // Add a new guardian to the form
  const addGuardian = () => {
    setGuardians([
      ...guardians,
      {
        full_name: "",
        relationship: "father",
        occupation: "",
        phone_number: "",
        address: "",
        email: "",
      },
    ]);
  };

  // Remove a guardian from the form
  const removeGuardian = (index: number) => {
    setGuardians(guardians.filter((_, i) => i !== index));
  };

  // Form submission
  const [isLoadin, setIsLoadin] = React.useState<boolean>(false);
  const handleParentorGuardianFormSubmit = async () => {
    try {
      setStudentsManagementDetails({ isLoading: true });
      setStudentsManagementDetails({ reload: true });
      setIsLoadin(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/api/guardians-multiple/",
        {
          guardians,
        }
      );
      alert("Guardians successfully added!");
      await fetchParents()
      console.log(response.data);
      handleCloseModal();
      setIsLoadin(false);
      setStudentsManagementDetails({ isLoading: false });
    } catch (error) {
      setStudentsManagementDetails({ isLoading: false });
      setIsLoadin(false);
      console.error("Error submitting guardians:", error);
    }
  };

  return (
    <>
      <NavbarBreadcrumbs />
      {!isSmallScreen ? (
        <Card sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleTabChange}
                aria-label="lab API tabs example"
              >
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
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                    gap: "6rem",
                  }}
                >
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="text"
                  >
                    Back
                  </Button>

                  {activeStep === steps.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      variant="text"
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
                <Dialog
                  open={openModal}
                  onClose={handleCloseModal}
                  TransitionComponent={Transition}
                  keepMounted
                  fullScreen={fullScreen}
                  fullWidth
                  maxWidth="md" // Controls the maximum width
                  sx={{
                    "& .MuiDialog-paper": {
                      width: "80%", // Adjust width
                      height: "80%", // Adjust height
                      maxWidth: "750px", // Optional, for larger screens
                      maxHeight: "80vh", // Prevent overflow on smaller screens
                    },
                  }}
                >
                  <DialogTitle>Add New Parent/Guardian</DialogTitle>
                  <DialogContent>
                    {/* Your form for adding a new parent/guardian goes here */}
                    <Card sx={{ width: "100%" }}>
                      {guardians.map((guardian, index) => (
                        <Box key={index}>
                          <Group>
                            <h4>{new String(guardian.relationship).toUpperCase()}</h4>
                            {guardians.length > 1 && (
                              <ActionIcon
                                color="red"
                                onClick={() => removeGuardian(index)}
                                size="lg"
                              >
                                {/* <IconTrash /> */}
                              </ActionIcon>
                            )}
                          </Group>

                          {!isSmallDevice ? (
                            <Group grow>
                              <TextInput
                                label="Full Name"
                                placeholder="Full Name"
                                required
                                value={guardian.full_name}
                                onChange={(e) =>
                                  setGuardians(
                                    guardians.map((g, i) =>
                                      i === index
                                        ? { ...g, full_name: e.target.value }
                                        : g
                                    )
                                  )
                                }
                              />
                              <NativeSelect
                                label="Relationship (with ward(s))"
                                data={["father", "mother", "guardian"]}
                                value={guardian.relationship}
                                onChange={(e) =>
                                  setGuardians(
                                    guardians.map((g, i) =>
                                      i === index
                                        ? { ...g, relationship: e.target.value }
                                        : g
                                    )
                                  )
                                }
                              />

                              <TextInput
                                label="Occupation"
                                placeholder="Occupation"
                                value={guardian.occupation}
                                onChange={(e) =>
                                  setGuardians(
                                    guardians.map((g, i) =>
                                      i === index
                                        ? { ...g, occupation: e.target.value }
                                        : g
                                    )
                                  )
                                }
                              />
                            </Group>
                          ) : (
                            <Box
                              style={{
                                display: "flex",
                                width: "100%",
                                flexDirection: "column",
                                gap: "3rem",
                              }}
                            >
                              <TextInput
                                label="Full Name"
                                placeholder="Full Name"
                                required
                                value={guardian.full_name}
                                onChange={(e) =>
                                  setGuardians(
                                    guardians.map((g, i) =>
                                      i === index
                                        ? { ...g, full_name: e.target.value }
                                        : g
                                    )
                                  )
                                }
                              />
                              <NativeSelect
                                label="Relationship (with ward(s))"
                                data={["father", "mother", "guardian"]}
                                value={guardian.relationship}
                                onChange={(e) =>
                                  setGuardians(
                                    guardians.map((g, i) =>
                                      i === index
                                        ? { ...g, relationship: e.target.value }
                                        : g
                                    )
                                  )
                                }
                              />

                              <TextInput
                                label="Occupation"
                                placeholder="Occupation"
                                value={guardian.occupation}
                                onChange={(e) =>
                                  setGuardians(
                                    guardians.map((g, i) =>
                                      i === index
                                        ? { ...g, occupation: e.target.value }
                                        : g
                                    )
                                  )
                                }
                              />
                            </Box>
                          )}

                          {!isSmallDevice ? (
                            <Group grow mt="md">
                              <TextInput
                                label="Phone Number"
                                placeholder="Phone Number"
                                required
                                value={guardian.phone_number}
                                onChange={(e) =>
                                  setGuardians(
                                    guardians.map((g, i) =>
                                      i === index
                                        ? { ...g, phone_number: e.target.value }
                                        : g
                                    )
                                  )
                                }
                              />
                              <Textarea
                                label="Address"
                                placeholder="Address"
                                value={guardian.address}
                                onChange={(e) =>
                                  setGuardians(
                                    guardians.map((g, i) =>
                                      i === index
                                        ? { ...g, address: e.target.value }
                                        : g
                                    )
                                  )
                                }
                              />
                            </Group>
                          ) : (
                            <Box
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "3rem",
                                marginTop: "3rem",
                              }}
                            >
                              <TextInput
                                label="Phone Number"
                                placeholder="Phone Number"
                                required
                                value={guardian.phone_number}
                                onChange={(e) =>
                                  setGuardians(
                                    guardians.map((g, i) =>
                                      i === index
                                        ? { ...g, phone_number: e.target.value }
                                        : g
                                    )
                                  )
                                }
                              />
                              <Textarea
                                label="Address"
                                placeholder="Address"
                                value={guardian.address}
                                onChange={(e) =>
                                  setGuardians(
                                    guardians.map((g, i) =>
                                      i === index
                                        ? { ...g, address: e.target.value }
                                        : g
                                    )
                                  )
                                }
                              />
                            </Box>
                          )}

                          {/* <Group grow mt="md">
                            <TextInput
                              label="Email"
                              placeholder="Email"
                              required
                              value={guardian.email}
                              onChange={(e) =>
                                setGuardians(
                                  guardians.map((g, i) =>
                                    i === index ? { ...g, email: e.target.value } : g
                                  )
                                )
                              }
                              disabled={guardian.temporaryEmail}
                            />
                            <PasswordInput
                              label="Create Account Password"
                              placeholder="Password"
                              required
                              value={guardian.password}
                              onChange={(e) =>
                                setGuardians(
                                  guardians.map((g, i) =>
                                    i === index ? { ...g, password: e.target.value } : g
                                  )
                                )
                              }
                              disabled={guardian.autoGeneratePassword}
                            />
                          </Group> */}

                          {/* <Group mt="md">
                            <Checkbox
                              label="Use Temporary Email Address"
                              checked={guardian.temporaryEmail}
                              onChange={(e) =>
                                setGuardians(
                                  guardians.map((g, i) =>
                                    i === index
                                      ? { ...g, temporaryEmail: e.target.checked }
                                      : g
                                  )
                                )
                              }
                            />
                            <Checkbox
                              label="Auto Generate Password"
                              checked={guardian.autoGeneratePassword}
                              onChange={(e) =>
                                setGuardians(
                                  guardians.map((g, i) =>
                                    i === index
                                      ? { ...g, autoGeneratePassword: e.target.checked }
                                      : g
                                  )
                                )
                              }
                            />
                          </Group> */}
                        </Box>
                      ))}

                      <Group mt="md">
                        <Button
                          //   leftIcon={<IconPlus />}
                          variant="outlined"
                          onClick={addGuardian}
                        >
                          Add Guardian
                        </Button>
                      </Group>
                    </Card>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleParentorGuardianFormSubmit}
                      color="primary"
                    >
                      {!isLoadin ? "Save" : "...Saving"}
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </TabPanel>
            <TabPanel value="2">
              {/* Information Section */}
              <Box width="100%" sx={{ display: "flex", gap: "3rem" }}>
                <Box>
                  <Typography variant="body1" gutterBottom>
                    An alternative to registering one student at a time, this
                    enables you to prepare the list of students to be enrolled
                    into a class (in an Excel Spreadsheet) and import the list
                    into the class.
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
                <Box width={"50%"}>
                  <Typography variant="h6" gutterBottom>
                    Ready to upload?
                  </Typography>
                  <BulEnrollStudent />
                </Box>
              </Box>
            </TabPanel>
            <TabPanel value="3">Coming soon</TabPanel>
          </TabContext>
        </Card>
      ) : (
        <Card
          sx={{
            width: "100%",
            maxWidth: {
              sm: "100%",
              md: "1700px",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
            },
          }}
        >
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
                  display: "flex",
                  alignItems: "center",
                  height: 50,
                  pl: 2,
                  bgcolor: "background.default",
                }}
              >
                <Typography>{mobileSteps[activeStep].label}</Typography>
              </Paper>
              <Box sx={{ width: "100%", p: 2 }}>
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
                    {activeStep === maxSteps - 1 ? "Save" : "Next"}
                    {mobileTheme.direction === "rtl" ? (
                      <KeyboardArrowLeft />
                    ) : (
                      <KeyboardArrowRight />
                    )}
                  </Button>
                }
                backButton={
                  <Button
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                  >
                    {mobileTheme.direction === "rtl" ? (
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Dialog
            open={openModal}
            onClose={handleCloseModal}
            TransitionComponent={Transition}
            keepMounted
            fullScreen={fullScreen}
            fullWidth
            maxWidth="md" // Controls the maximum width
            sx={{
              "& .MuiDialog-paper": {
                width: "80%", // Adjust width
                height: "80%", // Adjust height
                maxWidth: "750px", // Optional, for larger screens
                maxHeight: "80vh", // Prevent overflow on smaller screens
              },
            }}
          >
            <DialogTitle>Add New Parent/Guardian</DialogTitle>
            <DialogContent>
              {/* Your form for adding a new parent/guardian goes here */}
              <Card sx={{ width: "100%" }}>
                {guardians.map((guardian, index) => (
                  <Box key={index}>
                    <Group>
                      <h4>{guardian.relationship}</h4>
                      {guardians.length > 1 && (
                        <ActionIcon
                          color="red"
                          onClick={() => removeGuardian(index)}
                          size="lg"
                        >
                          {/* <IconTrash /> */}
                        </ActionIcon>
                      )}
                    </Group>

                    {!isSmallDevice ? (
                      <Group grow>
                        <TextInput
                          label="Full Name"
                          placeholder="Full Name"
                          required
                          value={guardian.full_name}
                          onChange={(e) =>
                            setGuardians(
                              guardians.map((g, i) =>
                                i === index
                                  ? { ...g, full_name: e.target.value }
                                  : g
                              )
                            )
                          }
                        />
                        <NativeSelect
                          label="Relationship (with ward(s))"
                          data={["father", "mother", "guardian"]}
                          value={guardian.relationship}
                          onChange={(e) =>
                            setGuardians(
                              guardians.map((g, i) =>
                                i === index
                                  ? { ...g, relationship: e.target.value }
                                  : g
                              )
                            )
                          }
                        />

                        <TextInput
                          label="Occupation"
                          placeholder="Occupation"
                          value={guardian.occupation}
                          onChange={(e) =>
                            setGuardians(
                              guardians.map((g, i) =>
                                i === index
                                  ? { ...g, occupation: e.target.value }
                                  : g
                              )
                            )
                          }
                        />
                      </Group>
                    ) : (
                      <Box
                        style={{
                          display: "flex",
                          width: "100%",
                          flexDirection: "column",
                          gap: "3rem",
                        }}
                      >
                        <TextInput
                          label="Full Name"
                          placeholder="Full Name"
                          required
                          value={guardian.full_name}
                          onChange={(e) =>
                            setGuardians(
                              guardians.map((g, i) =>
                                i === index
                                  ? { ...g, full_name: e.target.value }
                                  : g
                              )
                            )
                          }
                        />
                        <NativeSelect
                          label="Relationship (with ward(s))"
                          data={["father", "mother", "guardian"]}
                          value={guardian.relationship}
                          onChange={(e) =>
                            setGuardians(
                              guardians.map((g, i) =>
                                i === index
                                  ? { ...g, relationship: e.target.value }
                                  : g
                              )
                            )
                          }
                        />

                        <TextInput
                          label="Occupation"
                          placeholder="Occupation"
                          value={guardian.occupation}
                          onChange={(e) =>
                            setGuardians(
                              guardians.map((g, i) =>
                                i === index
                                  ? { ...g, occupation: e.target.value }
                                  : g
                              )
                            )
                          }
                        />
                      </Box>
                    )}

                    {!isSmallDevice ? (
                      <Group grow mt="md">
                        <TextInput
                          label="Phone"
                          placeholder="Phone"
                          required
                          value={guardian.phone_number}
                          onChange={(e) =>
                            setGuardians(
                              guardians.map((g, i) =>
                                i === index
                                  ? { ...g, phone_number: e.target.value }
                                  : g
                              )
                            )
                          }
                        />
                        <Textarea
                          label="Address"
                          placeholder="Address"
                          value={guardian.address}
                          onChange={(e) =>
                            setGuardians(
                              guardians.map((g, i) =>
                                i === index
                                  ? { ...g, address: e.target.value }
                                  : g
                              )
                            )
                          }
                        />
                      </Group>
                    ) : (
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "3rem",
                          marginTop: "3rem",
                        }}
                      >
                        <TextInput
                          label="Phone"
                          placeholder="Phone"
                          required
                          value={guardian.phone_number}
                          onChange={(e) =>
                            setGuardians(
                              guardians.map((g, i) =>
                                i === index
                                  ? { ...g, phone_number: e.target.value }
                                  : g
                              )
                            )
                          }
                        />
                        <Textarea
                          label="Address"
                          placeholder="Address"
                          value={guardian.address}
                          onChange={(e) =>
                            setGuardians(
                              guardians.map((g, i) =>
                                i === index
                                  ? { ...g, address: e.target.value }
                                  : g
                              )
                            )
                          }
                        />
                      </Box>
                    )}
                  </Box>
                ))}

                <Group mt="md">
                  <Button
                    //   leftIcon={<IconPlus />}
                    variant="outlined"
                    onClick={addGuardian}
                  >
                    Add Guardian
                  </Button>
                </Group>
              </Card>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary">
                Cancel
              </Button>
              <Button
                onClick={handleParentorGuardianFormSubmit}
                color="primary"
              >
                {!isLoadin ? "Save" : "...Saving"}
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      )}
    </>
  );
};

export default StudentEnrollment;
