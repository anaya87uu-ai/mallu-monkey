

# Mallu Monkey — Omegle-Style Video Chat App

## App Overview
A modern, dark-themed video chat app with a **liquid glass** aesthetic where strangers can connect via video/voice calls, chat in real-time, and skip to the next person.

---

## Pages & Navigation

### 1. **Home Page**
- Hero section with bold tagline, animated liquid glass elements, and a prominent "Start Chatting" CTA
- Brief feature highlights (video call, anonymous chat, gender filter)
- Dark gradient background with glassmorphism cards

### 2. **About Page**
- App mission, how it works (3-step flow), and community guidelines
- Liquid glass styled cards

### 3. **Contact Us Page**
- Contact form (name, email, message) with glass-styled inputs
- Social media links

### 4. **Auth Page (Login / Signup)**
- Email + password login & registration
- Guest mode (skip login, limited features)
- Gender selection: Boy / Girl option during signup
- Dark glass-styled form with smooth transitions between login/signup

### 5. **Video Chat Room (Core Feature)**
- **Split-screen layout**: Your camera on one side, stranger's camera on the other
- **Skip button**: Instantly disconnect and match with the next stranger
- **Text chat panel**: Slide-out or side panel for messaging during the call
- **Controls bar**: Mute mic, toggle camera, end call, skip next
- **Matching screen**: Animated "Finding a stranger..." loading state
- Camera & microphone permission prompts

---

## Core Features

### Authentication (Supabase)
- Email/password signup with gender (boy/girl) selection
- Guest login option (anonymous, no account required)
- User profiles table storing gender, display name, online status

### Real-Time Video Calling (WebRTC + Supabase Realtime)
- Peer-to-peer video/audio using WebRTC
- Supabase Realtime channels for signaling (offer/answer/ICE candidates)
- Random stranger matching based on available online users
- Gender filter option (match with boys, girls, or anyone)

### In-Call Chat
- Real-time text messaging with the connected stranger during video call
- Messages visible in a side panel alongside the video

### Skip / Next Stranger
- One-click skip to disconnect and instantly match with the next available person
- Smooth transition animation between connections

---

## Design System
- **Theme**: Dark mode with liquid glass / glassmorphism effects
- **Colors**: Deep dark backgrounds, glowing accent colors (purple/cyan gradients)
- **Glass effects**: Backdrop blur, translucent cards, subtle borders with glow
- **Typography**: Clean, modern sans-serif
- **Animations**: Smooth transitions, pulse effects on matching, floating glass elements

---

## Tech Stack
- **Frontend**: React + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Auth, Database, Realtime for signaling)
- **Video**: WebRTC (browser native APIs)
- **Signaling**: Supabase Realtime channels for WebRTC handshake

---

## Implementation Order
1. Design system — dark liquid glass theme & global styles
2. Layout & navigation — header, footer, page routing
3. Static pages — Home, About, Contact Us
4. Authentication — Supabase auth with gender selection & guest mode
5. Video chat room UI — camera views, controls, chat panel
6. WebRTC video calling — camera/mic access, peer connections
7. Stranger matching — online user queue & random pairing via Supabase
8. Real-time signaling — WebRTC offer/answer exchange via Supabase Realtime
9. In-call text chat — real-time messaging during calls
10. Skip/next functionality — disconnect & re-match flow

