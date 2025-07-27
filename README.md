# LinkedIn Banner Generator

A TypeScript project that fetches GitHub contribution data and generates custom LinkedIn banners with GitHub contribution heatmaps.

## Features

- 🔥 **Real GitHub Data**: Fetches authentic contribution data using GitHub's GraphQL API
- 🎨 **Custom LinkedIn Banners**: Generate professional banners with heatmaps
- 🎯 **Fully Customizable**: Adjust colors, fonts, text, and layout
- � **Perfect Dimensions**: Optimized for LinkedIn's 1584x396px banner size
- 💾 **Multiple Formats**: Generate SVG and high-quality PNG outputs
- 🛠 **TypeScript**: Fully typed for better development experience

## Quick Start

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Set up GitHub token**:
   ```bash
   cp .env.example .env
   # Edit .env and add your GitHub token
   ```

   Get your token at: https://github.com/settings/tokens (needs `read:user` scope)

3. **Generate your LinkedIn banner**:
   ```bash
   bun run my-linkedin-banner.ts
   ```

## Usage

### Generate LinkedIn Banner

```typescript
import { createMyCustomLinkedInBanner } from "./my-linkedin-banner";

// Generate your custom LinkedIn banner
await createMyCustomLinkedInBanner();
  
  // Save to file
  svgGenerator.saveSVGToFile(svg, "heatmap.svg");
}
```

### Custom Styling

```

### Customization Options

```typescript
const customBanner = svgGenerator.generateCustomLinkedInBanner(heatmapData, {
    username: "your-username",
    headerText: "Software Engineer",
    subText: "Building amazing things with code",
    motivationalText: "Passion\nPerseverance\nProgress",
    backgroundColor: "#fff",
    headerTextColor: "#000",
    subTextColor: "#000",
    subTextOpacity: 0.54,
    motivationalTextColor: "#000",
    heatmapTheme: 'dark',
    // Custom fonts
    fonts: {
        username: {
            family: "JetBrains Mono",
            url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap",
            fallback: "Consolas, Monaco, monospace"
        }
        // ... more font configurations
    }
});
```

## Project Structure

```
gh-heatmap/
├── my-linkedin-banner.ts    # Main banner generation script
├── svg-heatmap.ts          # SVG heatmap generator class
├── index.ts                # GitHub data fetching utilities
├── logos.ts                # Tech logos for banners
├── fonts/                  # Custom font files
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript configuration
├── .env.example           # Environment variables template
└── README.md              # This file
```

## Generated Files

When you run the banner generator, it creates:
- `rndmcodeguy-linkedin-banner.svg` - Vector format
- `rndmcodeguy-linkedin-banner.png` - Standard quality PNG
- `rndmcodeguy-linkedin-banner-hq.png` - High quality PNG (recommended for LinkedIn)
- `rndmcodeguy-linkedin-banner-ultra.png` - Ultra high quality PNG

## Requirements

- Bun runtime
- GitHub personal access token (for real data)
- Sharp package (optional, for PNG conversion)

This project was created using `bun init` in bun v1.2.13. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
