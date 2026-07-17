# SAGE: MongoDB Schema Design

## User Model (`users` collection)
```javascript
{
  "_id": ObjectId,
  "userId": "firebase_auth_uid",
  "username": "CosmicVoyager",
  "avatarUrl": "https://...",
  "sageLevel": "Universal Sage",
  "xp": 1450,
  "streak": 12,
  "lastLoginDate": ISODate("2024-04-18T..."),
  "masteryScore": 88,
  "categoryProgress": {
    "space": 95,
    "science": 70,
    "nature": 45,
    "brain": 90
  },
  "savedFacts": [ObjectId("knowledge_id_1"), ...],
  "mistakes": [
    {
      "knowledgeId": ObjectId("..."),
      "attemptedAt": ISODate("..."),
      "userResponse": 1,
      "wasCorrect": false
    }
  ],
  "settings": {
    "theme": "dark",
    "appLanguage": "en",
    "responseLanguage": "hi"
  }
}
```

## Knowledge Model (`knowledge` collection)
```javascript
{
  "_id": ObjectId,
  "type": "quiz", // or "fact"
  "category": "brain",
  "title": "The Neuroplasticity Paradox",
  "content": "A patient experiences phantom limb pain. Which logic path explains the brain's error?",
  "options": [
    "Neural Rewiring",
    "Sensory Deprivation",
    "Proprioceptive Drift"
  ],
  "correctOptionIndex": 0,
  "explanation": "Phantom limb pain occurs because the somatosensory cortex re-maps the missing limb's vacant neurons to adjacent areas. This is a flaw in the brain's adaptive logic...",
  "aiGenerated": true,
  "createdAt": ISODate("...")
}
```
