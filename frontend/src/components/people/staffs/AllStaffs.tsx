import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Button, Box, Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextInput } from "@mantine/core";

interface Staff {
  id: number;
  name: string;
  designation: string;
  phone: string;
  subjects: number;
  classes: number;
  email: string;
  accountStatus: string;
}

const StaffTable = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch teachers data from API
  useEffect(() => {
    axios
      .get("/api/staffs") // Replace with your API endpoint
      .then((response) => {
        if(new Array(response.data).length > 0){
          setStaffs(response.data);
          setLoading(false)
        }else{
          setStaffs([])
          setLoading(false)
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
        setStaffs([])
        setLoading(false)
      });
  }, []);

  // Handle search functionality
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Filter rows based on search term
  const filteredRows = staffs.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm) ||
      staff.email.toLowerCase().includes(searchTerm) ||
      staff.phone.toLowerCase().includes(searchTerm)
  );

  // Navigate to profile detail
  const handleProfileClick = (id: number) => {
    navigate(`/staff/${id}`); // Replace with your route
  };

  // Custom toolbar for export functionality
  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );

  // Define columns
  const columns: GridColDef[] = [
    { field: "id", headerName: "#", width: 70 },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => (
        <Box>
          <div>{params.row.name}</div>
          <div style={{ fontSize: "0.8rem", color: "gray" }}>
            {params.row.email}
          </div>
        </Box>
      ),
    },
    { field: "designation", headerName: "Designation", width: 150 },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "subjects",
      headerName: "Subject(s)",
      width: 120,
      renderCell: (params) => (
        <Button
          size="small"
          onClick={() => alert(`Subjects for staff ID: ${params.row.id}`)}
        >
          {params.row.subjects} Subjects
        </Button>
      ),
    },
    {
      field: "classes",
      headerName: "Form Class(es)",
      width: 150,
      renderCell: (params) => (
        <Button
          size="small"
          onClick={() => alert(`Classes for staff ID: ${params.row.id}`)}
        >
          {params.row.classes} Classes
        </Button>
      ),
    },
    {
      field: "profile",
      headerName: "Profile",
      width: 100,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleProfileClick(params.row.id)}
        >
          View
        </Button>
      ),
    },
    {
      field: "accountStatus",
      headerName: "Account Status",
      width: 150,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          color={params.row.accountStatus === "ON" ? "success" : "error"}
        >
          {params.row.accountStatus}
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <Card sx={{mb:'2rem', width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Typography variant='h5' >Staff</Typography>
        <Button variant='contained' size='small' onClick={()=>navigate("/people/staffs/newStaff")}>Add New Staff</Button>
      </Card>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextInput
          placeholder="Search staff"
          onChange={handleSearch}
        />
        <Button variant="contained" color="primary">
          Export List
        </Button>
      </Box>
      <DataGrid
  rows={filteredRows}
  columns={columns}
  loading={loading}
  initialState={{
    pagination: {
      paginationModel: { pageSize: 10 },
    },
  }}
  pageSizeOptions={[10, 20, 50]}
  slots={{
    toolbar: CustomToolbar,
  }}
  getRowId={(row) => row.id}
/>
    </Box>
  );
};

export default StaffTable;
