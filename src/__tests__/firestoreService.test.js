import { rsvpService, messagesService } from '../services/firestoreService';

// Mock Firestore
jest.mock('../firebase', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  serverTimestamp: jest.fn(() => ({ seconds: Date.now() / 1000 }))
}));

describe('Firestore Service - RSVP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createRSVP should add document to rsvps collection', async () => {
    const mockRSVPData = {
      name: 'Test User',
      mobile: '123-456-7890',
      adultCount: 2,
      children: [],
      message: 'Looking forward to it!',
      attending: 'yes'
    };

    const { addDoc } = require('firebase/firestore');
    addDoc.mockResolvedValue({ id: 'test-id' });

    const result = await rsvpService.createRSVP(mockRSVPData);

    expect(addDoc).toHaveBeenCalled();
    expect(result).toEqual({ id: 'test-id', ...mockRSVPData });
  });

  test('getRSVPs should fetch all RSVPs', async () => {
    const { getDocs, query, collection, orderBy } = require('firebase/firestore');
    
    const mockDocs = [
      {
        id: 'rsvp1',
        data: () => ({
          name: 'User 1',
          attending: 'yes',
          createdAt: { toDate: () => new Date() }
        })
      }
    ];

    getDocs.mockResolvedValue({ docs: mockDocs });
    query.mockReturnValue('mock-query');
    collection.mockReturnValue('mock-collection');
    orderBy.mockReturnValue('mock-order');

    const result = await rsvpService.getRSVPs();

    expect(getDocs).toHaveBeenCalledWith('mock-query');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('User 1');
  });
});

describe('Firestore Service - Messages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createMessage should add document to messages collection', async () => {
    const mockMessageData = {
      name: 'Test User',
      message: 'Happy Birthday!',
      guestType: 'adult'
    };

    const { addDoc } = require('firebase/firestore');
    addDoc.mockResolvedValue({ id: 'message-id' });

    const result = await messagesService.createMessage(mockMessageData);

    expect(addDoc).toHaveBeenCalled();
    expect(result).toEqual({ id: 'message-id', ...mockMessageData });
  });

  test('getMessages should fetch all messages', async () => {
    const { getDocs, query, collection, orderBy } = require('firebase/firestore');
    
    const mockDocs = [
      {
        id: 'msg1',
        data: () => ({
          name: 'User 1',
          message: 'Happy Birthday!',
          createdAt: { toDate: () => new Date() }
        })
      }
    ];

    getDocs.mockResolvedValue({ docs: mockDocs });

    const result = await messagesService.getMessages();

    expect(result).toHaveLength(1);
    expect(result[0].message).toBe('Happy Birthday!');
  });
});
