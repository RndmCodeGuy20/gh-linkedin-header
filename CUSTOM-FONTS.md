# Custom Fonts Guide for GitHub Heatmap Generator

## Overview
The SVG Heatmap Generator now supports custom fonts for enhanced typography in your LinkedIn banners and other heatmap visualizations.

## Features
- ✅ Google Fonts integration
- ✅ Custom font URLs
- ✅ Fallback font stacks
- ✅ Individual font configuration per text element
- ✅ Automatic font loading via `@import` or `@font-face`

## Basic Usage

### 1. Simple Custom Font Configuration

```typescript
import { SVGHeatmapGenerator } from "./svg-heatmap";

const svgGenerator = new SVGHeatmapGenerator();

const banner = svgGenerator.generateCustomLinkedInBanner(data, {
    fonts: {
        username: {
            family: "JetBrains Mono",
            url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap",
            fallback: "Consolas, Monaco, monospace"
        },
        headerText: {
            family: "Inter",
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap",
            fallback: "system-ui, sans-serif"
        }
    },
    customFonts: [
        {
            family: "JetBrains Mono",
            url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
        },
        {
            family: "Inter",
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap"
        }
    ]
});
```

## Font Configuration Options

### CustomFont Interface
```typescript
interface CustomFont {
    family: string;          // Font family name (required)
    url?: string;           // Google Fonts or custom font URL
    fallback?: string;      // Fallback font stack
    weight?: number | string; // Font weight (optional)
    style?: 'normal' | 'italic' | 'oblique'; // Font style (optional)
}
```

### FontConfig Interface
```typescript
interface FontConfig {
    username?: CustomFont;         // Font for @username
    headerText?: CustomFont;       // Font for main header
    subheaderText?: CustomFont;    // Font for subheader text
    motivationalText?: CustomFont; // Font for motivational text
}
```

## Examples

### 1. Google Fonts Example

```typescript
const googleFontsConfig = {
    fonts: {
        username: {
            family: "Roboto Mono",
            url: "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;600&display=swap",
            fallback: "monospace"
        },
        headerText: {
            family: "Playfair Display",
            url: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap",
            fallback: "serif"
        },
        subheaderText: {
            family: "Inter",
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400&display=swap",
            fallback: "sans-serif"
        },
        motivationalText: {
            family: "Montserrat",
            url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&display=swap",
            fallback: "sans-serif"
        }
    },
    customFonts: [
        {
            family: "Roboto Mono",
            url: "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;600&display=swap"
        },
        {
            family: "Playfair Display",
            url: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap"
        },
        {
            family: "Inter",
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400&display=swap"
        },
        {
            family: "Montserrat",
            url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&display=swap"
        }
    ]
};
```

### 2. Mixed Fonts (Custom + System)

```typescript
const mixedConfig = {
    fonts: {
        username: {
            family: "Source Code Pro",
            url: "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap",
            fallback: "Monaco, Consolas, monospace"
        },
        headerText: {
            family: "Poppins",
            url: "https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&display=swap",
            fallback: "-apple-system, BlinkMacSystemFont, sans-serif"
        }
        // subheaderText and motivationalText will use default system fonts
    },
    customFonts: [
        {
            family: "Source Code Pro",
            url: "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap"
        },
        {
            family: "Poppins",
            url: "https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&display=swap"
        }
    ]
};
```

### 3. Typography-Focused Design

```typescript
const typographyConfig = {
    fonts: {
        username: {
            family: "JetBrains Mono",
            url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap",
            fallback: "Consolas, monospace"
        },
        headerText: {
            family: "Space Grotesk",
            url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&display=swap",
            fallback: "system-ui, sans-serif"
        },
        subheaderText: {
            family: "IBM Plex Sans",
            url: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400&display=swap",
            fallback: "system-ui, sans-serif"
        },
        motivationalText: {
            family: "Bebas Neue",
            url: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap",
            fallback: "Impact, sans-serif"
        }
    }
};
```

## Popular Font Combinations

### Professional & Clean
```typescript
{
    username: "JetBrains Mono", // Code-style for username
    headerText: "Inter",        // Modern sans-serif
    subheaderText: "Inter",     // Consistent with header
    motivationalText: "Montserrat" // Bold impact font
}
```

### Creative & Elegant
```typescript
{
    username: "Source Code Pro", // Technical feel
    headerText: "Playfair Display", // Elegant serif
    subheaderText: "Source Sans Pro", // Clean sans-serif
    motivationalText: "Oswald" // Strong display font
}
```

### Modern & Tech-Forward
```typescript
{
    username: "Fira Code",     // Programming font
    headerText: "Space Grotesk", // Futuristic sans
    subheaderText: "IBM Plex Sans", // IBM design system
    motivationalText: "Orbitron" // Sci-fi style
}
```

## Best Practices

### 1. Font Loading
- Always provide fallback fonts
- Use Google Fonts for reliable loading
- Consider loading performance

### 2. Font Pairing
- Limit to 2-3 font families maximum
- Ensure good contrast and readability
- Test across different devices

### 3. Google Fonts URLs
- Use the full Google Fonts CSS URL
- Include all required weights
- Add `&display=swap` for better loading

### 4. Fallback Strategy
```typescript
// Good fallback examples:
fallback: "system-ui, -apple-system, sans-serif"        // Modern system fonts
fallback: "Georgia, Times, serif"                       // Traditional serif
fallback: "Consolas, Monaco, 'Courier New', monospace" // Monospace fonts
```

## Troubleshooting

### Fonts Not Loading
1. Check the Google Fonts URL is correct
2. Ensure fallback fonts are specified
3. Verify the font family name matches exactly

### Poor Rendering
1. Test fallback fonts work properly
2. Check font weights are available
3. Consider web-safe alternatives

### Performance Issues
1. Limit the number of font families
2. Only load required font weights
3. Use `&display=swap` in Google Fonts URLs

## Running Examples

Run the custom fonts examples:
```bash
bun run custom-fonts-example.ts
```

This will generate three example banners:
- `linkedin-banner-google-fonts.svg` - Google Fonts showcase
- `linkedin-banner-mixed-fonts.svg` - Mixed custom and system fonts  
- `linkedin-banner-typography.svg` - Typography-focused design

## Integration with Existing Code

Your existing LinkedIn banner generation will continue to work without changes. Custom fonts are entirely optional:

```typescript
// Works without custom fonts (uses system fonts)
const banner = svgGenerator.generateCustomLinkedInBanner(data, {
    username: "johndoe",
    headerText: "Software Engineer"
});

// Enhanced with custom fonts
const enhancedBanner = svgGenerator.generateCustomLinkedInBanner(data, {
    username: "johndoe", 
    headerText: "Software Engineer",
    fonts: {
        headerText: {
            family: "Inter",
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap"
        }
    },
    customFonts: [
        { family: "Inter", url: "https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap" }
    ]
});
```

## Font Resources

### Popular Google Fonts for Professional Use:
- **Sans-Serif**: Inter, Roboto, Open Sans, Lato, Montserrat, Poppins
- **Serif**: Playfair Display, Lora, Merriweather, Source Serif Pro
- **Monospace**: JetBrains Mono, Source Code Pro, Fira Code, Roboto Mono
- **Display**: Oswald, Bebas Neue, Space Grotesk, Orbitron

### Google Fonts URL Builder:
Visit [Google Fonts](https://fonts.google.com/) to browse and generate URLs for any font family.
