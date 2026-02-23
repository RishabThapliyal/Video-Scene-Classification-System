# 🎬 Video Scene Classification System

> AI-powered video analysis tool — search inside any video using natural language.

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Flask](https://img.shields.io/badge/Flask-2.x-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
[![CLIP](https://img.shields.io/badge/OpenAI-CLIP-412991?style=flat-square&logo=openai&logoColor=white)](https://openai.com/research/clip)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=flat-square&logo=github)](https://github.com/RishabThapliyal/Video-Scene-Classification-System)

---

## 📌 What It Does

Upload any video and describe a scene in plain English — the system finds the exact timestamp where that scene appears.

**Example queries:**

- `"a boat on the ocean at sunset"`
- `"person walking in a forest"`
- `"city street with traffic"`

The system processes video frames using OpenAI's **CLIP** model (zero-shot image-text alignment) and returns the matched timestamp with video playback jumping directly to that moment.

---

## 🧠 How It Works

```
User uploads video + types scene description
        ↓
OpenCV extracts 1 frame/sec from video
        ↓
CLIP encodes each frame → image embeddings
CLIP encodes text query → text embedding
        ↓
Cosine similarity computed between text ↔ all frames
        ↓
Top matching frame returned with timestamp
        ↓
React frontend seeks video to that timestamp
```

---

## 🛠️ Tech Stack

| Layer            | Technology                                    |
| ---------------- | --------------------------------------------- |
| Frontend         | React.js, Bootstrap, react-router-dom         |
| Backend          | Python, Flask, Flask-CORS                     |
| AI / ML          | OpenAI CLIP (ViT-B/32), Sentence Transformers |
| Video Processing | OpenCV (1 frame/sec extraction)               |
| Similarity       | Cosine Similarity (normalized dot product)    |

---

## 📁 Project Structure

```
Video-Scene-Classification-System/
├── Backend/
│   ├── app.py                    # Flask API server
│   ├── process_video_frames.py   # OpenCV frame extraction
│   ├── clip_model.py             # CLIP image & text embeddings
│   ├── nlp_model.py              # Sentence Transformer integration
│   └── requirements.txt
├── Frontend/
│   └── my-project/
│       ├── src/
│       │   ├── App.js            # Root component + routing
│       │   └── components/
│       │       ├── Home.js       # Landing page
│       │       ├── Upload.js     # Video upload + scene search (core)
│       │       ├── Team.js
│       │       └── FAQ.js
│       └── package.json
├── start-servers.bat             # One-click start (Windows)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+

### 1. Clone the repo

```bash
git clone https://github.com/RishabThapliyal/Video-Scene-Classification-System.git
cd Video-Scene-Classification-System
```

### 2. Backend setup

```bash
cd Backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
python app.py
```

Backend runs at `http://localhost:5000`

### 3. Frontend setup

```bash
cd Frontend/my-project
npm install
npm start
```

Frontend runs at `http://localhost:3000`

### Quick Start (Windows)

```bash
# Starts both servers at once:
start-servers.bat
```

---

## 🔌 API Reference

| Method | Endpoint                         | Description                            |
| ------ | -------------------------------- | -------------------------------------- |
| `POST` | `/api/upload_video`              | Upload video, receive `video_id`       |
| `POST` | `/api/search_scene`              | Query with `video_id` + `query` string |
| `GET`  | `/api/thumbnail/<video_id>/<ts>` | Get frame thumbnail at timestamp       |

**Search request:**

```json
{
  "video_id": "abc123",
  "query": "a boat on calm water"
}
```

**Response:**

```json
{
  "timestamp": "00:00:26",
  "confidence_score": 0.84
}
```

---

## ⚙️ Key Design Decision — 1 Frame/sec Sampling

Processing every frame at 30fps with CLIP is computationally expensive. Sampling at 1 frame/sec gives a **30x reduction** in CLIP inference calls while preserving sufficient semantic coverage for scene-level search.

| Video (10 min @ 30fps) | Frames processed |
| ---------------------- | ---------------- |
| Full processing        | 18,000           |
| 1 frame/sec sampling   | 600 ✅           |

---

## ⚠️ Limitations

- Not deployed — requires local setup (ML models too large for free hosting)
- GPU recommended for videos longer than 5 minutes; CPU inference is slow
- 1 frame/sec sampling can miss very short (sub-second) events
- Purely visual — no audio analysis

---

## 👥 Team

Built as B.Tech Major Project at **Graphic Era Hill University, Dehradun** (June 2025).

| Name                | Roll No |
| ------------------- | ------- |
| Rishab Thapliyal    | 2119013 |
| Shubham Singh Karki | 2119234 |
| Vimal Singh Panwar  | 2119423 |
| Yugraj              | 2119460 |

Guide: **Dr. Amrish Sharma**, Professor of Practice, CSE Dept.

---

## 📄 License

MIT License — open source, free to use.
