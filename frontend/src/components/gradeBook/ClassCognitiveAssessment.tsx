import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Paper,
  Card,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MantineProvider, NativeSelect, SimpleGrid } from "@mantine/core";
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

// Define the structure of a student record
interface Student {
  rollNumber: string;
  fullName: string;
  completionStatus: "Completed" | "Not Completed";
}

const ClassCognitiveAssessment: React.FC = () => {
  // Sample student data
  const [students, setStudents] = useState<Student[]>([
    { rollNumber: "001", fullName: "John Doe", completionStatus: "Completed" },
    { rollNumber: "002", fullName: "Jane Smith", completionStatus: "Not Completed" },
    { rollNumber: "003", fullName: "Michael Johnson", completionStatus: "Completed" },
    { rollNumber: "004", fullName: "Emily Davis", completionStatus: "Not Completed" },
  ]);

  const navigate = useNavigate()

  // Handlers for Add and Edit button actions
  const handleView = (rollNumber: string) => {
    alert(`Viewing details for student with Roll No: ${rollNumber}`);
    navigate("/viewStudentCognitiveSkill")

  };

  const handleEdit = (rollNumber: string) => {
    alert(`Editing details for student with Roll No: ${rollNumber}`);
    navigate("/updateStudentCognitiveSkill")
  };

  return (
    <>
      <Card sx={{mt:'2rem', pb:'5rem', width:'100%'}}>
          <MantineProvider>
          <Typography variant='h6' component={'h4'}>Select Options</Typography>
        <Divider sx={{mb:'1rem', mt:'1rem'}} />
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          <NativeSelect
          label="Exam Section"
          data={['Select Exam Section','First Trimester', 'Second Trimester', 'Third Trimester']}
          required
        />
        <NativeSelect
          label="Exam"
          data={['Select Exam','Mid-Term Exams', 'End of Term Exams', 'Supplementary/Resit Exams']}
          required
        />
        <NativeSelect
          label="Class"
          data={['Select Class','BS1', 'BS2', 'BS3']}
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
        />
        </SimpleGrid>
      </MantineProvider>
      <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', mt:'2.3rem'}}>
        <Button variant='contained' onClick={()=>navigate("/studentScoreEntry")}><BookmarkAddedIcon sx={{color:'white'}} /> Manage Students' Scores</Button>
      </Box>
      </Card>
      <Card sx={{width:'100%'}}>
        <Typography variant="h6" color="primary" sx={{ mb: 3 }}>
          Student Cogntive Skills Assessment
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Roll Number</strong></TableCell>
                <TableCell><strong>Full Name</strong></TableCell>
                <TableCell><strong>Completion Status</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.rollNumber}>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{student.fullName}</TableCell>
                  <TableCell>{student.completionStatus}</TableCell>
                  <TableCell align="center">
                    {/* Add Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleView(student.rollNumber)}
                    >
                      Edit
                    </Button>
                    {/* Edit Button */}
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => handleEdit(student.rollNumber)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  )
};

export default ClassCognitiveAssessment;
