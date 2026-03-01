# VR Medical Training System (VRMTS)

A comprehensive Virtual Reality Medical Training System for anatomy education with interactive 3D models, module-based learning, and quiz assessment capabilities.

## Key Features

- **Interactive 3D Anatomy**: WebGL-based viewer for detailed medical models (FBX) with rotation, zoom, and part selection.
- **Structured Learning**: Module-based exploration with AI assistant support, bookmarks, and note-taking.
- **Robust Quiz System**: 
    - Random question selection from an extensive Question Bank.
    - Multiple assessment modes: Module Quizzes, Timed Exams, and Adaptive Tests.
    - Detailed performance results with question-by-question breakdown.
- **Comprehensive Dashboards**: Tailored interfaces for Students, Instructors, and Administrators.
- **Advanced Analytics**: Detailed tracking of study patterns, score progress, and mastery across topics.

## Core Architecture

### Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS + Three.js
- **Backend**: Node.js + Express
- **Database**: MySQL

### System Design
The application follows a client-server architecture. The frontend communicates with a RESTful API backend, which manages authentication, module content, and the quiz engine. Secure authentication is handled via session-based cookies.

## Getting Started

### Docker Setup (Recommended)
This project is fully dockerized for easy setup.
```bash
docker compose up --build
```
For detailed instructions, common commands, and troubleshooting, see [DOCKERIZATION.md](./DOCKERIZATION.md).

### Local Architecture Overview
- `frontend/`: React source code and 3D assets.
- `backend/`: Server logic, API controllers, and database models.
- `dbtables.sql`: Core database schema.
