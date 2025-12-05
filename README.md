# AI Image Upscaler

A professional, modern web application that uses Artificial Intelligence to upscale low-resolution images to High Definition (2x and 4x).

## 🚀 Key Features

*   **AI Power**: Utilizes the Real-ESRGAN model (via Replicate API) for high-fidelity image restoration.
*   **Smart Fallback**: Includes a built-in "Mock API" (Client-side Canvas processing) that ensures the app works perfectly even without an API key or if the external API fails.
*   **Drag & Drop UI**: Intuitive image upload with file type validation.
*   **Interactive Comparison**: Slider to compare the original vs. upscaled result side-by-side.
*   **Privacy Focused**: Images are processed securely and not stored permanently.
*   **Responsive Design**: Fully responsive UI with glassmorphism effects and smooth animations.

## 📂 Project Structure & File Guide

Here is a guide to the codebase to help you understand where everything is:

### 1. Core Application (`app/`)
*   `app/page.tsx`: The main page. Contains the logic for state management (uploading, processing, results), connects all components, and handles the API vs. Mock fallback logic.
*   `app/layout.tsx`: Defines the global HTML structure, fonts (Inter), and metadata. Includes `suppressHydrationWarning` to prevent React mismatch errors.
*   `app/globals.css`: Global styles, Tailwind directives, and custom animations (`fade-in`, `slide-up`).
*   `app/api/upscale/route.ts`: The Next.js API Route. It acts as a secure bridge to the Replicate API, keeping your API key hidden from the client browser.

### 2. Components (`components/`)
*   `ImageUploader.tsx`: Handles file drag-and-drop, validation (size/type), and preview generation.
*   `UpscaleOptions.tsx`: The controls for selecting 2x or 4x upscale factors.
*   `ProcessingState.tsx`: Animated loading screen shown while the AI is working.
*   `ImageComparison.tsx`: The "Before/After" slider component to visualize results.
*   `DownloadButton.tsx`: Handles downloading the processed image with a proper filename.
*   `ui/`: Contains reusable atomic components like `button.tsx`, `card.tsx`, `badge.tsx`, etc., styled with Tailwind CSS.

### 3. Utilities (`lib/`)
*   `lib/mock-api.ts`: **Critical functionality**. This file contains the logic to simulate AI upscaling using the browser's Canvas API. It runs if the real API fails, ensuring the app is always usable.
*   `lib/utils.ts`: Helper functions for merging Tailwind CSS classes.

### 4. Configuration
*   `tailwind.config.ts`: Configuration for the design system (colors, animations, fonts).
*   `postcss.config.js`: Required setup for Tailwind CSS v3.
*   `next.config.js`: Next.js configuration settings.

## 🛠️ How to Use & Setup

### 1. Installation
```bash
npm install
```

### 2. Environment Setup (Optional)
To use the **Real** AI model, you need a Replicate API token.
1.  Create a `.env.local` file.
2.  Add your key: `REPLICATE_API_TOKEN=your_token_here`

*If you skip this, the app will automatically use the built-in Mock API.*

### 3. Running Locally
```bash
npm run dev
```
Open https://pixelperfect-ai.vercel.app/ in your browser.

## 💡 How It Works

1.  **Upload**: User selects an image. Browser creates a local preview URL.
2.  **Upscale Request**: 
    *   The app sends the image to `/api/upscale`.
    *   If an API Token is present, it calls Replicate (Real-ESRGAN).
    *   **Fallback**: If the API call fails (network error, no token, 422 error), the app catches the error and switches to `mockUpscaleImage` in `lib/mock-api.ts`.
3.  **Result**: The enhanced image URL is returned and displayed in the comparison view.
4.  **Download**: The download button fetches the image blob and saves it to the user's device.

## 🎨 Design System
The app uses a "Glassmorphism" aesthetic with:
*   Dark mode default
*   Translucent backgrounds (`bg-white/10 backdrop-blur`)
*   Vibrant gradients (`radial-gradient`)
*   Lucide React icons for a clean look

---
*Created by Ashish Mishra*
