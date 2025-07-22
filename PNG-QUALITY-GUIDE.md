# PNG Quality Enhancement Guide

## Overview

The GitHub contribution heatmap generator now supports high-quality PNG export with multiple quality settings and scaling options. This enhancement allows you to create crisp, professional-looking images suitable for various use cases.

## Quality Options

### Available Parameters

```typescript
interface PNGQualityOptions {
    quality?: number;     // 0-100, default: 100 (lossless)
    scale?: number;       // Size multiplier, default: 1
    width?: number;       // Custom width in pixels
    height?: number;      // Custom height in pixels
}
```

### Methods Available

#### 1. Basic PNG Conversion
```typescript
await generator.convertToPNG('input.svg', 'output.png');
```
- Standard quality
- Original dimensions
- Good for basic usage

#### 2. High-Quality PNG
```typescript
await generator.convertToHighQualityPNG('input.svg', 'output-hq.png', 2);
```
- 2x resolution by default
- Maximum quality (100%)
- Recommended for LinkedIn banners

#### 3. Custom Quality PNG
```typescript
await generator.convertToPNG('input.svg', 'output-custom.png', {
    quality: 100,
    scale: 3,
    width: 1920,
    height: 1080
});
```
- Full control over all parameters
- Custom dimensions support
- Flexible scaling options

## Quality Levels Explained

### 🔧 Technical Settings

**Compression Level**: Set to 0 (no compression) for maximum quality
**Adaptive Filtering**: Enabled for better edge preservation
**Color Mode**: Full color (no palette compression)
**Format**: PNG with alpha channel support

### 📊 Quality Comparison

| Quality Level | Scale | Use Case | File Size | Best For |
|---------------|-------|----------|-----------|----------|
| Basic | 1x | GitHub README | Small | Documentation |
| High | 2x | LinkedIn Banner | Medium | Social Media |
| Ultra | 3x | Portfolio | Large | Print Quality |
| Retina | 4x | High-DPI Displays | Largest | Premium Displays |

## Recommended Usage

### LinkedIn Banner
```typescript
// Perfect for LinkedIn (1584x396 optimal)
await generator.convertToHighQualityPNG('banner.svg', 'banner-linkedin.png', 2);
```

### GitHub README
```typescript
// Good balance of quality and file size
await generator.convertToPNG('heatmap.svg', 'heatmap-readme.png', {
    quality: 90,
    scale: 1.5
});
```

### Portfolio/Print
```typescript
// Maximum quality for professional use
await generator.convertToPNG('chart.svg', 'chart-portfolio.png', {
    quality: 100,
    scale: 4
});
```

### Custom Dimensions
```typescript
// For specific requirements
await generator.convertToPNG('graphic.svg', 'graphic-custom.png', {
    quality: 100,
    width: 2000,
    height: 1000
});
```

## Performance Considerations

### File Size Impact
- **1x scale**: ~50KB typical
- **2x scale**: ~200KB typical  
- **3x scale**: ~450KB typical
- **4x scale**: ~800KB typical

### Processing Time
- Higher scales require more memory and processing time
- Custom dimensions may take longer than simple scaling
- Quality setting has minimal impact on processing time

## Sharp Library Options

The enhanced PNG conversion uses the Sharp library with optimized settings:

```typescript
.png({
    quality: 100,              // Maximum quality
    compressionLevel: 0,       // No compression
    adaptiveFiltering: true,   // Better edge preservation
    palette: false            // Full color mode
})
```

## Installation Requirements

To use PNG conversion features:

```bash
bun add sharp
```

The system gracefully handles missing Sharp dependency with informative error messages.

## Error Handling

The system includes robust error handling:
- Missing Sharp library detection
- Invalid file path handling
- Memory limit protection
- Graceful fallback messages

## Example Implementation

```typescript
import { SVGHeatmapGenerator } from './svg-heatmap.ts';

const generator = new SVGHeatmapGenerator();

// Generate your SVG first
const svg = generator.generateSVG(data, options);
generator.saveSVGToFile(svg, 'my-heatmap.svg');

// Create multiple quality versions
await generator.convertToPNG('my-heatmap.svg', 'standard.png');
await generator.convertToHighQualityPNG('my-heatmap.svg', 'high-quality.png', 2);
await generator.convertToPNG('my-heatmap.svg', 'ultra.png', {
    quality: 100,
    scale: 3
});
```

## Best Practices

1. **Use 2x scale for social media** (LinkedIn, Twitter headers)
2. **Use 1x-1.5x scale for documentation** (GitHub README, docs)
3. **Use 3x-4x scale for print/portfolio** (high-quality presentations)
4. **Consider file size vs quality trade-offs** for web usage
5. **Test on target platform** before finalizing quality settings

## Output Examples

Running the demonstration will create:
- `quality-demo-basic.png` - Standard quality
- `quality-demo-high.png` - 2x scale, high quality
- `quality-demo-ultra.png` - 3x scale, ultra quality  
- `quality-demo-custom.png` - Custom 1920x1080 dimensions
- `quality-demo-retina.png` - 4x scale, Retina display quality

Each file demonstrates different quality levels for comparison and testing purposes.
