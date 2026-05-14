# Creator Toolkit AI

Premium GitHub Pages + Firebase-ready creator tools website.

## Features
- Caption generator
- Hashtag generator
- Assamese Creator Hub
- Copy buttons
- Clear button
- Save/favourite/history with localStorage
- Optional Firebase Firestore saving
- Dark mode default + light toggle
- Mobile responsive
- PWA manifest

## How to use on GitHub Pages
1. Create a GitHub repository.
2. Upload all files.
3. Go to Settings → Pages.
4. Select main branch and root folder.
5. Open your GitHub Pages link.

## How to connect Firebase
1. Create a Firebase project.
2. Add a Web App.
3. Copy the Firebase config.
4. Paste it in `app.js` inside `firebaseConfig`.
5. Enable Firestore Database.

If Firebase config is empty, the app still works using browser localStorage.

## Suggested Firestore rules for first private testing only
Do not use these permanently for public production.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /captionHistory/{docId} {
      allow read, write: if true;
    }
  }
}
```

For real public launch, use Firebase Authentication and stricter rules.
