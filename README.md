# File Uploader

A lightweight React demo that uploads multiple files in parallel with per-file progress, cancel, retry, and delete controls. Uploads are simulated client-side using an adaptive, chunked upload simulator so you can test realistic latencies and error handling without a backend.

## What this app does

- Drag & drop or click to select multiple files.
- Parallel, per-file numeric progress and progress bar.
- Per-file actions: Cancel, Retry, and Delete.
- Simulated chunked uploads with randomized delays and a small failure rate for testing retry/error flows.
- Toast notifications for success and error feedback.

## Tech stack

- React (frontend)
- Vite (dev server / build)
- Tailwind CSS (styling)
- react-toastify (notifications)

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open the URL shown by Vite (typically `http://localhost:5173`).

## Project structure (key files)

- Main: [src/App.jsx](src/App.jsx) — central state & orchestration
- Selection UI: [src/components/DropZone.jsx](src/components/DropZone.jsx)
- List/UI: [src/components/FileList.jsx](src/components/FileList.jsx), [src/components/FileItem.jsx](src/components/FileItem.jsx)
- Status badge: [src/components/FileStatusBadge.jsx](src/components/FileStatusBadge.jsx)
- Upload simulator: [src/utils/uploadSimulator.js](src/utils/uploadSimulator.js)
- Helpers: [src/utils/fileHelpers.js](src/utils/fileHelpers.js)

## How it works (brief)

1. User selects files with `DropZone` (drag/drop or browse).
2. `App` creates a per-file item (id, file, status, progress) and starts an upload for each file.
3. Each upload runs independently using a dedicated `AbortController` so users can cancel a single file without affecting others.
4. `simulateUpload` slices files into adaptive chunks, simulates per-chunk network delay and occasional failures, and calls a progress callback.
5. `App` updates state via `updateFile(id, updates)` which re-renders `FileList` / `FileItem` and shows numeric percent + progress bar.
6. Users can Cancel (abort), Retry (restart failed upload), or Delete the file entry.

## Architecture & approach (short)

This project follows a single-source-of-truth pattern where `App` centrally manages the `files` state and upload lifecycle; UI components (`DropZone`, `FileList`, `FileItem`) are intentionally thin and only handle presentation and user events. Each file upload runs in parallel with its own `AbortController` and state entry so users can Cancel, Retry, or Delete a single file without impacting others. The upload simulator uses adaptive chunking and a small failure injection to model realistic behavior and validate retry/error flows. The client is organized so `simulateUpload` can be swapped for real chunked API calls with minimal changes.

## Notes for integration

- To use a real backend, replace `src/utils/uploadSimulator.js` with logic that uploads file chunks to an API and finalizes the upload server-side.
- Ensure backend supports idempotent chunk uploads and a finalize/commit step when migrating from the simulator.

## One-line summary

React-based file uploader demo with parallel per-file uploads, per-file cancel/retry/delete, and per-file progress — includes a realistic chunked upload simulator for testing without a backend.
