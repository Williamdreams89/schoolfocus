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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { APIContext } from "../../utils/contexts/ReactContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useParams } from "react-router-dom";

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

export default function ReviewPublish() {
  const isSmallerDevice = useMediaQuery("(max-width:1045px)")
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [className, setClassName] = useState<string>("");
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const [examSession, setExamSession] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<string>("");
  const [classList, setClassList] = useState<Class[]>([]);
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

  const handlePreview = (student: Student) => {
    alert(
      `Previewing details for ${student.name}:\n` +
        `Grand Total: ${calculateGrandTotal(student)}\n` +
        `GPA: ${calculateGPA(student).toFixed(2)}\n` +
        `Attendance: ${student.attendance}%\n` +
        `Principal's Remark: ${student.principalRemark}`
    );
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
                <td style={{ width: "250px" }}>
                  <Select
                    width={"200px"}
                    value={student.principalRemark}
                    onChange={(value) =>
                      setStudents((prevStudents) =>
                        prevStudents.map((s) =>
                          s.id === student.id
                            ? { ...s, principalRemark: value! }
                            : s
                        )
                      )
                    }
                    data={remarks}
                  />
                </td>
                <td>
                  <Button
                    onClick={() => handlePreview(student)}
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
    </Box>
  );
}
