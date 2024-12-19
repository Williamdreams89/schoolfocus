import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  Button,
  IconButton,
  Select,
  MenuItem,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { styled } from "@mui/system";

interface Subject {
  id: number;
  name: string;
  code: string;
  class: string;
  classArm: string;
  term: string;
  passFullMark: string;
  attributes: string;
  teacherInCharge: string;
  assistingTeachers: string[];
}

// Sample data
const sampleSubjects: Subject[] = [
  {
    id: 1,
    name: "Mathematics",
    code: "MATH01",
    class: "Primary 6",
    classArm: "All",
    term: "All",
    passFullMark: "30 / 100",
    attributes: "Prerequisite: Yes",
    teacherInCharge: "Kwame William",
    assistingTeachers: ["Agya Appiah"],
  },
  {
    id: 2,
    name: "English Language",
    code: "ENG01",
    class: "Primary 6",
    classArm: "All",
    term: "All",
    passFullMark: "50 / 100",
    attributes: "Prerequisite: No",
    teacherInCharge: "Agya Appiah",
    assistingTeachers: ["Kwame William"],
  },
  // Add more subjects as needed
];

// Styled components for the toolbar
const CustomToolbarContainer = styled(GridToolbarContainer)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
}));

const CustomToolbar: React.FC = () => (
  <CustomToolbarContainer>
    <Button variant="outlined">Export List</Button>
    <Box display="flex" gap={2} alignItems="center">
      <Typography>Records per page:</Typography>
      <Select defaultValue={30} size="small">
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={30}>30</MenuItem>
        <MenuItem value={50}>50</MenuItem>
      </Select>
      <TextField
        size="small"
        placeholder="Search"
        variant="outlined"
        sx={{ width: 200 }}
      />
    </Box>
    <Box display="flex" gap={2}>
      <Button variant="contained" color="primary">
        Add Subject
      </Button>
      <Button variant="contained" color="secondary">
        Manage / Assign Subject Teachers
      </Button>
    </Box>
  </CustomToolbarContainer>
);

const AllSubjects: React.FC = () => {
  const [subjects] = useState<Subject[]>(sampleSubjects);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 30,
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "#", width: 50 },
    { field: "name", headerName: "Subject Name", flex: 1 },
    { field: "code", headerName: "Subject Code", flex: 1 },
    { field: "class", headerName: "Class", flex: 1 },
    { field: "classArm", headerName: "Class Arm", flex: 1 },
    { field: "term", headerName: "Term", flex: 1 },
    { field: "passFullMark", headerName: "Pass / Full Mark", flex: 1 },
    { field: "attributes", headerName: "Attributes", flex: 1 },
    { field: "teacherInCharge", headerName: "Teacher In Charge", flex: 1 },
    {
      field: "assistingTeachers",
      headerName: "Assisting Teachers",
      flex: 1,
      renderCell: (params) => (
        <ul>
          {params.row.assistingTeachers.map((teacher: string, index: number) => (
            <li key={index}>{teacher}</li>
          ))}
        </ul>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton color="info">
            <VisibilityIcon />
          </IconButton>
          <IconButton color="primary">
            <EditIcon />
          </IconButton>
          <IconButton color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%", padding: 2 }}>
      <DataGrid
        rows={subjects}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        checkboxSelection
        // disableSelectionOnClick
        slots={{
          toolbar: CustomToolbar,
        }}
      />
    </Box>
  );
};

export default AllSubjects;
