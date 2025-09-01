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
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

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
    // Subscribe to RSVPs
    const rsvpQuery = query(collection(db, 'rsvps'), orderBy('timestamp', 'desc'));
    const unsubscribeRsvps = onSnapshot(rsvpQuery, (querySnapshot) => {
      const rsvpData = [];
      querySnapshot.forEach((doc) => {
        rsvpData.push({ id: doc.id, ...doc.data() });
      });
      setRsvps(rsvpData);
      
      // Calculate stats
      const attending = rsvpData.filter(r => r.attending === 'yes');
      setStats(prev => ({
        ...prev,
        totalRsvps: rsvpData.length,
        attending: attending.length,
        adults: attending.filter(r => r.guestType === 'adult').length,
        children: attending.filter(r => r.guestType === 'child').length
      }));
    });

    // Subscribe to Messages
    const messageQuery = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    const unsubscribeMessages = onSnapshot(messageQuery, (querySnapshot) => {
      const messageData = [];
      querySnapshot.forEach((doc) => {
        messageData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messageData);
      setStats(prev => ({ ...prev, totalMessages: messageData.length }));
    });

    return () => {
      unsubscribeRsvps();
      unsubscribeMessages();
    };
  }, []);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, deleteDialog.type === 'rsvp' ? 'rsvps' : 'messages', deleteDialog.id));
      setSuccess(`${deleteDialog.type === 'rsvp' ? 'RSVP' : 'Message'} deleted successfully`);
      setDeleteDialog({ open: false, type: '', id: '', name: '' });
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const openDeleteDialog = (type, id, name) => {
    setDeleteDialog({ open: true, type, id, name });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredRsvps = rsvps.filter(rsvp => 
    rsvp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rsvp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = messages.filter(message => 
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
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
    <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRsvps.map((rsvp) => (
                <TableRow key={rsvp.id}>
                  <TableCell>{rsvp.name}</TableCell>
                  <TableCell>{rsvp.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={rsvp.attending === 'yes' ? 'Attending' : 'Not Attending'} 
                      color={rsvp.attending === 'yes' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={rsvp.guestType === 'child' ? 'Child' : 'Adult'} 
                      color={rsvp.guestType === 'child' ? 'secondary' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{rsvp.childAge || '-'}</TableCell>
                  <TableCell>{formatTimestamp(rsvp.timestamp)}</TableCell>
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
        <TableContainer>
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