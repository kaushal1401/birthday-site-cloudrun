import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const RSVPForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guestType: 'adult',
    childAge: '',
    message: '',
    attending: 'yes'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate child age if guest type is child
      if (formData.guestType === 'child') {
        const age = parseInt(formData.childAge);
        if (!age || age < 5 || age > 10) {
          setError('Child age must be between 5-10 years');
          setLoading(false);
          return;
        }
      }

      // Submit to Firestore
      await addDoc(collection(db, 'rsvps'), {
        ...formData,
        childAge: formData.guestType === 'child' ? parseInt(formData.childAge) : null,
        timestamp: serverTimestamp(),
        status: 'confirmed'
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        guestType: 'adult',
        childAge: '',
        message: '',
        attending: 'yes'
      });
    } catch (err) {
      console.error('Error submitting RSVP:', err);
      setError('Failed to submit RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        🎉 RSVP for the Birthday Party! 🎂
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Full Name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
          sx={{ mb: 3 }}
        />

        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend">Will you be attending?</FormLabel>
          <RadioGroup
            value={formData.attending}
            onChange={(e) => handleInputChange('attending', e.target.value)}
            row
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes, I'll be there! 🎉" />
            <FormControlLabel value="no" control={<Radio />} label="Sorry, can't make it 😢" />
          </RadioGroup>
        </FormControl>

        {formData.attending === 'yes' && (
          <>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Guest Type</FormLabel>
              <RadioGroup
                value={formData.guestType}
                onChange={(e) => handleInputChange('guestType', e.target.value)}
              >
                <FormControlLabel 
                  value="adult" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>Adult</span>
                      <Chip label="18+" size="small" color="primary" />
                    </Box>
                  }
                />
                <FormControlLabel 
                  value="child" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>Child</span>
                      <Chip label="5-10 years" size="small" color="secondary" />
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            {formData.guestType === 'child' && (
              <TextField
                fullWidth
                label="Child's Age"
                type="number"
                value={formData.childAge}
                onChange={(e) => handleInputChange('childAge', e.target.value)}
                required
                inputProps={{ min: 5, max: 10 }}
                helperText="Age must be between 5-10 years"
                sx={{ mb: 3 }}
              />
            )}

            <TextField
              fullWidth
              label="Special Message (Optional)"
              multiline
              rows={3}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Share your excitement for the birthday celebration!"
              sx={{ mb: 3 }}
            />
          </>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
          sx={{ py: 2 }}
        >
          {loading ? 'Submitting...' : 'Submit RSVP 🎈'}
        </Button>
      </Box>

      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          RSVP submitted successfully! Can't wait to celebrate with you! 🎉
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default RSVPForm;