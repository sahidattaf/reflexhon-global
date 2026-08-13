# 🎨 Reflexhon Public Assets

This directory contains all public-facing assets for the Reflexhon Global 2027 ecosystem — branding, web interfaces, and static content served via GitHub Pages.

## 📁 Structure

```
public/
├── index.html              # Landing page (home)
├── reflexhon_logo_dark.svg # Dark theme logo
├── reflexhon_logo_light.svg # Light theme logo
├── reflexhon_favicon.png   # Favicon for browser tab
└── README.md               # This file
```

## 🌐 Files Overview

### index.html
- **Purpose**: Main landing page for Reflexhon Global
- **Features**:
  - Responsive dark theme design
  - Vision statement & core components overview
  - Quick links to documentation
  - Gradient UI with glassmorphism effects
- **Served at**: `https://sahidattaf.github.io/reflexhon-global/`

### reflexhon_logo_dark.svg
- **Purpose**: Logo for dark backgrounds
- **Usage**: Header, dark theme branding
- **Format**: Scalable vector (SVG)

### reflexhon_logo_light.svg
- **Purpose**: Logo for light backgrounds
- **Usage**: Light theme branding, print materials
- **Format**: Scalable vector (SVG)

### reflexhon_favicon.png
- **Purpose**: Browser tab icon
- **Size**: Recommended 32x32 or 64x64 pixels
- **Usage**: Added to `<head>` in HTML files

## 🎯 Development Guidelines

### Adding New Assets
1. **Images**: Keep SVGs for logos (scalable), PNGs for icons/rasters
2. **HTML**: Reference assets with relative paths (e.g., `./reflexhon_logo_dark.svg`)
3. **Metadata**: Create sidecar JSON for any asset (see example below)

### Asset Metadata (Sidecar Pattern)
Every public asset should have an optional JSON metadata file:

```json
{
  "id": "reflexhon-logo-dark",
  "author": "@sahidattaf",
  "license": "CC-BY-4.0",
  "created_at": "2025-12-28T00:00:00Z",
  "description": "Dark theme logo for Reflexhon Global",
  "usage": ["web", "branding", "print"],
  "edits": ["original"]
}
```

Save as: `reflexhon_logo_dark.json` (alongside the asset)

## 🚀 GitHub Pages Deployment

1. **Setup** (one-time):
   ```bash
   cd reflexhon-global
   bash setup_reflexhon_launch.sh
   ```

2. **Verify**: Go to `Settings → Pages → Source: main branch / (root)`

3. **Test**: Visit `https://sahidattaf.github.io/reflexhon-global/`

## 🎨 Branding Standards

### Colors
- **Primary Gradient**: `#8b5cf6` (purple) → `#ec4899` (pink)
- **Background**: `#1a1a1a` (dark charcoal)
- **Text**: `#e0e0e0` (light gray)
- **Accent**: `#8b5cf6` (purple)

### Typography
- **Font Family**: System fonts (Apple/Ubuntu/Windows defaults)
- **Headings**: Sans-serif, 1.5–2.5rem
- **Body**: Sans-serif, 0.95–1.1rem
- **Code**: Monospace for technical content

### Design Principles
- ✅ **Clarity**: Simple, readable, jargon-free
- ✅ **Accessibility**: Sufficient color contrast, semantic HTML
- ✅ **Responsiveness**: Mobile-first design
- ✅ **Performance**: Minimal dependencies, fast load times

## 📝 Updating Content

### index.html
- Edit the HTML directly in VS Code
- Test locally: `npx serve public/` (requires npm)
- Commit and push to trigger GitHub Pages rebuild

### Logos & Icons
- Use vector editor (Figma, Inkscape, Adobe XD)
- Export as SVG (preserve layers for editability)
- Commit both `.svg` and metadata `.json`

## 🔄 Workflow

1. **Create/Edit** asset in `/public/`
2. **Create metadata** sidecar JSON
3. **Test locally** (if applicable)
4. **Commit** with message: `🎨 [type]: brief description` (e.g., `🎨 Add: landing page hero section`)
5. **Push** to `main` branch
6. **Verify** on GitHub Pages within 1–2 minutes

## 🤝 Contributing

Before adding new assets:
1. Check [COMMUNITY.md](../COMMUNITY.md) for contributor roles
2. Verify cultural respect & inclusivity
3. Ensure metadata is complete
4. Reference [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)

---

**Last updated**: 2025-12-28
