import React, { useState } from "react";
import {
  Box,
  Card,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  useMediaQuery,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material/styles";

const StudentEnrollmentRaw = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState<number | false>(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Handle tab changes
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // Handle accordion expansion
  const handleAccordionChange = (panel: number) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  return (
    <Card sx={{ padding: 2, marginTop: 2 }}>
      {isSmallScreen ? (
        <>
          {/* Accordion Panel 1 */}
          <Accordion
            expanded={expandedAccordion === 0}
            onChange={handleAccordionChange(0)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel0-content"
              id="panel0-header"
            >
              <Typography>Parent/Guardian Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Parent/Guardian Information Content</Typography>
            </AccordionDetails>
          </Accordion>

          {/* Accordion Panel 2 */}
          <Accordion
            expanded={expandedAccordion === 1}
            onChange={handleAccordionChange(1)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography>Student Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Student Information Content</Typography>
            </AccordionDetails>
          </Accordion>

          {/* Accordion Panel 3 */}
          <Accordion
            expanded={expandedAccordion === 2}
            onChange={handleAccordionChange(2)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>Contact Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Contact Information Content</Typography>
            </AccordionDetails>
          </Accordion>

          {/* Accordion Panel 4 */}
          <Accordion
            expanded={expandedAccordion === 3}
            onChange={handleAccordionChange(3)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <Typography>Address Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Address Information Content</Typography>
            </AccordionDetails>
          </Accordion>
        </>
      ) : (
        <Box>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="Student Enrollment Tabs"
          >
            <Tab label="Parent/Guardian Information" />
            <Tab label="Student Information" />
            <Tab label="Contact Information" />
            <Tab label="Address Information" />
          </Tabs>
          <Box sx={{ padding: 2 }}>
            {tabIndex === 0 && (
              <Typography>Parent/Guardian Information Content</Typography>
            )}
            {tabIndex === 1 && (
              <Typography>Student Information Content</Typography>
            )}
            {tabIndex === 2 && (
              <Typography>Contact Information Content</Typography>
            )}
            {tabIndex === 3 && (
              <Typography>Address Information Content</Typography>
            )}
          </Box>
        </Box>
      )}

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Button
          variant="contained"
          disabled={isSmallScreen ? expandedAccordion === 0 : tabIndex === 0}
          onClick={() =>
            isSmallScreen
              ? setExpandedAccordion((prev) => (prev !== false ? prev - 1 : prev))
              : setTabIndex((prev) => Math.max(prev - 1, 0))
          }
        >
          Previous
        </Button>
        <Button
          variant="contained"
          disabled={
            isSmallScreen
              ? expandedAccordion === 3
              : tabIndex === 3
          }
          onClick={() =>
            isSmallScreen
              ? setExpandedAccordion((prev) => (prev !== false ? prev + 1 : prev))
              : setTabIndex((prev) => Math.min(prev + 1, 3))
          }
        >
          Next
        </Button>
      </Box>
    </Card>
  );
};

export default StudentEnrollmentRaw;
