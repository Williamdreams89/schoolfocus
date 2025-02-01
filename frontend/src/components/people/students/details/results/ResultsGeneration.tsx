import React from 'react'
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Card, Grid, Image, Text } from '@mantine/core';
import { Box, Button, Divider, Table, TableContainer } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { RoomServiceOutlined } from '@mui/icons-material';

const ResultsGeneration = () => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const generatePDF = async () => {
    if (!contentRef.current) return;

    const canvas = await html2canvas(contentRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("download.pdf");
  };
  return (
    <>
    <Card shadow="sm" padding="lg" ref={contentRef} >
      <center style={{fontWeight:800, fontSize:'26px'}}>DREAMS INTERNATIONAL SCHOOL COMPLEX</center>
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent:'space-between', width:'100%', }}>
        
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // justifyContent: "center",
            // alignItems: "center",
            position:'relative'
          }}
        >
          <Box sx={{position:'absolute', display:'flex', flexDirection:'column', width:'100%', justifyContent:'center', alignItems:'center'}}><RoomServiceOutlined /> <span style={{fontSize:'17px'}}>Ejura</span></Box>
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
          <p>Name:</p>
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
          <p>Position: </p>
          <p>Student Average</p>
          <p>No. of Subjects: 8</p>
          <p>Student's Total Score: </p>
          <p>Student's Average Score:</p>
          <p>Grade Point Average:</p>
          <p>Grade Summary</p>
        </Box>
      </Box>
      {/* Subject Table */}
      <Box sx={{display:'flex'}}>
      <TableContainer className="custom-table" style={{ flex: 3 }}>
  <Table style={{ height: "100%" }}>
    <thead>
      <tr>
        <th>Subject</th>
        <th>Continuous Assessment</th>
        <th>Exams</th>
        <th>Total</th>
        <th>Grade Remark</th>
      </tr>
    </thead>
    <tbody>
      {/* {selectedStudent?.scores &&
        Object.entries(selectedStudent.scores).map(([subject, score], index) => (
          <tr key={index}>
            <td>{subject}</td>
            <td>{score.continuous}</td>
            <td>{score.exams}</td>
            <td>{score.total}</td>
            <td>{getGradeRemark(score.total)}</td>
          </tr>
        ))} */}
    </tbody>
  </Table>
</TableContainer>

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
      <Divider  />

      {/* Performance Chart */}
      <Text size="sm">Subject Performance Chart</Text>
      <Box>
        {/* <Bar data={data}  /> */}
        Bar Graph 
      </Box>

      {/* Footer Section */}
      <Grid mt="md">
        <Grid.Col span={6}>
          <Text size="sm">Form Teacher:</Text>
          <Divider />
          <Text size="sm">Form Teacher's Signature:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text size="sm">Principal:</Text>
          <Divider  />
          <Text size="sm">Principal's Signature:</Text>
        </Grid.Col>
      </Grid>
    </Card>
    <Button variant='outlined' onClick={generatePDF}>Generate PDF</Button>
    </>
  )
}

export default ResultsGeneration