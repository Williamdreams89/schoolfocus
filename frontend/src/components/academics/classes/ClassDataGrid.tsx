import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Button, Card, IconButton, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

interface ClassRow {
  id: number;
  className: string;
  subjectCount: number;
  studentCount: number;
}

const ClassDataGrid: React.FC = () => {
  const [rows, setRows] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isSmallDevice = useMediaQuery("(max-width:1025px)")

  // Fetch data from the API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://api.example.com/classes"); // Replace with your API endpoint
      const data = response.data.map((item: any) => ({
        id: item.id,
        className: item.name,
        subjectCount: item.subjects.length, // Assuming API includes a `subjects` array
        studentCount: item.students.length, // Assuming API includes a `students` array
      }));
      setRows(data);
    } catch (error) {
      console.error("Error fetching class data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Edit Action
  const handleEdit = (id: number) => {
    console.log(`Editing class with ID: ${id}`);
    // Add your edit logic here (e.g., open a modal or navigate to an edit page)
  };

  // Handle Delete Action
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await axios.delete(`https://api.example.com/classes/${id}`); // Replace with your API endpoint
        setRows((prev) => prev.filter((row) => row.id !== id));
        console.log(`Class with ID ${id} deleted successfully`);
      } catch (error) {
        console.error("Error deleting class:", error);
      }
    }
  };

  // Handle View Subjects Action
  const handleViewSubjects = (id: number) => {
    navigate(`/classes/${id}/subjects`); // Navigate to a detailed page for the subjects
  };

  // DataGrid Columns
  const columns: GridColDef[] = [
    { field: "className", headerName: "Class", width:250 },
    { field: "subjectCount", headerName: "Class Subjects", width:250 },
    { field: "studentCount", headerName: "Current Students", width:250 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width:250,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {/* View Subjects */}
          <Tooltip title="View Subjects">
            <IconButton
              onClick={() => handleViewSubjects(params.row.id)}
              color="primary"
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          {/* Edit Class */}
          <Tooltip title="Edit Class">
            <IconButton
              onClick={() => handleEdit(params.row.id)}
              color="secondary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          {/* Delete Class */}
          <Tooltip title="Delete Class">
            <IconButton
              onClick={() => handleDelete(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];
  
  return (
    <div style={{ height: 600, width: "100%" }}>
        <Card sx={{mb:'2rem', display:'flex', flexDirection: isSmallDevice ? "column-reverse":'row', justifyContent:!isSmallDevice?'space-between':null, alignItems:!isSmallDevice?'center':null}}>
            <Typography variant='h6'>Classes</Typography>
            <Box sx={{display:'flex', justifyContent:'flex-end'}}>
                <Button variant="contained" sx={{width:'fit-content'}} onClick={()=>navigate("/academics/classes/addClass")} >Add Class</Button>
            </Box> 
        </Card>
        <Box sx={{height:'400px'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                disableRowSelectionOnClick
                initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
                }}
                pageSizeOptions={[10, 20, 50]} // Options for rows per page
            />
        </Box>
    </div>
  );
};

export default ClassDataGrid;
