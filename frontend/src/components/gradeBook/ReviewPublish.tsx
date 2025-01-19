import React, { useState } from "react";
import {
  Table,
  Center,
  Text,
  Select,
  Button,
} from "@mantine/core";
import "./styles.css";
import { Box } from "@mui/material";

interface Score {
  continuous: number;
  exams: number;
}

interface Student {
  id: number;
  name: string;
  scores: {
    [subject: string]: Score;
  };
  attendance: number; // Percentage of attendance
  principalRemark: string; // Principal's remark
}

const subjects = [
  { name: "English Language", maxContinuous: 40, maxExams: 60 },
  { name: "Agricultural Science", maxContinuous: 40, maxExams: 60 },
  { name: "Fine Art", maxContinuous: 40, maxExams: 60 },
];

const remarks = [
  { value: "Excellent", label: "Excellent performance" },
  { value: "Good", label: "Good performance" },
  { value: "Needs Improvement", label: "Needs improvement" },
];

const initialStudents: Student[] = [
  {
    id: 1,
    name: "DANQUAH WILLIAM NAFO",
    scores: {
      "English Language": { continuous: 40, exams: 40 },
      "Agricultural Science": { continuous: 30, exams: 55 },
      "Fine Art": { continuous: 40, exams: 45 },
    },
    attendance: 95,
    principalRemark: "Excellent",
  },
  {
    id: 2,
    name: "DANQUAH JULIET OFFEIBEAH",
    scores: {
      "English Language": { continuous: 35, exams: 50 },
      "Agricultural Science": { continuous: 35, exams: 45 },
      "Fine Art": { continuous: 30, exams: 50 },
    },
    attendance: 89,
    principalRemark: "Good",
  },
];

export default function ReviewPublish() {
  const [students, setStudents] = useState(initialStudents);

  const handleScoreChange = (
    studentId: number,
    subject: string,
    type: "continuous" | "exams",
    value: number
  ) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.id === studentId) {
          return {
            ...student,
            scores: {
              ...student.scores,
              [subject]: {
                ...student.scores[subject],
                [type]: value,
              },
            },
          };
        }
        return student;
      })
    );
  };

  const calculateGrandTotal = (student: Student) => {
    return Object.values(student.scores).reduce(
      (sum, score) => sum + score.continuous + score.exams,
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

  return (
    <Box sx={{ width: '97%', overflowX:'scroll', maxWidth: { sm: "100%", md: "1700px" } }}>
      <Table className="custom-table" withColumnBorders>
        <thead>
          <tr>
            <th rowSpan={2} style={{ width: "50px" }}>#</th>
            <th style={{ width: "250px" }} rowSpan={2}>Students</th>
            {subjects.map((subject) => (
              <th style={{ width: "250px" }} colSpan={3} key={subject.name}>
                {subject.name}
              </th>
            ))}
            <th style={{ width: "100px" }} rowSpan={2}>Grand Total</th>
            <th style={{ width: "100px" }} rowSpan={2}>GPA</th>
            <th style={{ width: "120px" }} rowSpan={2}>Attendance (%)</th>
            <th style={{ width: "200px" }} rowSpan={2}>Principal's Remark</th>
            <th style={{ width: "100px" }} rowSpan={2}>Actions</th>
          </tr>
          <tr>
            {subjects.map((subject) => (
              <React.Fragment key={subject.name}>
                <th>Continuous ({subject.maxContinuous})</th>
                <th>Exams ({subject.maxExams})</th>
                <th>Total (100)</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td style={{ width: "250px" }}>{student.name}</td>
              {subjects.map((subject) => {
                const score = student.scores[subject.name];
                const total = score.continuous + score.exams;
                return (
                  <React.Fragment key={subject.name}>
                    <td>{score.continuous}</td>
                    <td>{score.exams}</td>
                    <td>
                      <Center>
                        <Text>{total}</Text>
                      </Center>
                    </td>
                  </React.Fragment>
                );
              })}
              <td>{calculateGrandTotal(student)}</td>
              <td>{calculateGPA(student).toFixed(2)}</td>
              <td>{student.attendance}%</td>
              <td style={{ width: "250px" }}>
                <Select width={'200px'}
                  value={student.principalRemark}
                  onChange={(value) =>
                    setStudents((prevStudents) =>
                      prevStudents.map((s) =>
                        s.id === student.id ? { ...s, principalRemark: value! } : s
                      )
                    )
                  }
                  data={remarks}
                />
              </td>
              <td>
                <Button onClick={() => handlePreview(student)} variant="outline">
                  Preview
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
}
