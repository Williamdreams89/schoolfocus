import { Box, Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Input, InputBase, Combobox, useCombobox } from "@mantine/core";
import useMediaQuery from "@mui/material/useMediaQuery"
import { styled } from "@mui/material/styles";

import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

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

const API_BASE_URL = 'https://example.com/api'; // Replace with your actual API base URL

const StudentDataGrid: React.FC = () => {
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Fetch students data from API
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students`);
      setRows(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
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

  useEffect(() => {
    fetchStudents();
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: '#', width: 50 },
    {
      field: 'photo',
      headerName: 'Photo',
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <img
          src={params.value}
          alt="student"
          style={{ width: 40, height: 40, borderRadius: '50%' }}
        />
      ),
    },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'regNumber', headerName: 'Reg. No.', width: 150 },
    { field: 'classArm', headerName: 'Class / Class Arm', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'is_active',
      headerName: 'Account Status',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Switch
          checked={params.value}
          color="success"
          onChange={() => handleToggleAccountStatus(params.row.id, params.value)}
        />
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%', }}>
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
        rows={rows}
        columns={columns}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => setPaginationModel(model)}
        // components={{
        //   Toolbar: GridToolbar,
        // }}
        checkboxSelection
      />
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
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <NavbarBreadcrumbs />
      <Card
        sx={{ display: "flex", alignItems: "center", gap: "1rem", mb: ".3rem" }}
      >
        <FilterAltIcon />
        <Typography component="h4">Select Class to View</Typography>
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
