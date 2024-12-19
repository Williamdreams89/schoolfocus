import React, { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { TextField, Button, Box, IconButton, Fab, Card } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditNoteIcon from '@mui/icons-material/EditNote';
import useMediaQuery from "@mui/material/useMediaQuery"
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

interface Student {
  id: number;
  roll: string;
  photo: string;
  name: string;
  gender: string;
  parent: string;
  class: string;
  section: string;
  dob: string;
  mobile: string;
  email: string;
}

const initialStudents: Student[] = [
  { id: 1, roll: '#2901', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Richi Rozario', gender: 'Female', parent: 'David Smith', class: '1', section: 'A', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 2, roll: '#2902', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Kazi Fahim', gender: 'Male', parent: 'Mike Hussey', class: '2', section: 'B', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 3, roll: '#2903', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Richi Rozario', gender: 'Female', parent: 'David Smith', class: '1', section: 'A', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 4, roll: '#2904', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Kazi Fahim', gender: 'Male', parent: 'Mike Hussey', class: '2', section: 'B', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 5, roll: '#2905', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Richi Rozario', gender: 'Female', parent: 'David Smith', class: '1', section: 'C', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 6, roll: '#2906', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Richi Rozario', gender: 'Female', parent: 'David Smith', class: '3', section: 'A', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 7, roll: '#2907', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Nchi Rozario', gender: 'Female', parent: 'David Smith', class: '5', section: 'D', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 8, roll: '#2908', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Mchi Rozario', gender: 'Female', parent: 'David Smith', class: '5', section: 'D', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 9, roll: '#2909', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Kazi Fahim', gender: 'Male', parent: 'Mike Hussey', class: '2', section: 'B', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 10, roll: '#2910', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Nchi Rozario', gender: 'Female', parent: 'David Smith', class: '5', section: 'D', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 11, roll: '#2911', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Mchi Rozario', gender: 'Female', parent: 'David Smith', class: '5', section: 'D', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 12, roll: '#2912', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Kazi Fahim', gender: 'Male', parent: 'Mike Hussey', class: '2', section: 'B', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 13, roll: '#2913', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Richi Rozario', gender: 'Female', parent: 'David Smith', class: '1', section: 'A', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 14, roll: '#2914', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Kazi Fahim', gender: 'Male', parent: 'Mike Hussey', class: '2', section: 'B', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 15, roll: '#2915', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Richi Rozario', gender: 'Female', parent: 'David Smith', class: '1', section: 'A', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 16, roll: '#2916', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Kazi Fahim', gender: 'Male', parent: 'Mike Hussey', class: '2', section: 'B', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 17, roll: '#2917', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Richi Rozario', gender: 'Female', parent: 'David Smith', class: '1', section: 'A', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 18, roll: '#2918', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Kazi Fahim', gender: 'Male', parent: 'Mike Hussey', class: '2', section: 'B', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 19, roll: '#2919', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Richi Rozario', gender: 'Female', parent: 'David Smith', class: '1', section: 'A', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
  { id: 20, roll: '#2920', photo: 'https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg', name: 'Kazi Fahim', gender: 'Male', parent: 'Mike Hussey', class: '2', section: 'B', dob: '10/03/2010', mobile: '+8812 00 5098', email: 'ndisons@gmail.com' },
];


const ManageStudents = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [filters, setFilters] = useState({ roll: '', section: '', class: '' });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    // Add search/filtering logic here
    alert('Search Clicked');
  };

  const handleEdit = (id: number) => {
    alert(`Edit Student with ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const handleView = (id: number) => {
    alert(`View Details of Student with ID: ${id}`);
  };

  const columns: GridColDef[] = [
    { field: 'roll', headerName: 'Std ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 160 },
    { field: 'photo', headerName: 'Photo', width: 100, renderCell: () => <img src="https://res.cloudinary.com/def1csoqu/raw/upload/v1726525979/media/images/preview_l7bpl9.jpeg" alt="Photo" style={{ width: 40, borderRadius: '50%', marginTop:'10px' }} /> },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'parent', headerName: 'Parents Name', width: 150 },
    { field: 'mobile', headerName: 'Mobile No', width: 160 },
    { field: 'class', headerName: 'Class', width: 90 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditNoteIcon />}
          label="Edit"
          // onClick={() => handleEdit(params)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          // onClick={() => {setOpenDeleteDialog(true); handleDelete(params.id)}}
        />,
        <GridActionsCellItem
          icon={<RemoveRedEyeIcon />}
          label="Invoice"
          // onClick={() => handlePrint(params.row)}
        />,
      ],
    },
  ];
    useEffect(()=>{
        document.title = "Students"
    })

    const isSmallDevice = useMediaQuery('(max-width:1047px)')
    const navigate = useNavigate()
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px', position:'relative' } }}>
      <Card>
      <Box sx={{display: !isSmallDevice?'flex': null, justifyContent:'space-between',alignItems:'center',mb:!isSmallDevice?'2rem':'.7rem', width:'100%'}}>
        <h2>All Students</h2>
        {!isSmallDevice &&<Button size='large' variant='contained' sx={{}} onClick={()=> navigate("/people/students/addStudent")}><AddIcon /> New Student</Button>}
      </Box>
      <Box sx={{display:'flex', flexDirection: isSmallDevice ? 'column':'row', gap:'10px', marginBottom:'2rem', justifyContent:'space-between', alignItems: !isSmallDevice?'center': null}} gap={2} mb={2}>
        <TextField
          label="Student Name"
          variant={isSmallDevice?"standard":'filled'}
          size="small"
          name="name"
          value={filters.roll}
          onChange={handleFilterChange}
          sx={{flex: 2}}
        />
        <TextField
          label="Class"
          variant={isSmallDevice?"standard":'filled'}
          size="small"
          name="class"
          value={filters.class}
          onChange={handleFilterChange}
        />
        <TextField
          label="Year Group"
          variant={isSmallDevice?"standard":'filled'}
          size="small"
          name="section"
          value={filters.section}
          onChange={handleFilterChange}
        />
        <Button variant="contained" size='large' startIcon={<SearchIcon />} onClick={handleSearch}>
          Search
        </Button>
      </Box>
        <DataGrid 
          autoHeight
          rows={students} 
          columns={columns} 
          sx={{backgroundColor:'white', '& .MuiDataGrid-columnHeaders': {backgroundColor:'black'}}}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          initialState={{
            pagination: { paginationModel: { pageSize: 20 } },
          }}
          pageSizeOptions={[10, 20, 50]}
          disableColumnResize
          density="compact"
          rowHeight={80}
          slotProps={{
            filterPanel: {
              filterFormProps: {
                logicOperatorInputProps: {
                  variant: 'outlined',
                  size: 'small',
                },
                columnInputProps: {
                  variant: 'outlined',
                  size: 'small',
                  sx: { mt: 'auto' },
                },
                operatorInputProps: {
                  variant: 'outlined',
                  size: 'small',
                  sx: { mt: 'auto' },
                },
                valueInputProps: {
                  InputComponentProps: {
                    variant: 'outlined',
                    size: 'small',
                  },
                },
              },
            },
          }}
          />
          <Fab onClick={()=> navigate("/people/students/addStudent")} color="inherit" aria-label="add" sx={{position:'fixed', bottom:'4rem', right: "calc(2rem)", display: !isSmallDevice ? 'none':'block'}}>
        <AddIcon fontSize='large' />
      </Fab>
      </Card>
    </Box>
  )
}

export default ManageStudents