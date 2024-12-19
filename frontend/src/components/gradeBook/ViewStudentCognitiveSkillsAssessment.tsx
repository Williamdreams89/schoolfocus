import React from "react";
import { Box, Grid, Avatar, Typography, Table, TableBody, TableCell, TableRow } from "@mui/material";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useNavigate } from "react-router-dom";

const CognitiveSkillsAssessment = () => {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        border: "1px solid #ddd",
        width:'100%'
      }}
    >
      <Box sx={{display:'flex', width: '100%', justifyContent:'space-between', alignItems:'center'}}>
        <Typography variant="h6" sx={{ marginBottom: "20px", color: "#3f51b5", fontWeight: "bold" }}>
          Student Cognitive Skills
        </Typography>
        <ModeEditIcon onClick={()=>navigate("/updateStudentCognitiveSkill")} />
      </Box>
      <Grid container spacing={4}>
        {/* Left Section - Student Details */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <Avatar
              alt="Student"
              src="/path/to/student-image.jpg"
              sx={{
                width: 100,
                height: 100,
                marginRight: "20px",
              }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                DEMO STUDENT
              </Typography>
              <Typography
                sx={{
                  padding: "4px 8px",
                  backgroundColor: "#3f51b5",
                  color: "#fff",
                  borderRadius: "4px",
                  display: "inline-block",
                  marginTop: "8px",
                }}
              >
                Student
              </Typography>
            </Box>
          </Box>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>DEMO STUDENT</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Registration No.</TableCell>
                <TableCell>000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Gender</TableCell>
                <TableCell>Female</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Category/Group</TableCell>
                <TableCell>Junior</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Current Class</TableCell>
                <TableCell>JS1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Class Division</TableCell>
                <TableCell>A</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Roll No.</TableCell>
                <TableCell>001</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Admission Date</TableCell>
                <TableCell>01/10/2018</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>

        {/* Right Section - Skills */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ marginBottom: "10px", fontWeight: "bold" }}>
            Affective Skills
          </Typography>
          <Table size="small" sx={{ marginBottom: "20px" }}>
            <TableBody>
              <TableRow>
                <TableCell>Punctuality</TableCell>
                <TableCell>4</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Attentiveness</TableCell>
                <TableCell>2</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Neatness</TableCell>
                <TableCell>4</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Honesty</TableCell>
                <TableCell>3</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Politeness</TableCell>
                <TableCell>4</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Perseverance</TableCell>
                <TableCell>4</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Relationship with Others</TableCell>
                <TableCell>4</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Organization Ability</TableCell>
                <TableCell>3</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Typography variant="h6" sx={{ marginBottom: "10px", fontWeight: "bold" }}>
            Psychomotor Skills
          </Typography>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>Hand Writing</TableCell>
                <TableCell>4</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CognitiveSkillsAssessment;
