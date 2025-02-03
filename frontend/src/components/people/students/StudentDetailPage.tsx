import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList';
import { Box, Button, Card, CardContent, CardMedia, Divider, Grid, IconButton, Tab, Table, TableContainer, Typography } from '@mui/material';
import React from 'react'
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import { styled } from '@mui/material/styles';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { Email, Facebook, Phone, RoomServiceOutlined, Twitter, WhatsApp } from '@mui/icons-material';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
  } from "@mui/material";
  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
  import useMediaQuery from '@mui/material/useMediaQuery';
import TabPanel from '@mui/lab/TabPanel';
import { APIContext } from '../../../utils/contexts/ReactContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import FeesTab from './details/Fees';
import ResultsTab from './details/results/Results';
import ResultsGeneration from './details/results/ResultsGeneration'
import { Image, Text, Card as ManCard, Grid as ManGrid } from '@mantine/core';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


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

  interface Score {
    continuous: number;
    exams: number;
    total: number;
  }

  interface Student {
    id: number;
    name: string;
    dob?: string;
    index_number?: string;
    email?: string;
    scores: {
      [subject: string]: Score;
    };
    attendance: number;
    principalRemark: string;
    average_score?: number;
    rank_title?: string;
    data?: any;
  }

const StudentDetailPage = () => {
    const [value, setValue] = React.useState("1");
    const { id } = useParams<{ id: string }>()
    const [studentDetailData, setStudentDetailData] = React.useState<any>()
    const [studentResultDetailData, setStudentResultDetailData] = React.useState<Student | null>(null)
    const navigate = useNavigate()
    const context = React.useContext(APIContext)
    if(!context){
      throw new Error("There should be a context")
    }
    
    const {setStudentsManagementDetails, studentsManagementDetails} = context;
    const studentID = studentsManagementDetails.getIDForStudentDetailPage
    const [studentProfilePic, setStudentProfilePic] = React.useState<any>(null)
    React.useEffect(() =>{
      const fetchStudentDetailData = async () =>{
        try{
          setStudentsManagementDetails({isLoading: true})
          const {data} = await axios.get(`http://127.0.0.1:8000/api/student/${id}/`)
          if (data.profile_pic) {
            const response = await fetch(data.profile_pic, { mode: "cors" });
            const blob = await response.blob();
            const objectURL = URL.createObjectURL(blob);
            setStudentProfilePic(objectURL);
          }
          setStudentDetailData(data)
          setStudentsManagementDetails({isLoading: false})
        }catch(error){
          setStudentsManagementDetails({isLoading: false})
        }
      }

      fetchStudentDetailData()
      return () => {
        if (studentProfilePic) {
          URL.revokeObjectURL(studentProfilePic);
        }
      };
    }, [id])

    const contentRef = React.useRef<HTMLDivElement>(null);
  const generatePDF = async () => {
    if (!contentRef.current) return;

    const canvas = await html2canvas(contentRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("download.pdf");
  };

  // Function to determine the grade remark
const getGradeRemark = (totalScore: number): string => {
  if (totalScore >= 85) return "Excellent";
  if (totalScore >= 75) return "Very Good";
  if (totalScore >= 65) return "Good";
  if (totalScore >= 50) return "Pass";
  return "Fail";
};
    

  React.useEffect(() => {
    const fetchStudentResults = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/results/review_new/JHS%203/2025/First%20Term/");
  
        // Convert `id` from params to a number
        const studentId = Number(id);
  
        // Filter the student by ID
        const fetchStudentResultByID = response.data.find((s: any) => s.id === studentId);
  
        setStudentResultDetailData(fetchStudentResultByID);
        console.log("fetch student results by id=", fetchStudentResultByID);
      } catch (error) {
        console.error("Error fetching student results:", error);
      }
    };
  
    fetchStudentResults();
  }, [id]); // Ensure useEffect re-runs when id changes
  
    
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
            image={studentDetailData?.profile_pic === null?"https://via.placeholder.com/150": `${studentDetailData?.profile_pic}`} // Replace with actual student image URL
            alt="Student Profile"
            sx={{ width: 190, height: 190, margin: 2, borderRadius: 1 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginLeft: 2, textTransform:'uppercase' }}>
            {studentDetailData?.full_name}
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
          <TabPanel value={"1"}>
          <Card>
        <Box display="flex" flexDirection="row" alignItems="center">
          <CardMedia
            component="img"
            image={studentDetailData?.profile_pic === null ? "https://via.placeholder.com/150": studentDetailData?.profile_pic} // Replace with actual student image URL
            alt="Student Profile"
            sx={{ width: 150, height: 150, margin: 2, borderRadius: 1 }}
          />
          <Typography variant="h3" sx={{ fontWeight: 'bold', marginLeft: 2, textTransform:'uppercase' }}>
            {studentDetailData?.full_name}
          </Typography>
        </Box>
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Registration No:</strong> {studentDetailData?.index_number}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Gender:</strong> {studentDetailData?.gender === "M" ? "Male":"Female"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Class Category:</strong> Null
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Class:</strong> {studentDetailData?.student_class_name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Admission Date:</strong> 01-01-2023
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Assigned Tag:</strong> Subscriber
              </Typography>
              <Typography>
                <strong>Registered Online:</strong> Subscriber
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Phone:</strong> +233123456789
              </Typography>
              <Typography>
                <strong>Nationality:</strong> +233123456789
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Town of Residence:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Area of Residence:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Permanent Address:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Residential Address:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Date of Birth:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>NID/Birth Certificate Number:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Blood Group:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Blood Group:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Religion:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Bio/Remark:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Fees:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Current Hostel Allocation:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Current Transport Allocation:</strong> example@school.edu
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Parent/Guardian:</strong> example@school.edu
              </Typography>
            </Grid>
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
        </CardContent>
      </Card>
          </TabPanel>
          <TabPanel value={"2"}>
          </TabPanel>
          <TabPanel value={"3"}>
            <FeesTab />
          </TabPanel>
          <TabPanel value={"4"}>
          <>
          {new Array(studentResultDetailData?.scores).length <0 ?<>
              <ManCard shadow="sm" padding="sm" style={{position:'relative' }} ref={contentRef} >
                <img style={{position:'absolute', zIndex:9999, height:'800px', width:'560px', opacity:"10%", top:'20%', left:'10%'}} src='/images/logo.png' />
                <center style={{fontWeight:800, fontSize:'20px'}}>DREAMS INTERNATIONAL SCHOOL COMPLEX</center>
                {/* Header Section */}
                <Box sx={{ display: "flex", justifyContent:'space-between', width:'100%', }}>
                  
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      // justifyContent: "center",
                      // alignItems: "center",
                      position:'relative'
                    }}
                  >
                    
                    <Box sx={{flex: 3, display:'flex', alignItems:'center', gap:'6rem', mt:'.51rem', mb:'.51rem'}}>
                      <Text>
                        Website: www.lighthouse.edu
                      </Text>
                      <Text>Phone: 0302-987-654</Text>
                      <Text>Ejura</Text>
                    </Box>
                  </Box>
                  {/* <Image
                    src="/images/logo.png"
                    alt="School Logo"
                    style={{ width: "100px", objectFit: "cover" }}
                  /> */}
                </Box>


                {/* Student Info Section */}
                <Box sx={{display:'flex', justifyContent:'space-between', height:'fit-content', border:'1px solid #eaeaea', marginBottom:'rem'}}>
                <Box className="report-bio">
                    <p>Name: {studentResultDetailData?.name}</p>
                    <p>Reg No.: {studentResultDetailData?.index_number} </p>
                    <p>Gender: Male</p>
                    <p>Date Of Birth: {studentResultDetailData?.dob} </p>
                    
                    
                  </Box>
                  <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', padding:'10px'}}>
                    <Image
                      src={`${studentProfilePic}`}
                      alt="Student Photo"
                      height={"140px"}
                    />
                  </Box>
                  <Box className="report-bio">
                    <p>Class:{studentDetailData?.student_class_name}</p>
                    <p>Position: {studentResultDetailData?.rank_title}</p>
                    <p>Student's Average Score:{studentResultDetailData?.average_score}</p>
                  </Box>
                </Box>
                {/* Subject Table */}
                <Box sx={{display:'flex', height:'40%'}}>
                <TableContainer className="custom-table" style={{ flex: 3 }}>
            <Table style={{ height: "100%" }}>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Continuous Assessment</th>
                  <th>Exams</th>
                  <th>Total</th>
                  <th>Grade Remark</th>
                </tr>
              </thead>
              <tbody style={{textAlign:'center'}}>
                {studentResultDetailData?.scores &&
                  Object.entries(studentResultDetailData.scores).map(([subject, score], index) => (
                    <tr key={index}>
                      <td>{subject}</td>
                      <td>{score.continuous}</td>
                      <td>{score.exams}</td>
                      <td>{score.total}</td>
                      <td>{getGradeRemark(score.total)}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </TableContainer>
                  <Box className="report-cognitive">
                    <p style={{fontWeight:900}}>Affective Skill Rating (5)</p>
                    <p><span className="val-one">Punctuality</span><span className="val-two">5</span></p>
                    <p><span className="val-one">Attentiveness</span><span className="val-two">5</span></p>
                    <p><span className="val-one">Neatness</span><span className="val-two">5</span></p>
                    <p><span className="val-one">Honesty</span><span className="val-two">5</span></p>
                    <p><span className="val-one">Politeness</span><span className="val-two">5</span></p>
                    <p><span className="val-one">Perseverance</span><span className="val-two">5</span></p>
                    <p><span className="val-one">Relionship with others</span><span className="val-two">5</span></p>
                    <p style={{fontWeight:900}}>Psychomotor Skill Rating (5)</p>
                    <p><span className="val-one">Handwriting</span><span className="val-two">5</span></p>
                    <p><span className="val-one">Drawing & Painting</span><span className="val-two">5</span></p>
                    <p><span className="val-one">Verbal Fluency</span><span className="val-two">5</span></p>
                    <p><span className="val-one">Retentiveness</span><span className="val-two">5</span></p>
                    <p><span className="val-one">Visual Memory</span><span className="val-two">5</span></p>
                    <p><span className="val-one">Public Speaking</span><span className="val-two">5</span></p>
                    <p><span className="val-one">Sports & Games</span><span className="val-two">5</span></p>
                    <p style={{fontWeight:900}}>Attendance Report</p>
                    <p><span className="val-one">No. of School days</span><span className="val-two">5</span></p>
                    <p><span className="val-one">No. of days present</span><span className="val-two">5</span></p>
                    <p><span className="val-one">No. of days absent</span><span className="val-two">5</span></p>
                  </Box>
                </Box>
                <Divider  />

                {/* Performance Chart */}
                <Text size="sm" style={{fontWeight:900, textAlign:'center', marginTop:'1rem'}}>Subject Performance Chart</Text>
                <Box sx={{height:'260px', width:'100%'}}>
                  {/* <Bar data={data}  /> */}
                  <Bar data={studentResultDetailData?.data} /> 
                </Box>

                {/* Footer Section */}
                {/* <Grid mt="md">
                  <Grid>
                    <Text size="sm">Form Teacher:</Text>
                    <Divider />
                    <Text size="sm">Form Teacher's Signature:</Text>
                  </Grid>
                  <Grid>
                    <Text size="sm">Principal:</Text>
                    <Divider  />
                    <Text size="sm">Principal's Signature:</Text>
                  </Grid>
                </Grid> */}
              </ManCard>
              <Button variant='outlined' onClick={generatePDF}>Generate PDF</Button>
            </>: <Box><p>Results slip not available for this student</p></Box>}
    </>
          </TabPanel>
          <TabPanel value={"5"}></TabPanel>
          <TabPanel value={"6"}></TabPanel>
          <TabPanel value={"7"}></TabPanel>
          <TabPanel value={"8"}></TabPanel>
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