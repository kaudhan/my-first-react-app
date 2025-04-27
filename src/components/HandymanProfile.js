import React from 'react';
import { Box, Typography, Paper, Grid, Avatar, Rating } from '@mui/material';
import { LocationOn, Work, Star } from '@mui/icons-material';

const HandymanProfile = ({ handyman }) => {
  if (!handyman) return null;

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar
              src={handyman.photoURL}
              alt={handyman.displayName}
              sx={{ width: 150, height: 150, mb: 2 }}
            />
            <Typography variant="h5" component="h2" gutterBottom>
              {handyman.displayName}
            </Typography>
            <Rating value={handyman.rating || 0} readOnly precision={0.5} />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography paragraph>
              {handyman.bio || 'No bio available'}
            </Typography>
            
            <Box display="flex" alignItems="center" mb={1}>
              <LocationOn color="action" sx={{ mr: 1 }} />
              <Typography>
                {handyman.location || 'Location not specified'}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" mb={1}>
              <Work color="action" sx={{ mr: 1 }} />
              <Typography>
                {handyman.skills?.join(', ') || 'No skills specified'}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center">
              <Star color="action" sx={{ mr: 1 }} />
              <Typography>
                {handyman.experience || '0'} years of experience
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HandymanProfile;