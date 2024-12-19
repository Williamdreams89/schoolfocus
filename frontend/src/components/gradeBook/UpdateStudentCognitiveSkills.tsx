import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  TextField,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from '@mui/material';

const UpdateCognitiveSkills: React.FC = () => {
  // State for Affective Skills
  const [affectiveSkills, setAffectiveSkills] = useState({
    punctuality: 4,
    attentiveness: 2,
    neatness: 4,
    honesty: 3,
    politeness: 4,
    perseverance: 4,
  });

  // Handle skill change
  const handleSkillChange = (skill: string, value: number) => {
    setAffectiveSkills((prev) => ({ ...prev, [skill]: value }));
  };

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitted Data:', affectiveSkills);
    alert('Form submitted successfully!');
  };

  return (
    <Box
      p={4}
      bgcolor="#f9f9f9"
      borderRadius={2}
      boxShadow={2}
      mx="auto"
      sx={{width:'100%'}}
    >
      {/* Header */}
      <Typography
        variant="h6"
        color="primary"
        textAlign="center"
        sx={{ mb: 4, fontWeight: 600 }}
      >
        Update Student Cognitive Skills
      </Typography>

      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={4}>
          {/* Student Info Section */}
          <Grid item xs={12} md={4}>
            <Box textAlign="center" mb={4}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  margin: 'auto',
                  bgcolor: '#1976d2',
                }}
              >
                <Typography variant="h5" color="white">
                  DS
                </Typography>
              </Avatar>
              <Typography
                variant="h6"
                color="textPrimary"
                sx={{ mt: 2, fontWeight: 600 }}
              >
                DEMO STUDENT
              </Typography>
            </Box>

            {/* Student Details */}
            <Box>
              {[
                { label: 'Name', value: 'DEMO STUDENT' },
                { label: 'Registration No.', value: '000' },
                { label: 'Gender', value: 'Female' },
                { label: 'Category/Group', value: 'Junior' },
                { label: 'Current Class', value: 'JS1' },
                { label: 'Class Division', value: 'A' },
                { label: 'Roll No.', value: '001' },
              ].map((field) => (
                <TextField
                  key={field.label}
                  label={field.label}
                  value={field.value}
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                  InputProps={{ readOnly: true }}
                />
              ))}
            </Box>
          </Grid>

          {/* Affective Skills Section */}
          <Grid item xs={12} md={8}>
            <Typography
              variant="h6"
              color="textPrimary"
              sx={{ mb: 3, fontWeight: 600 }}
            >
              Affective Skills
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {/* Skills List */}
            {[
              { label: 'Punctuality', key: 'punctuality' },
              { label: 'Attentiveness', key: 'attentiveness' },
              { label: 'Neatness', key: 'neatness' },
              { label: 'Honesty', key: 'honesty' },
              { label: 'Politeness', key: 'politeness' },
              { label: 'Perseverance', key: 'perseverance' },
            ].map((skill) => (
              <Box key={skill.key} sx={{ mb: 3 }}>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 500, color: '#555' }}
                    >
                      {skill.label}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <RadioGroup
                      row
                      value={affectiveSkills[skill.key as keyof typeof affectiveSkills]}
                      onChange={(e) =>
                        handleSkillChange(
                          skill.key,
                          parseInt(e.target.value, 10)
                        )
                      }
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <FormControlLabel
                          key={i + 1}
                          value={i + 1}
                          control={<Radio size="small" />}
                          label={String(i + 1)}
                          sx={{ mr: 1 }}
                        />
                      ))}
                    </RadioGroup>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Box mt={4} textAlign="right">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ px: 5, py: 1 }}
          >
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdateCognitiveSkills;
