import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Checkbox,
  Paper,
  Box,
  Divider,
  useMediaQuery,
  Card,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  MantineProvider,
  NativeSelect,
  NumberInput,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { APIContext } from "../../utils/contexts/ReactContext";
import axios from "axios";
import "./styles.css"
import { useNavigate } from "react-router-dom";

interface Student {
  id: number;
  index_number: string;
  full_name: string;
  continuousAssessment?: number | "";
  examination?: number | "";
  totalScore?: number;
  scores?: {
    [subject: string]: {
      continuous?: number;
      exams?: number;
      total?: number;
    };
  } | null;
  absent: boolean;
}

interface Subject{
  value: string;
  label: string;
}

const ScoreEntryMain: React.FC = () => {
  const [examSession, setExamSession] = useState<string>("");
  const [examType, setExamType] = useState<string>("");
  const [fetchedSubjects, setFetchedSubjects] = useState<Subject[]>([]);
  const [fetchedStudents, setFetchedStudents] = useState<Student[]>([]);
  const [studentClassName, setStudentClassName] = useState<string>("");
  const [subject, setSubject] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const isSmallDevice = useMediaQuery("(max-width:1045px)");
  const navigate = useNavigate()
  const context = useContext(APIContext);

  if (!context) throw new Error("A context is required!");

  const { studentsManagementDetails, setStudentsManagementDetails } = context;

  // Fetch Subjects
  useEffect(() => {
    const fetchAllSubjects = async () => {
      try {
        setStudentsManagementDetails({ isLoading: true });
        const { data } = await axios.get(`http://127.0.0.1:8000/api/subject/`);
        const subjectList = data.map((subjectItem: any)=>({value: subjectItem.id, label: subjectItem.title}))
        setFetchedSubjects(subjectList);
        setStudentsManagementDetails({ isLoading: false });
      } catch (error) {
        setStudentsManagementDetails({ isLoading: false });
        console.error("Error fetching subjects:", error);
      }
    };
    fetchAllSubjects();
  }, [setStudentsManagementDetails]);

  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // alert(`subject change: ${event.target.value}`)
    setSelectedSubject(event.target.value)
    alert(`${event.target.value}`)
  }

  // Fetch Students for Results Entry
  const fetchStudentsForResultsEntry = async () => {
    // alert(`ExamSession:${examSession}; examType:${examType}; studentClassName:${studentClassName}; subject:${subject}`);
    
    if (examSession && examType && studentClassName && selectedSubject) {
      try {
        setStudentsManagementDetails({ isLoading: true });
  
        // Fetch results for the selected subject and exam session
        const response = await axios.get(`http://127.0.0.1:8000/api/results/per_subject/review/${new Date().getFullYear()}/${examSession}/${studentClassName}/${selectedSubject}/`);
        const { data: studentData } = await axios.get(`http://127.0.0.1:8000/api/results/${studentClassName}/`);
        
        // Combine students and results based on matching full_name
        const combineStudents = studentData.map((student: any) => {
          // Find the matching result for the current student based on `index_number`
          const matchingResult = response.data.find(
              (result: any) => result.index_number === student.index_number
          );
      
          // Return the student object with scores if a match is found, or just the student object
          return {
              ...student,
              scores: matchingResult ? matchingResult.scores : null, // Attach scores or null if no match
          };
      });
      
      // Log to confirm the output
      console.log(combineStudents);
      
        

        console.log("matched=", combineStudents)
  
        setFetchedStudents(combineStudents);
        setStudentsManagementDetails({ isLoading: false });
      } catch (error) {
        setFetchedStudents([]);
        setStudentsManagementDetails({ isLoading: false });
        console.error("Error fetching students:", error);
        // alert("No students found in the specified class.");
      }
    } else {
      // alert("All fields must be filled.");
    }
  };
  

  

  // Handle Input Change
  const handleInputChange = (studentId: number, field: string, subject: string, value: number) => {
    setFetchedStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? {
              ...student,
              scores: {
                ...student.scores,
                [subject]: {
                  ...student.scores?.[subject],
                  [field]: value,
                  total: (student.scores?.[subject]?.continuous || 0) + (student.scores?.[subject]?.exams || 0),
                },
              },
            }
          : student
      )
    );
  };
  

  // Handle Absent Toggle
  const handleAbsentChange = (id: number) => {
    setFetchedStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? { ...student, absent: !student.absent, continuousAssessment: 0, examination: 0 }
          : student
      )
    );
  };

  // Handle Submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      // Create the payload
      const payload = fetchedStudents.map((student) => ({
        student: Number(student.id),
        subject_name: selectedSubject,
        continuous_assessment: student.scores?.[selectedSubject]?.continuous || 0,
        exams_score: student.scores?.[selectedSubject]?.exams || 0,
        absent: student.absent,
        academic_year: "2025",
        exam_session: examSession,
      }));

      console.log("payload=", payload)
  
      // Set loading state
      setStudentsManagementDetails({ isLoading: true });
  
      // Make the POST request
      await axios.post(
        `http://127.0.0.1:8000/api/results/${studentClassName}/`,
        payload
      );
  
      // Reset loading state and show success message
      setStudentsManagementDetails({ isLoading: false });
      alert("Scores successfully saved!");
    } catch (error) {
      // Reset loading state and handle errors
      setStudentsManagementDetails({ isLoading: false });
      console.error("Error saving scores:", error);
  
      // Display error details if available
      if (axios.isAxiosError(error) && error.response?.data) {
        // alert(`Error saving scores: ${JSON.stringify(error.response.data)}`);
      } else {
        // alert("Error saving scores.");
      }
    }
  };
  

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: !isSmallDevice ? "row" : "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography component="h2" variant="h6">
          Exam Score Entry
        </Typography>
      </Box>
      <Accordion sx={{mb:'2rem'}} defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            <span style={{ color: "red" }}>* </span>Fetch Data Options
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Card>
            <MantineProvider>
              <SimpleGrid cols={4}>
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
                  label="Exam Type"
                  data={[
                    "Select Exam",
                    "Mid-Term Exams",
                    "End of Term Exams",
                    "Resit Exams",
                  ]}
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                />
                <NativeSelect
                  label="Class"
                  data={[
                    "- Select Class -","KG 1", "KG 2", "KG 3",
                    "BS 1", "BS 2", "BS 3", "BS 4", "BS 5", "BS 6",
                    "JHS 1", "JHS 2", "JHS 3"
                  ]}
                  value={studentClassName}
                  onChange={(e) => setStudentClassName(e.target.value)}
                />
                <NativeSelect
                  label="Subject"
                  data={fetchedSubjects.map((subject) => ({
                    value: subject.value, // Store subject ID as value
                    label: subject.label, // Display subject name as label
                  }))}
                  onChange={handleSubjectChange}
                />
              </SimpleGrid>
            </MantineProvider>
            <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
              <Button variant="contained" color="primary" size="small" onClick={fetchStudentsForResultsEntry}>
                <BookmarkAddedIcon /> Manage Students Score
              </Button>
            </Box>
          </Card>
        </AccordionDetails>
      </Accordion>
      {fetchedStudents.length > 0 && (
        <>
        <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "30px",
        backgroundColor: "", // Adjust as per your design
        // border: "1px solid #ccc",
        // borderRadius: "4px",
        width:'100%'
      }}
    >
      <Typography
        sx={{
          // fontWeight: "bold",
          fontSize: "18px",
          marginRight: "15px",
        }}
      >
        {studentClassName} Students
      </Typography>
      {/* <Divider orientation="vertical" flexItem /> */}
      <Typography
        sx={{
          marginLeft: "15px",
          marginRight: "15px",
          fontSize: "18px",
        }}
      >
        Scores Entry for Subject: {selectedSubject}
      </Typography>
      {/* <Divider orientation="vertical" flexItem /> */}
      <Typography sx={{ marginLeft: "15px", fontSize: "18px", }}>
        Exam: {examSession.toUpperCase()}, 2025-2026 ({examType})
      </Typography>
    </Box>
    <Divider />
    <Box sx={{height:'fit-content',padding:'1rem', width:'100%'}}>
        <Box sx={{display: 'flex', justifyContent:'right', gap:'3rem'}}>
          {/* <Button variant="outlined" size="large">Configure Score Division</Button> */}
          <Button variant="contained" size="large" color="primary" onClick={()=>navigate("/Review&PublishResultsOptions")}>Review & Publish Results</Button>
        </Box>
    </Box>
        <form onSubmit={handleSubmit}>
          <TableContainer component={Paper}>
          <Table stickyHeader className="custom-table">
  <TableHead>
    <TableRow>
      <TableCell>Student Name</TableCell>
      <TableCell><Box sx={{display:'flex', flexDirection:'column'}}><span style={{fontSize:'17px', width:'300px'}}>Continuous Assessment</span><small>Max Score: 40</small></Box></TableCell>
      <TableCell><Box sx={{display:'flex', flexDirection:'column'}}><span style={{fontSize:'17px', width:'300px'}}>Exam Score</span><small>Max Score: 60</small></Box></TableCell>
      <TableCell>Total Score</TableCell>
      <TableCell>Absent</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {fetchedStudents.map((student) => (
      <TableRow key={student.id}>
        <TableCell>{student.full_name}</TableCell>
        <TableCell>
        <NumberInput
          min={0}
          max={40}
          value={student.scores?.[selectedSubject]?.continuous || 0}
          onChange={(value: any) => {
            const clampedValue = Math.min(Math.max(value || 0, 0), 40); // Clamp value between 0 and 40
            handleInputChange(student.id, "continuous", selectedSubject, clampedValue);
          }}
          disabled={student.absent} // Disable input if the student is marked absent
        />
          </TableCell>
          <TableCell>
          <NumberInput
          min={0}
          max={60}
          value={student.scores?.[selectedSubject]?.exams || 0}
          onChange={(value: any) => {
            const clampedValue = Math.min(Math.max(value || 0, 0), 60); // Clamp value between 0 and 60
            handleInputChange(student.id, "exams", selectedSubject, clampedValue);
          }}
          disabled={student.absent} // Disable input if the student is marked absent
        />
          </TableCell>
          <TableCell>
            {(student.scores?.[selectedSubject]?.continuous || 0) +
              (student.scores?.[selectedSubject]?.exams || 0)}
          </TableCell>
          <TableCell>
            <Checkbox
              checked={student.absent}
              onChange={() => handleAbsentChange(student.id)}
            />
          </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>


          </TableContainer>
          <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
            <Button variant="contained" type="submit">
              Save Scores
            </Button>
          </Box>
        </form>
        </>
      )}
    </Box>
  );
};

export default ScoreEntryMain;
