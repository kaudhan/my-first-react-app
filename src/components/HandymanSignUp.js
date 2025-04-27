import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Alert, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Checkbox,
  Chip
} from '@mui/material';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const HandymanSignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    experience: '',
    hourlyRate: '',
    skills: [],
    bio: '',
    location: '',
    isAvailable: true,
    availability: {
      days: [],
      startTime: '09:00',
      endTime: '17:00'
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value;
    setFormData(prev => ({
      ...prev,
      skills: typeof skills === 'string' ? skills.split(',') : skills
    }));
  };

  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Please log in to sign up as a handyman');
      }

      // Validate required fields
      if (!formData.name || !formData.experience || !formData.hourlyRate || !formData.skills.length) {
        throw new Error('Please fill in all required fields');
      }

      const handymenRef = collection(db, 'handymen');
      const newHandyman = {
        ...formData,
        userId: user.uid,
        email: user.email,
        rating: 0,
        reviews: 0,
        createdAt: new Date(),
        isAvailable: formData.isAvailable,
        availability: formData.availability
      };

      await addDoc(handymenRef, newHandyman);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving handyman data:', error);
      setError(error.message || 'Error creating your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Become a Handyman
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Years of Experience"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Hourly Rate ($)"
                name="hourlyRate"
                type="number"
                value={formData.hourlyRate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skills (comma separated)"
                name="skills"
                value={formData.skills.join(',')}
                onChange={handleSkillsChange}
                helperText="Enter your skills separated by commas"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Working Hours</InputLabel>
                <Select
                  name="days"
                  multiple
                  value={formData.availability.days}
                  onChange={handleAvailabilityChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Time"
                name="startTime"
                type="time"
                value={formData.availability.startTime}
                onChange={handleAvailabilityChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Time"
                name="endTime"
                type="time"
                value={formData.availability.endTime}
                onChange={handleAvailabilityChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                  />
                }
                label="Currently Available for Work"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Creating Profile...' : 'Create Handyman Profile'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default HandymanSignUp;
