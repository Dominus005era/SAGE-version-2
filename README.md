# 🧠 SAGE (Version 2) — AI-Powered EdTech & Learning Engine

SAGE (Version 2) is a next-generation, AI-driven micro-learning application built on **Vite**, **React**, and **TypeScript**. It utilizes the **Google GenAI SDK** (Gemini) to generate dynamic, personalized micro-learning content, and integrates with **Firebase** for cloud data storage and authentication.

This version is designed as an interactive template deployable to **Google AI Studio** or standalone cloud hosting.

---

## ✨ Features

- 🤖 **Dynamic Content Generation**: Uses `gemini-3-flash-preview` to generate custom 20-30 second micro-facts or scenario-based logic challenges on the fly.
- 🎯 **Tailored Gamification**: Real-time tracking of user experience points (XP), leveling progress, streaks, mastery scores, and category metrics.
- 💾 **Firebase Integration**: Saves user profiles, bookmarked learning items, and mistake logs inside Cloud Firestore.
- 🌐 **Real-time Localization**: Requests Gemini to output text in the user's selected language (e.g., English, Spanish, Hindi, etc.) for personalized localization.
- ⚡ **Express + Vite Server**: A unified server script (`server.ts`) running Express with Vite middleware in development and serving the static bundle in production.
- 🎭 **Rich Micro-animations**: Powered by **Framer Motion** (Motion) and canvas-confetti.

---

## 🛠️ Tech Stack

- **Frontend Build Tool**: [Vite 6](https://vite.dev/)
- **Core Library**: [React 19](https://react.dev/)
- **Styling & CSS**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI Core**: [@google/genai (Google GenAI SDK)](https://www.npmjs.com/package/@google/genai)
- **Backend Service**: [Firebase Client SDK v12](https://firebase.google.com/) (Auth, Firestore)
- **Server Framework**: [Express](https://expressjs.com/) with [tsx](https://github.com/privatenumber/tsx) execution
- **Motion & Visuals**: `motion` (Framer Motion) and `canvas-confetti`

---

## 📁 Directory Structure

```
SAGE version 2/
├── src/
│   ├── components/            # Interface Layouts & Views
│   │   ├── AppLayout.tsx      # Sidebar, XP bar, theme selector, and user stats
│   │   ├── KnowledgeCard.tsx  # Dynamic Card for facts/quizzes with logic correction
│   │   └── LandingPage.tsx    # Interactive introductory splash page
│   ├── lib/
│   │   └── firebase.ts        # Firebase Client SDK Configuration & Initialization
│   ├── services/
│   │   └── learningEngine.ts  # Gemini API prompt builder and structured response schema
│   ├── App.tsx                # Application shell with state management (Firebase sync)
│   ├── index.css              # Custom styles and Tailwind imports
│   ├── main.tsx               # Client entry point
│   └── types.ts               # Shared TypeScript schemas (UserProfile, KnowledgeItem)
├── .env.example               # Example template for required environment variables
├── index.html                 # Main HTML index
├── package.json               # Node script list & package dependencies
├── server.ts                  # Hybrid development & production Express server
├── tsconfig.json              # TypeScript compilation rules
└── vite.config.ts             # Vite configuration with Tailwind CSS support
```

---

## ⚙️ Configuration & Setup

### 1. Environment Variables

Create a file named `.env.local` in the root of the project:
```bash
GEMINI_API_KEY="your_google_gemini_api_key"
APP_URL="http://localhost:3000"
```

*Note: For AI Studio deployments, the `GEMINI_API_KEY` is automatically injected at runtime using your user secrets.*

### 2. Firebase Credentials

Ensure you have initialized a Firebase project. Update the config in [src/lib/firebase.ts](file:///E:/SAGE%20WEB/SAGE%20version%202/src/lib/firebase.ts) with your credentials:
```typescript
const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_project.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project.appspot.com",
  messagingSenderId: "your_sender_id",
  appId: "your_app_id"
};
```

---

## 🚀 Running the App

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v18.x or higher recommended).

### Installation

1. Navigate to the project directory:
   ```bash
   cd "SAGE version 2"
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Run the development server (runs express backend server dynamically):
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the Node Express server using `tsx` (enabling Vite middleware). |
| `npm run build` | Builds the React app into the `dist` directory. |
| `npm run preview` | Previews the compiled production bundle via Vite. |
| `npm run clean` | Removes the compiled `dist` directory. |

---

## 📄 License

This project is licensed under the MIT License.
