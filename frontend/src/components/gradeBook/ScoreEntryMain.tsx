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
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { APIContext } from "../../utils/contexts/ReactContext";
import axios from "axios";

interface Student {
  id: number;
  index_number: string;
  full_name: string;
  continuousAssessment: number | "";
  examination: number | "";
  totalScore: number;
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
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const isSmallDevice = useMediaQuery("(max-width:1045px)");
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
    const subjectId = parseInt(event.target.value, 10); // Convert the selected value to an integer
    setSelectedSubject(subjectId);
    const selected = fetchedSubjects.find((subject) => Number(subject.value) === subjectId); // Find the selected subject
    setSubject(selected ? selected.label : null)
  };

  // Fetch Students for Results Entry
  const fetchStudentsForResultsEntry = async () => {
    alert(`ExamSession:${examSession}; examType:${examType}; studentClassName:${studentClassName}; subject:${selectedSubject}`)
    if (examSession && examType && studentClassName && selectedSubject) {
      try {
        setStudentsManagementDetails({ isLoading: true });
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/results/${studentClassName}/`
        );
        setFetchedStudents(data);
        setStudentsManagementDetails({ isLoading: false });
      } catch (error) {
        setFetchedStudents([]);
        setStudentsManagementDetails({ isLoading: false });
        console.error("Error fetching students:", error);
        alert("No students found in the specified class.");
      }
    } else {
      alert("All fields must be filled.");
    }
  };

  // Handle Input Change
  const handleInputChange = (
    id: number,
    field: keyof Pick<Student, "continuousAssessment" | "examination">,
    value: number | ""
  ) => {
    setFetchedStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id
          ? {
              ...student,
              [field]: value,
totalScore:
  (field === "continuousAssessment"
    ? Number(value)
    : Number(student.continuousAssessment) || 0) +
  (field === "examination"
    ? Number(value)
    : Number(student.examination) || 0),
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
      const payload = fetchedStudents.map((student) => ({
        student: Number(student.id),
        subject: selectedSubject,
        continuous_assessment: student.continuousAssessment,
        exams_score: student.examination,
        absent: student.absent,
        academic_year: "2025",
        exam_session: examSession,
      }));
      setStudentsManagementDetails({ isLoading: true });
      await axios.post(
        `http://127.0.0.1:8000/api/results/${studentClassName}/`,
        payload
      );
      setStudentsManagementDetails({ isLoading: false });
      alert("Scores successfully saved!");
    } catch (error) {
      setStudentsManagementDetails({ isLoading: false });
      console.error("Error saving scores:", error);
      alert("Error saving scores.");
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
      <Accordion defaultExpanded>
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
                  data={["Select Class", "BS1", "BS2", "JHS 3"]}
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
              <Button variant="contained" onClick={fetchStudentsForResultsEntry}>
                <BookmarkAddedIcon /> Fetch Students
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
        justifyContent: "center",
        padding: "10px",
        backgroundColor: "#f0f0f0", // Adjust as per your design
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "14px",
        width:'100%'
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
          marginRight: "15px",
        }}
      >
        {studentClassName} Students
      </Typography>
      <Divider orientation="vertical" flexItem />
      <Typography
        sx={{
          marginLeft: "15px",
          marginRight: "15px",
        }}
      >
        Scores Entry for Subject: <b>{subject}</b>
      </Typography>
      <Divider orientation="vertical" flexItem />
      <Typography sx={{ marginLeft: "15px" }}>
        Exam: <b>{examSession.toUpperCase()}, 2025-2026 ({examType})</b>
      </Typography>
    </Box>
        <form onSubmit={handleSubmit}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Index No</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell>Continuous Assessment</TableCell>
                  <TableCell>Examination</TableCell>
                  <TableCell>Total Score</TableCell>
                  <TableCell>Absent</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fetchedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.index_number}</TableCell>
                    <TableCell>{student.full_name}</TableCell>
                    <TableCell>
                      <TextInput
                        type="number"
                        disabled={student.absent}
                        value={student.continuousAssessment || ""}
                        onChange={(e) =>
                          handleInputChange(
                            student.id,
                            "continuousAssessment",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextInput
                        type="number"
                        disabled={student.absent}
                        value={student.examination || ""}
                        onChange={(e) =>
                          handleInputChange(
                            student.id,
                            "examination",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>{student.totalScore}</TableCell>
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
