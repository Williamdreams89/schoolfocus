import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Button, Avatar, TextField, Box, Typography, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery"
import { TextInput } from "@mantine/core";

interface Guardian {
  id: number;
  name: string;
  email: string;
  phone: string;
  relationship: string;
  profilePic: string;
  accountStatus: boolean;
}

const GuardiansTable: React.FC = () => {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [filteredGuardians, setFilteredGuardians] = useState<Guardian[]>([]);
  const [search, setSearch] = useState("");
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const navigate = useNavigate();

  // Fetch data from API
  useEffect(() => {
    axios
      .get("https://api.example.com/guardians") // Replace with your API endpoint
      .then((response) => {
        setGuardians(response.data);
        setFilteredGuardians(response.data);
      })
      .catch((error) => console.error("Error fetching guardians:", error));
  }, []);

  // Handle search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const filtered = guardians.filter((guardian) =>
      guardian.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredGuardians(filtered);
  };

  // Navigate to parent details page
  const handleProfileClick = (id: number) => {
    const selectedGuardian = guardians.find((guardian) => guardian.id === id);
    if (selectedGuardian) {
      navigate(`/parent-details/${id}`, { state: selectedGuardian });
    }
  };

  // DataGrid columns definition
  const columns: GridColDef[] = [
    { field: "id", headerName: "#", width: 50 },
    {
      field: "profilePic",
      headerName: "Photo",
      width: 100,
      renderCell: (params) => (
        <Avatar
          src={params.value as string}
          alt="Profile"
          sx={{ cursor: "pointer" }}
          onClick={() => handleProfileClick(params.row.id)}
        />
      ),
    },
    { field: "name", headerName: "Guardian's Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "relationship", headerName: "Relationship with Ward(s)", width: 200 },
    {
      field: "accountStatus",
      headerName: "Account Status",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color={params.value ? "success" : "error"}
          onClick={() =>
            alert(
              `Account Status: ${params.value ? "ON" : "OFF"} for ${
                params.row.name
              }`
            )
          }
        >
          {params.value ? "ON" : "OFF"}
        </Button>
      ),
    },
  ];

  const isSmallDevice = useMediaQuery('(max-width:1047px)')
  return (
    <div style={{ width: "100%" }}>
        <Card sx={{display:'flex', flexDirection: isSmallDevice ? 'column-reverse':'row',mt:'1rem', mb:'2rem',justifyContent:'space-between',alignItems:!isSmallDevice?'center':null, width:'100%', gap:'2rem'}}>
            <Typography variant={ !isSmallDevice?'h4':'h5'} component={'h3'}>Parents/Guardians</Typography>
            <Box sx={isSmallDevice ?{width:'100%', display:'flex', justifyContent:'end'}:null}>
              <Button variant='contained' onClick={()=>navigate("/people/addParents")} size={isSmallDevice?'small':'small'} sx={{width:'fit-content'}}>Add Parent/Guardian</Button>            
            </Box>
        </Card>
      {/* Header Section with Search and Export */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <TextInput
          label="Search"
          value={search}
          onChange={handleSearch}
        />
        <Button size='small' variant="contained" onClick={() => alert("Exporting data...")}>
          Export List
        </Button>
      </div>

      {/* DataGrid */}
      <Box sx={{height:'300px'}}>
        <DataGrid
            rows={filteredGuardians}
            columns={columns}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
        />
      </Box>
    </div>
  );
};

export default GuardiansTable;
