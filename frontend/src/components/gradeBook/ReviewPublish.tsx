import React, { useState } from "react";
import {
  Table,
  Center,
  Text,
  Select,
  Button,
  MantineProvider,
  NativeSelect,
  SimpleGrid,
  Modal,
} from "@mantine/core";
import "./styles.css";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  TableContainer,
  Backdrop,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { APIContext } from "../../utils/contexts/ReactContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useParams } from "react-router-dom";
import ReportCard from "./ReportCard";
import {Card as ManCard} from "@mantine/core"
import {
  Grid,
  Image,
  Divider,
} from "@mantine/core";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "./styles.css";
import RoomIcon from '@mui/icons-material/Room';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


const studentData = {
  name: "DANQUAH WILLIAM KWAFO",
  regNo: "2025/000003",
  gender: "M",
  age: "",
  class: "PRIMARY 6 - A",
  email: "william.danquah@schoolsfocus.net",
  position: "1st",
  noOfSubjects: 3,
  totalScore: "165 / 200",
  average: "82.50%",
  gpa: "5.00",
  resultSummary: "Incomplete Result",
};

const data = {
  labels: ["English Language", "Agricultural Science", "ICT"],
  datasets: [
    {
      label: "Exam Performance",
      data: [80, 85, 75],
      backgroundColor: ["#3498db", "#2ecc71", "#e74c3c"],
    },
  ],
};

interface Score {
  continuous: number;
  exams: number;
}

interface Subject {
  id: number;
  name: string;
}

interface Student {
  id: number;
  name: string;
  scores: {
    [subject: string]: Score;
  };
  attendance: number; // Percentage of attendance
  principalRemark: string; // Principal's remark
  average_score?: number;
  rank_title?: string;
}

// const subjects = [
//   { name: "English Language", maxContinuous: 40, maxExams: 60 },
//   { name: "Agricultural Science", maxContinuous: 40, maxExams: 60 },
//   { name: "Fine Art", maxContinuous: 40, maxExams: 60 },
// ];

const remarks = [
  { value: "Excellent", label: "Excellent performance" },
  { value: "Good", label: "Good performance" },
  { value: "Needs Improvement", label: "Needs improvement" },
];

interface Class {
  value: string;
  label: string;
}

interface Skill {
  id: number;
  name: string;
}


interface CognitiveAssessmentFormProps {
  student: Student;
  onClose: () => void;
}

const CognitiveAssessmentForm: React.FC<CognitiveAssessmentFormProps> = ({ student, onClose }) => {
  const [skills, setSkills] = useState<Skill[]>([
    { "id": 1, "name": "Punctuality" },
    { "id": 2, "name": "Attentiveness" },
    { "id": 3, "name": "Neatness" },
    { "id": 4, "name": "Honesty" },
    { "id": 5, "name": "Politeness" },
    { "id": 6, "name": "Perseverance" },
    { "id": 7, "name": "Relationship with Others" },
    { "id": 8, "name": "Handwriting" },
    { "id": 9, "name": "Drawing & Painting" },
    { "id": 10, "name": "Verbal Fluency" },
    { "id": 11, "name": "Retentiveness" },
    { "id": 12, "name": "Visual Memory" },
    { "id": 13, "name": "Public Speaking" },
    { "id": 14, "name": "Sports & Games" }
  ]
  );
  const [scores, setScores] = useState<{ [skillId: number]: number }>({});

  // React.useEffect(() => {
  //   axios.get('/api/skills/').then((response) => setSkills(response.data));
  // }, []);

  const handleScoreChange = (skillId: number, score: number) => {
    setScores({ ...scores, [skillId]: score });
  };

  const handleSubmit = () => {
    const payload = Object.keys(scores).map((skillId) => ({
      student: student.id,
      skill: parseInt(skillId, 10),
      score: scores[parseInt(skillId, 10)],
    }));

    axios.post('/api/skill-assessments/', payload).then(() => {
      onClose();
    });
  };

  return (
    <Box p={3}>
      <Typography variant="h6">{`Assessing ${student.name}`}</Typography>
      {skills.map((skill) => (
        <Box key={skill.id} mt={2}>
          <Typography>{skill.name}</Typography>
          <RadioGroup
            row
            value={scores[skill.id] || ''}
            onChange={(e) => handleScoreChange(skill.id, parseInt(e.target.value, 10))}
          >
            {[1, 2, 3, 4, 5].map((score) => (
              <FormControlLabel
                key={score}
                value={score}
                control={<Radio />}
                label={score.toString()}
              />
            ))}
          </RadioGroup>
        </Box>
      ))}
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
};

export default function ReviewPublish() {
  const isSmallerDevice = useMediaQuery("(max-width:1045px)")
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [className, setClassName] = useState<string>("");
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const [examSession, setExamSession] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<string>("");
  const [classList, setClassList] = useState<Class[]>([]);
  const [open, setOpen] = React.useState<boolean>(false)

  const calculateGrandTotal = (student: Student) => {
    return Object.values(student.scores).reduce(
      (sum, score) => sum + (score.continuous || 0) + (score.exams || 0),
      0
    );
  };

  const calculateGPA = (student: Student) => {
    const grandTotal = calculateGrandTotal(student);
    const maxTotal = subjects.length * 100;
    return (grandTotal / maxTotal) * 4.0; // GPA on a scale of 4.0
  };

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handlePreview = async (student: Student) => {
    try {
      // Just for clarity, though not necessary since student is already passed
      const selectedStudentData = students.filter((s) => s.id === student.id)[0];
      // const { data } = await axios.get(
      //   `http://127.0.0.1:8000/api/results/student/${selectedStudentData.id}/`
      // );
      setSelectedStudent(selectedStudentData); // Set the selected student
      // setReportCardData(data); // Set the fetched report card data
      console.log("selected student results=", selectedStudentData)
    } catch (error) {
      console.error(`Error fetching student data: ${error}`);
    }
  };

  const context = React.useContext(APIContext);
  if (!context) {
    throw new Error("Context was not found!");
  }

  const { studentsManagementDetails, setStudentsManagementDetails } = context;

  React.useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await axios.get("http://127.0.0.1:8000/api/class/");
        const storedClassList = data.map((classItem: any) => ({
          value: classItem.id.toString(), // Convert ID to a string
          label: classItem.name, // Use the name directly
        }));
        setClassList(storedClassList);
      } catch (error) {
        alert(`Error fetching classes: ${error}`);
      }
    };
    fetchClasses();
  }, []);
  
  const fetchResults = async () => {
    try {
      setStudentsManagementDetails({ isLoading: true });
      const { data } = await axios.get(
        `http://127.0.0.1:8000/api/results/review_new/${selectedClassName}/${academicYear}/${examSession}/`
      );
      console.log("results =", data);
      setStudents(data);
      setStudentsManagementDetails({ isLoading: false });
    } catch (error) {
      setStudentsManagementDetails({ isLoading: false });
      // alert(`${error}`);
      console.log(`${error}`);
    }
  };

    const fetchSubjects = async () => {
      try {
        setStudentsManagementDetails({ isLoading: true });
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/results/subjects/${selectedClassName}/${academicYear}/${examSession}/`
        );
        setSubjects(data);
        setStudentsManagementDetails({ isLoading: false });
      } catch (error) {
        setStudentsManagementDetails({ isLoading: false });
        // alert(`error: ${error}`);
      }
    };


  const handleFormSubmit = () =>{
    if(selectedClassName.length ===0 && examSession.length===0 && academicYear.length===0){
      alert("All fields must be filled")
    }
    try{
      setStudentsManagementDetails({isLoading: true})
      fetchSubjects()
      fetchResults()
      setStudentsManagementDetails({isLoading: false})
    }catch(error){
      setStudentsManagementDetails({isLoading: false})
      setStudents([])
      setSubjects([])
      alert('error fetching results')
    }
  }

  const handleOpenForm = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleCloseForm = () => {
    setSelectedStudent(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
    >
      <Accordion sx={{ width: "100%" }} defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Select Class List to View Results</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Card>
            <MantineProvider>
              <SimpleGrid cols={!isSmallerDevice?4:1}>
                <NativeSelect
                  label="Exam Session"
                  data={[
                    "Select Exam Session",
                    "First Term",
                    "Second Term",
                    "Third Term",
                  ]}
                  value={examSession}
                  onChange={(e) => setExamSession(e.target.value)}
                  />
                <NativeSelect
                  aria-placeholder="Select Academic year"
                  label="Academic Year"
                  data={["2021", "2022", "2023", "2024", "2025"]}
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                />
                <NativeSelect
                  label="Class"
                  data={classList}
                  value={className}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    const selectedValue = event.target.value;
                    setClassName(selectedValue);

                    // Find the selected class item to get the name
                    const selectedClass = classList.find(
                      (classItem) => classItem.value === selectedValue
                    );
                    setSelectedClassName(selectedClass?.label || ""); // Update the class name state
                  }}
                />
            <Box sx={{ textAlign: "center", marginTop: "1.4rem" }}>
              <Button variant="contained" onClick={handleFormSubmit} style={{width:'100%'}}>View Results</Button>
            </Box>
              </SimpleGrid>
            </MantineProvider>
          </Card>
        </AccordionDetails>
      </Accordion>
      {students.length !==0 ?<TableContainer sx={{ mt: "1rem" }}>
        <Table className="custom-table" withColumnBorders>
          <thead>
            <tr>
              <th rowSpan={2} align="center" style={{ width: "50px" }}>
                #
              </th>
              <th style={{ width: "250px" }} align="center" rowSpan={2}>
                Students
              </th>
              {subjects.map((subject) => (
                <th
                  align="center"
                  style={{ width: "250px" }}
                  colSpan={3}
                  key={subject.name}
                >
                  {subject.name}
                </th>
              ))}
              <th align="center" style={{ width: "100px" }} rowSpan={2}>
                Grand Total
              </th>
              <th align="center" style={{ width: "100px" }} rowSpan={2}>
                Average Score
              </th>
              <th align="center" style={{ width: "100px" }} rowSpan={2}>
                Position
              </th>
              <th align="center" style={{ width: "120px" }} rowSpan={2}>
                Attendance (%)
              </th>
              <th align="center" style={{ width: "200px" }} rowSpan={2}>
                Principal's Remark
              </th>
              <th align="center" style={{ width: "100px" }} rowSpan={2}>
                Actions
              </th>
            </tr>
            <tr>
              {subjects.map((subject) => (
                <React.Fragment key={subject.name}>
                  <th align="center">Continuous (40)</th>
                  <th align="center">Exams ({60})</th>
                  <th align="center">Total (100)</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id}>
                <td align="center">{index + 1}</td>
                <td align="center" style={{ width: "250px" }}>
                  {student.name}
                </td>
                {subjects.map((subject) => {
                  const score = student.scores[subject.name];
                  const total = score ? score.continuous + score.exams : 0; // Safeguard for undefined score
                  return (
                    <React.Fragment key={subject.name}>
                      <td align="center">{score ? score.continuous : 0}</td>
                      <td align="center">{score ? score.exams : 0}</td>
                      <td>
                        <Center>
                          <Text>{total}</Text>
                        </Center>
                      </td>
                    </React.Fragment>
                  );
                })}
                <td>{calculateGrandTotal(student)}</td>
                <td>{student.average_score}</td>
                <td>{student.rank_title}</td>
                <td>{student.attendance}%</td>
                <td align="center" style={{ width: "250px" }}>
                <Button onClick={() => handleOpenForm(student)}>Assess</Button>
                </td>
                <td>
                  <Button
                    onClick={() => {handlePreview(student); setOpen(true)}}
                    variant="outline"
                  >
                    Preview
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>: <Box sx={{width:'100%', height:'200px', display:'flex', justifyContent:'center', alignItems:'center'}}>Results Not Available!!</Box>}
      {open&&<Backdrop
  sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1, display:'flex', flexDirection:'column', gap:'1rem', position:'fixed',  top:0, left:0, overflowY:'scroll', height:'2000px'})}
open={open}
>

      <Modal size={"65rem"} opened={open} style={{position:'absolute', zIndex:99999, overflowY:'hidden'}} onClose={()=>setOpen(false)}>
      <ManCard shadow="sm" padding="lg">
      <center style={{fontWeight:800, fontSize:'26px'}}>DREAMS INTERNATIONAL SCHOOL COMPLEX</center>
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent:'space-between', width:'100%', }}>
        <Image
          src="/images/logo.png"
          alt="School Logo"
          style={{ width: "100px", objectFit: "cover" }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // justifyContent: "center",
            // alignItems: "center",
            position:'relative'
          }}
        >
          <Box sx={{position:'absolute', display:'flex', flexDirection:'column', width:'100%', justifyContent:'center', alignItems:'center'}}><RoomIcon /> <span style={{fontSize:'17px'}}>Ejura</span></Box>
          <Box sx={{flex: 3, display:'flex', alignItems:'center', gap:'2rem', mt:'1rem'}}>
            <Text>
              Website: www.lighthouse.edu
              <Divider orientation="vertical" />
            </Text>
            <Text>Phone: 0302-987-654</Text>
            <Text>
              <Divider orientation="vertical" />
              Email:admin@lighthouse.edu.gh
            </Text>
          </Box>
        </Box>
        <Image
          src="/images/logo.png"
          alt="School Logo"
          style={{ width: "100px", objectFit: "cover" }}
        />
      </Box>


      {/* Student Info Section */}
      <Box sx={{display:'flex', justifyContent:'space-between', height:'fit-content', border:'1px solid #eaeaea', marginBottom:'rem'}}>
      <Box className="report-bio">
          <p>Name: {selectedStudent?.name}</p>
          <p>Reg No.:  </p>
          <p>Gender: Male</p>
          <p>Date Of Birth: </p>
          <p>Class Category: PRIMARY</p>
          <p>Class: PRIMARY 6-A</p>
          <p>Email: williamdanquah@gmail.com</p>
          
        </Box>
        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', padding:'10px'}}>
          <img
            src="images/avata.png"
            alt="Student Photo"
            width={"220px"}
          />
        </Box>
        <Box className="report-bio">
          <p>Position: {selectedStudent?.rank_title}</p>
          <p>Student Average: {selectedStudent?.average_score}%</p>
          <p>No. of Subjects: 8</p>
          <p>Student's Total Score: </p>
          <p>Student's Average Score:</p>
          <p>Grade Point Average:</p>
          <p>Grade Summary</p>
        </Box>
      </Box>
      {/* Subject Table */}
      <Box sx={{display:'flex'}}>
        <Table className="custom-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Continuous Assessment</th>
              <th>Examination</th>
              <th>Total Score</th>
              <th>Grade Remark</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>English Language</td>
              <td>40</td>
              <td>40</td>
              <td>80</td>
              <td>Good</td>
            </tr>
            <tr>
              <td>Agricultural Science</td>
              <td>35</td>
              <td>50</td>
              <td>85</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>ICT</td>
              <td>30</td>
              <td>45</td>
              <td>75</td>
              <td>Good</td>
            </tr>
          </tbody>
        </Table>
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
      <Divider my="sm" />

      {/* Performance Chart */}
      <Text size="sm">Subject Performance Chart</Text>
      <Bar data={data} />

      {/* Footer Section */}
      <Grid mt="md">
        <Grid.Col span={6}>
          <Text size="sm">Form Teacher:</Text>
          <Divider my="xs" />
          <Text size="sm">Form Teacher's Signature:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text size="sm">Principal:</Text>
          <Divider my="xs" />
          <Text size="sm">Principal's Signature:</Text>
        </Grid.Col>
      </Grid>
    </ManCard>
      </Modal>
</Backdrop>}
{!!selectedStudent&&<Backdrop
  sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1, display:'flex', flexDirection:'column', gap:'1rem', position:'fixed',  top:0, left:0, overflowY:'scroll', height:'2000px'})}
open={open}
>
<Dialog open={!!selectedStudent} onClose={handleCloseForm} fullWidth>
        {selectedStudent && (
          <CognitiveAssessmentForm
            student={selectedStudent}
            onClose={handleCloseForm}
          />
        )}
      </Dialog>
  </Backdrop>}
    </Box>
  );
}
