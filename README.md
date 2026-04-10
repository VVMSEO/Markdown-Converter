# Markdown Converter

A web application built with React, Vite, and Firebase that allows you to write Markdown and preview it in real-time as rendered HTML or plain text.

## Features

- Split-pane layout: Markdown editor on the left, preview on the right.
- Toggle preview mode: Rendered HTML or Plain Text.
- Auto-save: Drafts are automatically saved to Firestore every 500ms using Anonymous Authentication.
- Export options: Copy HTML, Copy Plain Text, Download `.html`, Download `.txt`.

## Tech Stack

- React 18 + Vite
- Firebase 10 (Firestore + Anonymous Auth)
- `react-markdown` + `remark-gfm` for rendering
- `marked` + `dompurify` for HTML conversion and sanitization
- Tailwind CSS for styling

## Setup Instructions

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the `.env.example` file to `.env` and fill in your Firebase configuration keys:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Firebase Configuration Guide

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Enable **Firestore Database** in test mode (you will update the rules later).
4. Go to **Authentication** -> **Sign-in method** and enable **Anonymous**.
5. Go to **Project settings** -> **General** -> **Your apps** and add a Web App.
6. Copy the Firebase configuration object and paste the values into your `.env` file.

### Firestore Security Rules

Update your Firestore security rules to the following to ensure users can only access their own drafts:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /documents/{userId}/drafts/{docId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```
