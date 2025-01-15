import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  TextField,
  IconButton,
  Menu,
  MenuItem as DropdownMenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import { GridRenderCellParams } from '@mui/x-data-grid';


const FeesTab = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const columns = [
    { field: 'id', headerName: 'Invoice ID', width: 150 },
    { field: 'student', headerName: 'Student', width: 200 },
    { field: 'feeClass', headerName: 'Fee Class', width: 150 },
    { field: 'total', headerName: 'Total', width: 120 },
    { field: 'paid', headerName: 'Paid', width: 120 },
    { field: 'due', headerName: 'Due', width: 120 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'created', headerName: 'Created', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <DropdownMenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <NotificationImportantIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Send Reminder</ListItemText>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Invoice</ListItemText>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <ShareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Download / Share Invoice</ListItemText>
            </DropdownMenuItem>
          </Menu>
        </>
      ),
    },
  ];

  const rows = [
    {
      id: 'INV123',
      student: 'WILLIAM DANQUAH WIREDU',
      feeClass: 'Primary 6 - A',
      total: 'GHS 1,000',
      paid: 'GHS 1,000',
      due: 'GHS 0',
      status: 'Paid',
      created: 'Jan 13, 2025',
    },
  ];

  return (
    <Box p={4} sx={{bgcolor:'white', width:'100%'}}>
      {/* Filters and Actions */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4}>
          <Select fullWidth defaultValue="All">
            <MenuItem value="All">All Fee Sessions</MenuItem>
            <MenuItem value="2025">2025 Session</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} md={4}>
          <Select fullWidth defaultValue="All">
            <MenuItem value="All">All Fee Terms</MenuItem>
            <MenuItem value="Term 1">Term 1</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
          <Button variant="contained" startIcon={<AddIcon />}>
            New Invoice
          </Button>
        </Grid>
      </Grid>

      {/* Fee Summary */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <Box
            p={2}
            borderRadius={2}
            bgcolor="#e3f2fd"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Total Fee:</Typography>
            <Typography fontWeight="bold">GHS 1,000</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            p={2}
            borderRadius={2}
            bgcolor="#e8f5e9"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Total Paid:</Typography>
            <Typography fontWeight="bold" color="green">
              GHS 1,000
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            p={2}
            borderRadius={2}
            bgcolor="#ffebee"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Total Due:</Typography>
            <Typography fontWeight="bold" color="red">
              GHS 0
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Fee Table */}
      <Box mb={2}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} checkboxSelection />
      </Box>
    </Box>
  );
};

export default FeesTab;
