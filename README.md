# iBlog

```plaintext
iBlog/
├── frontend/                      # React Frontend (Vite or Create React App)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/          # Reusable UI components (Button, Modal, etc.)
│   │   ├── context/             # React Context (Auth, Theme, etc.)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/               # Page-level components (Home, Dashboard, etc.)
│   │   ├── services/            # API client setup (Axios/Fetch wrappers)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Node.js & Express Backend
│   ├── prisma/                  # Prisma ORM layer
│   │   ├── migrations/          # Database migration history
│   │   └── schema.prisma        # Database models & configuration
│   ├── src/
│   │   ├── config/              # Configuration files (e.g., passport, db client)
│   │   ├── controllers/         # Request handlers / Business logic
│   │   ├── middlewares/         # Custom Express middlewares (auth, error handling)
│   │   ├── routes/              # Express route definitions
│   │   ├── services/            # Data access & complex operations (Prisma calls)
│   │   ├── utils/               # Helper functions & validators
│   │   ├── app.js               # Express app setup & middleware wiring
│   │   └── server.js            # HTTP server listener
│   ├── .env                     # Backend environment variables (DATABASE_URL, etc.)
│   ├── package.json
│
├── .gitignore
├── package.json                 # Root package.json (optional workspace scripts)
└── README.md
```
