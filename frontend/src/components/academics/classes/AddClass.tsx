import React from 'react'
import {Box, Typography, Button, Card} from "@mui/material"
import { useNavigate } from 'react-router-dom'
import useMediaQuery from '@mui/material/useMediaQuery'
import { GridMenuIcon } from '@mui/x-data-grid'
import { MantineProvider, NativeSelect } from '@mantine/core'
const AddClass = () => {
    const navigate = useNavigate()
    const isSmallDevice = useMediaQuery("(max-width:1025px)")
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px', position:'relative' } }}>
        <Box sx={{display:'flex', flexDirection: isSmallDevice ? 'column-reverse':'row',mt:'1rem', mb:'2rem',justifyContent:'space-between',alignItems:!isSmallDevice?'center':null, width:'100%', gap:'2rem'}}>
            <Typography variant={ !isSmallDevice?'h4':'h5'} component={'h3'}>Add New Class</Typography>
            <Box sx={isSmallDevice ?{width:'100%', display:'flex', justifyContent:'end'}:null}>
              <Button variant='contained' onClick={()=>navigate("/academics/addClass")} size={isSmallDevice?'small':'small'} sx={{width:'fit-content'}}><GridMenuIcon sx={{mr:'.5rem'}} /> View Class List</Button>            
            </Box>
        </Box>
      <MantineProvider>
        <Card sx={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
          <Box sx={{display:'flex', flexDirection:'column', gap:'3rem', width:'80%'}}>
              <NativeSelect
                label="Class Category"
                data={['','Creche', 'Kindergarten','Nursery','Primary','Junior High','Senior High','College/University']}
                required
              />
              <NativeSelect
                label="Name of Class"
                data={['','KG1', 'KG2','BS1','BS2','BS3','BS4','BS5','BS6', 'JHS1', 'JHS2', 'JHS3']}
                required
              />
              <NativeSelect
                label="Class Division"
                data={['', 'A']}
                required
              />
              <NativeSelect
                label="Teacher In-Charge of Class"
                data={['', 'William']}
                required
              />
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={'2rem'}>
            <Button variant='contained' size='small'>Add</Button>
            <Button size='small'>Done</Button>
          </Box>
        </Card>
      </MantineProvider>
    </Box>
  )
}

export default AddClass