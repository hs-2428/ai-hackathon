# ✅ Local Demo Testing Checklist

## 🚀 Quick Start (Choose One Method)

### Method 1: Automated (Easiest)
```powershell
# Double-click this file:
start-local-demo.bat

# Wait for both windows to open
# In the "Mobile App" window, press 'w' when ready
```

### Method 2: Manual (More Control)
```powershell
# Terminal 1
cd local-server
node server.js

# Terminal 2 (new window)
cd mobile-app
npm start
# Press 'w' for web
```

---

## 📋 Pre-Testing Checklist

Before you start:

- [ ] Node.js installed (check: `node --version`)
- [ ] Project downloaded/cloned
- [ ] In correct directory: `D:\Users\aishwaryaD\ai-hackathon(1)`
- [ ] No other apps using port 3001
- [ ] No other apps using port 19006

---

## 🧪 Testing Steps

### Step 1: Start Local Server ✅

**Command:**
```powershell
cd local-server
node server.js
```

**Expected Output:**
```
🚀 LOCAL MOCK API SERVER RUNNING
📡 Server URL: http://localhost:3001
```

**Verify:**
- [ ] No error messages
- [ ] Shows "Server URL: http://localhost:3001"
- [ ] Lists available endpoints
- [ ] Terminal stays open (don't close!)

---

### Step 2: Start Mobile App ✅

**Command:**
```powershell
cd mobile-app
npm start
```

**Expected Output:**
```
Starting Metro Bundler...
Expo DevTools running at http://localhost:19002
```

**Verify:**
- [ ] No error messages
- [ ] Shows QR code
- [ ] Shows options: w (web), a (android), i (ios)
- [ ] Terminal stays open (don't close!)

---

### Step 3: Open in Browser ✅

**Action:** Press `w` in the Mobile App terminal

**Expected:**
- [ ] Browser opens automatically
- [ ] URL: http://localhost:19006
- [ ] App loads (may take 30 seconds first time)
- [ ] No blank screen

---

### Step 4: Test Language Selector ✅

**What to do:**
1. Look at top of page
2. See horizontal language bar
3. Click different languages

**Verify:**
- [ ] 9 languages visible (Santali, Gondi, Bhili, etc.)
- [ ] Each has flag emoji
- [ ] Selected language highlighted in blue
- [ ] Can click to change language
- [ ] Language name updates in app

---

### Step 5: Test Voice Assistant ✅

**Test Query 1: Scholarship**

1. Type: "What scholarships are available?"
2. Click microphone button (or press Enter)

**Verify:**
- [ ] Query appears in "You said:" box
- [ ] Response appears in "Response:" box
- [ ] Response mentions "Post Matric Scholarship"
- [ ] Response mentions "National Scholarship Portal"
- [ ] Response is readable and relevant

**Test Query 2: Health**

1. Type: "How can I get health insurance?"
2. Click microphone button

**Verify:**
- [ ] Response mentions "Ayushman Bharat"
- [ ] Response mentions "₹5 lakh"
- [ ] Response mentions "health center"

**Test Query 3: Farming**

1. Type: "Tell me about farming schemes"
2. Click microphone button

**Verify:**
- [ ] Response mentions "PM-KISAN"
- [ ] Response mentions "₹6,000 per year"
- [ ] Response mentions "agriculture office"

---

### Step 6: Test News Feed ✅

**What to do:**
1. Scroll down to news section
2. Read news articles

**Verify:**
- [ ] "News in [language]" header visible
- [ ] 3 news articles displayed
- [ ] Each article has:
  - [ ] Title in English
  - [ ] Translated title in Hindi/tribal language
  - [ ] Content/description
  - [ ] Cultural relevance note (📌)
  - [ ] Related schemes box (blue background)
  - [ ] Date/timestamp

**News Articles Expected:**
1. New Scholarship Program Announced
2. Forest Rights Act Implementation
3. Free Health Checkup Camp

---

### Step 7: Test Different Languages ✅

**What to do:**
1. Select "Gondi" language
2. Type same query: "What scholarships are available?"
3. Check response

**Verify:**
- [ ] Response still appears
- [ ] Response is relevant
- [ ] News feed updates (if different)

**Repeat for:**
- [ ] Santali
- [ ] Bhili
- [ ] Hindi
- [ ] English

---

### Step 8: Check Server Logs ✅

**What to do:**
1. Look at Terminal 1 (server window)
2. Check logs after each query

**Expected Logs:**
```
📡 POST /detect-language
📡 POST /cultural-assistant
📡 POST /news
```

**Verify:**
- [ ] Logs appear for each action
- [ ] No error messages
- [ ] Shows POST requests
- [ ] Shows endpoint names

---

### Step 9: Test Offline Indicator ✅

**What to do:**
1. Stop server (Ctrl+C in Terminal 1)
2. Try to make a query in app
3. Restart server

**Verify:**
- [ ] App shows "📵 Offline Mode" or error
- [ ] After restart, app works again

---

### Step 10: Visual Check ✅

**Overall Appearance:**
- [ ] Clean, professional design
- [ ] No overlapping text
- [ ] Buttons are clickable
- [ ] Colors are pleasant
- [ ] Text is readable
- [ ] Responsive layout
- [ ] No broken images
- [ ] Smooth scrolling

---

## 📸 Screenshot Checklist

Take these screenshots for your presentation:

- [ ] **Full app view** - Showing all components
- [ ] **Language selector** - All 9 languages visible
- [ ] **Voice assistant** - With query and response
- [ ] **News feed** - Multiple articles visible
- [ ] **Cultural context** - Showing cultural relevance note
- [ ] **Related schemes** - Government schemes box
- [ ] **Different language** - Same query in Hindi/Santali
- [ ] **Server logs** - Terminal showing API calls

---

## 🎥 Demo Video Checklist

Record a 2-minute demo showing:

- [ ] **0:00-0:15** - App loading, language selector
- [ ] **0:15-0:45** - Voice query and response
- [ ] **0:45-1:15** - News feed scrolling
- [ ] **1:15-1:45** - Different language selection
- [ ] **1:45-2:00** - Cultural context and schemes

---

## 🐛 Troubleshooting Checklist

### If Server Won't Start

- [ ] Check if port 3001 is free
- [ ] Try different port (edit server.js)
- [ ] Check Node.js is installed
- [ ] Check you're in correct directory

### If App Won't Start

- [ ] Run `npm install` in mobile-app folder
- [ ] Check if port 19006 is free
- [ ] Clear npm cache: `npm cache clean --force`
- [ ] Delete node_modules and reinstall

### If Browser Shows Blank Page

- [ ] Wait 30 seconds (first load is slow)
- [ ] Check browser console (F12)
- [ ] Refresh page (Ctrl+R)
- [ ] Try different browser
- [ ] Check server is running

### If No Response to Queries

- [ ] Check server terminal for errors
- [ ] Verify server URL in .env.local
- [ ] Check browser console for errors
- [ ] Restart both server and app

---

## ✅ Success Criteria

Your demo is ready when:

- [x] Server starts without errors
- [x] App opens in browser
- [x] All 9 languages selectable
- [x] Voice queries get responses
- [x] News feed displays 3 articles
- [x] Cultural context is shown
- [x] Related schemes are displayed
- [x] Different languages work
- [x] Server logs show API calls
- [x] Screenshots taken
- [x] Demo video recorded

---

## 🎯 Final Verification

### Quick Test Sequence (2 minutes)

1. **Start server** → See "🚀 LOCAL MOCK API SERVER RUNNING"
2. **Start app** → See Expo DevTools
3. **Press 'w'** → Browser opens
4. **Select Santali** → Language changes
5. **Type "scholarships"** → Get response
6. **Scroll to news** → See 3 articles
7. **Check server logs** → See API calls

**If all 7 steps work → You're ready!** ✅

---

## 📊 Testing Results

### Date: ___________
### Tester: ___________

| Test | Status | Notes |
|------|--------|-------|
| Server starts | ⬜ Pass ⬜ Fail | |
| App starts | ⬜ Pass ⬜ Fail | |
| Browser opens | ⬜ Pass ⬜ Fail | |
| Language selector | ⬜ Pass ⬜ Fail | |
| Voice queries | ⬜ Pass ⬜ Fail | |
| News feed | ⬜ Pass ⬜ Fail | |
| Cultural context | ⬜ Pass ⬜ Fail | |
| Server logs | ⬜ Pass ⬜ Fail | |

**Overall Result:** ⬜ PASS ⬜ FAIL

---

## 🎉 You're Ready!

Once all checkboxes are ticked:

✅ Your local demo works  
✅ You have screenshots  
✅ You have demo video  
✅ You understand the flow  
✅ You're ready to present!

**No AWS deployment needed for demo!**

---

## 💡 Pro Tips

1. **Practice the demo 3 times** before presenting
2. **Keep both terminals visible** during demo
3. **Have backup screenshots** in case of issues
4. **Explain the architecture** while showing the demo
5. **Emphasize serverless** and cost efficiency

---

**Good luck with your demo!** 🚀

