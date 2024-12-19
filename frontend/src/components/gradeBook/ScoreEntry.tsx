import { Box, Button, Card, CardActions, Divider, Typography } from '@mui/material'
import React from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { MantineProvider, NativeSelect, SimpleGrid } from '@mantine/core'
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import { useNavigate } from 'react-router-dom';

const ScoreEntry = () => {
  const isSmallDevice = useMediaQuery("(max-width:1045px)")
  const navigate = useNavigate()
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Box sx={{width:'100%', display:'flex', flexDirection: !isSmallDevice ? 'row':'column', alignItems:'center', justifyContent:'space-between' }}>
          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            Exam Score Entry
          </Typography>
          <Box>
            <Typography component="p" variant="body1" > Academic Session: <span>2024 - 2025</span></Typography>
            <Divider />
            <Typography component="p" variant="body1" > Academic Session: <span>2024 - 2025</span></Typography>
          </Box>
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
        <NativeSelect
          label="Subject"
          data={['Select Subject','English Language', 'Mathematics', 'Integrated Science']}
          required
        />
        </SimpleGrid>
      </MantineProvider>
      </Card>
      <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', mt:'2.3rem'}}>
        <Button variant='contained' onClick={()=>navigate("/studentScoreEntry")}><BookmarkAddedIcon sx={{color:'white'}} /> Manage Students' Scores</Button>
      </Box>
    </Box>
  )
}

export default ScoreEntry 