# Backend Demo

This is a snapshot of a backend project in development, back from when the codebase was still structured as a monorepo.

Although I moved to private NPM packages a bit later, I think the monorepo makes it easier to get an idea of what's going on without having to navigate around a whole bunch of different repositories.

The project is an API that processes video files at an `/upload` endpoint.

## Features

**Snapshot version**

- Auth-protected file upload API (unencrypted at this stage)
- Local file storage (swapped with S3 in prod)
- Job creation with BullMQ
- Worker that simulates file processing (i.e. AI transcription and sentiment analysis)
- Status updates published via Redis Pub/Sub
- Optional real-time updates via WebSocket service
- Testable services with Jest

**Full version**

- An Admin API for managing users and reviewing uploads
- A real PostgreSQL database
- S3-based file storage instead of local disk
- Rate limiting & auth
- File processing with OpenAI Whisper

## Tech stack (snapshot version)

- Node.js
- TypeScript
- Docker Compose – For dev orchestration
- Express: REST API server
- Multer: File upload middleware
- Redis: For queue and pub/sub
- BullMQ: Job queue backed by Redis
- Socket.IO: Real-time updates
- Jest: Testing

## Architecture (snapshot Version)

This is a pretty typical setup for me when building an API with support for job queues and background workers.

In production, the simulated AI processing uses OpenAI's Whisper API.

         ┌──────────────┐
         │    Client    │
         └──────┬───────┘
                │
         Upload file (REST)
                │
        ┌───────▼────────┐
        │     API        │
        │ (Express.js)   │
        └───────┬────────┘
                │
                │ Push job to BullMQ queue
                ▼
         ┌──────────────┐
         │   Redis      │◄─── Pub/Sub + Job Queue
         └────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │     Worker       │
     │ (BullMQ + Node)  │
     └──────────────────┘
              │
      Simulated AI processing
              │
              ▼
         Publish status
              │
              ▼
     ┌─────────────────────┐
     │   (optional) WS     │
     │ WebSocket Broadcast │
     └─────────────────────┘