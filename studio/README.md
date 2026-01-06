# 🌴 Reflexhon Studio

Beautiful, culturally-aligned web interface for the Reflexhon Global API.

## Features

- 💬 **AI Chat Interface** - Real-time chat with culturally-aware AI
- 📚 **Dataset Explorer** - Browse 70+ Papiamentu cultural entries
- 🎨 **Caribbean Theme** - Beautiful design reflecting Caribbean culture
- ⚡ **Fast & Modern** - Built with React, Vite, and Tailwind CSS
- 🚀 **Cloudflare Integration** - Powered by Cloudflare Workers AI

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit `http://localhost:5173`

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

## Deployment to Cloudflare Pages

### Option 1: GitHub Integration (Recommended)

1. Push code to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `studio`
5. Deploy!

### Option 2: Wrangler CLI

```bash
# Build the project
npm run build

# Deploy with Wrangler
npx wrangler pages deploy dist --project-name reflexhon-studio
```

## Project Structure

```
studio/
├── src/
│   ├── components/
│   │   ├── ChatInterface.jsx      # AI chat component
│   │   └── DatasetExplorer.jsx    # Dataset browser
│   ├── App.jsx                    # Main app with tabs
│   ├── index.css                  # Tailwind styles
│   └── main.jsx                   # React entry point
├── tailwind.config.js             # Tailwind configuration
└── vite.config.js                 # Vite configuration
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Cloudflare Workers AI** - AI backend
- **HuggingFace** - Dataset source

## Part of Reflexhon Global 2027

Human-Centered Intelligence Ecosystem • Caribbean Cultural AI Alignment
