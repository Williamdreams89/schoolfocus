import { Box, Divider } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import { useNavigate } from 'react-router-dom';
import NavBreadCrumbs from '../NavbarBreadcrumbs';
import { Props, TermSessionProps } from './students/types';


const People: React.FC<TermSessionProps> = ({academicSessionSettingsData, academicSettingsData}) => {
    const navigate = useNavigate()
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          <NavBreadCrumbs academicSessionSettingsData={academicSessionSettingsData} academicSettingsData={academicSettingsData} items={[
    { label: "Dashboard", href: "/" },
    { label: "People" },
  ]} />
        </Typography>
      <Box sx={{display:'grid', gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", width:'100%', mt:'3rem', gap:'2.5rem'}}>
      <Card sx={{ backgroundColor:'white', cursor:'pointer' }} onClick={()=>navigate("/people/students")}>
        <CardContent sx={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'1rem'}}>
        <img
          alt=""
          height="100"
          src="images/student.png"
          style={{margin:'auto'}}
        />
          <Typography variant="h6" component="h3" align='center'>
              Students 
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ backgroundColor:'white', cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center' }} onClick={()=>navigate("/people/staffs")}>
        <CardContent sx={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'1rem'}}>
        <img
          alt=""
          height="100"
          src="images/teachers.png"
          style={{margin:'auto'}}
      
        />
          <Typography variant="h6" component="h3" align='center'>
          Staff/Employees
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ backgroundColor:'white', cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center' }} onClick={()=>navigate("/people/parents")}>
        <CardContent sx={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'1rem'}}>
        <img
          alt=""
          height="100"
          src="images/parent.png"
          style={{margin:'auto'}}
        />
          <Typography variant="h6" component="h3" align='center'>
          Parents
          </Typography>
        </CardContent>
      </Card>
      </Box>
      </Box>
    )
}

export default People