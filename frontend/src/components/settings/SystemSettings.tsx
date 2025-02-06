import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Box,
  Button,
  Card,
  Divider,
  Tab,
  TableContainer,
  Typography,
} from "@mui/material";
import { FiPlusSquare, FiSettings } from "react-icons/fi";
import React from "react";
import { Shuffle } from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  NativeSelect,
  SimpleGrid,
  TextInput,
  Button as ManButton,
} from "@mantine/core";

const SystemSettings = () => {
  const [value, setValue] = React.useState("1");
  const [imagePreview, setImagePreview] = React.useState<string>("/images/logo.png");
  const [imagePreview2, setImagePreview2] = React.useState<string>("/images/pale-education.png");
  const [imagePreview3, setImagePreview3] = React.useState<string>("/images/logo.png");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "ID" },
    {
      field: "session",
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
      type: "number",
      width: 180,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
  ];

  const rows = [
    {
      id: 1,
      session: "2023-2024",
      start_year: "2023",
      end_year: "2024",
      status: false,
    },
    {
      id: 2,
      session: "2023-2024",
      start_year: "2023",
      end_year: "2024",
      status: false,
    },
    {
      id: 3,
      session: "2023-2024",
      start_year: "2023",
      end_year: "2024",
      status: false,
    },
    {
      id: 4,
      session: "2023-2024",
      start_year: "2023",
      end_year: "2024",
      status: false,
    },
    {
      id: 5,
      session: "2023-2024",
      start_year: "2023",
      end_year: "2024",
      status: false,
    },
    {
      id: 6,
      session: "2023-2024",
      start_year: "2023",
      end_year: "2024",
      status: false,
    },
  ];
  return (
    <React.Fragment>
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
                  <span style={{ fontWeight: 900 }}>2025-2026</span>
                </p>
                <p>
                  Active Academic Year:{" "}
                  <span style={{ fontWeight: 900 }}>2025</span>
                </p>
                <p>
                  Active Academic Term:{" "}
                  <span style={{ fontWeight: 900 }}>2025</span>
                </p>
              </Box>
              <Button variant="contained">
                <Shuffle />
                <span>Switch Session/Term</span>
              </Button>
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
                  rows={rows}
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
                  rows={rows}
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
