import React, { useState } from "react";
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
  Typography,
  Divider,
  useMediaQuery,
  Card,
} from "@mui/material";
import { MantineProvider, NativeSelect, SimpleGrid, TextInput } from "@mantine/core";
import { APIContext } from "../../utils/contexts/ReactContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

interface Student {
  id: number;
  name: string;
  rollNo: string;
  continuousAssessment: number | "";
  midTermTest: number | "";
  examination: number | "";
  totalScore: number;
  absent: boolean;
}

const ScoreEntryMain: React.FC = () => {

  // Dummy data work
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Demo Student", rollNo: "001", continuousAssessment: 10, midTermTest: 18, examination: 55, totalScore: 83, absent: false },
    { id: 2, name: "James Enyinnaya", rollNo: "009", continuousAssessment: 9, midTermTest: 12, examination: 54, totalScore: 75, absent: false },
    { id: 3, name: "Obasi Oluchukwu", rollNo: "010", continuousAssessment: 4, midTermTest: 10, examination: 39, totalScore: 53, absent: false },
    { id: 4, name: "Jolayemi James Taiwo", rollNo: "011", continuousAssessment: 7, midTermTest: 18, examination: 60, totalScore: 85, absent: false },
  ]);

  const handleInputChange = (
    id: number,
    field: keyof Omit<Student, "id" | "name" | "rollNo" | "totalScore" | "absent">,
    value: number | ""
  ) => {
    setFetchStudents((prevStudents: any) =>
      prevStudents.map((student: any) => {
        if (student.id === id) {
          const updatedStudent = {
            ...student,
            [field]: value, 
          };
  
          // Explicitly ensure the values are numbers
          const continuousAssessment = Number(updatedStudent.continuousAssessment) || 0;
          const examination = Number(updatedStudent.examination) || 0;
  
          return {
            ...updatedStudent,
            totalScore: continuousAssessment + examination,
          };
        }
        return student;
      })
    );
  };
  

  const handleAbsentToggle = (id: number) => {
    setFetchStudents((prevStudents: any) =>
      prevStudents.map((student: any) =>
        student.id === id ? { ...student, absent: !student.absent } : student
      )
    );
  };

  // Data from API work
  const isSmallDevice = useMediaQuery("(max-width:1045px)")
  const context = React.useContext(APIContext)
  if(!context){
    throw new Error("A context is required!")
  }
  const {studentsManagementDetails, setStudentsManagementDetails} = context;
  const [fetchedStudents, setFetchStudents] = React.useState<any>()
  const [studentClassName, setStudentClassName] = React.useState<string>("")
  const [subject, setSubject] = React.useState<any>(null)
  const fetchStudentsForResultsEntry = async () => {
    try{
      setStudentsManagementDetails({isLoading: true})
      const {data} = await axios.get(`http://127.0.0.1:8000/api/results/${studentClassName}/`)
      setFetchStudents(data)
      setStudentsManagementDetails({isLoading: false})
    }catch(error){
      setStudentsManagementDetails({isLoading: false})
      alert(`error:${error}`)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const payload = fetchedStudents.map((student: any) => ({
        student: student.id,
        subject: 1,
        continuous_assessment: student.continuousAssessment,
        exams_score: student.examination,
        absent: student.absent,
        academic_year: '2025',
        exam_session: 'First Term'

      }));

      setStudentsManagementDetails({ isLoading: true });
      await axios.post(`http://127.0.0.1:8000/api/results/${studentClassName}/`, payload);
      setStudentsManagementDetails({ isLoading: false });
      alert("Scores successfully saved!");
    } catch (error) {
      setStudentsManagementDetails({ isLoading: false });
      alert(`Error saving scores: ${error}`);
    }
  };


  const navigate = useNavigate()
  

  return (
    <>
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Box sx={{width:'100%', display:'flex', flexDirection: !isSmallDevice ? 'row':'column', alignItems:'center', justifyContent:'space-between' }}>
          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            Exam Score Entry
          </Typography>
          
        </Box>
      <Card sx={{mt:'2rem', pb:'5rem'}}>
          <MantineProvider>
          <Typography variant='h6' component={'h4'}>Select Options</Typography>
        <Divider sx={{mb:'1rem', mt:'1rem'}} />
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          <NativeSelect
          label="Exam Session"
          data={['Select Exam Section','First Term', 'Second Term', 'Third Term']}
          required
        />
        <NativeSelect
          label="Exam"
          data={['Select Exam','Mid-Term Exams', 'End of Term Exams', 'Supplementary/Resit Exams']}
          required
        />
        <NativeSelect
          label="Class"
          data={['Select Class','BS1', 'BS2', 'BS3', "JHS 3"]}
          name="class"
          value={studentClassName}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>)=>{setStudentClassName(event.target.value)}}
          required
        />
        {/* <NativeSelect
          label="Class Division"
          data={['Select Class Division','BS1A', 'BS2A', 'JHS1A']}
          required
        /> */}
        <NativeSelect
          label="Subject"
          data={['Select Subject','English Language', 'Mathematics', 'Integrated Science']}
          required
          value={subject}
        />
        </SimpleGrid>
      </MantineProvider>
      <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', mt:'2.3rem'}}>
        <Button variant='contained' onClick={fetchStudentsForResultsEntry}><BookmarkAddedIcon sx={{color:'white'}} /> Manage Students' Scores</Button>
      </Box>
      </Card>
    </Box>
    {fetchedStudents?.length >= 0?<>
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
        JS1 ( A ) Students
      </Typography>
      <Divider orientation="vertical" flexItem />
      <Typography
        sx={{
          marginLeft: "15px",
          marginRight: "15px",
        }}
      >
        Scores Entry for Subject: <b>English Language</b>
      </Typography>
      <Divider orientation="vertical" flexItem />
      <Typography sx={{ marginLeft: "15px" }}>
        Exam: <b>FIRST TERM, 2024-2025 (End of Term Examination)</b>
      </Typography>
    </Box>
        <form onSubmit={handleSubmit}>
        <TableContainer component={Paper}>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell align="center">Index No</TableCell>
                <TableCell width={170}>Student</TableCell>
                <TableCell>Continuous Assessment (Max: 10)</TableCell>
                <TableCell>Examination (Max: 70)</TableCell>
                <TableCell>Total Score (Max: 100)</TableCell>
                <TableCell>Absent</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {fetchedStudents.map((student:any, index: any) => (
                <TableRow key={student.id}>
                <TableCell>{student.index_number}</TableCell>
                <TableCell>
                    {student.full_name}
                </TableCell>
                <TableCell>
                    <TextInput
                    type="number"
                    value={student.continuousAssessment || ""}
                    onChange={(e) =>
                        handleInputChange(student.id, "continuousAssessment", parseInt(e.target.value) || "")
                    }
                    disabled={student.absent}
                    />
                </TableCell>
                <TableCell>
                    <TextInput
                    type="number"
                    
                    value={student.examination || ""}
                    onChange={(e) =>
                        handleInputChange(student.id, "examination", parseInt(e.target.value) || "")
                    }
                    disabled={student.absent}
                    />
                </TableCell>
                <TableCell>
                    <TextInput
                    type="number"
                    value={student.totalScore}
                    disabled
                    />
                </TableCell>
                <TableCell>
                    <Checkbox
                    checked={student.absent}
                    onChange={() => handleAbsentToggle(student.id)}
                    color="primary"
                    />
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <Button
                variant="contained"
                color="primary"
                style={{ marginTop: 16, marginBottom:16 }}
                onClick={handleSubmit}
                
            >
                Save Scores
            </Button>
        </Box>
        </TableContainer>
        </form>
    </>:<>No data here</>}
    </>
  );
};

export default ScoreEntryMain;
