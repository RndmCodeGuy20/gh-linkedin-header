#!/usr/bin/env bun
import { SVGHeatmapGenerator, createHeatmapData } from "./svg-heatmap";

/**
 * Example demonstrating local TTF fonts in LinkedIn banner
 */
async function createBannerWithLocalFonts() {
    const svgGenerator = new SVGHeatmapGenerator();

    // Sample contribution data for demo
    const sampleData = {
        weeks: Array.from({ length: 53 }, (_, weekIndex) => ({
            firstDay: `2024-${String(Math.floor(weekIndex / 4) + 1).padStart(2, '0')}-01`,
            contributionDays: Array.from({ length: 7 }, (_, dayIndex) => ({
                date: `2024-${String(Math.floor(weekIndex / 4) + 1).padStart(2, '0')}-${String(dayIndex + 1).padStart(2, '0')}`,
                contributionCount: Math.floor(Math.random() * 8),
                color: '#40c463',
                weekday: dayIndex
            }))
        })),
        totalContributions: 1247,
        username: "rndmcodeguy"
    };

    // Example 1: Local TTF files
    console.log("🎨 Creating banner with local TTF fonts...");
    const localFontsConfig = {
        fonts: {
            username: {
                family: "SF Mono",
                localPath: "./fonts/SFMono-Regular.ttf",
                format: "truetype" as const,
                fallback: "Consolas, Monaco, monospace"
            },
            headerText: {
                family: "Helvetica Neue",
                localPath: "./fonts/HelveticaNeue-Bold.ttf",
                format: "truetype" as const,
                weight: 700,
                fallback: "Helvetica, Arial, sans-serif"
            },
            motivationalText: {
                family: "Futura",
                localPath: "./fonts/Futura-Bold.ttf",
                format: "truetype" as const,
                weight: 700,
                fallback: "Impact, Arial Black, sans-serif"
            }
        },
        customFonts: [
            {
                family: "SF Mono",
                localPath: "./fonts/SFMono-Regular.ttf",
                format: "truetype" as const
            },
            {
                family: "Helvetica Neue",
                localPath: "./fonts/HelveticaNeue-Bold.ttf",
                format: "truetype" as const,
                weight: 700
            },
            {
                family: "Futura",
                localPath: "./fonts/Futura-Bold.ttf",
                format: "truetype" as const,
                weight: 700
            }
        ]
    };

    const localFontsBanner = svgGenerator.generateCustomLinkedInBanner(sampleData, {
        username: "rndmcodeguy",
        headerText: "Creative Developer",
        subText: "Crafting beautiful digital experiences with custom typography",
        motivationalText: "CREATE\nINNOVATE\nINSPIRE",
        backgroundColor: "#fff",
        headerTextColor: "#1a1a1a",
        subTextColor: "#666",
        subTextOpacity: 0.8,
        motivationalTextColor: "#0066cc",
        heatmapTheme: 'dark',
        ...localFontsConfig
    });

    svgGenerator.saveSVGToFile(localFontsBanner, "linkedin-banner-local-fonts.svg");
    console.log("✅ Local fonts banner saved: linkedin-banner-local-fonts.svg");

    // Example 2: Mixed local and web fonts
    console.log("\n🎨 Creating banner with mixed local/web fonts...");
    const mixedConfig = {
        fonts: {
            username: {
                family: "JetBrains Mono",
                url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap",
                fallback: "Consolas, monospace"
            },
            headerText: {
                family: "Custom Heading Font",
                localPath: "./fonts/CustomHeading-Bold.ttf",
                format: "truetype" as const,
                weight: 700,
                fallback: "Arial Black, sans-serif"
            },
            motivationalText: {
                family: "Impact Local",
                localPath: "./fonts/Impact.ttf",
                format: "truetype" as const,
                fallback: "Impact, Arial Black, sans-serif"
            }
        },
        customFonts: [
            {
                family: "JetBrains Mono",
                url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
            },
            {
                family: "Custom Heading Font",
                localPath: "./fonts/CustomHeading-Bold.ttf",
                format: "truetype" as const,
                weight: 700
            },
            {
                family: "Impact Local",
                localPath: "./fonts/Impact.ttf",
                format: "truetype" as const
            }
        ]
    };

    const mixedFontsBanner = svgGenerator.generateCustomLinkedInBanner(sampleData, {
        username: "rndmcodeguy",
        headerText: "Full Stack Developer",
        subText: "Building scalable applications with modern technologies",
        motivationalText: "PASSION\nPURPOSE\nPROGRESS",
        backgroundColor: "#f8f9fa",
        headerTextColor: "#212529",
        subTextColor: "#6c757d",
        subTextOpacity: 0.9,
        motivationalTextColor: "#dc3545",
        heatmapTheme: 'dark',
        ...mixedConfig
    });

    svgGenerator.saveSVGToFile(mixedFontsBanner, "linkedin-banner-mixed-local-web.svg");
    console.log("✅ Mixed fonts banner saved: linkedin-banner-mixed-local-web.svg");

    // Example 3: OTF and WOFF fonts
    console.log("\n🎨 Creating banner with different font formats...");
    const differentFormatsConfig = {
        fonts: {
            headerText: {
                family: "Custom OTF Font",
                localPath: "./fonts/CustomFont.otf",
                format: "opentype" as const,
                weight: 600,
                fallback: "Arial, sans-serif"
            },
            motivationalText: {
                family: "Custom WOFF Font",
                localPath: "./fonts/BoldFont.woff2",
                format: "woff2" as const,
                weight: 700,
                fallback: "Arial Black, sans-serif"
            }
        },
        customFonts: [
            {
                family: "Custom OTF Font",
                localPath: "./fonts/CustomFont.otf",
                format: "opentype" as const,
                weight: 600
            },
            {
                family: "Custom WOFF Font",
                localPath: "./fonts/BoldFont.woff2",
                format: "woff2" as const,
                weight: 700
            }
        ]
    };

    const formatsBanner = svgGenerator.generateCustomLinkedInBanner(sampleData, {
        username: "rndmcodeguy",
        headerText: "Typography Expert",
        subText: "Specializing in custom font implementations and design systems",
        motivationalText: "DESIGN\nDEVELOP\nDELIVER",
        backgroundColor: "#ffffff",
        headerTextColor: "#2d3748",
        subTextColor: "#4a5568",
        subTextOpacity: 0.85,
        motivationalTextColor: "#805ad5",
        heatmapTheme: 'dark',
        ...differentFormatsConfig
    });

    svgGenerator.saveSVGToFile(formatsBanner, "linkedin-banner-different-formats.svg");
    console.log("✅ Different formats banner saved: linkedin-banner-different-formats.svg");

    // Try to convert to PNG if Sharp is available
    try {
        await svgGenerator.convertToPNG("linkedin-banner-local-fonts.svg", "linkedin-banner-local-fonts.png");
        await svgGenerator.convertToPNG("linkedin-banner-mixed-local-web.svg", "linkedin-banner-mixed-local-web.png");
        await svgGenerator.convertToPNG("linkedin-banner-different-formats.svg", "linkedin-banner-different-formats.png");
        console.log("🖼️  PNG versions created successfully!");
    } catch (error) {
        console.log("ℹ️  PNG conversion skipped (install Sharp for PNG support)");
    }

    console.log("\n🎯 Local Font Examples Complete!");
    console.log("📁 Files created:");
    console.log("   • linkedin-banner-local-fonts.svg (Local TTF fonts)");
    console.log("   • linkedin-banner-mixed-local-web.svg (Mixed local/web fonts)");
    console.log("   • linkedin-banner-different-formats.svg (OTF/WOFF formats)");

    console.log("\n📚 Local Font Configuration:");
    console.log("   📁 localPath: Path to your TTF/OTF/WOFF font file");
    console.log("   🔧 format: 'truetype' | 'opentype' | 'woff' | 'woff2'");
    console.log("   🎯 family: Font family name to use in CSS");
    console.log("   🛡️  fallback: Fallback font stack");

    console.log("\n📋 Font Format Guide:");
    console.log("   • .ttf files → format: 'truetype'");
    console.log("   • .otf files → format: 'opentype'");
    console.log("   • .woff files → format: 'woff'");
    console.log("   • .woff2 files → format: 'woff2'");

    console.log("\n💡 Setup Instructions:");
    console.log("   1. Create a 'fonts' folder in your project");
    console.log("   2. Place your .ttf/.otf/.woff files in the fonts folder");
    console.log("   3. Use relative paths like './fonts/YourFont.ttf'");
    console.log("   4. Specify the correct format for each font");
    console.log("   5. Always provide fallback fonts");

    console.log("\n⚠️  Important Notes:");
    console.log("   • Ensure font files are accessible from your SVG location");
    console.log("   • Local fonts may not work in all environments");
    console.log("   • Consider licensing when using custom fonts");
    console.log("   • Test fallback fonts work properly");
}

// Run the local fonts demo
createBannerWithLocalFonts().catch(console.error);

export { createBannerWithLocalFonts };
