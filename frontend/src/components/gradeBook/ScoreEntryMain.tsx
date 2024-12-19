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
} from "@mui/material";
import { TextInput } from "@mantine/core";

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
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.id === id) {
          const updatedStudent = {
            ...student,
            [field]: value,
          };
  
          // Explicitly ensure the values are numbers
          const continuousAssessment = Number(updatedStudent.continuousAssessment) || 0;
          const midTermTest = Number(updatedStudent.midTermTest) || 0;
          const examination = Number(updatedStudent.examination) || 0;
  
          return {
            ...updatedStudent,
            totalScore: continuousAssessment + midTermTest + examination,
          };
        }
        return student;
      })
    );
  };
  

  const handleAbsentToggle = (id: number) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, absent: !student.absent } : student
      )
    );
  };

  return (
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
        <TableContainer component={Paper}>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Continuous Assessment (Max: 10)</TableCell>
                <TableCell>Mid Term Test (Max: 20)</TableCell>
                <TableCell>Examination (Max: 70)</TableCell>
                <TableCell>Total Score (Max: 100)</TableCell>
                <TableCell>Absent</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {students.map((student, index) => (
                <TableRow key={student.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                    {student.name} <br /> Roll No: {student.rollNo}
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
                    value={student.midTermTest || ""}
                    onChange={(e) =>
                        handleInputChange(student.id, "midTermTest", parseInt(e.target.value) || "")
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
                onClick={() => console.log("Scores saved:", students)}
            >
                Save Scores
            </Button>
        </Box>
        </TableContainer>
    </>
  );
};

export default ScoreEntryMain;
