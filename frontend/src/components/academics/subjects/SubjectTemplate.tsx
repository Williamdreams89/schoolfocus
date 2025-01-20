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
  Menu,
  MenuProps,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { alpha, styled } from "@mui/system";
import { TextInput } from "@mantine/core";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


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

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300],
    }),
  },
}));

function CustomizedMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Actions on Selected
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disableRipple>
          Add to class(es)
        </MenuItem>
        
      </StyledMenu>
    </div>
  );
}



// Styled components for the toolbar
const CustomToolbarContainer = styled(GridToolbarContainer)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
}));

const CustomToolbar: React.FC = () => (
  <CustomToolbarContainer sx={{mb:'2rem'}}>
    <CustomizedMenu />
    <Box display="flex" gap={2} alignItems="center">
      <Typography>Records per page:</Typography>
      <Select defaultValue={30} size="small">
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={30}>30</MenuItem>
        <MenuItem value={50}>50</MenuItem>
      </Select>
      <TextInput
        placeholder="Search subject template"
        style={{ width: 400 }}
      />
    </Box>
    {/* <Box display="flex" gap={2}>
      <Button variant="contained" color="primary">
        Add Subject
      </Button>
      <Button variant="contained" color="secondary">
        Manage / Assign Subject Teachers
      </Button>
    </Box> */}
  </CustomToolbarContainer>
);

const SubjectTemplates: React.FC = () => {
  const [subjects] = useState<Subject[]>(sampleSubjects);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 30,
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "#", width: 50 },
    { field: "name", headerName: "Subject (template) Name", width: 200 },
    { field: "code", headerName: "Subject Code", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: 'center',
      align:'center',
      width: 250,
      renderCell: (params) => (
        <Box sx={{backgroundColor: 'rd', width:'100%', display:'flex', gap:'1rem', mt:'2rem', justifyContent:'center'}}>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
          <IconButton>
            <EditIcon />
          </IconButton>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={subjects}
          rowHeight={100}
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

export default SubjectTemplates;
