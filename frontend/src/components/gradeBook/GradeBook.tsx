import { Box } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import { useNavigate } from 'react-router-dom';


const GradeBook = () => {
    const navigate = useNavigate()
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Grade Book
      </Typography>
    <Box sx={{display:'grid', gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", width:'100%', mt:'3rem', gap:'2.5rem'}}>
    <Card sx={{ backgroundColor:'white', cursor:'pointer' }} onClick={()=>navigate("/scoreEntryOptions")}>
      <CardContent sx={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'1rem'}}>
      <img
        alt=""
        height="100"
        src="images/score.png"
        style={{margin:'auto'}}
      />
        <Typography variant="h6" component="h3" align='center'>
            Score Entry
        </Typography>
      </CardContent>
    </Card>
    <Card sx={{ backgroundColor:'white', cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center' }} onClick={()=>navigate("/cognitiveAssessment")}>
      <CardContent sx={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'1rem'}}>
      <img
        alt=""
        height="100"
        src="images/cognitive.png"
        style={{margin:'auto'}}
    
      />
        <Typography variant="h6" component="h3" align='center'>
        Cognitive Skills Assessment
        </Typography>
      </CardContent>
    </Card>
    <Card sx={{ backgroundColor:'white', cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center' }} onClick={()=>navigate("/Review&PublishResultsOptions")}>
      <CardContent sx={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'1rem'}}>
      <img
        alt=""
        height="100"
        src="images/publish.png"
        style={{margin:'auto'}}
      />
        <Typography variant="h6" component="h3" align='center'>
        Review & Publish Results
        </Typography>
      </CardContent>
    </Card>
    <Card sx={{ backgroundColor:'white', cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center' }} onClick={()=>navigate("/studentPromotion")}>
      <CardContent sx={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'1rem'}}>
      <img
        alt=""
        height="100"
        src="images/promotion.png"
        style={{margin:'auto'}}
      />
        <Typography variant="h6" component="h3" align='center'>
        Annual Promotionl Reports
        </Typography>
      </CardContent>
    </Card>
    <Card sx={{ backgroundColor:'white', cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center' }} onClick={()=>navigate("/printResults")}>
      <CardContent sx={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'1rem'}}>
      <img
        alt=""
        height="100"
        src="images/printer.png"
        style={{margin:'auto'}}
      />
        <Typography variant="h6" component="h3" align='center'>
        Print Student Report
        </Typography>
      </CardContent>
    </Card>
    </Box>
    </Box>
  )
}

export default GradeBook