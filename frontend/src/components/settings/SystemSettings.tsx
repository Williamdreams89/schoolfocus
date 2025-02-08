import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Backdrop,
  Box,
  Button,
  Card,
  Divider,
  Slide,
  Tab,
  TableContainer,
  Typography,
} from "@mui/material";
import { FiPlusSquare, FiSettings } from "react-icons/fi";
import React from "react";
import { Shuffle } from "@mui/icons-material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  NativeSelect,
  SimpleGrid,
  TextInput,
  Button as ManButton,
} from "@mantine/core";
import { TermSessionProps } from "../people/students/types";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TransitionProps } from '@mui/material/transitions';
import { APIContext } from "../../utils/contexts/ReactContext";
import axios from "axios";
import NavBreadCrumbs from "../NavbarBreadcrumbs";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface DataProps{
  label: string;
  value: string
}

interface AcademicTerm{
  id: any;
  _session: string;
  start_year: string;
  end_year : string;
  is_active: any
}


const SystemSettings: React.FC<TermSessionProps> = ({academicSettingsData, academicSessionSettingsData}) => {
  const [value, setValue] = React.useState("1");
  const [imagePreview, setImagePreview] = React.useState<string>("/images/logo.png");
  const [imagePreview2, setImagePreview2] = React.useState<string>("/images/pale-education.png");
  const [imagePreview3, setImagePreview3] = React.useState<string>("/images/logo.png");
  const [rowTerm, setRowTerm] = React.useState<any>([])
  const [rowSession, setRowSession] = React.useState<any>([])
  const [fetchedSessions, setFetchedSessions] = React.useState<DataProps []>([])
  const [selectedSession, setSelectedSession] = React.useState<any>("")
  const [selectedYear, setSelectedYear] = React.useState<any>("")
  const [selectedTerm, setSelectedTerm] = React.useState<any>("")
  const [fetchedAcademicYear, setFetchedAcademicYear] = React.useState<any>()
  const [fetchedAcademicTerms, setFetchedAcademicTerms] = React.useState<{ value: string; label: string }[]>([]) 
  const [termSwitcherOpen,setTermSwitcherOpen] = React.useState<boolean>(false)

  const [activeAcademicData, setActiveAcademic] = React.useState<any>()
    React.useEffect(() => {
      if (academicSettingsData && Array.isArray(academicSettingsData)) {
        const activeTerm = academicSettingsData.find((term: AcademicTerm) => term.is_active === true);
        console.log("mappppa=", activeTerm);
        setActiveAcademic(activeTerm)
      } else {
        console.log("academicSettingsData is not an array:", academicSettingsData);
      }
    }, [academicSettingsData]);
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const context = React.useContext(APIContext)
  if(!context){
    throw new Error('There must be context')
  }
  const {studentsManagementDetails, setStudentsManagementDetails} = context

  const handleSwitchOver = async (event: React.FormEvent) => {
    event.preventDefault()
    if(new String(selectedSession).length>0,new String(selectedYear).length>0, new String(selectedTerm).length>0){
      try{
        setStudentsManagementDetails({...studentsManagementDetails, isLoading:true})
        const {data} = await axios.post(`http://127.0.0.1:8000/api/academic/settings/activate/${selectedSession}/${selectedTerm}/`)
        console.log("Activation data=", data)
        window.location.reload()
        setStudentsManagementDetails({...studentsManagementDetails, isLoading:false})
        setTermSwitcherOpen(false)
      }catch(error){
        setStudentsManagementDetails({...studentsManagementDetails, isLoading:false})
        alert(error)
      }
    } 
    
  }

  React.useEffect(()=>{
    console.log("dataaaapaaa=", academicSessionSettingsData)
  }, [])

  React.useEffect(()=>{
    setRowTerm(academicSettingsData)
    setRowSession(academicSessionSettingsData)
    const sessionList = rowSession.map((session:any)=>({label:session._session, value: session.id}))
    setFetchedSessions(sessionList)
  },[handleSwitchOver])


  const columns : GridColDef<(typeof rowTerm)[number]>[] = [
    {field: "id", headerName:'ID'},
    {
      field: "term_name",
      headerName: "Term Name",
      width: 180, 
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "_session",
      headerName: "Session",
      width: 180,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "is_active",
      headerName: "Status",
      width: 180,
      editable: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<any>) =>{
        const status = params.value as boolean
        return <div>
          {status === false?<div></div>: <Button variant="outlined" size="small" sx={{width:'180px', margin:'auto'}}>Active Academic Session</Button>}
        </div>
      }
    },
  ]
  const columnsSessions: GridColDef<(typeof rowSession)[number]>[] = [
    { field: "id", headerName: "ID" },
    {
      field: "_session",
      headerName: "Session",
      width: 180,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "start_year",
      headerName: "Start Year",
      width: 180,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "end_year",
      headerName: "End Year",
      // type: "number",
      width: 180,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "is_active",
      headerName: "Status",
      sortable: false,
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<any>) =>{
        const status = params.value
        return <div>
          {status === false?<div></div>: <Button variant="outlined" size="small" sx={{width:'180px', margin:'auto'}}>Active Academic Session</Button>}
        </div>
      }
    },
  ];

  return (
    <React.Fragment>
      <NavBreadCrumbs academicSessionSettingsData={academicSessionSettingsData} academicSettingsData={academicSettingsData} items={[{label: "General Settings"}]} />
      <TabContext value={value}>
        <TabList variant="fullWidth" onChange={handleTabChange}>
          <Tab label="Academic Session" sx={{ width: "10rem" }} value={"1"} />
          <Tab label="System Settings" sx={{ width: "10rem" }} value={"2"} />
          <Tab label="Image Settings" sx={{ width: "10rem" }} value={"3"} />
          <Tab label="Email" sx={{ width: "10rem" }} value={"4"} />
          <Tab label="SMS" sx={{ width: "10rem" }} value={"5"} />
          <Tab label="User Privileges" sx={{ width: "10rem" }} value={"6"} />
        </TabList>
        <TabPanel sx={{ width: "100%" }} value={"1"}>
          <Card sx={{ backgroundColor: "white" }}>
            <Box
              sx={{
                display: "flex",
                gap: "3rem",
                alignItems: "center",
                justifyContent: "left",
                border: "1px solid #eaeaea",
                padding: "1.3rem",
              }}
            >
              <Box
                sx={{
                  border: "1px solid black",
                  borderRadius: "2rem",
                  padding: "15px",
                  width: "fit-content",
                  boxShadow: "10px 10px 5px 0px rgba(0,0,0,0.75);-webkit-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);-moz-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75)"
                }}
              >
                <p>
                  Active Academic Session:{" "}
                  <span style={{ fontWeight: 900 }}>{activeAcademicData?._session}</span>
                </p>
                <p>
                  Active Academic Year:{" "}
                  <span style={{ fontWeight: 900 }}>{new String(activeAcademicData?._session).split("-")[0]}</span>
                </p>
                <p>
                  Active Academic Term:{" "}
                  <span style={{ fontWeight: 900 }}>{activeAcademicData?.term_name}</span>
                </p>
              </Box>
              <Button onClick={()=>setTermSwitcherOpen(true)} variant="contained">
                <Shuffle />
                <span>Switch Session/Term</span>
              </Button>
              {termSwitcherOpen &&<Dialog
        open={termSwitcherOpen}
        onClose={()=>setTermSwitcherOpen(false)}
        maxWidth = {'lg'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{
          sx:{
            position:'absolute', 
            top:'10%',
            padding:'2rem'
          }
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Change Academic Session / Term"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SimpleGrid cols={{ base: 1, sm: 1, lg: 3 }}
      spacing={{ base: 10, sm: 'md' }}
      verticalSpacing={{ base: 'md', sm: 'xl' }}>
        <NativeSelect style={{width:'300px'}} label = "Active Academic Session" data={fetchedSessions.map((session)=>({value: session.value, label:session.label}))} onChange={(event)=>{setSelectedSession(event.target.value); alert(`${event.target.value}`); 
        const academicYearFetch = async () => {
          try{
            setStudentsManagementDetails({...studentsManagementDetails, isLoading: true})
            const response = await axios.get(`http://127.0.0.1:8000/api/academic-sessions/${event.target.value}/`) 
            setFetchedAcademicYear(response.data.academic_year)
            setSelectedYear(response.data.academic_year)
            console.log('aca yearsss =', response.data.academic_year)
            setStudentsManagementDetails({...studentsManagementDetails, isLoading: false})
          }catch(error){
            setStudentsManagementDetails({...studentsManagementDetails, isLoading: false})
            alert("Network error")
          }
        };
        const academicTermsFetch = async () => {
          try{
            setStudentsManagementDetails({...studentsManagementDetails, isLoading: true})
            const response = await axios.get(`http://127.0.0.1:8000/api/academic-terms-by-session/${event.target.value}/`) 
            setFetchedAcademicTerms(response.data.map((term: any) => ({ value: term.id, label: term.term_name })))
            console.log('aca yearsss =', response.data.academic_year)
            setStudentsManagementDetails({...studentsManagementDetails, isLoading: false})
          }catch(error){
            setStudentsManagementDetails({...studentsManagementDetails, isLoading: false})
            alert("Network error")
          }
        };
        academicTermsFetch()
        academicYearFetch()
      }} />
        <NativeSelect style={{width:'300px'}} label = "Active Academic Year" data={fetchedAcademicYear ? [{ value: fetchedAcademicYear, label: fetchedAcademicYear }] : [{ value: "", label: "Select Academic Year" }]} onChange={(event)=>{alert(`${event.target.value}`)}}  />
        <NativeSelect style={{width:'300px'}} label = "Active Academic Term" data={fetchedAcademicTerms.length > 0 ? fetchedAcademicTerms : [{ value: "", label: "Select Term" }]} onChange={(event)=>{setSelectedTerm(event.target.value)}} />
      </SimpleGrid>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <ManButton onClick={handleSwitchOver}>
          {studentsManagementDetails.isLoading=== true?"...please wait":"Switch Over"}
          </ManButton>
        </DialogActions>
      </Dialog>}
            </Box>
            <Box
              sx={{
                mt: ".3rem",
                mb: ".3rem",
                padding: "1.3rem",
                border: "1px solid #eaeaea",
              }}
            >
              <h1>Academic Session List</h1>
              <Divider sx={{ mt: "2rem", mb: "2rem" }} />
              <Box sx={{ width: "fit-content" }}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                    mb: "2rem",
                  }}
                >
                  <Button variant="contained" size="small">
                    <FiPlusSquare />
                    Create New Academic Session
                  </Button>
                </Box>
                <DataGrid
                  rows={rowSession}
                  columns={columnsSessions}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  disableRowSelectionOnClick
                />
              </Box>
            </Box>
            <Box
              sx={{
                mt: "2.3rem",
                border: "1px solid #eaeaea",
                padding: "1.3rem",
              }}
            >
              <h1>Academic Terms List</h1>
              <Divider sx={{ mt: "2rem", mb: "2rem" }} />
              <Box sx={{ width: "fit-content" }}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                    mb: "2rem",
                  }}
                >
                  <Button variant="contained" size="small">
                    <FiPlusSquare />
                    Create New Academic Term
                  </Button>
                </Box>
                <DataGrid
                  rows={rowTerm}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  disableRowSelectionOnClick
                />
              </Box>
            </Box>
          </Card>
        </TabPanel>
        <TabPanel sx={{ width: "100%" }} value={"2"}>
          <Box sx={{ padding: "2rem", border: "1px solid #eaeaea" }}>
            <Typography variant="h3" sx={{ mb: "1rem" }}>
              {" "}
              <FiSettings /> System Settings
            </Typography>
            <Divider sx={{ mb: "2rem" }} />
            <SimpleGrid
              cols={{ base: 1, sm: 1, lg: 2 }}
              spacing={{ base: 10, sm: "xl" }}
              verticalSpacing={{ base: "md", sm: "xl" }}
              style={{ border: "1px solid #eaeaea", padding: "2rem" }}
              component={"form"}
            >
              <NativeSelect
                label="Active Services"
                data={["", "School Portal and Website", "School Portal Only"]}
                required
              />
              <TextInput label="School Name" />
              <TextInput label="School Motto / Slogan / Tagline" />
              <TextInput label="Our Mission" />
              <TextInput label="Our Vision" />
              <TextInput label="Our Core Values" />
              <TextInput label="School Email" />
              <TextInput label="School Phone" />
              <TextInput label="Fees Payment Support Contact Desk" />
              <TextInput label="School Address" />
              <TextInput label="Country" />
              <TextInput label="City/State" />
              <TextInput label="Currency Symbol" />
              <NativeSelect
                data={["", "Enable", "Disable"]}
                label="Absence on Attendance SMS to Parent"
              />
              <TextInput label="School Head staff title" />
            </SimpleGrid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                mt: "2rem",
              }}
            >
              <ManButton>Save</ManButton>
            </Box>
          </Box>
        </TabPanel>
        <TabPanel sx={{ width: "100%" }} value={"3"}>
          <Box>
            <Typography variant="h2">Image Settings</Typography>
          </Box>

          <Divider />
          <SimpleGrid
            cols={{ base: 1, sm: 1, lg: 3 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
            style={{ padding: "2rem" }}
          >
            <Box style={{ border: "1px solid #eaeaea", padding: "2rem", display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }}>
            <h2>School Logo</h2>
            <img
                src={imagePreview}
                style={{ width: "200px", height: "200px", border:'1px solid #eaeaea' }}
                alt="some-img"
              />
              <button style={{ width: "200px", position: "relative" }}>
                Select Image
                <input
                  type="file"
                  accept="image/*"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
              </button>
            </Box>
            <Box style={{ border: "1px solid #eaeaea", padding: "2rem", display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }}>
            <h3>Additional Logo for Results</h3>
            <img
                src={imagePreview2}
                style={{ width: "200px", height: "200px", border:'1px solid #eaeaea' }}
                alt="some-img"
              />
              <button style={{ width: "200px", position: "relative" }}>
                Select Image
                <input
                  type="file"
                  accept="image/*"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
              </button>
            </Box>
            <Box style={{ border: "1px solid #eaeaea", padding: "2rem", display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }}>
            <h2>Site Icon</h2>
            <img
                src={imagePreview3}
                style={{ width: "200px", height: "200px", border:'1px solid #eaeaea' }}
                alt="some-img"
              />
              <button style={{ width: "200px", position: "relative" }}>
                Select Image
                <input
                  type="file"
                  accept="image/*"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
              </button>
            </Box>
          </SimpleGrid>
        </TabPanel>
        <TabPanel sx={{ width: "100%" }} value={"4"}>
          <Card
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "400px",
                height: "400px",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Typography variant="h1">404</Typography>
              <Typography variant="h6">Page Under Development</Typography>
            </Box>
          </Card>
        </TabPanel>
        <TabPanel sx={{ width: "100%" }} value={"5"}>
          <Card
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "400px",
                height: "400px",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Typography variant="h1">404</Typography>
              <Typography variant="h6">Page Under Development</Typography>
            </Box>
          </Card>
        </TabPanel>
      </TabContext>
    </React.Fragment>
  );
};

export default SystemSettings;
