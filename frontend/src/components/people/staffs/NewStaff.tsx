import { Box, Button, Card, Divider, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import '@mantine/core/styles.css';
import {Autocomplete, FileInput, MantineProvider, NativeSelect, TextInput, Textarea} from "@mantine/core"
import { SimpleGrid } from '@mantine/core';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react'
import { GridMenuIcon } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

const NewStaff = () => {
    const isSmallDevice =useMediaQuery('(max-width:1025px)')
    const navigate = useNavigate()
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px', position:'relative' } }}>
          <Box sx={{display:'flex', flexDirection: isSmallDevice ? 'column-reverse':'row',mt:'1rem', mb:'2rem',justifyContent:'space-between',alignItems:!isSmallDevice?'center':null, width:'100%', gap:'2rem'}}>
              <Typography variant={ !isSmallDevice?'h4':'h5'} component={'h3'}>New Staff</Typography>
              <Box sx={isSmallDevice ?{width:'100%', display:'flex', justifyContent:'end'}:null}>
                <Button variant='contained' onClick={()=>navigate("/people/staffs")} size={isSmallDevice?'small':'small'} sx={{width:'fit-content'}}><GridMenuIcon sx={{mr:'.5rem'}} /> Staff List</Button>            
              </Box>
          </Box>
          <Card>
          <MantineProvider>
            <Typography variant='h6' component={'h4'}>Staff Information</Typography>
          <Divider sx={{mb:'1rem', mt:'1rem'}} />
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 4 }}
            spacing={{ base: 10, sm: 'xl' }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}
          >
          <TextInput
            label="Full Name (surname first)"
            required
          />
          <NativeSelect
            label="Gender"
            data={['','Male', 'Female']}
            required
          />
          <TextInput
            label="Mobile Number"
            type='tel'
            required
          />
          <NativeSelect
            label="Designation"
            data={['','Teacher', 'Bursar', 'Registrar/Admission Officer', 'Office Clerk', 'Administrator']}
            required
          />
          <TextInput
            label="Email"
            type='email'
            required
          />
          <TextInput
            label="Password"
            type='hidden'
            required
          />
            {/* <NativeSelect label='Gender' data={['', 'Male', 'Female']} /> */}
            {/* <TextInput type='date'  label='Date of Birth' />
            <TextInput label='Next of Kin' />
            <TextInput label='Admission No.' />
            <TextInput type='date' label='Admission Date' />
            <NativeSelect label='Religion' data={['', 'Christianity', 'Islam', 'Traditional']} />
            <TextInput type='email'  label='Email' /> */}
            <FileInput accept="image/png,image/jpeg" label="Upload Staff Profile Photo" placeholder='No file chosen' />
          </SimpleGrid>
          <Typography variant='h6' component={'h4'} sx={{mt:'2rem'}}>Next of Kin's Information</Typography>
          <Divider sx={{mb:'1rem', mt:'1rem'}} />
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 4 }}
            spacing={{ base: 10, sm: 'xl' }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}
          >
            <TextInput label="Next of Kin's Name" />
            <TextInput label="Next of Kin's Contact phone" />
            <TextInput label="Next of Kin's Contact email" />
            <TextInput label="Next of Kin's Address" />
            <TextInput label='Parent Contact' />
            <TextInput type='tel' label='Parent Contact' />
            <TextInput label='Nationality' />
            <TextInput label='Area of Residence' />
            <TextInput label='GPS Address' />
            <FileInput accept="image/png,image/jpeg" label="Upload Next of Kin's Photo" placeholder='No file chosen' />
          </SimpleGrid>
          <Typography variant='h6' component={'h4'} sx={{mt:'2rem'}}>More information</Typography>
          <Divider sx={{mb:'1rem', mt:'1rem'}} />
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 4 }}
            spacing={{ base: 10, sm: 'xl' }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}
          >
            <TextInput label="Staff Number" />
            <TextInput label="Highest Qualifiaction" />
            <TextInput label="Area of Specialization" />
            <TextInput label="Religion" />
            <TextInput label='Nationality' />
            <Textarea label='Permanent Address' />
            <TextInput label='Role' />
            <TextInput label='Area of Residence' />
            <TextInput label='GPS Address' />
            <TextInput label='Date of Appointment' />
          </SimpleGrid>
          <Box sx={{mt:'2rem', display:'flex', gap:'1rem'}}>
            <Button variant='contained' size='large'>Save</Button>
            <Button variant='contained' size='large' color='error'>Reset</Button>
          </Box>
          </MantineProvider>
          </Card>
      </Box>
    )
}

export default NewStaff