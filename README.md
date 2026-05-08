# EFW2 Generation Tool

A desktop application for generating IRS EFW2 (W-2) files and employee W-2 PDFs. Built for Livi Home Care to streamline their annual tax filing workflow.

## What It Does

- Upload an employee wage spreadsheet (`.xlsx`) to populate W-2 data
- Fill in employer and submitter information via a guided form
- Generate a properly formatted **EFW2 file** ready for SSA submission
- Generate **individual W-2 PDFs** (Copy B, C, and 2) for each employee, packaged as a ZIP

All file generation is handled server-side via a private API, keeping business logic secure and ensuring the desktop app always stays up to date without requiring reinstallation.

## Tech Stack

- **Electron** — cross-platform desktop app
- **React + Vite** — UI framework and build tool
- **SheetJS (xlsx)** — client-side Excel parsing
- **REST API** — private backend handles EFW2 compilation and PDF generation

## Running Locally

### Prerequisites

- Node.js 18+
- The backend API running locally or deployed (not included in this repo)

### Setup

```bash
# Install dependencies
npm install

# Start the Vite dev server
npm run dev

# In a separate terminal, launch the Electron app
npm run electron
```

By default the app points to `http://localhost:3000` for API calls. Update the fetch URLs in `MainFormComponent.jsx` if your backend is running on a different port or deployed remotely.

### Building

```bash
npm run build
```

This generates the production build in `dist/`, which Electron loads when packaged.
