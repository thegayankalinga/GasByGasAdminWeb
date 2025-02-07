import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useRoutes, useNavigate } from 'react-router-dom';
import { grey } from '@mui/material/colors';

export default function NotFound() {
  const primary = grey[500]; 
  const navigate = useNavigate();
  return (

    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: primary,
      }}
    >
      <Typography variant="h1" style={{ color: 'white' }}>
        404
      </Typography>
      <Typography variant="h6" style={{ color: 'white' }}>
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button onClick={() => navigate('/')} variant="contained">Back Home</Button>
    </Box>
  );
}