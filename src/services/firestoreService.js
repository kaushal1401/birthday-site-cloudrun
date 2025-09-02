// Firestore service for birthday site
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, isDemoMode } from '../firebase';

// Demo data for when Firebase credentials are not available
const demoRSVPs = [
  {
    id: 'demo-1',
    name: 'Demo Family',
    email: 'demo@example.com',
    phone: '+1-234-567-8900',
    adults: 2,
    children: [{ name: 'Child 1', age: 6 }, { name: 'Child 2', age: 8 }],
    message: 'Excited to celebrate with you!',
    createdAt: new Date()
  }
];

const demoMessages = [
  {
    id: 'demo-msg-1',
    name: 'Demo Grandparents',
    message: 'Happy Birthday! We love you so much!',
    createdAt: new Date()
  },
  {
    id: 'demo-msg-2',
    name: 'Demo Aunty',
    message: 'Wishing you joy and happiness on your special day!',
    createdAt: new Date()
  }
];

// RSVP Service
export const rsvpService = {
  // Get all RSVPs
  async getRSVPs() {
    if (isDemoMode || !db) {
      console.log('Demo mode: Returning demo RSVPs');
      return Promise.resolve([...demoRSVPs]);
    }
    
    try {
      const q = query(collection(db, 'rsvps'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      }));
    } catch (error) {
      console.error('Error getting RSVPs:', error);
      throw error;
    }
  },

  // Create new RSVP
  async createRSVP(rsvpData) {
    if (isDemoMode || !db) {
      console.log('Demo mode: RSVP would be saved:', rsvpData);
      const newRSVP = { 
        id: 'demo-' + Date.now(), 
        ...rsvpData, 
        createdAt: new Date() 
      };
      demoRSVPs.unshift(newRSVP);
      return Promise.resolve(newRSVP);
    }
    
    try {
      const docRef = await addDoc(collection(db, 'rsvps'), {
        ...rsvpData,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...rsvpData };
    } catch (error) {
      console.error('Error creating RSVP:', error);
      throw error;
    }
  },

  // Delete RSVP
  async deleteRSVP(id) {
    if (isDemoMode || !db) {
      console.log('Demo mode: RSVP would be deleted:', id);
      const index = demoRSVPs.findIndex(rsvp => rsvp.id === id);
      if (index > -1) demoRSVPs.splice(index, 1);
      return Promise.resolve(true);
    }
    
    try {
      await deleteDoc(doc(db, 'rsvps', id));
      return true;
    } catch (error) {
      console.error('Error deleting RSVP:', error);
      throw error;
    }
  }
};

// Messages Service
export const messagesService = {
  // Get all messages
  async getMessages() {
    if (isDemoMode || !db) {
      console.log('Demo mode: Returning demo messages');
      return Promise.resolve([...demoMessages]);
    }
    
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      }));
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },

  // Create new message
  async createMessage(messageData) {
    if (isDemoMode || !db) {
      console.log('Demo mode: Message would be saved:', messageData);
      const newMessage = { 
        id: 'demo-msg-' + Date.now(), 
        ...messageData, 
        createdAt: new Date() 
      };
      demoMessages.unshift(newMessage);
      return Promise.resolve(newMessage);
    }
    
    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        ...messageData,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...messageData };
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  },

  // Delete message
  async deleteMessage(id) {
    if (isDemoMode || !db) {
      console.log('Demo mode: Message would be deleted:', id);
      const index = demoMessages.findIndex(msg => msg.id === id);
      if (index > -1) demoMessages.splice(index, 1);
      return Promise.resolve(true);
    }
    
    try {
      await deleteDoc(doc(db, 'messages', id));
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
};
