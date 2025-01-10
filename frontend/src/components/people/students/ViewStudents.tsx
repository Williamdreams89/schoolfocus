import { Backdrop, Box, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Input, InputBase, Combobox, useCombobox, Modal, Text, TextInput } from "@mantine/core";
import useMediaQuery from "@mui/material/useMediaQuery"
import { styled } from "@mui/material/styles";
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Email, Phone, WhatsApp, Facebook, Twitter } from '@mui/icons-material';

import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import {
  Button,
  Switch,
  IconButton,
  Tooltip,
} from '@mui/material';


import axios from 'axios';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PrintIcon from '@mui/icons-material/Print';
import { useNavigate } from "react-router-dom";
import { APIContext } from "../../../utils/contexts/ReactContext";
import { StudentData } from "./types";

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

interface Parent {
    guardian_name: string;
    guardian_phone: string;
    guardian_email: string;
  }

const API_BASE_URL = 'http://127.0.0.1:8000'; // Replace with your actual API base URL

const StudentDataGrid: React.FC = () => {
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 100,
  });


  // Preparing context api for some actions
  const context = React.useContext(APIContext);
  if(!context){
    throw new Error("There must be a context")
  }

  const {studentsManagementDetails, setStudentsManagementDetails} = context;
  // Fetch students data from API
  const fetchStudents = async () => {
    try {
      setStudentsManagementDetails({isLoading: true})
      const response = await axios.get(`${API_BASE_URL}/api/studentsList/`);
      setRows(response.data);
      setStudentsManagementDetails({isLoading: false})
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudentsManagementDetails({isLoading: false})
    }
  };

  // Handle account status toggle
  const handleToggleAccountStatus = async (id: number, isActive: boolean) => {
    try {
      await axios.patch(`${API_BASE_URL}/students/${id}/`, { is_active: !isActive });
      // Update the local state
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, is_active: !isActive } : row
        )
      );
      alert(`Account status updated to ${!isActive ? 'active' : 'inactive'}.`);
    } catch (error) {
      console.error('Error updating account status:', error);
      alert('Failed to update account status. Please try again.');
    }
  };
  
  const handleEditClick = (params:any) => {
    setFormData({
      id: params.row.id,
      surname: params.row.surname || "",
      first_name: params.row.first_name || "",
      other_names: params.row.other_names || "",
      registration_number: params.row.registration_number || "",
      date_of_birth: params.row.date_of_birth || "",
      student_email: params.row.student_email || "",
      contact_phone: params.row.contact_phone || "",
      permanent_address: params.row.permanent_address || "",
      residential_address: params.row.residential_address || "",
      parents: params.row.parents || [],
    });
    setOpen(true);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  
  // Student Detail Page confs
  const [studentDetailData, setStudentDetailData] = React.useState<any>()
  const handleViewStudentDetail = async (id:number) =>{
    try{
      setStudentsManagementDetails({isLoading: true})
      const {data} = await axios.get(`http://127.0.0.1:8000/api/student/${id}/`)
      setStudentDetailData(data)
      console.log(`student detail data = ${data.full_name}`)
      setStudentsManagementDetails({isLoading: false})
      setOpen(true);
    }catch(error){
      setStudentsManagementDetails({isLoading: false})
      alert("Error fetching student data")
    }
  }


  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
const [loading, setLoading] = useState(false);

// Function to handle delete action
const handleDelete = (id: number) => {
  setSelectedRowId(id); // Set the ID of the row to be deleted
  setDeleteModalOpen(true); // Open the modal
};

// Function to confirm deletion
const confirmDelete = async () => {
  if (!selectedRowId) return;
  setLoading(true);
  try {
    // Replace with your API endpoint
    await axios.delete(`/api/students/${selectedRowId}`);
    console.log(`Student with id ${selectedRowId} deleted successfully`);
    setDeleteModalOpen(false); // Close the modal
    setSelectedRowId(null); // Reset the selected row ID
    // Optionally refresh the data grid here
  } catch (error) {
    console.error('Error deleting student:', error);
  } finally {
    setLoading(false);
  }
};

const cancelDelete = () => {
  setDeleteModalOpen(false); // Close the modal
  setSelectedRowId(null); // Reset the selected row ID
};

  const columns: GridColDef[] = [
    { field: 'id', headerName: '#', width: 50 },
    {
      field: 'profile_pic',
      headerName: 'Photo',
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="View profile">
          <img
            src={params.value || 'https://via.placeholder.com/40?text=A'} // Default avatar if profile_pic is missing
            alt="student"
            style={{ width: 40, height: 40, borderRadius: '50%', cursor:'pointer' }}
            onClick={() => handleViewStudentDetail(params.row.id)}
          />
          </Tooltip>
        </Box>
      ),
    },
    { field: 'full_name', headerName: 'Name', width: 200, renderCell: (params: GridRenderCellParams) =>{
      return (<Box sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
        <Tooltip title="View Profile" >
          <Typography sx={{ cursor:'pointer'}} onClick={() => handleViewStudentDetail(params.row.id)}>{params.value}</Typography>
        </Tooltip>
      </Box>)
    } },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'index_number', headerName: 'Reg. No.', width: 150 },
    {
      field: 'guardian_details',
      headerName: 'Parents / Guardian',
      width: 350,
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const parents = (params.value as Parent[]) || [];
        return (
          <Box>
            {parents.length > 0 ? (
              parents.map((parent, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    mb: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100px',
                  }}
                >
                  <Typography variant="subtitle2">{parent.guardian_name}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {/* {parent.guardian_phone} */}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => window.open(`tel:${parent.guardian_phone}`, '_blank')}
                    >
                      <PhoneIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() =>
                        window.open(`https://wa.me/${parent.guardian_phone.replace(/\D/g, '')}`, '_blank')
                      }
                    >
                      <WhatsAppIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => window.open(`mailto:${parent.guardian_email}`, '_blank')}
                    >
                      <EmailIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => alert(`Initiate chat with ${parent.guardian_name}`)}
                    >
                      <ChatIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No parents available
                </Typography>
              </Box>
            )}
          </Box>
        );
      },
    },
    
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      headerAlign:'center',
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{display:'flex', flexDirection:'row-reverse', alignItems:'center', justifyContent:'center', mt:'2rem', gap:'1rem'}}>
          {/* <IconButton
            size="small"
            color="primary"
            onClick={() => handleEditClick(params)}
          >
            <EditIcon />
          </IconButton> */}
          <IconButton
        size="small"
        color="secondary"
        onClick={() => handleDelete(params.row.id)}
      >
        <DeleteIcon />
      </IconButton>
          <IconButton
        size="small"
        color="secondary"
        onClick={() => handleViewStudentDetail(params.row.id)}
      >
        <VisibilityIcon />
      </IconButton>
        </Box>
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    surname: "",
    first_name: "",
    other_names: "",
    registration_number: "",
    date_of_birth: "",
    student_email: "",
    contact_phone: "",
    permanent_address: "",
    residential_address: "",
    parents: [],
  });


  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleParentSelect = (selectedParents:any) => {
    setFormData((prevData) => ({
      ...prevData,
      parents: selectedParents,
    }));
  };

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();

    try {
      // Replace `YOUR_API_ENDPOINT` with the actual API endpoint to update student details
      const response = await axios.put(
        `YOUR_API_ENDPOINT/${formData.id}/`, // Include the student's ID
        formData
      );
      console.log("Student updated successfully:", response.data);

      // Optionally, refresh the DataGrid or notify the user
      setOpen(false);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  

  return (
    <Box sx={{ height: 600, width: '100%', }}>
      {rows.length !== 0 ? <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudDownloadIcon />}
            sx={{ mr: 1 }}
          >
            Export List
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PrintIcon />}
          >
            Print Version
          </Button>
        </Box>
        <Typography variant="h6">Students</Typography>
      </Box>
      <DataGrid
        style={{height:'max-content'}}
        rowHeight={100}
        rows={rows}
        columns={columns}
        loading={studentsManagementDetails.isLoading}
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => setPaginationModel(model)}
        // components={{
        //   Toolbar: GridToolbar,
        // }}
        // checkboxSelection
      />
      </Box>: <Box sx={{width: '100%', height:"400px", display:'flex', justifyContent:'center', alignItems:'center'}}>No Student Found!</Box>}
      
      {deleteModalOpen &&<Backdrop
  sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1, display:'flex', flexDirection:'column', gap:'1rem', position:'relative' })}
open
>
<Modal
  opened={deleteModalOpen}
  onClose={cancelDelete}
  title="Confirm Deletion"
  centered
  size="sm"
  style = {{position:'absolute', zIndex:9999}}
  // transition="fade" // Optional, use Mantine's supported transitions like "fade"
  // transitionDuration={300} // Adjust duration of the transition
>
  <Text>Are you sure you want to delete this student? This action cannot be undone.</Text>
  <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
    <Button onClick={cancelDelete}>
      Cancel
    </Button>
    <Button  onClick={confirmDelete}>
      Yes, Delete
    </Button>
  </div>
</Modal>
</Backdrop>}
{open&&<Backdrop
  sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1, display:'flex', flexDirection:'column', gap:'1rem', position:'fixed',  top:0, left:0})}
open={open}
>

      <Modal title="Student Information" size={"55rem"} opened={open} style={{position:'absolute', zIndex:99999,}} onClose={handleClose}>
      <Card>
        <Box display="flex" flexDirection="row" alignItems="center">
          <CardMedia
            component="img"
            image={studentDetailData.profile_pic === null ? "https://via.placeholder.com/150": studentDetailData.profile_pic} // Replace with actual student image URL
            alt="Student Profile"
            sx={{ width: 150, height: 150, margin: 2, borderRadius: 1 }}
          />
          <Typography variant="h3" sx={{ fontWeight: 'bold', marginLeft: 2, textTransform:'uppercase' }}>
            {studentDetailData.full_name}
          </Typography>
        </Box>
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Registration No:</strong> {studentDetailData.registration_number}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Gender:</strong> {studentDetailData.gender === "M" ? "Male":"Female"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Class Category:</strong> PRIMARY
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Class:</strong> P3
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Admission Date:</strong> 01-01-2023
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Assigned Tag:</strong> Subscriber
              </Typography>
              <Typography>
                <strong>Registered Online:</strong> Subscriber
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Phone:</strong> +233123456789
              </Typography>
              <Typography>
                <strong>Nationality:</strong> +233123456789
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Town of Residence:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Area of Residence:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Permanent Address:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Residential Address:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Date of Birth:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>NID/Birth Certificate Number:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Blood Group:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Blood Group:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Religion:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Bio/Remark:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Fees:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Current Hostel Allocation:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Current Transport Allocation:</strong> example@school.edu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Parent/Guardian:</strong> example@school.edu
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" gap={1}>
              <IconButton color="primary">
                <Phone />
              </IconButton>
              <IconButton color="primary">
                <WhatsApp />
              </IconButton>
              <IconButton color="primary">
                <Email />
              </IconButton>
              <IconButton color="primary">
                <Facebook />
              </IconButton>
              <IconButton color="primary">
                <Twitter />
              </IconButton>
            </Box>
            <Button variant="contained" color="primary">
              Go to Profile Page
            </Button>
          </Box>
        </CardContent>
      </Card>
      </Modal>
</Backdrop>}
    </Box>
  );
};




const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  width: "100%",
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: theme.palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "left",
  },
}));

function NavbarBreadcrumbs() {
  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">Dashboard</Typography>
      <Typography variant="body1">Students</Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.primary", fontWeight: 600 }}
      >
        View Students
      </Typography>
    </StyledBreadcrumbs>
  );
}

const classNames = [
  "KG1",
  "KG2",
  "KG3",
  "BS1",
  "BS2",
  "BS3",
  "BS4",
  "BS5",
  "BS6",
  "JHS1",
  "JHS2",
  "JHS3",
  "JHS3",
  "SHS3",
  "SHS3",
  "SHS3",
];

const classDivision = ["A"]

const academicSession = [
    "2024-2025",
    "2025 -2026"
]

const accountStatus = [
    "All",
    "Active",
    "Deactivated",
]

const ViewStudents = () => {

    // Class Names
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [valueClassName, setValueClassName] = useState<string | null>(null);

  const options = classNames.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

    // Class Names
  const classDivisionCombobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [valueClassDivision, setValueClassDivision] = useState<string | null>(null);

  const classDivisionOptions = classDivision.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));
    // Academic Session
  const academicSessionCombobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [valueacademicSession, setValueacademicSession] = useState<string | null>(null);

  const academicSessionOptions = academicSession.map((itemiee) => (
    <Combobox.Option value={itemiee} key={itemiee}>
      {itemiee}
    </Combobox.Option>
  ));

    // Academic Session
  const accountStatusCombobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [valueaccountStatus, setValueaccountStatus] = useState<string | null>(null);

  const accountStatusOptions = accountStatus.map((itemi) => (
    <Combobox.Option value={itemi} key={itemi}>
      {itemi}
    </Combobox.Option>
  ));

  const isSmallScreen = useMediaQuery("(max-width:1045px)")
  const navigate = useNavigate()
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <NavbarBreadcrumbs />
      <Card
        sx={{ display: "flex", alignItems: "center", gap: "1rem", mb: ".3rem", justifyContent:'space-between' }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", mb: ".3rem" }}>
            <FilterAltIcon />
            <Typography component="h4">Select Class to View</Typography>
        </Box>
        <Button variant="outlined" onClick={()=>navigate("/people/students/enrollment")}> + New Student</Button>
      </Card>
      <Card sx={{ width:'100%',mb:'.5rem'}}>
        <Box sx={{display:'grid', gridTemplateColumns: !isSmallScreen?"repeat(4, minmax(200px, 1fr))":"repeat(1, minmax(200px, 1fr))", gap:'2rem', width:'100%', mb:'2rem'}}>
        <Box>
          <label htmlFor="">Class *</label>
          <Combobox
            store={combobox}
            onOptionSubmit={(val) => {
              setValueClassName(val);
              combobox.closeDropdown();
            }}
          >
            <Combobox.Target>
              <InputBase
                component="button"
                type="button"
                pointer
                rightSection={<Combobox.Chevron />}
                rightSectionPointerEvents="none"
                onClick={() => combobox.toggleDropdown()}
              >
                {valueClassName || (
                  <Input.Placeholder>Pick value</Input.Placeholder>
                )}
              </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options mah={200} style={{ overflowY: "auto" }}>
                {options}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
        </Box>
        <Box>
          <label htmlFor="">Class Division *</label>
          <Combobox
            store={classDivisionCombobox}
            onOptionSubmit={(val) => {
              setValueClassDivision(val);
              classDivisionCombobox.closeDropdown();
            }}
          >
            <Combobox.Target>
              <InputBase
                component="button"
                type="button"
                pointer
                rightSection={<Combobox.Chevron />}
                rightSectionPointerEvents="none"
                onClick={() => classDivisionCombobox.toggleDropdown()}
              >
                {valueClassDivision || (
                  <Input.Placeholder>Select Class First</Input.Placeholder>
                )}
              </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options mah={200} style={{ overflowY: "auto" }}>
                {classDivisionOptions}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
        </Box>
        <Box>
          <label htmlFor="">Academic Session *</label>
          <Combobox
            store={academicSessionCombobox}
            onOptionSubmit={(val) => {
              setValueacademicSession(val);
              academicSessionCombobox.closeDropdown();
            }}
          >
            <Combobox.Target>
              <InputBase
                component="button"
                type="button"
                pointer
                rightSection={<Combobox.Chevron />}
                rightSectionPointerEvents="none"
                onClick={() => academicSessionCombobox.toggleDropdown()}
              >
                {valueacademicSession || (
                  <Input.Placeholder>Select Academic session</Input.Placeholder>
                )}
              </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options mah={200} style={{ overflowY: "auto" }}>
                {academicSessionOptions}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
        </Box>
        <Box>
          <label htmlFor="">Account Status *</label>
          <Combobox
            store={accountStatusCombobox}
            onOptionSubmit={(val) => {
              setValueaccountStatus(val);
              accountStatusCombobox.closeDropdown();
            }}
          >
            <Combobox.Target>
              <InputBase
                component="button"
                type="button"
                pointer
                rightSection={<Combobox.Chevron />}
                rightSectionPointerEvents="none"
                onClick={() => accountStatusCombobox.toggleDropdown()}
              >
                {valueaccountStatus || (
                  <Input.Placeholder>Select Account Status</Input.Placeholder>
                )}
              </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options mah={200} style={{ overflowY: "auto" }}>
                {accountStatusOptions}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
        </Box>

        </Box>
        <Box sx={{width:'100%', display:'flex', justifyContent:'center'}}>
            <Button variant="contained" color="primary">View Students</Button>
        </Box>
      </Card>
      <Card>
        <StudentDataGrid />
      </Card>

    </Box>
  );
};

export default ViewStudents;
