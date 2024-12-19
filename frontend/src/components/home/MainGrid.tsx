import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChartStudentByResidence from './ChartStudentByResidence';
// import CustomizedTreeView from './CustomizedTreeView';
import CustomDataGrid from './CustomDataGrid';
import HighlightedCard from '../HighlightedCard';
import FeePaymentBarChart from './FeePaymentChart';
import SessionsChart from './SessionsChart';
import StatCard, {StatCardProps} from './StatCard';
import IncomeExpenditureTable from './CustomDataGrid';

const data: StatCardProps[] = [
  {
    title: 'Students',
    value: '1,200',
    interval: 'Last 30 days',
    trend: 'up',
    data: [1200, 1220, 1180, 1215, 1190, 1250, 1300, 1280, 1295, 1310, 1350, 1370], // Student enrollment count over time
  },
  {
    title: 'Attendance Rate',
    value: '95%',
    interval: 'Last 30 days',
    trend: 'up',
    data: [93, 94, 95, 96, 94, 95, 96, 97, 95, 96, 97, 95], // Attendance rate trend
  },
  {
    title: 'Exams Passed',
    value: '850',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: [850, 870, 880, 860, 845, 830, 850, 840, 860, 890, 900, 910], // Number of students passing exams
  },
];

export default function MainGrid() {
  React.useEffect(()=>{
    document.title = "Home"
  })
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FeePaymentBarChart />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Incomes & Expenditures
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <IncomeExpenditureTable />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            {/* <CustomizedTreeView /> */}
            <ChartStudentByResidence />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
