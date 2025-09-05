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
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import { 
  Add as AddIcon, 
  Remove as RemoveIcon,
  PersonOutlined,
  ChildCareOutlined
} from '@mui/icons-material';
import { rsvpService } from '../services/firestoreService';

const RSVPForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    adultCount: 1,
    childrenCount: 0, // Simple count instead of array
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

  const handleAdultCountChange = (increment) => {
    setFormData(prev => ({
      ...prev,
      adultCount: Math.max(1, prev.adultCount + (increment ? 1 : -1))
    }));
  };

  const handleChildrenCountChange = (increment) => {
    setFormData(prev => ({
      ...prev,
      childrenCount: Math.max(0, prev.childrenCount + (increment ? 1 : -1))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        setError('Name is required');
        setLoading(false);
        return;
      }

      if (formData.attending === 'no' && !formData.message.trim()) {
        setError('Please provide a birthday message');
        setLoading(false);
        return;
      }

      // Validate mobile number format (basic validation)
      if (formData.mobile && !/^\+?[\d\s\-()]{10,15}$/.test(formData.mobile.replace(/\s/g, ''))) {
        setError('Please enter a valid mobile number');
        setLoading(false);
        return;
      }

      // Submit to Firestore
      await rsvpService.createRSVP({
        name: formData.name,
        mobile: formData.mobile,
        adultCount: formData.adultCount,
        childrenCount: formData.childrenCount,
        message: formData.message,
        attending: formData.attending
      });

      setSuccess(true);
      if (onSuccess) {
        onSuccess(formData.attending === 'no' ? 'Birthday message sent successfully! 💌' : 'RSVP submitted successfully! 🎉');
      }
      
      setFormData({
        name: '',
        mobile: '',
        adultCount: 1,
        childrenCount: 0,
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
    <Box sx={{ 
      width: '100%',
      maxWidth: '100%', 
      margin: '0 auto',
      px: { xs: 1, sm: 2 }, // Reduced padding on mobile
      overflowX: 'hidden' // Prevent horizontal scroll
    }}>
      {/* RSVP Form */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
          mb: 4, 
          backgroundColor: 'white',
          borderRadius: 3,
          maxWidth: '100%',
          overflow: 'hidden'
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          align="center" 
          color="primary"
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }, // Responsive font size
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 700,
            mb: { xs: 2, sm: 3 }
          }}
        >
          🎉 RSVP for the Birthday Party! 🎂
        </Typography>
        
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ 
            mt: { xs: 2, sm: 3 },
            width: '100%',
            maxWidth: '100%'
          }}
        >
          <TextField
            fullWidth
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            sx={{ 
              mb: { xs: 2, sm: 3 },
              '& .MuiInputBase-root': {
                fontSize: { xs: '16px' } // Prevent zoom on iOS
              }
            }}
            inputProps={{
              style: { fontSize: '16px' } // Additional iOS zoom prevention
            }}
          />

          <TextField
            fullWidth
            label="Mobile Number (Optional)"
            type="tel"
            value={formData.mobile}
            onChange={(e) => handleInputChange('mobile', e.target.value)}
            placeholder="+1 (555) 123-4567"
            helperText="Optional for event reminders"
            sx={{ 
              mb: { xs: 2, sm: 3 },
              '& .MuiInputBase-root': {
                fontSize: { xs: '16px' } // Prevent zoom on iOS
              }
            }}
            inputProps={{
              style: { fontSize: '16px' },
              inputMode: 'tel' // Better mobile keyboard
            }}
          />

          <FormControl 
            component="fieldset" 
            sx={{ 
              mb: { xs: 2, sm: 3 },
              width: '100%'
            }}
          >
            <FormLabel 
              component="legend"
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                mb: 1
              }}
            >
              Will you be attending?
            </FormLabel>
            <RadioGroup
              value={formData.attending}
              onChange={(e) => handleInputChange('attending', e.target.value)}
              sx={{
                flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile
                gap: { xs: 1, sm: 0 }
              }}
            >
              <FormControlLabel 
                value="yes" 
                control={<Radio />} 
                label="Yes, I'll be there! 🎉"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
              <FormControlLabel 
                value="no" 
                control={<Radio />} 
                label="Sorry, can't make it 😢"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </RadioGroup>
          </FormControl>

        {formData.attending === 'yes' && (
          <>
            {/* Adult Count Section */}
            <Card sx={{ 
              mb: { xs: 2, sm: 3 }, 
              background: 'linear-gradient(135deg, #FFE5F1 0%, #FFEAA7 100%)',
              borderRadius: 2
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 2, sm: 0 }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                  }}>
                    <PersonOutlined color="primary" />
                    <Typography 
                      variant="h6" 
                      color="primary"
                      sx={{ 
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                        fontWeight: 600
                      }}
                    >
                      Adults
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: { xs: 3, sm: 2 },
                    justifyContent: 'center'
                  }}>
                    <IconButton 
                      onClick={() => handleAdultCountChange(false)}
                      disabled={formData.adultCount <= 1}
                      color="primary"
                      sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                        minWidth: { xs: '44px', sm: '40px' },
                        minHeight: { xs: '44px', sm: '40px' }
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        minWidth: { xs: '60px', sm: '40px' }, 
                        textAlign: 'center',
                        fontSize: { xs: '1.5rem', sm: '1.25rem' },
                        fontWeight: 700,
                        color: 'primary.main'
                      }}
                    >
                      {formData.adultCount}
                    </Typography>
                    <IconButton 
                      onClick={() => handleAdultCountChange(true)}
                      disabled={formData.adultCount >= 10}
                      color="primary"
                      sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                        minWidth: { xs: '44px', sm: '40px' },
                        minHeight: { xs: '44px', sm: '40px' }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Children Section */}
            <Card sx={{ 
              mb: { xs: 2, sm: 3 }, 
              background: 'linear-gradient(135deg, #E8F5E8 0%, #F0E68C 100%)',
              borderRadius: 2
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 2, sm: 0 },
                  mb: 2
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                  }}>
                    <ChildCareOutlined color="secondary" />
                    <Typography 
                      variant="h6" 
                      color="secondary"
                      sx={{ 
                        fontSize: { xs: '0.875rem', sm: '1.25rem' },
                        fontWeight: 600,
                        textAlign: { xs: 'center', sm: 'left' }
                      }}
                    >
                      Children (5-10 years)
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: { xs: 3, sm: 2 },
                    justifyContent: 'center'
                  }}>
                    <IconButton 
                      onClick={() => handleChildrenCountChange(false)}
                      disabled={formData.childrenCount <= 0}
                      color="secondary"
                      sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                        minWidth: { xs: '44px', sm: '40px' },
                        minHeight: { xs: '44px', sm: '40px' }
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        minWidth: { xs: '60px', sm: '40px' }, 
                        textAlign: 'center',
                        fontSize: { xs: '1.5rem', sm: '1.25rem' },
                        fontWeight: 700,
                        color: 'secondary.main'
                      }}
                    >
                      {formData.childrenCount}
                    </Typography>
                    <IconButton 
                      onClick={() => handleChildrenCountChange(true)}
                      disabled={formData.childrenCount >= 10}
                      color="secondary"
                      sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                        minWidth: { xs: '44px', sm: '40px' },
                        minHeight: { xs: '44px', sm: '40px' }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    textAlign: 'center', 
                    fontStyle: 'italic',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    px: { xs: 1, sm: 0 }
                  }}
                >
                  {formData.childrenCount === 0 
                    ? 'No children coming. Use + button to add children.' 
                    : `${formData.childrenCount} ${formData.childrenCount === 1 ? 'child' : 'children'} coming to the party! 🎉`
                  }
                </Typography>
              </CardContent>
            </Card>
          </>
        )}

        {/* Message Section - Conditional based on attendance */}
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          {formData.attending === 'no' ? (
            <Card sx={{ 
              mb: { xs: 2, sm: 3 }, 
              background: 'linear-gradient(135deg, #FFE5F1 0%, #E8F8F5 100%)',
              borderRadius: 2
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#FF6B9D', 
                    mb: 2, 
                    textAlign: 'center',
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    fontWeight: 600
                  }}
                >
                  💌 Send Kashvi a Birthday Message! 💌
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#636E72', 
                    mb: 2, 
                    textAlign: 'center',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    px: { xs: 1, sm: 0 }
                  }}
                >
                  Even though you can't be there in person, you can still send your love and birthday wishes! 🎂💕
                </Typography>
                <TextField
                  fullWidth
                  label="Birthday Message for Kashvi"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Send your warmest birthday wishes to our little princess! 'Happy 1st Birthday Kashvi! Wishing you...' 🎉👑"
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#FF6B9D',
                      },
                      '&:hover fieldset': {
                        borderColor: '#C44569',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF6B9D',
                      },
                    },
                    '& .MuiInputBase-root': {
                      fontSize: { xs: '16px' } // Prevent zoom on iOS
                    }
                  }}
                  inputProps={{
                    style: { fontSize: '16px' }
                  }}
                />
              </CardContent>
            </Card>
          ) : formData.attending === 'yes' ? (
            <TextField
              fullWidth
              label="Special Message for Kashvi (Optional)"
              multiline
              rows={3}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Share your excitement for the birthday celebration! 'Can't wait to celebrate with Kashvi!' 🎉"
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: { xs: '16px' } // Prevent zoom on iOS
                }
              }}
              inputProps={{
                style: { fontSize: '16px' }
              }}
            />
          ) : null}
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
          sx={{ 
            py: { xs: 1.5, sm: 2 },
            fontSize: { xs: '1rem', sm: '1.125rem' },
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
            background: 'linear-gradient(45deg, #ff6b9d, #c44569)',
            '&:hover': {
              background: 'linear-gradient(45deg, #c44569, #ff6b9d)',
            },
            '&:disabled': {
              background: '#ccc'
            }
          }}
        >
          {loading ? 'Submitting...' : 
            formData.attending === 'no' ? 'Send Birthday Message 💌' : 'Submit RSVP 🎈'
          }
        </Button>
      </Box>

      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          {formData.attending === 'no' 
            ? 'Birthday message sent successfully! Kashvi will love it! 💌'
            : 'RSVP submitted successfully! Can\'t wait to celebrate with you! 🎉'
          }
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
    </Box>
  );
};

export default RSVPForm;