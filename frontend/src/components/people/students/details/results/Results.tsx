import React from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
} from "@mui/material";
import "./results.css";
import { useNavigate, useParams } from "react-router-dom";
import { APIContext } from "../../../../../utils/contexts/ReactContext";
import axios from "axios";
import jsPDF from "jspdf";

const ResultsTab = () => {
  const [value, setValue] = React.useState("1");
  const { id } = useParams<{ id: string }>();
  const [studentDetailData, setStudentDetailData] = React.useState<any>();
  const navigate = useNavigate();
  const context = React.useContext(APIContext);
  if (!context) {
    throw new Error("There should be a context");
  }

  const { setStudentsManagementDetails, studentsManagementDetails } = context;

  React.useEffect(() => {
    const fetchStudentDetailData = async () => {
      try {
        setStudentsManagementDetails({ isLoading: true });
        const { data } = await axios.get(`http://127.0.0.1:8000/api/student/${id}/`);
        setStudentDetailData(data);
        setStudentsManagementDetails({ isLoading: false });
      } catch (error) {
        setStudentsManagementDetails({ isLoading: false });
      }
    };

    fetchStudentDetailData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleGetPDF = () => {
    const doc = new jsPDF();
    doc.text("Dreams International Complex", 20, 10);
    doc.text("Student Name: William Danquah Wiredu", 10, 20);
    doc.text("Class: Primary 6 - A", 10, 30);
    doc.text("Term: First Term", 10, 40);
    // Add more data as needed...
    doc.save("result.pdf");
  };

  const handleSendEmail = () => {
    const guardianEmail = studentDetailData?.guardian_email; // Adjust the field name if necessary
    if (guardianEmail) {
      alert(`Sending results to ${guardianEmail}`);
      // You can integrate your email-sending API here.
    } else {
      alert("Guardian email not available!");
    }
  };

  const handleSendWhatsApp = () => {
    const guardianWhatsApp = studentDetailData?.guardian_whatsapp; // Adjust the field name if necessary
    if (guardianWhatsApp) {
      const message = encodeURIComponent("Here are the results for your ward.");
      window.open(`https://wa.me/${guardianWhatsApp}?text=${message}`, "_blank");
    } else {
      alert("Guardian WhatsApp number not available!");
    }
  };

  return (
    <Box className="results-container">
      {/* Header Section */}
      <Box className="header-section" p={3}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={2}>
            <img
              src="/images/logo.png"
              alt="School Logo"
              className="school-logo"
            />
          </Grid>
          <Grid item xs={8} textAlign="center">
            <Typography variant="h4" fontWeight="bold">
              Dreams International Complex
            </Typography>
            <Typography variant="body1">
              Address: [Enter School Address Here] | Email: info@school.com
            </Typography>
            <Typography variant="body1">Phone: +1234567890</Typography>
          </Grid>
          <Grid item xs={2}>
            <img
              src={studentDetailData?.profile_pic}
              alt="Student"
              className="student-photo"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Student Information */}
      <Box className="student-info-section" p={3}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Student Name:</strong> William Danquah Wiredu</Typography>
            <Typography variant="body1"><strong>Class:</strong> Primary 6 - A</Typography>
            <Typography variant="body1"><strong>Age:</strong> 12</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Session:</strong> 2023 - 2024</Typography>
            <Typography variant="body1"><strong>Term:</strong> First Term</Typography>
            <Typography variant="body1"><strong>Admission No.:</strong> ADM12345</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Results Table */}
      <Box className="results-table-section" p={3}>
        <Paper elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Subject</strong></TableCell>
                <TableCell><strong>Continuous Assessment</strong></TableCell>
                <TableCell><strong>Exams score</strong></TableCell>
                <TableCell><strong>Total Score</strong></TableCell>
                <TableCell><strong>Grade</strong></TableCell>
                <TableCell><strong>Grade Remark</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Mathematics</TableCell>
                <TableCell>35</TableCell>
                <TableCell>50</TableCell>
                <TableCell>85</TableCell>
                <TableCell>A</TableCell>
                <TableCell>Excellent</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>English</TableCell>
                <TableCell>78</TableCell>
                <TableCell>B</TableCell>
                <TableCell>Very Good</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* Footer Section */}
      <Box className="footer-section" p={3}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Terms:</strong> Results are provisional until final approval.</Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography variant="body2">Signed by: [Principal Name]</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Action Buttons */}
      <Box className="action-buttons-section" p={3} textAlign="right">
        <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={handlePrint}>
          Print Result
        </Button>
        <Button variant="outlined" color="primary" sx={{ mr: 2 }} onClick={handleGetPDF}>
          Get as PDF
        </Button>
        <Button variant="outlined" color="secondary" sx={{ mr: 2 }} onClick={handleSendEmail}>
          Send to Email
        </Button>
        <Button variant="outlined" color="success" onClick={handleSendWhatsApp}>
          Send via WhatsApp
        </Button>
      </Box>
    </Box>
  );
};

export default ResultsTab;
