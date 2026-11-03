# DSA MASTER AI — Firebase Firestore Database Schema

This document details the database collections, documents, subcollections, security rules, and indexing requirements for **DSA MASTER AI**.

---

## 1. Collections Architecture Overview

```
firestore/
├── users/
│   └── {userId}/
│       ├── profile (document fields)
│       ├── progress/
│       │   └── syllabus (document with topic completion map)
│       ├── labSubmissions/
│       │   └── {submissionId} (lab practical exam test results)
│       └── vivaHistory/
│           └── {vivaSessionId} (viva turns, questions, scores)
├── questions/
│   └── {questionId} (MCQs, 2M, 5M, 10M repository)
└── labExperiments/
    └── {experimentId} (15 university lab experiments master data)
```

---

## 2. Detailed Collection Schemas

### 2.1 `users` Collection
- **Document ID**: Firebase Auth UID (`auth.currentUser.uid`)
- **Fields**:
  ```json
  {
    "uid": "string (e.g. 'usr_9812401')",
    "displayName": "string (e.g. 'Aditya Sharma')",
    "email": "string (e.g. 'aditya.student@srmist.edu.in')",
    "university": "string (e.g. 'SRM Institute of Science and Technology')",
    "degree": "string (e.g. 'B.Tech CSE')",
    "semester": 3,
    "xp": 1250,
    "streak": 7,
    "lastActiveDate": "2026-11-03T18:30:00Z",
    "unlockedBadges": [
      "b-struct",
      "b-ll",
      "b-stack",
      "b-queue"
    ],
    "overallReadiness": {
      "syllabusCompletion": 68,
      "labReadiness": 85,
      "vivaReadiness": 78
    },
    "createdAt": "TIMESTAMP",
    "updatedAt": "TIMESTAMP"
  }
  ```

### 2.2 `users/{userId}/progress/syllabus` Document
- **Fields**:
  ```json
  {
    "completedTopics": {
      "u1-struct": true,
      "u1-self-ref": true,
      "u1-ptr-struct": true,
      "u1-dma": true,
      "u2-linked-list": true,
      "u2-doubly-ll": true,
      "u3-stack": true,
      "u3-queue": true,
      "u4-bst": true,
      "u5-bfs": true
    },
    "unitBreakdown": {
      "unit1": 100,
      "unit2": 75,
      "unit3": 80,
      "unit4": 65,
      "unit5": 40
    },
    "weakAreas": [
      "AVL Double Rotations (LR/RL)",
      "Kruskal Cycle Detection via DSU"
    ],
    "strongAreas": [
      "Linked Lists",
      "Stack Applications",
      "BST Traversals"
    ]
  }
  ```

### 2.3 `users/{userId}/labSubmissions` Subcollection
- **Document ID**: Auto-generated (`sub_xxx`)
- **Fields**:
  ```json
  {
    "submissionId": "string",
    "experimentTitle": "Implement Queue using Linked List",
    "question": "Implement Queue using Linked List with enqueue, dequeue, and display in C.",
    "submittedCode": "string (complete C code)",
    "timeTakenMinutes": 28,
    "totalMarks": 9.0,
    "maxMarks": 10,
    "breakdown": {
      "logic": 2.5,
      "validation": 2.0,
      "output": 2.0,
      "readability": 1.0,
      "viva": 1.5
    },
    "verdict": "Distinction",
    "timeComplexity": "O(1) enqueue/dequeue",
    "spaceComplexity": "O(N) heap nodes",
    "bugsDetected": [],
    "generatedViva": [
      {
        "question": "What happens if rear is not set to NULL when the last element is dequeued?",
        "sampleAnswer": "Rear becomes a dangling pointer pointing to deallocated memory."
      }
    ],
    "submittedAt": "TIMESTAMP"
  }
  ```

### 2.4 `users/{userId}/vivaHistory` Subcollection
- **Document ID**: Auto-generated (`viva_xxx`)
- **Fields**:
  ```json
  {
    "sessionId": "string",
    "topic": "Linked List",
    "finalScore": 88,
    "highestDifficultyReached": "Hard",
    "turnsCount": 5,
    "turns": [
      {
        "question": "Explain how Floyd's cycle detection algorithm works in C.",
        "studentAnswer": "We use fast and slow pointers...",
        "examinerCritique": "Good explanation of pointer traversal...",
        "scoreDelta": 12,
        "difficulty": "Medium"
      }
    ],
    "createdAt": "TIMESTAMP"
  }
  ```

---

## 3. Firestore Security Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // User profiles & progress data
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
      
      match /progress/{document=**} {
        allow read, write: if isOwner(userId);
      }
      
      match /labSubmissions/{submissionId} {
        allow read, write: if isOwner(userId);
      }
      
      match /vivaHistory/{sessionId} {
        allow read, write: if isOwner(userId);
      }
    }

    // Public read-only syllabus and question bank
    match /questions/{questionId} {
      allow read: if true;
      allow write: if false; // Admin managed only
    }

    match /labExperiments/{experimentId} {
      allow read: if true;
      allow write: if false; // Admin managed only
    }
  }
}
```

---

## 4. Firestore Composite Indexes

For optimized queries across student analytics:
1. **Collection**: `users/{userId}/labSubmissions`
   - Fields: `submittedAt` (DESC), `totalMarks` (DESC)
2. **Collection**: `users/{userId}/vivaHistory`
   - Fields: `createdAt` (DESC), `finalScore` (DESC)
