# GitHub Contribution Heatmap Generator

A TypeScript project that fetches GitHub contribution data using Octokit and generates beautiful SVG heatmaps similar to GitHub's contribution graph.

## Features

- 🔥 **Fetch Real Data**: Uses GitHub's GraphQL API to get authentic contribution data
- 🎨 **Multiple Color Schemes**: GitHub, Green, Blue, Purple, and Orange themes
- 🎯 **Customizable**: Adjust cell size, padding, labels, and tooltips
- 📊 **Rich Statistics**: Get streaks, averages, and detailed analytics
- 💾 **SVG Output**: Clean, scalable vector graphics that work everywhere
- 🛠 **TypeScript**: Fully typed for better development experience

## Setup

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

## Usage

### Basic Usage

```typescript
import { GitHubContributionFetcher } from "./index";
import { SVGHeatmapGenerator, createHeatmapData } from "./svg-heatmap";

async function generateHeatmap() {
  const fetcher = new GitHubContributionFetcher(process.env.GITHUB_TOKEN);
  const svgGenerator = new SVGHeatmapGenerator();

  // Fetch contribution data
  const contributionData = await fetcher.fetchContributionData("username");
  const processedData = fetcher.processContributionDataForHeatmap(contributionData);
  
  // Create heatmap data
  const heatmapData = createHeatmapData(processedData, "username");
  
  // Generate SVG
  const svg = svgGenerator.generateSVG(heatmapData);
  
  // Save to file
  svgGenerator.saveSVGToFile(svg, "heatmap.svg");
}
```

### Custom Styling

```typescript
// Custom options
const svg = svgGenerator.generateSVG(heatmapData, {
  cellSize: 15,           // Size of each square
  cellPadding: 3,         // Space between squares
  showTooltips: true,     // Enable hover tooltips
  showMonthLabels: true,  // Show month names
  showDayLabels: true,    // Show day names (Mon, Wed, Fri)
  colors: ['#f0f9ff', '#bfdbfe', '#60a5fa', '#3b82f6', '#1d4ed8'], // Custom colors
});
```

### Color Schemes

```typescript
// Use predefined color schemes
const schemes = ['github', 'green', 'blue', 'purple', 'orange'];

schemes.forEach(scheme => {
  const svg = svgGenerator.generateCustomColorHeatmap(heatmapData, scheme);
  svgGenerator.saveSVGToFile(svg, `heatmap-${scheme}.svg`);
});
```

## Run Examples

```bash
# Run the main example with real GitHub data
bun run example.ts

# Generate sample heatmaps with demo data  
bun run demo.ts

# Run the basic index file
bun run index.ts
```

## Key Files

- `index.ts` - Core GitHub data fetching functionality
- `svg-heatmap.ts` - SVG heatmap generation
- `example.ts` - Example with real GitHub data
- `demo.ts` - Generate sample heatmaps with demo data

## Output

The SVG heatmaps include:
- ✅ Contribution squares with proper colors
- ✅ Month labels (Jan, Feb, Mar...)
- ✅ Day labels (Mon, Wed, Fri)
- ✅ Tooltips with contribution details
- ✅ Legend showing contribution levels
- ✅ Summary text with total contributions
- ✅ Responsive and scalable design

This project was created using `bun init` in bun v1.2.13. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
