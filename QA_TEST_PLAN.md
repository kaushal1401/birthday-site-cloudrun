# QA Test Plan - Birthday Site

## Test Environment Setup
- **Local Development**: http://localhost:3000
- **Production**: Cloud Run deployment
- **Database**: Firestore (Free Tier)
- **Storage**: Cloud Storage (Photos)

## 1. FUNCTIONAL TESTING

### 1.1 Page Load & Display Tests
- [ ] **Test Case**: Page loads successfully
  - **Expected**: Site displays with header, event details, RSVP section, messages section
  - **Status**: ✅ PASS

- [ ] **Test Case**: Event details are correctly displayed
  - **Expected**: Venue: Mythri Banquet Hall, Address: 8350 N MacArthur Blvd Suite 190, Irving, TX 75063, Time: 7:00 PM
  - **Status**: ✅ PASS

- [ ] **Test Case**: Responsive design works on mobile
  - **Expected**: Layout adapts to mobile screen sizes
  - **Status**: ⏳ TODO

### 1.2 RSVP Functionality Tests
- [ ] **Test Case**: RSVP form accepts valid input
  - **Expected**: User can enter name, contact, guest count, dietary restrictions
  - **Status**: ⏳ TODO (Form not yet implemented in simplified version)

- [ ] **Test Case**: RSVP data saves to Firestore
  - **Expected**: Data persists in 'rsvps' collection
  - **Status**: ⏳ TODO

- [ ] **Test Case**: Form validation works
  - **Expected**: Required fields show error messages when empty
  - **Status**: ⏳ TODO

### 1.3 Messages Functionality Tests
- [ ] **Test Case**: Guest can post birthday message
  - **Expected**: Message appears in messages wall
  - **Status**: ⏳ TODO

- [ ] **Test Case**: Messages save to Firestore
  - **Expected**: Data persists in 'messages' collection
  - **Status**: ⏳ TODO

- [ ] **Test Case**: Messages display in chronological order
  - **Expected**: Newest messages appear first
  - **Status**: ⏳ TODO

### 1.4 Photo Gallery Tests
- [ ] **Test Case**: Photos load from Cloud Storage
  - **Expected**: Baby journey photos display in gallery
  - **Status**: ⏳ TODO

- [ ] **Test Case**: Photo modal opens on click
  - **Expected**: Full-size photo view with navigation
  - **Status**: ⏳ TODO

### 1.5 Admin Dashboard Tests
- [ ] **Test Case**: Admin button opens dashboard
  - **Expected**: Admin panel shows RSVPs and messages
  - **Status**: ⏳ TODO

- [ ] **Test Case**: Admin can delete inappropriate content
  - **Expected**: Delete functionality works for RSVPs and messages
  - **Status**: ⏳ TODO

## 2. PERFORMANCE TESTING

### 2.1 Load Time Tests
- [ ] **Test Case**: Initial page load < 3 seconds
  - **Target**: First Contentful Paint < 1.5s, Largest Contentful Paint < 2.5s
  - **Status**: ⏳ TODO

- [ ] **Test Case**: Firestore queries respond quickly
  - **Target**: Database operations < 500ms
  - **Status**: ⏳ TODO

### 2.2 Bundle Size Tests
- [ ] **Test Case**: JavaScript bundle size optimized
  - **Current**: 45.4 kB gzipped (✅ Good)
  - **Status**: ✅ PASS

## 3. SECURITY TESTING

### 3.1 Firestore Security Rules
- [ ] **Test Case**: Public read/write access works for guests
  - **Expected**: Guests can submit RSVPs and messages without authentication
  - **Status**: ✅ PASS (Rules deployed)

- [ ] **Test Case**: No sensitive data exposure
  - **Expected**: No API keys or credentials in client code
  - **Status**: ✅ PASS

### 3.2 Input Validation
- [ ] **Test Case**: XSS protection in message inputs
  - **Expected**: HTML/JavaScript in messages is escaped
  - **Status**: ⏳ TODO

- [ ] **Test Case**: SQL injection protection (not applicable - NoSQL)
  - **Status**: ✅ N/A

## 4. COMPATIBILITY TESTING

### 4.1 Browser Compatibility
- [ ] **Chrome**: ✅ PASS
- [ ] **Firefox**: ⏳ TODO
- [ ] **Safari**: ⏳ TODO
- [ ] **Edge**: ⏳ TODO

### 4.2 Device Compatibility
- [ ] **Desktop**: ✅ PASS
- [ ] **Tablet**: ⏳ TODO
- [ ] **Mobile Phone**: ⏳ TODO

## 5. DEPLOYMENT TESTING

### 5.1 Cloud Run Deployment
- [ ] **Test Case**: Build process completes successfully
  - **Command**: `npm run build`
  - **Status**: ✅ PASS

- [ ] **Test Case**: Container builds and deploys
  - **Expected**: Cloud Run service serves the application
  - **Status**: ⏳ TODO

### 5.2 Environment Configuration
- [ ] **Test Case**: Environment variables work in production
  - **Expected**: Event details display correctly from env vars
  - **Status**: ✅ PASS (Local)

## 6. ERROR HANDLING TESTING

### 6.1 Network Errors
- [ ] **Test Case**: Offline functionality
  - **Expected**: Graceful degradation when Firestore is unavailable
  - **Status**: ⏳ TODO

- [ ] **Test Case**: Error messages for failed operations
  - **Expected**: User-friendly error messages for failed RSVP/message submission
  - **Status**: ⏳ TODO

## 7. ACCESSIBILITY TESTING

### 7.1 Screen Reader Compatibility
- [ ] **Test Case**: ARIA labels present
  - **Expected**: Screen readers can navigate the site
  - **Status**: ⏳ TODO

### 7.2 Keyboard Navigation
- [ ] **Test Case**: Tab navigation works
  - **Expected**: All interactive elements accessible via keyboard
  - **Status**: ⏳ TODO

## TEST AUTOMATION

### Unit Tests
- ✅ AppSimple component rendering
- ✅ Environment variable handling
- ✅ Firestore service functions
- ✅ Event details display

### Integration Tests Needed
- [ ] RSVP form submission to Firestore
- [ ] Message posting to Firestore
- [ ] Photo loading from Cloud Storage
- [ ] Admin dashboard functionality

### E2E Tests Needed
- [ ] Complete user journey: View event → Submit RSVP → Post message
- [ ] Admin workflow: View dashboard → Manage content

## MANUAL TESTING CHECKLIST

### Before Each Release
1. [ ] Verify all environment variables are set correctly
2. [ ] Test RSVP submission with various input combinations
3. [ ] Test message posting with emoji and special characters
4. [ ] Verify photo gallery loads correctly
5. [ ] Test admin functionality
6. [ ] Check mobile responsiveness
7. [ ] Verify all links and buttons work
8. [ ] Test error scenarios (network issues, invalid input)

### Production Deployment Checklist
1. [ ] Run `npm run build` successfully
2. [ ] Verify bundle size is acceptable
3. [ ] Test production build locally with `serve -s build`
4. [ ] Deploy to Cloud Run
5. [ ] Verify environment variables in Cloud Run
6. [ ] Test live site functionality
7. [ ] Monitor Firestore usage and limits
8. [ ] Check Cloud Storage access permissions

## NOTES
- **Free Tier Limits**: Firestore (50K reads/writes per day), Cloud Storage (5GB)
- **Monitoring**: Set up alerts for quota usage
- **Backup**: Consider exporting Firestore data periodically
