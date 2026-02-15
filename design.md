# System Design Document
## Voice-Based Digital Assistant for Marginalized Communities

---

## 1. System Architecture Overview

The system follows a **voice-first, offline-friendly architecture** where user speech is processed locally, interpreted using cultural context, and converted into easy-to-understand responses.

### 1.1 High-Level Architecture

```
╔═══════════════════════════════════════════════════════════════════╗
║                    MOBILE APPLICATION (Android)                    ║
╠═══════════════════════════════════════════════════════════════════╣
║  ┌────────────────────────────────────────────────────────────┐  ║
║  │                  PRESENTATION LAYER                         │  ║
║  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  ║
║  │  │  Voice   │  │  Visual  │  │  Audio   │  │Navigation│  │  ║
║  │  │   UI     │  │   UI     │  │  Player  │  │  Manager │  │  ║
║  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │  ║
║  └────────────────────────────────────────────────────────────┘  ║
║                              │                                     ║
║                              ▼                                     ║
║  ┌────────────────────────────────────────────────────────────┐  ║
║  │                   BUSINESS LOGIC LAYER                      │  ║
║  │  ┌──────────────────────────────────────────────────────┐  │  ║
║  │  │           Voice Processing Engine                     │  │  ║
║  │  │  • Speech-to-Text  • Intent Recognition              │  │  ║
║  │  │  • Text-to-Speech  • Context Management              │  │  ║
║  │  └──────────────────────────────────────────────────────┘  │  ║
║  │  ┌──────────────────────────────────────────────────────┐  │  ║
║  │  │           Cultural Context Engine                     │  │  ║
║  │  │  • Term Mapping    • Metaphor Translation            │  │  ║
║  │  │  • Measurement     • Regional Adaptation             │  │  ║
║  │  └──────────────────────────────────────────────────────┘  │  ║
║  │  ┌──────────────────────────────────────────────────────┐  │  ║
║  │  │           Service Modules                             │  │  ║
║  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │  │  ║
║  │  │  │Healthcare│ │ Welfare  │ │Education │            │  │  ║
║  │  │  │ Service  │ │ Service  │ │& Legal   │            │  │  ║
║  │  │  └──────────┘ └──────────┘ └──────────┘            │  │  ║
║  │  └──────────────────────────────────────────────────────┘  │  ║
║  └────────────────────────────────────────────────────────────┘  ║
║                              │                                     ║
║                              ▼                                     ║
║  ┌────────────────────────────────────────────────────────────┐  ║
║  │                    DATA LAYER                               │  ║
║  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  ║
║  │  │  SQLite  │  │  Content │  │   User   │  │  Cache   │  │  ║
║  │  │    DB    │  │  Store   │  │   Prefs  │  │  Manager │  │  ║
║  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │  ║
║  └────────────────────────────────────────────────────────────┘  ║
║                              │                                     ║
║                              ▼                                     ║
║  ┌────────────────────────────────────────────────────────────┐  ║
║  │              SYNC MODULE (When Online)                      │  ║
║  │  • Content Updates  • Version Check  • Delta Sync          │  ║
║  └────────────────────────────────────────────────────────────┘  ║
╚══════════════════════════════════════════════════════════════════╝
                               │
                               ▼ (Optional - When Internet Available)
                    ┌──────────────────────┐
                    │   BACKEND SERVICES   │
                    │   (AWS/Government)   │
                    └──────────────────────┘
```

---

## 2. Component Design

### 2.1 User Interface Layer

#### 2.1.1 Voice Input Component
```
┌─────────────────────────────┐
│   🎤 PRESS TO SPEAK         │
│                             │
│   [Large Circular Button]   │
│                             │
│   Status: Ready / Listening │
└─────────────────────────────┘
```

**Responsibilities**:
- Capture voice input via microphone
- Provide visual feedback during recording
- Handle push-to-talk interaction
- Display recording status

**Key Features**:
- Large touch target (120x120dp minimum)
- Visual animation during listening
- Haptic feedback on press
- Clear status indicators

#### 2.1.2 Visual Navigation Component
```
┌─────────────────────────────────────┐
│  ┌─────────┐  ┌─────────┐          │
│  │   🏥    │  │   📋    │          │
│  │ Health  │  │ Welfare │          │
│  └─────────┘  └─────────┘          │
│  ┌─────────┐  ┌─────────┐          │
│  │   📚    │  │   ⚖️    │          │
│  │Education│  │  Legal  │          │
│  └─────────┘  └─────────┘          │
└─────────────────────────────────────┘
```

---

### 2.2 Voice Processing Module

#### 2.2.1 Voice Processing Pipeline

```
Step 1: AUDIO CAPTURE
┌──────────────────────┐
│  Microphone Input    │  Raw audio stream (16kHz)
└──────────┬───────────┘
           │
           ▼
Step 2: PREPROCESSING
┌──────────────────────┐
│  • Noise Reduction   │  Clean audio signal
│  • Normalization     │
└──────────┬───────────┘
           │
           ▼
Step 3: SPEECH-TO-TEXT
┌──────────────────────┐
│  Android ASR Engine  │  Text: "bukhar ki dawa"
│  (Offline Mode)      │
└──────────┬───────────┘
           │
           ▼
Step 4: INTENT DETECTION
┌──────────────────────┐
│  • Intent: GET_INFO  │  Category: Healthcare
│  • Entity: fever     │  Action: Get medicine info
└──────────┬───────────┘
           │
           ▼
Step 5: CULTURAL MAPPING
┌──────────────────────┐
│  "bukhar" → "fever"  │  Term translation
└──────────┬───────────┘
           │
           ▼
Step 6: CONTENT RETRIEVAL
┌──────────────────────┐
│  Query Database      │  Fetch fever info
└──────────┬───────────┘
           │
           ▼
Step 7: RESPONSE GENERATION
┌──────────────────────┐
│  Format in Local     │  "Bukhar ki dawa..."
│  Language            │
└──────────┬───────────┘
           │
           ▼
Step 8: TEXT-TO-SPEECH
┌──────────────────────┐
│  Android TTS Engine  │  Audio output
└──────────┬───────────┘
           │
           ▼
Step 9: PLAYBACK
┌──────────────────────┐
│  Speaker + Visuals   │  User hears & sees response
└──────────────────────┘
```

#### 2.2.2 Implementation Example

```kotlin
class VoiceProcessor(private val context: Context) {
    private var speechRecognizer: SpeechRecognizer? = null
    private var tts: TextToSpeech? = null
    
    fun startListening(language: String = "hi-IN") {
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, language)
            putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, true)
        }
        speechRecognizer?.startListening(intent)
    }
    
    fun speak(text: String) {
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, null)
    }
}
```

---

### 2.3 Cultural Context Layer

#### 2.3.1 Term Mapping Engine

**Purpose**: Translate official/medical terms to local vocabulary

**Example Mappings**:
```
Official Term          → Local Term
─────────────────────────────────────
"Diabetes"            → "Sugar ki bimari"
"Hypertension"        → "High blood pressure"
"Immunization"        → "Teeka"
"Ration Card"         → "Rashan card"
"Birth Certificate"   → "Janam praman patra"
```

**Data Structure**:
```json
{
  "term_id": "T001",
  "official_term": "Diabetes",
  "local_terms": [
    {"language": "Hindi", "term": "Sugar ki bimari"},
    {"language": "Gondi", "term": "[Local term]"}
  ],
  "context": "medical"
}
```

#### 2.3.2 Metaphor Translator

**Purpose**: Use culturally relevant examples

**Examples**:
```
Medical Concept        → Cultural Metaphor
─────────────────────────────────────────────
"Blood circulation"   → "Khoon ka behna jaise nadi mein pani"
"Immune system"       → "Sharir ki raksha shakti"
"Balanced diet"       → "Sahi khana jaise kheti mein sahi khad"
```

#### 2.3.3 Measurement Adapter

**Purpose**: Convert standard measurements to familiar units

**Conversions**:
```
Standard              → Local Equivalent
────────────────────────────────────────
"50mg tablet"        → "Ek chhoti goli"
"3 times a day"      → "Subah, dopahar, shaam"
"1 kilometer"        → "Gaon se school tak ki doori"
"100ml"              → "Ek chhota glass"
```

#### 2.3.4 Implementation Example

```kotlin
class TermMapper(private val dao: TermMappingDao) {
    suspend fun mapToLocal(
        officialTerm: String,
        language: String,
        context: String? = null
    ): String {
        val mapping = dao.findMapping(officialTerm, language, context)
        return mapping?.localTerm ?: officialTerm
    }
}
```

---

### 2.4 Service Guidance Module

#### 2.4.1 Service Structure

```
                    ┌──────────────────┐
                    │  SERVICE ROUTER  │
                    └────────┬─────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
┌───────────────────┐ ┌──────────────┐ ┌──────────────┐
│ HEALTHCARE        │ │  WELFARE     │ │  EDUCATION   │
│ SERVICE           │ │  SERVICE     │ │  & LEGAL     │
├───────────────────┤ ├──────────────┤ ├──────────────┤
│ • Common          │ │ • Food       │ │ • School     │
│   Conditions      │ │   Security   │ │   Enrollment │
│ • Maternal        │ │ • Financial  │ │ • Scholars   │
│   Health          │ │   Assistance │ │ • Legal      │
│ • Child Health    │ │ • Housing    │ │   Rights     │
│ • Preventive      │ │ • Employment │ │              │
│   Care            │ │              │ │              │
└───────────────────┘ └──────────────┘ └──────────────┘
```

#### 2.4.2 Healthcare Service Example

```kotlin
class HealthcareService(
    private val contentRepository: ContentRepository,
    private val termMapper: TermMapper
) {
    suspend fun getConditionInfo(
        condition: String,
        language: String
    ): HealthcareResponse? {
        // Map local term to official term
        val officialCondition = termMapper.mapToOfficial(condition, language)
        
        // Fetch content
        val content = contentRepository.getHealthcareContent(
            subcategory = officialCondition,
            language = language
        )
        
        return content?.let { parseHealthcareContent(it) }
    }
}

data class HealthcareResponse(
    val condition: String,
    val localName: String,
    val symptoms: List<String>,
    val homeCare: List<HomeCareStep>,
    val whenToSeekHelp: String
)
```

---

### 2.5 Data Storage Layer

#### 2.5.1 Database Schema

```sql
-- Content Table
CREATE TABLE content (
    id INTEGER PRIMARY KEY,
    category TEXT NOT NULL,
    subcategory TEXT,
    title TEXT NOT NULL,
    content_json TEXT NOT NULL,
    language TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    last_updated TIMESTAMP
);

-- Term Mappings
CREATE TABLE term_mappings (
    id INTEGER PRIMARY KEY,
    official_term TEXT NOT NULL,
    local_term TEXT NOT NULL,
    language TEXT NOT NULL,
    context TEXT,
    usage_count INTEGER DEFAULT 0
);

-- User Preferences
CREATE TABLE user_preferences (
    id INTEGER PRIMARY KEY,
    language TEXT NOT NULL,
    region TEXT,
    voice_speed REAL DEFAULT 1.0
);
```

#### 2.5.2 Entity Implementation

```kotlin
@Entity(tableName = "content")
data class Content(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val category: String,
    val subcategory: String?,
    val title: String,
    val contentJson: String,
    val language: String,
    val version: Int = 1,
    val lastUpdated: Long = System.currentTimeMillis()
)

@Dao
interface ContentDao {
    @Query("SELECT * FROM content WHERE category = :category AND language = :language")
    suspend fun getContentByCategory(category: String, language: String): List<Content>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertContent(content: Content)
}
```

---

## 3. Data Flow Diagrams

### 3.1 User Interaction Flow

```
                        ┌─────────────┐
                        │    START    │
                        └──────┬──────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  User Presses Mic    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Recording...        │
                    │  [Animated Mic]      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  User Speaks Query   │
                    │  "Bukhar ki dawa?"   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Processing...       │
                    └──────────┬───────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
    ┌───────────────────┐         ┌───────────────────┐
    │  Query Understood │         │  Query Not Clear  │
    └─────────┬─────────┘         └─────────┬─────────┘
              │                               │
              ▼                               ▼
    ┌───────────────────┐         ┌───────────────────┐
    │  Fetch Content    │         │  Ask to Repeat    │
    └─────────┬─────────┘         └───────────────────┘
              │
              ▼
    ┌───────────────────┐
    │  Apply Cultural   │
    │  Context          │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │  Play Audio +     │
    │  Show Visuals     │
    └─────────┬─────────┘
              │
              ▼
        ┌─────────────┐
        │     END     │
        └─────────────┘
```

### 3.2 Offline-First Architecture

```
                    ┌──────────────┐
                    │  USER QUERY  │
                    └──────┬───────┘
                           │
                           ▼
                ┌──────────────────────┐
                │  Check Internet?     │
                └──────┬───────────────┘
                       │
            ┌──────────┴──────────┐
            │                     │
           NO                    YES
            │                     │
            ▼                     ▼
┌───────────────────────┐  ┌──────────────────┐
│  OFFLINE MODE         │  │  ONLINE MODE     │
├───────────────────────┤  ├──────────────────┤
│ • Use Local Database  │  │ • Check Updates  │
│ • Process Locally     │  │ • Sync if New    │
│ • Return Result       │  │ • Use Local DB   │
└───────────────────────┘  └──────────────────┘
            │                     │
            └──────────┬──────────┘
                       │
                       ▼
                ┌──────────────┐
                │  RESPONSE    │
                └──────────────┘
```

### 3.3 Content Update Flow

```
┌──────────────┐
│ WiFi Detected│
└──────┬───────┘
       │
       ▼
┌──────────────────┐      NO
│ > 7 Days Old?    │──────────► Skip
└──────┬───────────┘
       │ YES
       ▼
┌──────────────────┐
│ Contact Server   │
│ Get Version Info │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐      NO
│ New Version?     │──────────► Skip
└──────┬───────────┘
       │ YES
       ▼
┌──────────────────┐
│ Download Delta   │
│ (Only Changes)   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Verify & Apply   │
│ to Database      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Notify User      │
└──────────────────┘
```

---

## 4. Security & Privacy Design

### 4.1 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 1: APPLICATION SECURITY                                    │
├─────────────────────────────────────────────────────────────────┤
│ • Code Obfuscation (ProGuard/R8)                                │
│ • No Hardcoded Secrets                                          │
│ • Secure Coding Practices                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 2: DATA SECURITY                                          │
├─────────────────────────────────────────────────────────────────┤
│ • Encrypted Local Storage (SQLCipher)                           │
│ • No Sensitive Data Collection                                  │
│ • Secure Preferences (EncryptedSharedPreferences)               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 3: NETWORK SECURITY                                       │
├─────────────────────────────────────────────────────────────────┤
│ • HTTPS Only (Certificate Pinning)                              │
│ • Signed Content Updates                                        │
│ • No Tracking / Analytics by Default                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 4: PLATFORM SECURITY                                      │
├─────────────────────────────────────────────────────────────────┤
│ • Android Sandbox                                               │
│ • Permission Management                                         │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Privacy Principles

1. **Data Minimization**: Collect only essential data
2. **On-Device Processing**: All voice processing happens locally
3. **No Tracking**: No user behavior tracking without consent
4. **Transparent**: Clear privacy policy in local language

---

## 5. Deployment Architecture

### 5.1 Deployment Flow

```
CONTENT CREATION
────────────────────────────────────────────────────────────────
┌──────────────────┐
│ Content Creators │ (Experts, NGOs, Government)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Content CMS      │ (Web Portal)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Verification     │ (Domain Experts)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Content Server   │ (AWS S3 / Government Server)
└────────┬─────────┘
         │
         │
DISTRIBUTION
────────────────────────────────────────────────────────────────
         │
    ┌────┴────┬────────┬────────┐
    │         │        │        │
    ▼         ▼        ▼        ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Play   │ │ Direct │ │  NGO   │ │Pre-    │
│ Store  │ │  APK   │ │ Distri │ │Install │
└───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
    │          │          │          │
    └──────────┴────┬─────┴──────────┘
                    │
                    ▼
         ┌──────────────────┐
         │  Android Device  │
         │  ┌────────────┐  │
         │  │    App     │  │
         │  └────────────┘  │
         │  ┌────────────┐  │
         │  │ Local DB   │  │
         │  └────────────┘  │
         └──────────────────┘
```

---

## 6. Technology Stack & Dependencies

### 6.1 Core Dependencies

```gradle
dependencies {
    // Core Android
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    
    // Jetpack Compose (UI)
    implementation 'androidx.compose.ui:ui:1.6.0'
    implementation 'androidx.compose.material3:material3:1.2.0'
    
    // Room Database
    implementation 'androidx.room:room-runtime:2.6.1'
    implementation 'androidx.room:room-ktx:2.6.1'
    kapt 'androidx.room:room-compiler:2.6.1'
    
    // Coroutines
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
    
    // Dependency Injection (Hilt)
    implementation 'com.google.dagger:hilt-android:2.50'
    kapt 'com.google.dagger:hilt-compiler:2.50'
    
    // WorkManager (Background tasks)
    implementation 'androidx.work:work-runtime-ktx:2.9.0'
    
    // Gson (JSON parsing)
    implementation 'com.google.code.gson:gson:2.10.1'
}
```

### 6.2 Project Structure

```
voice-assistant/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/project/voiceassistant/
│   │   │   │   ├── ui/
│   │   │   │   ├── voice/
│   │   │   │   ├── cultural/
│   │   │   │   ├── services/
│   │   │   │   ├── data/
│   │   │   │   └── sync/
│   │   │   └── res/
│   │   └── test/
│   └── build.gradle
└── content/
    ├── healthcare/
    ├── welfare/
    ├── education/
    └── legal/
```

---

## 7. Performance Optimization

### 7.1 Optimization Strategies

1. **Lazy Loading**: Load content on-demand
2. **Content Compression**: Compress audio and images
3. **Database Indexing**: Fast query retrieval
4. **Memory Management**: Efficient cache management (LRU cache, max 50MB)
5. **Battery Optimization**: Minimize background processes

### 7.2 Performance Targets

| Metric | Target |
|--------|--------|
| App Startup | < 3 seconds |
| Voice Response | < 2 seconds |
| Memory Usage | < 150MB |
| Storage | < 100MB |
| Battery Impact | < 5% per hour |

---

## 8. Future Enhancements

### Phase 2 Features

- **Image Recognition**: Medicine identification, document scanning
- **Multi-modal Input**: Voice + Image, gesture support
- **Community Features**: Local health worker connect, community Q&A
- **Advanced Analytics**: Usage patterns (anonymized), content effectiveness

### Scalability Roadmap

1. **More Languages**: Add 10+ tribal languages
2. **Regional Customization**: State-specific content
3. **Integration**: Connect with government portals
4. **Offline AI**: On-device ML models for better understanding

---

**Document Version**: 2.0  
**Last Updated**: February 15, 2026  
**Status**: Final
