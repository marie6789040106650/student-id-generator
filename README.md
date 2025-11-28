# Student ID Generator

A professional, pure frontend Student ID card generator built with React, Vite, and Tailwind CSS. Features AI-powered auto-completion and portrait generation using Google Gemini API.

## Features

*   **Real-time Preview**: WYSIWYG editor for Student ID cards.
*   **AI Auto-Fill**: Automatically generates realistic student profiles (Name, Major, ID, etc.) using Gemini.
*   **AI Portraits**: Generates context-aware student headshots based on major and school name.
*   **High Quality Export**: Download front and back sides as high-resolution PNGs (print ready).
*   **Customizable**: Supports custom photos, logos, theme colors, and vertical/horizontal layouts.
*   **Internationalization**: Supports English, Chinese, Russian, and Polish.
*   **Smart Chip**: Toggleable visual simulation of a smart card chip.

## Tech Stack

*   **Framework**: React 19 + Vite
*   **Styling**: Tailwind CSS
*   **AI**: Google Gemini API (`@google/genai`)
*   **Icons**: Lucide React
*   **Export**: html2canvas

## Setup & Installation

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure API Key**:
    *   Get a free API key from [Google AI Studio](https://aistudio.google.com/).
    *   Create a `.env` file in the root directory:
        ```env
        API_KEY=your_google_gemini_api_key_here
        ```
    *   *Note*: The project is configured to inject this key into the client-side build via `vite.config.ts`.

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Deployment

This project is optimized for **Cloudflare Pages**.

1.  Push your code to a Git repository (GitHub/GitLab).
2.  Connect Cloudflare Pages to your repository.
3.  **Build Settings**:
    *   **Framework**: Vite / React
    *   **Build command**: `npm run build`
    *   **Output directory**: `dist`
4.  **Environment Variables**:
    *   Go to **Settings** -> **Environment Variables**.
    *   Add `API_KEY` with your actual Gemini API key.

## Usage

1.  **Select Layout**: Choose between Vertical (Badge style) or Horizontal (Wallet style).
2.  **Enter Details**: Type manually or use "Auto Fill (AI)" to generate a random profile.
3.  **Upload/Generate Photo**: Upload your own or let AI generate one for you.
4.  **Customize**: Toggle the Smart Chip, change theme colors, or switch languages.
5.  **Download**: Click the download buttons to save your ID card images.
