import React, { useState } from "react";
import LockScreen from "./utils/component/LockScreen";
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import MainGrid from './components/home/MainGrid';
import SideMenu from './components/SideMenu';
import AppTheme from './theme/AppTheme'; 
import { dataGridCustomizations } from './theme/customizations/dataGrid';
import { treeViewCustomizations } from './theme/customizations/treeView';
import { chartsCustomizations } from './theme/customizations/charts';
import { datePickersCustomizations } from './theme/customizations/datePickers';
import {Routes, Route} from "react-router-dom"
import ManageStudents from './components/people/students/ManageStudents';
import MenuContent from './components/MenuContent';
import StudentAddForm from './components/StudentAddForm';
import { StudentPromotion } from './components/people/students/Promotions';
import { Typography } from '@mui/material';
import useMediaQuery from "@mui/material/useMediaQuery"
import GradeBook from './components/gradeBook/GradeBook';
import AnnualPromotion from './components/gradeBook/AnnualPromotion';
import CognitiveSkillsAssessment from './components/gradeBook/ViewStudentCognitiveSkillsAssessment';
import PrintResults from './components/gradeBook/PrintResults';
import ReviewAndPublishResults from './components/gradeBook/ReviewAndPublishResults';
import ScoreEntry from './components/gradeBook/ScoreEntry';
import ScoreEntryMain from './components/gradeBook/ScoreEntryMain';
import UpdateCognitiveSkills from './components/gradeBook/UpdateStudentCognitiveSkills';
import ClassCognitiveAssessment from './components/gradeBook/ClassCognitiveAssessment';
import ReviewAndPublishOptions from './components/gradeBook/ReviewAndPublishOptions';
import PublishResultForm from './components/gradeBook/PublishResults';
import People from './components/people/People';
import BulEnrollStudent from "./components/people/students/BulkEnrollStudents"
import GuardiansTable from './components/people/parents/GuardiansTable';
import AddGuardianForm from './components/people/parents/AddGuardian';
import NewStaff from './components/people/staffs/NewStaff';
import StaffTable from './components/people/staffs/AllStaffs';
import Academics from "./components/academics/Academics";
import ClassDataGrid from "./components/academics/classes/ClassDataGrid";
import useInactivityTracker from "./utils/useInactivityTracker";
import { useNavigate, useLocation } from "react-router-dom";
import LoginPage from "./components/auth/LoginPage";
import ForgotPassword from "./components/auth/ForgotPassword";
import AddClass from "./components/academics/classes/AddClass";
import AllSubjects from "./components/academics/subjects/AllSubjects";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import StudentEnrollment from "./components/people/students/StudentEnrollment";
import ViewStudents from "./components/people/students/ViewStudents";
import { APIContext } from "./utils/contexts/ReactContext";
import LoadingScreen from "./utils/component/LoadingScreen";
import StudntEnroll from "./components/people/students/StudntEnroll";
import StudentDetailPage from "./components/people/students/StudentDetailPage";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const App: React.FC = (props: { disableCustomTheme?: boolean }) => {
  const location = useLocation()
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    // Read the initial lock state from localStorage
    return localStorage.getItem("isLocked") === "true";
  });
  const navigate = useNavigate();

  const handleUnlock = () => {
    setIsLocked(false); // Unlock logic
    localStorage.setItem("isLocked", "false");
    console.log("System unlocked");

    // Restore URL and scroll position
    const savedURL = localStorage.getItem("savedURL");
    const savedScrollPosition = localStorage.getItem("savedScrollPosition");

    if (savedURL) {
      navigate(savedURL);
      localStorage.removeItem("savedURL");
    }

    if (savedScrollPosition) {
      const [x, y] = savedScrollPosition.split(",").map(Number);
      window.scrollTo(x, y);
      localStorage.removeItem("savedScrollPosition");
    }
  };

  // const handleInactive = () => {
  //   if (!isLocked) { // Prevent re-triggering if already locked
  //     setIsLocked(true);
  //     localStorage.setItem("isLocked", "true"); // Persist the locked state
  //     navigate("/lock-screen"); // Redirect to lock screen
  //   }
  // };

  const handleInactive = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.log("No access token found. Inactivity lock is disabled.");
      return; // Exit if no token is found
    }
  
    if (!isLocked) { // Prevent re-triggering if already locked

       // Save current URL and scroll position
       localStorage.setItem("savedURL", location.pathname);
       localStorage.setItem(
         "savedScrollPosition",
         `${window.scrollX},${window.scrollY}`
       );
      setIsLocked(true);
      localStorage.setItem("isLocked", "true"); // Persist the locked state
      navigate("/lock-screen"); // Redirect to lock screen
    }
  };
  
  const isAuthPage =
    location.pathname === "/auth/login" ||
    location.pathname === "/auth/forgot-password";
  // Track user inactivity (30 seconds)
  useInactivityTracker(5000, handleInactive, isLocked ||isAuthPage);

  

  React.useEffect(()=>{
    console.log(`Current page is ${window.location.href}`)
  })


  const isSmallScreen = useMediaQuery("(max-width: 1045px)")
  const [showPreloader, setShowPreloader] = React.useState<boolean>(true)
  React.useEffect(()=>{
    setTimeout(()=>{
      setShowPreloader(false)
    }, 3000)
  }, [])

  const context = React.useContext(APIContext)
  if(!context){
    throw new Error("A context was not found!")
  }

  const {studentsManagementDetails, setStudentsManagementDetails} = context;

  return (
    <div>
      {isLocked ? (
        <LockScreen onUnlock={handleUnlock} />
      ) : (
        <AppTheme {...props} themeComponents={xThemeComponents}>
        <CssBaseline enableColorScheme />
        {showPreloader ? <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', width:'100vw', height:'100vh'}}>
          <Box sx={{display:'flex', flexDirection:'column',justifyContent:'center', alignItems:'center', width:!isSmallScreen ?'80%':'90%', height:!isSmallScreen ?'80%':null}}>
            <img src="/images/preloaderlogo.jpg" style={{width: !isSmallScreen ?'250px':'150px'}} />
            <Typography variant='h1' component={'h1'} sx={{fontWeight:!isSmallScreen?900:700, color:'#03045E', letterSpacing:!isSmallScreen?'15px':'5px'}}>SKUUNI</Typography>
            <Typography variant='subtitle1' component={'p'} sx={{fontWeight:700, color:'#03045E', letterSpacing:'3px', textAlign:'center'}}>School Management App</Typography>
            <img src="/images/loading.gif" style={{marginTop:'1rem'}} />
          </Box>
        </Box>:<Box sx={{ display: 'flex', position:'relative' }}>
          {studentsManagementDetails.isLoading && <LoadingScreen />}
        {!isAuthPage &&
                (
                <>
                  <SideMenu />
                  <AppNavbar />
                </>
              )}
          {/* Main content */}
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: theme
                ? 'rgba(255, 255, 255, 1)'
                : 'rgba(255, 87, 51, 1)',
              overflow: 'auto',
            })}
          >
            <Stack
              spacing={2}
              sx={{
                alignItems: 'center',
                mx: 3,
                pb: 5,
                mt: { xs: 8, md: 0 },
              }}
            >
              {!isAuthPage &&
                   (
                    <Header />
                  )}
                <Routes>
                  <Route path='/auth/login' element = {<LoginPage />} />
                  <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                  <Route element={<ProtectedRoute />}>
                      <Route path='/' element = {<MainGrid />} />
                      <Route path='/people' element={<People />} />
                      <Route path='/people/students' element={<ViewStudents />} />
                      <Route path='/people/student/:id' element={<StudentDetailPage />} />
                      <Route path='/people/students/addStudent' element={<StudentAddForm />} />
                      <Route path='/people/students/enrollment' element={<StudentEnrollment />} />
                      <Route path='/people/students/bulkenroll' element={<BulEnrollStudent />} />
                      <Route path='/people/parents' element={<GuardiansTable />} />
                      <Route path='/people/addParents' element={<AddGuardianForm />} />
                      <Route path='/people/staffs' element={<StaffTable />} />
                      <Route path='/people/staffs/new-staff' element={<NewStaff />} />
                      <Route path='/people/staffs/newStaff' element={<NewStaff />} />
                      <Route path='/academics' element={<Academics />} />
                      <Route path='/academics/classes' element={<ClassDataGrid />} />
                      <Route path='/academics/classes/addClass' element={<AddClass />} />
                      <Route path='/academics/subject-list' element={<AllSubjects />} />
                      <Route path='/studentPromotion' element={<StudentPromotion />} />
                      <Route path='/exams-report' element={<GradeBook />} />
                      <Route path='/annualPromotionalReport' element={<AnnualPromotion />} />
                      <Route path='/viewStudentCognitiveSkill' element={<CognitiveSkillsAssessment />} />
                      <Route path='/updateStudentCognitiveSkill' element={<UpdateCognitiveSkills />} />
                      <Route path='/cognitiveAssessment' element={<ClassCognitiveAssessment />} />
                      <Route path='/printResults' element={<PrintResults />} />
                      <Route path='/Review&PublishResultsOptions' element={<ReviewAndPublishOptions />} />
                      <Route path='/Review&PublishResults' element={<ReviewAndPublishResults />} />
                      <Route path='/publishResults' element={<PublishResultForm />} />
                      <Route path='/scoreEntryOptions' element={<ScoreEntry />} />
                      <Route path='/studentScoreEntry' element={<ScoreEntryMain />} />
                  </Route>
                </Routes>
            </Stack>
          </Box>
        </Box>}
      </AppTheme>
      )}
    </div>
  );
};

export default App;



