# UI/UX Wireframe - Tribal Information Bridge App

## App Overview
An accessible mobile application designed for marginal/tribal communities to bridge the information gap through AI assistance, local news, and constitutional rights information - all in their native language.

---

## Design Principles
- **Language-First**: All content adapts to user's preferred local language
- **Simple Navigation**: Large, clear icons with minimal text
- **Voice-First**: Prioritize voice input for low-literacy users
- **Offline Support**: Core features work without internet
- **Low Data Usage**: Optimized for slow connections

---

## Screen 1: Language Selection (First Launch)
```
┌─────────────────────────────────┐
│                                 │
│         [App Logo/Icon]         │
│                                 │
│    Welcome / स्वागत / સ્વાગત    │
│                                 │
│   Select Your Language          │
│   अपनी भाषा चुनें                │
│                                 │
│  ┌───────────────────────────┐  │
│  │      🗣️ हिंदी             │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │      🗣️ ગુજરાતી          │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │      🗣️ मराठी             │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │      🗣️ [Other Languages] │  │
│  └───────────────────────────┘  │
│                                 │
│         [Continue Button]       │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Large, tappable language cards
- Native script display
- Voice icon for audio support
- Scrollable list for multiple languages

---

## Screen 2: Home Screen (Main Dashboard)
```
┌─────────────────────────────────┐
│  ☰ Menu    [App Name]    🔔 (3) │
├─────────────────────────────────┤
│                                 │
│  नमस्ते, [User Name] 👋          │
│  [Current Date & Time]          │
│                                 │
│  ┌─────────────────────────┐    │
│  │   🤖 AI सहायक           │    │
│  │   AI Assistant          │    │
│  │                         │    │
│  │   [🎤 Tap to Ask]       │    │
│  │   प्रश्न पूछें           │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │   📰 समाचार             │    │
│  │   Local News            │    │
│  │   ─────────────         │    │
│  │   • Latest headline...  │    │
│  │   • Breaking news...    │    │
│  │   [View All →]          │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │   ⚖️ आपके अधिकार        │    │
│  │   Your Rights           │    │
│  │   ─────────────         │    │
│  │   • शिक्षा का अधिकार    │    │
│  │   • रोजगार अधिकार       │    │
│  │   [View All →]          │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
│  [🏠 Home] [📰 News] [⚖️ Rights] │
└─────────────────────────────────┘
```

**Features:**
- Personalized greeting
- Three main sections as cards
- Bottom navigation bar
- Notification indicator
- Quick access to all features

---

## Screen 3: AI Assistant Screen
```
┌─────────────────────────────────┐
│  ← Back      AI सहायक      ⋮    │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🤖                      │    │
│  │ मैं आपकी कैसे मदद कर   │    │
│  │ सकता हूं?                │    │
│  │                         │    │
│  │ How can I help you?     │    │
│  └─────────────────────────┘    │
│                                 │
│  Quick Questions:               │
│  ┌──────────────┐ ┌──────────┐  │
│  │ 🏥 स्वास्थ्य │ │ 💼 रोजगार│  │
│  │   Health    │ │   Jobs   │  │
│  └──────────────┘ └──────────┘  │
│                                 │
│  ┌──────────────┐ ┌──────────┐  │
│  │ 🎓 शिक्षा    │ │ 🏛️ योजना │  │
│  │  Education  │ │  Schemes │  │
│  └──────────────┘ └──────────┘  │
│                                 │
│  ┌──────────────┐ ┌──────────┐  │
│  │ 🌾 कृषि      │ │ ⚖️ कानून  │  │
│  │ Agriculture │ │   Legal  │  │
│  └──────────────┘ └──────────┘  │
│                                 │
│                                 │
│  ─────────────────────────────  │
│  [Type your question...]        │
│  [🎤 Voice] [📷 Image] [Send →] │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Voice input button (primary)
- Text input (secondary)
- Image input for visual queries
- Quick topic buttons
- Bilingual labels
- Chat history scrollable above

---

## Screen 4: AI Chat Conversation
```
┌─────────────────────────────────┐
│  ← Back      AI सहायक      ⋮    │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐    │
│  │ मुझे सरकारी योजनाओं के  │    │
│  │ बारे में बताएं          │    │
│  │                    [🎤] │    │
│  │                   10:23 │    │
│  └─────────────────────────┘    │
│                                 │
│         ┌───────────────────┐   │
│         │ 🤖                │   │
│         │ यहां कुछ मुख्य    │   │
│         │ सरकारी योजनाएं हैं:│   │
│         │                   │   │
│         │ 1. प्रधानमंत्री   │   │
│         │    आवास योजना     │   │
│         │ 2. मनरेगा         │   │
│         │ 3. आयुष्मान भारत  │   │
│         │                   │   │
│         │ [🔊 Listen]       │   │
│         │           10:23   │   │
│         └───────────────────┘   │
│                                 │
│  ┌─────────────────────────┐    │
│  │ मनरेगा के बारे में और  │    │
│  │ बताएं                   │    │
│  │                    [🎤] │    │
│  │                   10:24 │    │
│  └─────────────────────────┘    │
│                                 │
│  ─────────────────────────────  │
│  [Type your question...]        │
│  [🎤 Voice] [📷 Image] [Send →] │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- User messages on left (blue)
- AI responses on right (gray)
- Voice playback for responses
- Timestamp on each message
- Voice indicator on voice messages
- Persistent input bar

---

## Screen 5: News Panel
```
┌─────────────────────────────────┐
│  ← Back      समाचार        🔍   │
├─────────────────────────────────┤
│  [All] [Local] [National] [Gov] │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐    │
│  │ [News Image]            │    │
│  │                         │    │
│  ├─────────────────────────┤    │
│  │ 📍 स्थानीय समाचार       │    │
│  │                         │    │
│  │ नई सरकारी योजना की     │    │
│  │ घोषणा...                │    │
│  │                         │    │
│  │ 🕐 2 घंटे पहले          │    │
│  │ [🔊 सुनें] [Share]      │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ [News Image]            │    │
│  │                         │    │
│  ├─────────────────────────┤    │
│  │ 🏛️ राष्ट्रीय समाचार     │    │
│  │                         │    │
│  │ शिक्षा नीति में बदलाव... │    │
│  │                         │    │
│  │ 🕐 5 घंटे पहले          │    │
│  │ [🔊 सुनें] [Share]      │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ [News Image]            │    │
│  │                         │    │
│  ├─────────────────────────┤    │
│  │ 🌾 कृषि समाचार          │    │
│  │                         │    │
│  │ मौसम की जानकारी...     │    │
│  │                         │    │
│  │ 🕐 1 दिन पहले           │    │
│  │ [🔊 सुनें] [Share]      │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
│  [🏠 Home] [📰 News] [⚖️ Rights] │
└─────────────────────────────────┘
```

**Features:**
- Category filters at top
- Card-based news layout
- Featured image for each article
- Audio playback option
- Timestamp in local language
- Share functionality
- Infinite scroll

---

## Screen 6: News Detail
```
┌─────────────────────────────────┐
│  ← Back                    ⋮    │
├─────────────────────────────────┤
│                                 │
│  [Full Width News Image]        │
│                                 │
├─────────────────────────────────┤
│                                 │
│  📍 स्थानीय समाचार              │
│  🕐 2 घंटे पहले                 │
│                                 │
│  नई सरकारी योजना की घोषणा      │
│  ═══════════════════════════     │
│                                 │
│  [🔊 पूरी खबर सुनें]            │
│  [Listen to Full News]          │
│                                 │
│  सरकार ने आज एक नई योजना की    │
│  घोषणा की है जो ग्रामीण क्षेत्रों│
│  में रोजगार के अवसर बढ़ाएगी।   │
│  इस योजना के तहत...            │
│                                 │
│  [Full article text continues   │
│   in user's local language]     │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Related Links:                 │
│  • योजना के लिए आवेदन करें      │
│  • अधिक जानकारी                │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  [📤 Share] [🔖 Bookmark]       │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Full article view
- Audio narration of entire article
- Related links and resources
- Share and bookmark options
- Large, readable text
- Scrollable content

---

## Screen 7: Constitutional Rights
```
┌─────────────────────────────────┐
│  ← Back    आपके अधिकार     🔍   │
├─────────────────────────────────┤
│                                 │
│  संविधान द्वारा प्रदत्त अधिकार  │
│  Constitutional Rights          │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 📚 शिक्षा का अधिकार     │    │
│  │    Right to Education   │    │
│  │                         │    │
│  │    [🔊 सुनें] [Read →]  │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 💼 रोजगार का अधिकार     │    │
│  │    Right to Employment  │    │
│  │                         │    │
│  │    [🔊 सुनें] [Read →]  │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🏥 स्वास्थ्य का अधिकार  │    │
│  │    Right to Health      │    │
│  │                         │    │
│  │    [🔊 सुनें] [Read →]  │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🗳️ मतदान का अधिकार      │    │
│  │    Right to Vote        │    │
│  │                         │    │
│  │    [🔊 सुनें] [Read →]  │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ ⚖️ समानता का अधिकार     │    │
│  │    Right to Equality    │    │
│  │                         │    │
│  │    [🔊 सुनें] [Read →]  │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
│  [🏠 Home] [📰 News] [⚖️ Rights] │
└─────────────────────────────────┘
```

**Features:**
- Categorized rights list
- Bilingual labels
- Audio explanation option
- Simple card layout
- Icons for visual recognition
- Scrollable list

---

## Screen 8: Rights Detail
```
┌─────────────────────────────────┐
│  ← Back                    ⋮    │
├─────────────────────────────────┤
│                                 │
│  📚 शिक्षा का अधिकार            │
│     Right to Education          │
│                                 │
│  ═══════════════════════════     │
│                                 │
│  [🔊 पूरा विवरण सुनें]          │
│  [Listen to Full Description]   │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  क्या है यह अधिकार?             │
│  What is this right?            │
│                                 │
│  भारतीय संविधान के अनुच्छेद 21A │
│  के तहत, 6 से 14 वर्ष के सभी   │
│  बच्चों को मुफ्त और अनिवार्य   │
│  शिक्षा का अधिकार है।          │
│                                 │
│  [Detailed explanation in       │
│   user's local language]        │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  आप क्या कर सकते हैं?           │
│  What you can do?               │
│                                 │
│  • नजदीकी स्कूल में दाखिला लें  │
│  • मुफ्त किताबें प्राप्त करें   │
│  • छात्रवृत्ति के लिए आवेदन करें│
│                                 │
│  ─────────────────────────────  │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 📞 हेल्पलाइन नंबर       │    │
│  │    1800-XXX-XXXX        │    │
│  │    [📞 Call Now]        │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🤖 AI से पूछें           │    │
│  │    Ask AI Assistant     │    │
│  └─────────────────────────┘    │
│                                 │
│  [📤 Share] [🔖 Bookmark]       │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Detailed explanation
- Audio narration
- Actionable steps
- Helpline integration
- Direct link to AI assistant
- Share and bookmark

---

## Screen 9: Side Menu
```
┌─────────────────────────────────┐
│                                 │
│  ┌─────────────────────────┐    │
│  │   [Profile Picture]     │    │
│  │                         │    │
│  │   [User Name]           │    │
│  │   [Phone Number]        │    │
│  └─────────────────────────┘    │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  🏠  होम / Home                 │
│                                 │
│  🤖  AI सहायक / AI Assistant    │
│                                 │
│  📰  समाचार / News              │
│                                 │
│  ⚖️  अधिकार / Rights            │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  🌐  भाषा बदलें / Change Lang   │
│                                 │
│  🔖  सहेजे गए / Bookmarks       │
│                                 │
│  📞  हेल्पलाइन / Helpline       │
│                                 │
│  ℹ️  ऐप के बारे में / About     │
│                                 │
│  ⚙️  सेटिंग्स / Settings        │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  🚪  लॉग आउट / Logout           │
│                                 │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- User profile section
- All main navigation
- Language switcher
- Bookmarks access
- Settings and help
- Logout option

---

## Screen 10: Settings
```
┌─────────────────────────────────┐
│  ← Back      सेटिंग्स           │
├─────────────────────────────────┤
│                                 │
│  भाषा / Language                │
│  ┌─────────────────────────┐    │
│  │  हिंदी              [>] │    │
│  └─────────────────────────┘    │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  सूचनाएं / Notifications        │
│  ┌─────────────────────────┐    │
│  │  समाचार        [Toggle] │    │
│  │  News                   │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  सरकारी योजना  [Toggle] │    │
│  │  Govt Schemes           │    │
│  └─────────────────────────┘    │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  आवाज / Voice                   │
│  ┌─────────────────────────┐    │
│  │  आवाज की गति            │    │
│  │  Voice Speed            │    │
│  │  [Slow] [Normal] [Fast] │    │
│  └─────────────────────────┘    │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  डेटा / Data                    │
│  ┌─────────────────────────┐    │
│  │  ऑफलाइन मोड    [Toggle] │    │
│  │  Offline Mode           │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  कम डेटा मोड   [Toggle] │    │
│  │  Low Data Mode          │    │
│  └─────────────────────────┘    │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  फ़ॉन्ट आकार / Font Size        │
│  ┌─────────────────────────┐    │
│  │  [A-] [A] [A+]          │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Language selection
- Notification preferences
- Voice speed control
- Offline mode toggle
- Data saving options
- Font size adjustment
- Accessibility options

---

## Key UI/UX Considerations

### Accessibility
- Large touch targets (minimum 48x48dp)
- High contrast colors
- Voice input/output throughout
- Simple, clear iconography
- Bilingual labels everywhere
- Font size adjustments

### Localization
- Right-to-left support if needed
- Local number formats
- Date/time in local format
- Cultural sensitivity in imagery
- Regional dialect support

### Performance
- Offline-first architecture
- Progressive image loading
- Cached content
- Low bandwidth optimization
- Battery efficient

### User Flow Priority
1. Voice interaction (primary)
2. Visual navigation (secondary)
3. Text input (tertiary)

### Color Scheme Suggestion
- Primary: Deep Blue (#1565C0) - Trust, authority
- Secondary: Warm Orange (#FF6F00) - Energy, accessibility
- Success: Green (#2E7D32) - Positive actions
- Background: Light Gray (#F5F5F5) - Easy on eyes
- Text: Dark Gray (#212121) - Readability
- Accent: Amber (#FFA000) - Highlights

### Typography
- Primary Font: Noto Sans (supports multiple Indian scripts)
- Fallback: System default
- Sizes: 
  - Headers: 24sp
  - Body: 16sp
  - Captions: 14sp
  - Buttons: 18sp

---

## Technical Implementation Notes

### AI Assistant
- Speech-to-text in local language
- Text-to-speech for responses
- Context-aware responses
- Offline fallback with cached FAQs

### News Panel
- RSS feed aggregation
- Auto-translation to local language
- Image optimization
- Audio generation for articles

### Rights Section
- Static content with regular updates
- Simplified legal language
- Visual aids and examples
- Direct action links

### Data Sync
- Background sync when online
- Priority: Rights > News > AI history
- Compression for low bandwidth
- Delta updates only

---

## Future Enhancements
- Video content support
- Community forum
- Direct government service links
- Document scanner for forms
- Scheme eligibility checker
- Location-based services
- SMS fallback for critical info

---

*This wireframe prioritizes simplicity, accessibility, and local language support to effectively serve marginal and tribal communities.*
