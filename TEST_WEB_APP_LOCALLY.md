# 🌐 Test Mobile App as Web App Locally

## Quick Start (3 Steps)

### Step 1: Start Local Mock Server (Terminal 1)

```powershell
# Open first PowerShell terminal
cd D:\Users\aishwaryaD\ai-hackathon(1)
cd local-server
node server.js
```

**You should see:**
```
🚀 LOCAL MOCK API SERVER RUNNING
📡 Server URL: http://localhost:3001
```

**Keep this terminal running!**

---

### Step 2: Start Mobile App (Terminal 2)

```powershell
# Open SECOND PowerShell terminal
cd D:\Users\aishwaryaD\ai-hackathon(1)
cd mobile-app

# Install dependencies (first time only)
npm install

# Start the app
npm start
```

**Wait for Expo to start...**

---

### Step 3: Open in Web Browser

When Expo starts, press `w` to open in web browser.

Or manually open: http://localhost:19006

---

## 🎯 What You'll See

### 1. Language Selector
- 9 languages with flags
- Click to select (Santali, Gondi, Hindi, etc.)

### 2. Voice Assistant
- Microphone button
- Text input area
- Response display

### 3. News Feed
- Latest news in selected language
- Cultural context notes
- Related government schemes

---

## 🧪 Test Scenarios

### Test 1: Scholarship Query

1. Select language: **Santali**
2. Type in text box: "What scholarships are available?"
3. Click microphone button (or just type)
4. **Expected Response:**
   ```
   Post Matric Scholarship for ST Students is available. 
   You can apply through National Scholarship Portal...
   ```

### Test 2: Health Query

1. Select language: **Gondi**
2. Type: "How can I get health insurance?"
3. **Expected Response:**
   ```
   Ayushman Bharat provides free health insurance 
   up to ₹5 lakh for tribal families...
   ```

### Test 3: Farming Query

1. Select language: **Bhili**
2. Type: "Tell me about farming schemes"
3. **Expected Response:**
   ```
   PM-KISAN scheme provides ₹6,000 per year...
   ```

### Test 4: News Feed

1. Scroll down to news section
2. **Expected:** 3 news articles
   - New Scholarship Program
   - Forest Rights Act
   - Free Health Checkup Camp
3. Each with cultural context and related schemes

### Test 5: Language Detection

1. Type in Hindi: "मुझे सरकारी योजना के बारे में बताएं"
2. **Expected:** Detects Hindi, provides response

---

## 🎨 What to Look For

### UI Elements

✅ **Language Selector Bar**
- Horizontal scroll
- 9 language options
- Selected language highlighted in blue

✅ **Voice Assistant Card**
- White card with shadow
- Microphone button (blue)
- Text input area
- Response display area

✅ **News Feed**
- Multiple news cards
- Translated titles
- Cultural relevance notes
- Related schemes in blue boxes

### Functionality

✅ **Language Selection**
- Click changes selected language
- Updates throughout app

✅ **Voice Input**
- Type in text box
- Click microphone to submit
- Response appears below

✅ **News Display**
- Shows 3 news items
- Each with title, content, context
- Scrollable list

---

## 🔧 Troubleshooting

### Issue: "Network request failed"

**Solution:** Make sure local server is running
```powershell
# In Terminal 1
cd local-server
node server.js
```

### Issue: "Cannot find module"

**Solution:** Install dependencies
```powershell
cd mobile-app
npm install
```

### Issue: Expo won't start

**Solution:** Install Expo CLI
```powershell
npm install -g expo-cli
```

### Issue: Port already in use

**Solution:** Change port in server.js
```javascript
const PORT = 3002; // Change from 3001
```

### Issue: Web page blank

**Solution:** 
1. Check browser console (F12)
2. Verify server is running
3. Check .env.local file exists

---

## 📱 Test on Phone (Optional)

### Using Expo Go App

1. Install "Expo Go" from Play Store/App Store
2. Scan QR code from terminal
3. App opens on your phone
4. **Note:** Phone must be on same WiFi network

### Using Android Emulator

```powershell
# Press 'a' in Expo terminal
# Or
npm run android
```

### Using iOS Simulator (Mac only)

```powershell
# Press 'i' in Expo terminal
# Or
npm run ios
```

---

## 🎬 Demo Recording

### Record Your Demo

**Windows (Built-in):**
1. Press `Win + G` to open Game Bar
2. Click record button
3. Record your demo
4. Video saved to Videos/Captures

**OBS Studio (Free):**
1. Download: https://obsproject.com/
2. Add browser source
3. Record demo
4. Export video

---

## 📊 Testing Checklist

### Basic Functionality
- [ ] Server starts successfully
- [ ] Mobile app starts successfully
- [ ] Web page loads in browser
- [ ] Language selector visible
- [ ] Can select different languages

### Voice Assistant
- [ ] Can type in text box
- [ ] Microphone button works
- [ ] Response appears after query
- [ ] Response is relevant to query
- [ ] Different queries give different responses

### News Feed
- [ ] News section visible
- [ ] 3 news items displayed
- [ ] Titles are readable
- [ ] Cultural context shown
- [ ] Related schemes shown

### Language Support
- [ ] Santali works
- [ ] Gondi works
- [ ] Hindi works
- [ ] English works
- [ ] Language detection works

---

## 🎯 Expected Behavior

### When You Type "What scholarships are available?"

**Server logs (Terminal 1):**
```
📡 POST /detect-language
📡 POST /cultural-assistant
```

**App displays:**
```
You said:
What scholarships are available?

Response:
Post Matric Scholarship for ST Students is available. 
You can apply through National Scholarship Portal 
(scholarships.gov.in). This provides financial assistance 
up to ₹50,000 per year for tribal students pursuing 
higher education.
```

### When You Open News Feed

**Server logs:**
```
📡 POST /news
```

**App displays:**
```
News in santali

📰 New Scholarship Program Announced
नया छात्रवृत्ति कार्यक्रम की घोषणा

सरकार ने आदिवासी छात्रों के लिए उच्च शिक्षा के लिए 
एक नया छात्रवृत्ति कार्यक्रम की घोषणा की है।

📌 This helps Santali students pursue higher education 
and improve their livelihood

Related Government Schemes:
Post Matric Scholarship, Pre Matric Scholarship
```

---

## 💡 Pro Tips

### 1. Keep Both Terminals Open
- Terminal 1: Server (must stay running)
- Terminal 2: Mobile app (must stay running)

### 2. Check Server Logs
- Every request shows in Terminal 1
- Helps debug issues

### 3. Refresh Browser
- If something doesn't work, refresh (F5)

### 4. Test Different Queries
- Try various questions
- See different responses

### 5. Take Screenshots
- Capture working features
- Use for presentation

---

## 🎓 Understanding the Flow

### What Happens When You Type a Query:

1. **You type:** "What scholarships are available?"
2. **App sends to:** http://localhost:3001/detect-language
3. **Server detects:** English language
4. **App sends to:** http://localhost:3001/cultural-assistant
5. **Server responds:** Scholarship information
6. **App displays:** Response on screen

### What Happens When You Open News:

1. **App requests:** http://localhost:3001/news
2. **Server returns:** 3 news articles
3. **App displays:** News with translations

---

## 🚀 Quick Commands Reference

### Start Everything

```powershell
# Terminal 1 - Start server
cd D:\Users\aishwaryaD\ai-hackathon(1)\local-server
node server.js

# Terminal 2 - Start app
cd D:\Users\aishwaryaD\ai-hackathon(1)\mobile-app
npm start
# Press 'w' for web
```

### Stop Everything

```powershell
# In both terminals
Ctrl + C
```

### Restart

```powershell
# Just run the start commands again
```

---

## 📸 Screenshots to Take

For your presentation:

1. **Language Selector** - All 9 languages visible
2. **Voice Assistant** - Query and response
3. **News Feed** - Multiple news items
4. **Cultural Context** - Showing cultural notes
5. **Related Schemes** - Government schemes box
6. **Different Languages** - Same query in different languages

---

## 🎉 Success Criteria

You've successfully tested when:

✅ Server starts without errors  
✅ Mobile app opens in browser  
✅ Can select different languages  
✅ Can type and get responses  
✅ News feed displays articles  
✅ Cultural context is shown  
✅ Related schemes are displayed  
✅ Everything looks good visually  

---

## 🏆 Ready for Demo!

Once everything works locally:

1. ✅ Take screenshots
2. ✅ Record demo video
3. ✅ Practice your pitch
4. ✅ You're ready to present!

**No AWS needed for demo!** Just show this working local version.

---

## 💰 Cost

**Local Testing:** $0  
**Time:** 5 minutes setup  
**Requirements:** Node.js only  

---

## 📞 Need Help?

**Check:**
1. Both terminals are running
2. No error messages in terminals
3. Browser console (F12) for errors
4. Server URL is correct in .env.local

**Common fixes:**
- Restart server (Ctrl+C, then run again)
- Restart app (Ctrl+C, then npm start)
- Clear browser cache (Ctrl+Shift+Delete)
- Check firewall isn't blocking localhost

---

**Now go ahead and test! Open two terminals and follow Step 1 & 2 above.** 🚀

