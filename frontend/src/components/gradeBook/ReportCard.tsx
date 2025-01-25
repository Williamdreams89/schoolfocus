import React from "react";
import {
  Card,
  Grid,
  Image,
  Text,
  Table,
  Divider,
  SimpleGrid,
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
import { Box } from "@mui/material";
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

const ReportCard = () => {
  return (
    <Card shadow="sm" padding="lg">
      <center style={{fontWeight:800, fontSize:'26px'}}>DREAMS INTERNATIONAL SCHOOL COMPLEX</center>
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent:'space-between', width:'100%'}}>
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
          <p>Name: DANQUAH WILLIAM DAVID</p>
          <p>Reg No.: 202520003</p>
          <p>Gender: Male</p>
          <p>Class: PRIMARY 6-A</p>
          <p>Email: williamdanquah@gmail.com</p>
          <p>Position: 1st</p>
          <p>Student Average: 85.0%</p>
        </Box>
        <Box sx={{ flex: 1, height:'100%', display:'flex', justifyContent:'center', alignItems:'center', padding:'10px'}}>
          <Image
            src="images/avata.png"
            alt="Student Photo"
            radius="md"
            width={"90%"}
            height={"90%"}
          />
        </Box>
        <Box className="report-bio">
          <p>Name: DANQUAH WILLIAM DAVID</p>
          <p>Reg No.: 202520003</p>
          <p>Gender: Male</p>
          <p>Class: PRIMARY 6-A</p>
          <p>Email: williamdanquah@gmail.com</p>
          <p>Position: 1st</p>
          <p>Student Average: 85.0%</p>
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
    </Card>
  );
};

export default ReportCard;
