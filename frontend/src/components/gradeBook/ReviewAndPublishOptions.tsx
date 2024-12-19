import useMediaQuery  from '@mui/material/useMediaQuery'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { Box, Button, Card, Divider, Typography } from '@mui/material'
import { MantineProvider, NativeSelect, SimpleGrid } from '@mantine/core'
import SearchIcon from '@mui/icons-material/Search';

const ReviewAndPublishOptions = () => {
    const isSmallDevice = useMediaQuery("(max-width:1045px)")
    const navigate = useNavigate()
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
          <Box sx={{width:'100%', display:'flex', flexDirection: !isSmallDevice ? 'row':'column', alignItems:'center', justifyContent:'space-between' }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Review And Publish Results
            </Typography>
          </Box>
        <Card sx={{mt:'2rem', pb:'5rem'}}>
            <MantineProvider>
            <Typography variant='h6' component={'h4'}>Select Options</Typography>
          <Divider sx={{mb:'1rem', mt:'1rem'}} />
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 4 }}
            spacing={{ base: 10, sm: 'xl' }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}
          >
            <NativeSelect
            label="Exam Section"
            data={['Select Exam Section','First Trimester', 'Second Trimester', 'Third Trimester']}
            required
          />
          <NativeSelect
            label="Exam"
            data={['Select Exam','Mid-Term Exams', 'End of Term Exams', 'Supplementary/Resit Exams']}
            required
          />
          <NativeSelect
            label="Class"
            data={['Select Class','BS1', 'BS2', 'BS3']}
            required
          />
          {/* <NativeSelect
            label="Class Division"
            data={['Select Class Division','BS1A', 'BS2A', 'JHS1A']}
            required
          /> */}
          
          </SimpleGrid>
        </MantineProvider>
        </Card>
        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', mt:'2.3rem'}}>
          <Button variant='contained' onClick={()=>navigate("/Review&PublishResults")}><SearchIcon sx={{color:'white'}} /> View Results</Button>
        </Box>
      </Box>
    )
}

export default ReviewAndPublishOptions