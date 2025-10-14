# Visual Image Matcher

Visual Image Matcher is a web application to find visually similar products. Users can upload an image or provide an image URL and get a list of products that look similar. The application also allows filtering results by category or product name.

## Features

- Search by image upload or image URL
- Category filtering (Men, Women, Kids)
- Dynamic search by product name after results
- Fast similarity search using Qdrant vector database
- Responsive and interactive UI using React & Tailwind CSS

## Tech Stack

- **Frontend:** React, Tailwind CSS, Lucide-React
- **Backend:** FastAPI
- **Database:** Qdrant (vector search)
- **ML/AI:** CLIP embeddings using `sentence-transformers`
- **Other:** Python-dotenv, PIL, Requests

## Folder Structure

visual-image-matcher/
├── backend/
│ ├── embedding_generator.py
│ ├── main.py
│ └── uploads/
├── frontend/
│ ├── src/
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ ├── NoResultFound.jsx
│ │ └── index.css
│ ├── public/
│ └── package.json
├── venv/
├── .env
├── .gitignore
└── requirements.txt



## Installation

### Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate   # Windows
# or
source venv/bin/activate       # macOS/Linux

pip install -r requirements.txt
uvicorn main:app --reload

Frontend
cd frontend
npm install
npm run dev

Environment Variables

Create a .env file in the root directory with:

VITE_BACKEND_URL=http://localhost:8000
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION_NAME=your_collection_name
FRONTEND_URL=http://localhost:5173

Usage

Open the frontend in a browser (http://localhost:5173).

Upload an image or provide an image URL.

View visually similar products.

Optionally filter by category or product name.
