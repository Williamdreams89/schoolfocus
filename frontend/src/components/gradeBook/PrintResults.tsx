import { Box, Button, Card, Divider, Grid, IconButton, Table, TableContainer, Tooltip as MUIToolTip, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import NavBreadCrumbs from '../NavbarBreadcrumbs'
import { Props } from '../people/students/types'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Image, NativeSelect, SimpleGrid, Text } from '@mantine/core'
import { APIContext } from '../../utils/contexts/ReactContext'
import { Email, Phone, WhatsApp } from '@mui/icons-material'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PrintIcon from '@mui/icons-material/Print';
import {saveAs} from "file-saver"
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import JSZip from "jszip";
import {Card as ManCard} from "@mantine/core"
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type StudentRow = {
  id: number;
  photo: string;
  name: string;
  gender: string;
  regNumber: string;
  classArm: string;
  email: string;
  is_active: boolean;
};

interface Score {
  continuous: number;
  exams: number;
  total: number;
}

interface Student {
  id: number;
  name: string;
  dob?: string;
  index_number?: string;
  student_class_name: string;
  profile_pic: any;
  email?: string;
  scores: {
    [subject: string]: Score;
  };
  attendance: number;
  principalRemark: string;
  average_score?: number;
  rank_title?: string;
  data?: any;
}


  // Function to determine the grade remark
  const getGradeRemark = (totalScore: number): string => {
    if (totalScore >= 85) return "Excellent";
    if (totalScore >= 75) return "Very Good";
    if (totalScore >= 65) return "Good";
    if (totalScore >= 50) return "Pass";
    return "Fail";
  };
  const getOverallRemark = (totalScore: any): string => {
    if (totalScore >= 85) return "Excellent";
    if (totalScore >= 75) return "Very Good";
    if (totalScore >= 65) return "Good";
    if (totalScore >= 50) return "Pass";
    return "Fail";
  };

const PrintResults: React.FC<Props> = ({SystemSettingData, academicSessionSettingsData, academicSettingsData}) => {
  const [rows, setRows] = React.useState<StudentRow[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = React.useState<number[]>([]);
  const [selectedStudentsResults, setSelectedStudentsResults] = React.useState<Student[]>([]);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 100,
  });

  

  // Preparing context api for some actions
  const context = React.useContext(APIContext);
  if(!context){
    throw new Error("There must be a context")
  }

  // Preparing data from the filter
  const [filterData, setFilterData] = React.useState<FilterForm>(
    {student_class_name: "",
      academic_year : ""}
  )

  // Fetch and filter student results
const [studentImages, setStudentImages] = React.useState<{ [key: number]: string }>({});
React.useEffect(() => {
  const fetchStudentResults = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/results/review_new/${filterData.student_class_name}/${new Date().getFullYear()}/First%20Term/`
      );

      // Filter the results based on selectedStudentIds
      const filteredResults = response.data.filter((student: any) =>
        selectedStudentIds.includes(student.id)
      );

      setSelectedStudentsResults(filteredResults);
      // Process profile picture conversion
      filteredResults.forEach(async (student: Student) => {
        if (student.profile_pic) {
          try {
            const imageResponse = await fetch(student.profile_pic);
            const blob = await imageResponse.blob();
            const blobUrl = URL.createObjectURL(blob);
            setStudentImages(prev => ({ ...prev, [student.id]: blobUrl }));
          } catch (error) {
            console.error("Error converting profile picture to blob:", error);
          }
        }
      });
    } catch (error) {
      console.error("Error fetching student results:", error);
    }
  };
  

  if (selectedStudentIds.length > 0) {
    fetchStudentResults();
  }
}, [selectedStudentIds]);

  const {studentsManagementDetails, setStudentsManagementDetails} = context;
  // Fetch students data from API
  const fetchStudents = async () => {
    try {
      setStudentsManagementDetails({isLoading: true})
      const response = await axios.get(`http://127.0.0.1:8000/api/studentsList/${filterData.student_class_name}/${filterData.academic_year}/`);
      setRows(response.data);
      setStudentsManagementDetails({isLoading: false})
    } catch (error) {
      setRows([])
      console.error('Error fetching students:', error);
      setStudentsManagementDetails({isLoading: false})
      
    }
  };



  // Student Detail Page confs
  const [studentDetailData, setStudentDetailData] = React.useState<any>()
  const handleViewStudentDetail = async (id:number) =>{
    try{
      setStudentsManagementDetails({isLoading: true})
      const {data} = await axios.get(`http://127.0.0.1:8000/api/student/${id}/`)
      setStudentDetailData(data)
      console.log(`student detail data = ${data.full_name}`)
      setStudentsManagementDetails({isLoading: false, getIDForStudentDetailPage: id})
      setOpen(true);
    }catch(error){
      setStudentsManagementDetails({isLoading: false})
      alert("Error fetching student data")
    }
  }

  const contentRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({})
  const generatePDF = async (student: any) => {
    const content = contentRefs.current[student.index_number];
    if (!content) return null;
    const canvas = await html2canvas(content, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    return pdf.output("blob");
  };

  const handlePrintAllAsPDF = async () => {
    if (!selectedStudentsResults.length) {
      console.warn("No students selected for printing.");
      return;
    }
  
    setStudentsManagementDetails({ isLoading: true });
  
    const pdf = new jsPDF("p", "mm", "a4");
  
    for (const student of selectedStudentsResults) {
      const contentElement = student.index_number ? contentRefs.current[student.index_number] : null;
  
      if (!contentElement) {
        console.warn(`No content found for student: ${student.name} (${student.index_number})`);
        continue;
      }
  
      try {
        const canvas = await html2canvas(contentElement, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
  
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
        if (student !== selectedStudentsResults[0]) {
          pdf.addPage();
        }
  
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        
      } catch (error) {
        console.error(`Error generating PDF for ${student.name}:`, error);
      }
    }

    pdf.save(`${filterData?.student_class_name}.pdf`);
  
    // Open print dialog and wait until it is closed
    const blobUrl = pdf.output("bloburl");
    const printWindow = window.open(blobUrl, "_blank");
  
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
          setStudentsManagementDetails({ isLoading: false }); // Set loading to false after print is done
        }, 1000);
      };
    } else {
      console.error("Failed to open print window.");
      setStudentsManagementDetails({ isLoading: false });
    }
  };
  
  
  const handleDownloadZip = async () => {
    if (!selectedStudentsResults.length) {
      console.warn("No students selected for download.");
      return;
    }
  
    setStudentsManagementDetails({isLoading: true})
    const zip = new JSZip();
    const folderName = filterData?.student_class_name || "Results";
  
    for (const student of selectedStudentsResults) {
      const contentElement = student.index_number ? contentRefs.current[student.index_number] : null;

  
      if (!contentElement) {
        console.warn(`No content found for student: ${student.name} (${student.index_number})`);
        continue; // Skip if content is missing
      }
  
      try {
        const pdfBlob = await generatePDF(student);
        if (pdfBlob) {
          zip.file(`${student.name}.pdf`, pdfBlob);
        } else {
          console.warn(`Failed to generate PDF for student: ${student.name}`);
        }
      } catch (error) {
        console.error(`Error generating PDF for ${student.name}:`, error);
      }
    }
  
    if (Object.keys(zip.files).length === 0) {
      console.warn("No PDFs were generated.");
      setStudentsManagementDetails({isLoading: true})
      return;
    }
  
    try {
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${folderName}.zip`);
      console.log("Download complete!");
    } catch (error) {
      console.error("Error generating ZIP file:", error);
    } finally {
      setStudentsManagementDetails({isLoading: false})// Stop loading when done
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 150, align:'center', headerAlign:'center' },
    {
      field: 'profile_pic',
      headerName: 'Photo',
      align:'center', headerAlign:'center',
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{display:'flex', alignItems:'center', justifyContent:'center'}}>
          <MUIToolTip title="View profile">
          <img
            src={params.value || 'https://via.placeholder.com/40?text=A'} // Default avatar if profile_pic is missing
            alt="student"
            style={{ width: 40, height: 40, borderRadius: '50%', cursor:'pointer', marginTop:'30px' }}
            onClick={() => handleViewStudentDetail(params.row.id)}
          />
          </MUIToolTip>
        </Box>
      ),
    },
    { field: 'full_name', headerName: 'Name', width: 300,align:'center', headerAlign:'center', renderCell: (params: GridRenderCellParams) =>{
      return (<Box sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
        <MUIToolTip title="View Profile" >
          <Typography sx={{ cursor:'pointer'}} onClick={() => handleViewStudentDetail(params.row.id)}>{params.value}</Typography>
        </MUIToolTip>
      </Box>)
    } },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'index_number', headerName: 'Reg. No.', width: 250, align:'center', headerAlign:'center', },
  ];

  const [open, setOpen] = React.useState(false);

  interface FilterForm{
    student_class_name: string;
    academic_year : string;
  }
  const isSmallScreen = useMediaQuery("(max-width:1045px)")
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <NavBreadCrumbs academicSessionSettingsData={academicSessionSettingsData} academicSettingsData={academicSettingsData} items={[{label:'Academic Results', href:'/exams-report'}, {label:'Print Results By Class'}]} />
      <div style={{marginBottom:'2rem'}} />
      
      <Card sx={{ width:'100%',mb:'.5rem'}}>
        <Box sx={{display:'grid', gridTemplateColumns: !isSmallScreen?"repeat(4, minmax(200px, 1fr))":"repeat(1, minmax(200px, 1fr))", gap:'2rem', width:'100%', mb:'2rem'}}>
          <NativeSelect label="Class" data={[
            "- Select Class -","KG 1", "KG 2", "KG 3",
            "BS 1", "BS 2", "BS 3", "BS 4", "BS 5", "BS 6",
            "JHS 1", "JHS 2", "JHS 3"
          ]}
          value={filterData.student_class_name}
          onChange={(e)=>setFilterData({...filterData, student_class_name: e.target.value})} 
          required />
          <NativeSelect label="Class Division" data={["- Select class division -", "All"]} required />
          <NativeSelect label="Academic Year" data={["- Select Academic Year -", `${new Date().getFullYear()}`]} value={filterData.academic_year} onChange={(e)=>setFilterData({...filterData, academic_year: e.target.value})} required />
        </Box>
        <Box sx={{width:'100%', display:'flex', justifyContent:'center'}}>
            <Button variant="contained" color="primary" onClick={fetchStudents}>View Students</Button>
        </Box>
      </Card>
      <Card>
      <Box sx={{ height: 600, width: '100%', }}>
      {rows.length !== 0 ? <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<CloudDownloadIcon />}
            sx={{ mr: 1 }}
            onClick={handleDownloadZip}
          >
            Zip Download {selectedStudentIds.length} Selected Student(s)' Results
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<CloudDownloadIcon />}
            sx={{ mr: 1 }}
            onClick={handlePrintAllAsPDF}
          >
            Print All {selectedStudentIds.length} Student(s)' Results
          </Button>
          
        </Box>
      </Box>
      <Box sx={{backgroundColor:'red'}}>
      <DataGrid
  checkboxSelection
  rowHeight={100}
  rows={rows}
  columns={columns}
  loading={studentsManagementDetails.isLoading}
  paginationModel={paginationModel}
  onPaginationModelChange={(model) => setPaginationModel(model)}
  onRowSelectionModelChange={(selection) => {
    setSelectedStudentIds(selection as number[]); // Update selected IDs
  }}
/>
      </Box>
      </Box>: <Box sx={{width: '100%', height:"400px", display:'flex', justifyContent:'center', alignItems:'center'}}>No Student Found!</Box>}

    </Box>
      </Card>
      {selectedStudentsResults.map((studentResults)=>(<div>{studentResults?.scores && <ManCard
      key={studentResults.index_number}
      ref={(el) => {
        if (el) contentRefs.current[studentResults.index_number || ""] = el;
      }}
      style={{ position: "absolute", left: "-9999px" }}
      >
                <img style={{position:'absolute', zIndex:9999, height:'800px', width:'560px', opacity:"10%", top:'20%', left:'10%'}} src='/images/logo.png' />
                <center style={{fontWeight:800, fontSize:'20px'}}>{new String(SystemSettingData[0]?.school_name).toUpperCase()}</center>
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
                    
                    <Box sx={{flex: 3, display:'flex', alignItems:'center', gap:'6rem', mt:'.51rem', mb:'.51rem'}}>
                      <Text>
                        Website: www.lighthouse.edu
                      </Text>
                      <Text>Phone: 0302-987-654</Text>
                      <Text>Ejura</Text>
                    </Box>
                  </Box>
                  {/* <Image
                    src="/images/logo.png"
                    alt="School Logo"
                    style={{ width: "100px", objectFit: "cover" }}
                  /> */}
                </Box>


                {/* Student Info Section */}
                <Box sx={{display:'flex', justifyContent:'space-between', height:'fit-content', border:'1px solid #eaeaea', marginBottom:'rem'}}>
                <Box className="report-bio">
                    <p>Name: {studentResults?.name}</p>
                    <p>Reg No.: {studentResults?.index_number} </p>
                    <p>Gender: Male</p>
                    <p>Date Of Birth: {studentResults?.dob} </p>
                    <p>Class Category: undefined</p>
                    <p>Class:{studentResults?.student_class_name}</p>
                  </Box>
                  <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', padding:'10px'}}>
                    <Image
                      src={studentImages[studentResults.id] || studentResults.profile_pic}
                      alt="Student Photo"
                      height={"140px"}
                    />
                  </Box>
                  <Box className="report-bio">
                    <p>Position: {studentResults?.rank_title}</p>
                    <p>No. of Subjects: undefined</p>
                    <p>Student's Total Score: undefined</p>
                    <p>Student's Average Score:{studentResults?.average_score}%</p>
                    <p>Summary Remark: {getOverallRemark(studentResults?.average_score)}</p>
                    <p>Date Printed: undefined</p>
                  </Box>
                </Box>
                {/* Subject Table */}
                <Box sx={{display:'flex', height:'40%'}}>
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
              <tbody style={{textAlign:'center'}}>
                {studentResults?.scores &&
                  Object.entries(studentResults.scores).map(([subject, score], index) => (
                    <tr key={index}>
                      <td>{subject}</td>
                      <td>{score.continuous}</td>
                      <td>{score.exams}</td>
                      <td>{score.total}</td>
                      <td>{getGradeRemark(score.total)}</td>
                    </tr>
                  ))}
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
                <Text size="sm" style={{fontWeight:900, textAlign:'center', marginTop:'1rem'}}>Subject Performance Chart</Text>
                <Box sx={{height:'260px', width:'100%', justifyContent:'center', display:'flex'}}>
                  {/* <Bar data={data}  /> */}
                  {studentResults?.data?<Bar data={studentResults?.data} />:<p>Chart data not available</p>} 
                </Box>

                {/* Footer Section */}
                {/* <Grid mt="md">
                  <Grid>
                    <Text size="sm">Form Teacher:</Text>
                    <Divider />
                    <Text size="sm">Form Teacher's Signature:</Text>
                  </Grid>
                  <Grid>
                    <Text size="sm">Principal:</Text>
                    <Divider  />
                    <Text size="sm">Principal's Signature:</Text>
                  </Grid>
                </Grid> */}
        </ManCard>}</div>))}
    </Box>
  )
}

export default PrintResults