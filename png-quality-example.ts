import { GitHubContributionFetcher } from './index.ts';
import type { ContributionDay, ContributionWeek } from './index.ts';
import { SVGHeatmapGenerator } from './svg-heatmap.ts';

/**
 * Demonstrates different PNG quality options for GitHub contribution heatmaps
 */
async function demonstratePNGQuality() {
    console.log('🖼️  PNG Quality Demonstration\n');

    // Create a simple heatmap for testing
    const svgGenerator = new SVGHeatmapGenerator();

    // Sample data for demonstration (properly typed)
    const colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'] as const;
    const sampleData = {
        weeks: Array.from({ length: 53 }, (_, weekIndex): ContributionWeek => ({
            firstDay: `2024-01-01`,
            contributionDays: Array.from({ length: 7 }, (_, dayIndex): ContributionDay => ({
                date: `2024-01-01`,
                contributionCount: Math.floor(Math.random() * 8),
                color: colors[Math.floor(Math.random() * colors.length)] || '#ebedf0',
                weekday: dayIndex
            }))
        })),
        totalContributions: 892,
        username: "demo-user"
    };

    // Generate a simple SVG heatmap
    const svg = svgGenerator.generateSVG(sampleData, {
        cellSize: 12,
        cellPadding: 3,
        borderRadius: 2,
        colors: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
    });

    svgGenerator.saveSVGToFile(svg, 'quality-demo-heatmap.svg');
    console.log('✅ SVG heatmap created: quality-demo-heatmap.svg');

    try {
        console.log('\n📤 Generating PNG versions with different quality settings...\n');

        // 1. Basic PNG (standard quality)
        console.log('🔄 Generating basic PNG...');
        await svgGenerator.convertToPNG('quality-demo-heatmap.svg', 'quality-demo-basic.png');
        console.log('✅ Basic PNG: quality-demo-basic.png');

        // 2. High Quality PNG (2x scale)
        console.log('🔄 Generating high-quality PNG (2x scale)...');
        await svgGenerator.convertToHighQualityPNG('quality-demo-heatmap.svg', 'quality-demo-high.png', 2);
        console.log('✅ High Quality PNG: quality-demo-high.png');

        // 3. Ultra Quality PNG (3x scale)
        console.log('🔄 Generating ultra-quality PNG (3x scale)...');
        await svgGenerator.convertToPNG('quality-demo-heatmap.svg', 'quality-demo-ultra.png', {
            quality: 100,
            scale: 3
        });
        console.log('✅ Ultra Quality PNG: quality-demo-ultra.png');

        // 4. Custom dimensions
        console.log('🔄 Generating custom size PNG (1920x1080)...');
        await svgGenerator.convertToPNG('quality-demo-heatmap.svg', 'quality-demo-custom.png', {
            quality: 100,
            width: 1920,
            height: 1080
        });
        console.log('✅ Custom Size PNG: quality-demo-custom.png');

        // 5. Retina display optimized (4x scale)
        console.log('🔄 Generating Retina display PNG (4x scale)...');
        await svgGenerator.convertToPNG('quality-demo-heatmap.svg', 'quality-demo-retina.png', {
            quality: 100,
            scale: 4
        });
        console.log('✅ Retina PNG: quality-demo-retina.png');

        console.log('\n🎯 Quality Comparison Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📄 basic.png      - Standard quality, original size');
        console.log('⭐ high.png       - 2x resolution, crisp on most displays');
        console.log('💎 ultra.png      - 3x resolution, excellent for print');
        console.log('📐 custom.png     - Custom dimensions (1920x1080)');
        console.log('🖥️  retina.png     - 4x resolution, perfect for Retina displays');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n💡 Recommendations:');
        console.log('   • LinkedIn Banner: Use high.png (2x scale)');
        console.log('   • GitHub README: Use basic.png or high.png');
        console.log('   • Print/Portfolio: Use ultra.png or retina.png');
        console.log('   • Custom Projects: Adjust width/height as needed');

    } catch (error) {
        console.error('❌ Error generating PNG files:', error);
        console.log('\n🔧 To enable PNG conversion, install Sharp:');
        console.log('   bun add sharp');
    }
}

// Available quality options interface
interface PNGQualityOptions {
    quality?: number;     // 0-100, default: 100
    scale?: number;       // Multiplier for original size, default: 1
    width?: number;       // Custom width in pixels
    height?: number;      // Custom height in pixels
}

console.log('🎨 PNG Quality Options:');
console.log('┌─────────────────────────────────────────────────────────┐');
console.log('│ Option    │ Description                                 │');
console.log('├─────────────────────────────────────────────────────────┤');
console.log('│ quality   │ Compression quality (0-100, default: 100)  │');
console.log('│ scale     │ Size multiplier (1=original, 2=double)     │');
console.log('│ width     │ Custom width in pixels                     │');
console.log('│ height    │ Custom height in pixels                    │');
console.log('└─────────────────────────────────────────────────────────┘');
console.log('');

// Run the demonstration
demonstratePNGQuality();

export { demonstratePNGQuality, type PNGQualityOptions };
