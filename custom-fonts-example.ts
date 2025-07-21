#!/usr/bin/env bun
import { SVGHeatmapGenerator, createHeatmapData } from "./svg-heatmap";

/**
 * Example demonstrating custom fonts in LinkedIn banner
 */
async function createBannerWithCustomFonts() {
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

    // Example 1: Google Fonts
    console.log("🎨 Creating banner with Google Fonts...");
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

    const googleFontsBanner = svgGenerator.generateCustomLinkedInBanner(sampleData, {
        username: "rndmcodeguy",
        headerText: "Software Engineer",
        subText: "Building refined user interfaces and the solid infrastructure that supports them",
        motivationalText: "Patience. Perseverance. Dedication",
        backgroundColor: "#fff",
        headerTextColor: "#000",
        subTextColor: "#000",
        subTextOpacity: 0.54,
        motivationalTextColor: "#000",
        heatmapTheme: 'dark',
        ...googleFontsConfig
    });

    svgGenerator.saveSVGToFile(googleFontsBanner, "linkedin-banner-google-fonts.svg");
    console.log("✅ Google Fonts banner saved: linkedin-banner-google-fonts.svg");

    // Example 2: Mix of custom and system fonts
    console.log("\n🎨 Creating banner with mixed fonts...");
    const mixedFontsConfig = {
        fonts: {
            username: {
                family: "JetBrains Mono",
                url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap",
                fallback: "Consolas, monospace"
            },
            headerText: {
                family: "Poppins",
                url: "https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&display=swap",
                fallback: "-apple-system, BlinkMacSystemFont, sans-serif"
            },
            // subheaderText will use default system fonts
            motivationalText: {
                family: "Oswald",
                url: "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&display=swap",
                fallback: "Impact, sans-serif"
            }
        },
        customFonts: [
            {
                family: "JetBrains Mono",
                url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
            },
            {
                family: "Poppins",
                url: "https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&display=swap"
            },
            {
                family: "Oswald",
                url: "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&display=swap"
            }
        ]
    };

    const mixedFontsBanner = svgGenerator.generateCustomLinkedInBanner(sampleData, {
        username: "rndmcodeguy",
        headerText: "Creative Developer",
        subText: "Crafting beautiful digital experiences with modern web technologies",
        motivationalText: "CREATE. INNOVATE. INSPIRE.",
        backgroundColor: "#fafafa",
        headerTextColor: "#1a1a1a",
        subTextColor: "#666",
        subTextOpacity: 0.8,
        motivationalTextColor: "#2563eb",
        heatmapTheme: 'dark',
        ...mixedFontsConfig
    });

    svgGenerator.saveSVGToFile(mixedFontsBanner, "linkedin-banner-mixed-fonts.svg");
    console.log("✅ Mixed fonts banner saved: linkedin-banner-mixed-fonts.svg");

    // Example 3: Typography-focused minimal design
    console.log("\n🎨 Creating typography-focused banner...");
    const typographyConfig = {
        fonts: {
            username: {
                family: "Source Code Pro",
                url: "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap",
                fallback: "Monaco, Consolas, monospace"
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
        },
        customFonts: [
            {
                family: "Source Code Pro",
                url: "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap"
            },
            {
                family: "Space Grotesk",
                url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&display=swap"
            },
            {
                family: "IBM Plex Sans",
                url: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400&display=swap"
            },
            {
                family: "Bebas Neue",
                url: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
            }
        ]
    };

    const typographyBanner = svgGenerator.generateCustomLinkedInBanner(sampleData, {
        username: "rndmcodeguy",
        headerText: "TYPE DESIGNER",
        subText: "Exploring the intersection of code, design, and typography",
        motivationalText: "PRECISION IN EVERY PIXEL",
        backgroundColor: "#ffffff",
        headerTextColor: "#0a0a0a",
        subTextColor: "#404040",
        subTextOpacity: 0.9,
        motivationalTextColor: "#ff6b35",
        heatmapTheme: 'dark',
        ...typographyConfig
    });

    svgGenerator.saveSVGToFile(typographyBanner, "linkedin-banner-typography.svg");
    console.log("✅ Typography banner saved: linkedin-banner-typography.svg");

    // Try to convert to PNG if Sharp is available
    try {
        await svgGenerator.convertToPNG("linkedin-banner-google-fonts.svg", "linkedin-banner-google-fonts.png");
        await svgGenerator.convertToPNG("linkedin-banner-mixed-fonts.svg", "linkedin-banner-mixed-fonts.png");
        await svgGenerator.convertToPNG("linkedin-banner-typography.svg", "linkedin-banner-typography.png");
        console.log("🖼️  PNG versions created successfully!");
    } catch (error) {
        console.log("ℹ️  PNG conversion skipped (install Sharp for PNG support)");
    }

    console.log("\n🎯 Custom Font Examples Complete!");
    console.log("📁 Files created:");
    console.log("   • linkedin-banner-google-fonts.svg (Google Fonts example)");
    console.log("   • linkedin-banner-mixed-fonts.svg (Mixed fonts example)");
    console.log("   • linkedin-banner-typography.svg (Typography-focused example)");

    console.log("\n📚 Font Configuration Options:");
    console.log("   🔤 family: Font family name");
    console.log("   🌐 url: Google Fonts or custom font URL");
    console.log("   🛡️  fallback: Fallback font stack");
    console.log("   ⚖️  weight: Font weight (optional)");
    console.log("   📐 style: Font style (normal/italic/oblique)");

    console.log("\n💡 Pro Tips:");
    console.log("   • Use Google Fonts URLs for easy web font integration");
    console.log("   • Always provide fallback fonts for better compatibility");
    console.log("   • Test font rendering in your target applications");
    console.log("   • Consider loading times with custom fonts");
}

// Run the custom fonts demo
createBannerWithCustomFonts().catch(console.error);

export { createBannerWithCustomFonts };
