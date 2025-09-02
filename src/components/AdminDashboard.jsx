import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { rsvpService, messagesService } from '../services/firestoreService';

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [rsvps, setRsvps] = useState([]);
  const [messages, setMessages] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', id: '', name: '' });
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalRsvps: 0,
    attending: 0,
    adults: 0,
    children: 0,
    totalMessages: 0
  });

  useEffect(() => {
    // Load data from Firestore
    const loadData = async () => {
      try {
        // Load RSVPs
        const rsvpData = await rsvpService.getRSVPs();
        setRsvps(rsvpData);
        
        // Calculate stats
        const attending = rsvpData.filter(r => r.attending === 'yes');
        const totalAdults = attending.reduce((sum, r) => sum + (r.adultCount || r.adults || 0), 0);
        const totalChildren = attending.reduce((sum, r) => sum + (r.childrenCount || r.children?.length || 0), 0);
        
        setStats(prev => ({
          ...prev,
          totalRsvps: rsvpData.length,
          attending: attending.length,
          adults: totalAdults,
          children: totalChildren
        }));

        // Load Messages
        const messageData = await messagesService.getMessages();
        setMessages(messageData);
        setStats(prev => ({ ...prev, totalMessages: messageData.length }));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
    
    // Set up polling for updates
    const interval = setInterval(loadData, 10000); // Poll every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async () => {
    try {
      if (deleteDialog.type === 'rsvp') {
        await rsvpService.deleteRSVP(deleteDialog.id);
        const rsvpData = await rsvpService.getRSVPs();
        setRsvps(rsvpData);
      } else {
        await messagesService.deleteMessage(deleteDialog.id);
        const messageData = await messagesService.getMessages();
        setMessages(messageData);
      }
      
      setSuccess(`${deleteDialog.type === 'rsvp' ? 'RSVP' : 'Message'} deleted successfully`);
      setDeleteDialog({ open: false, type: '', id: '', name: '' });
    } catch (error) {
      console.error('Error deleting item:', error);
      setSuccess('Error deleting item. Please try again.');
    }
  };

  const openDeleteDialog = (type, id, name) => {
    setDeleteDialog({ open: true, type, id, name });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    // Handle different timestamp formats
    let date;
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else if (timestamp.toDate) {
      date = timestamp.toDate(); // Firestore Timestamp
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredRsvps = rsvps.filter(rsvp => 
    rsvp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rsvp.mobile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rsvp.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = messages.filter(message => 
    message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card sx={{ 
      height: '100%', 
      background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF9E7 100%)',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" color={color + '.main'}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Paper elevation={6} sx={{ 
      p: 4, 
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 50%, #E9ECEF 100%)',
      borderRadius: 3,
      border: '2px solid #FFD700',
      boxShadow: '0 8px 16px rgba(255, 215, 0, 0.2)'
    }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        👑 Admin Dashboard 👑
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <StatCard 
            title="Total RSVPs" 
            value={stats.totalRsvps} 
            icon={<PeopleIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard 
            title="Attending" 
            value={stats.attending} 
            icon={<PeopleIcon color="success" />}
            color="success"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard 
            title="Adults" 
            value={stats.adults} 
            icon={<PeopleIcon color="info" />}
            color="info"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard 
            title="Children" 
            value={stats.children} 
            icon={<PeopleIcon color="secondary" />}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search guests or messages..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab label={`Guest List (${filteredRsvps.length})`} icon={<PeopleIcon />} />
          <Tab label={`Messages (${filteredMessages.length})`} icon={<MessageIcon />} />
        </Tabs>
      </Box>

      {/* Guest List Tab */}
      {currentTab === 0 && (
        <TableContainer component={Paper} sx={{ 
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          borderRadius: 2
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Adults</TableCell>
                <TableCell>Children</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRsvps.map((rsvp) => (
                <TableRow key={rsvp.id}>
                  <TableCell>{rsvp.name}</TableCell>
                  <TableCell>{rsvp.mobile || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={rsvp.attending === 'yes' ? 'Attending' : 'Not Attending'} 
                      color={rsvp.attending === 'yes' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={rsvp.adultCount || rsvp.adults || 0} 
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={rsvp.childrenCount || rsvp.children?.length || 0} 
                      color="secondary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {rsvp.message || '-'}
                  </TableCell>
                  <TableCell>{formatTimestamp(rsvp.createdAt)}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="error" 
                      onClick={() => openDeleteDialog('rsvp', rsvp.id, rsvp.name)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Messages Tab */}
      {currentTab === 1 && (
        <TableContainer component={Paper} sx={{ 
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          borderRadius: 2
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>{message.name}</TableCell>
                  <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {message.message}
                  </TableCell>
                  <TableCell>{formatTimestamp(message.timestamp)}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="error" 
                      onClick={() => openDeleteDialog('message', message.id, message.name)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, type: '', id: '', name: '' })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteDialog.type} from {deleteDialog.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, type: '', id: '', name: '' })}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={!!success} 
        autoHideDuration={4000} 
        onClose={() => setSuccess('')}
      >
        <Alert onClose={() => setSuccess('')} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AdminDashboard;