import { GitHubContributionFetcher } from "./index";
import { SVGHeatmapGenerator, createHeatmapData } from "./svg-heatmap";

async function createLinkedInHeatmap() {
    const fetcher = new GitHubContributionFetcher(process.env.GITHUB_TOKEN);
    const svgGenerator = new SVGHeatmapGenerator();

    try {
        const username = "rndmcodeguy20"; // Change this to your GitHub username

        // Fetch data
        console.log(`🚀 Fetching GitHub data for ${username}...`);
        const contributionData = await fetcher.fetchContributionData(username);
        const processedData = fetcher.processContributionDataForHeatmap(contributionData);
        const heatmapData = createHeatmapData(processedData, username);

        console.log("🎨 Creating LinkedIn-optimized heatmaps...");

        // LinkedIn Header dimensions: 1584x396px (4:1 ratio)
        // We'll create a wide, horizontal layout perfect for LinkedIn

        // 1. Custom LinkedIn Banner with your exact specifications
        const customBannerSvg = svgGenerator.generateCustomLinkedInBanner(heatmapData, {
            username: "rndmcodeguy",
            headerText: "Software engineer",
            subText: "Building refined user interfaces and the solid infrastructure that supports them",
            motivationalText: "Patience. Perseverance. Dedication",
            backgroundColor: "#fff",
            headerTextColor: "#000",
            subTextColor: "#000",
            subTextOpacity: 0.54,
            motivationalTextColor: "#000"
        });
        svgGenerator.saveSVGToFile(customBannerSvg, `${username}-custom-linkedin-banner.svg`);

        // 2. LinkedIn Header - Black Theme (Alternative)
        const linkedinSvg = svgGenerator.generateLinkedInHeader(heatmapData, {
            theme: 'black',
            includeProfile: true,
            headerText: `${heatmapData.totalContributions} contributions on GitHub`,
            subText: "Building in public, one commit at a time"
        });
        svgGenerator.saveSVGToFile(linkedinSvg, `${username}-linkedin-header.svg`);

        // 2. Professional Dark Theme
        const professionalSvg = svgGenerator.generateLinkedInHeader(heatmapData, {
            theme: 'professional',
            includeProfile: true,
            headerText: `Software Developer • ${heatmapData.totalContributions} GitHub contributions`,
            subText: "Passionate about clean code and continuous learning"
        });
        svgGenerator.saveSVGToFile(professionalSvg, `${username}-professional-header.svg`);

        // 3. Minimal Black & White
        const minimalSvg = svgGenerator.generateLinkedInHeader(heatmapData, {
            theme: 'minimal',
            includeProfile: false,
            headerText: `${heatmapData.totalContributions} contributions this year`,
            subText: ""
        });
        svgGenerator.saveSVGToFile(minimalSvg, `${username}-minimal-header.svg`);

        // 4. Generate PNG versions using sharp (if available)
        console.log("📸 Converting to PNG format...");
        await convertSvgToPng(customBannerSvg, `${username}-custom-linkedin-banner.png`, 1584, 396);
        await convertSvgToPng(linkedinSvg, `${username}-linkedin-header.png`, 1584, 396);
        await convertSvgToPng(professionalSvg, `${username}-professional-header.png`, 1584, 396);
        await convertSvgToPng(minimalSvg, `${username}-minimal-header.png`, 1584, 396);

        console.log("✅ LinkedIn headers created successfully!");
        console.log("📁 Files generated:");
        console.log(`   🎯 ${username}-custom-linkedin-banner.svg/.png (YOUR CUSTOM DESIGN)`);
        console.log(`   • ${username}-linkedin-header.svg/.png (black theme)`);
        console.log(`   • ${username}-professional-header.svg/.png (professional)`);
        console.log(`   • ${username}-minimal-header.svg/.png (minimal)`);

        console.log("\n🎨 Your Custom Banner Features:");
        console.log("   • White background (#fff)");
        console.log("   • @rndmcodeguy in top left");
        console.log("   • 'Software engineer' as main header");
        console.log("   • Subheading with 54% opacity");
        console.log("   • 'Patience. Perseverance. Dedication' in bottom left");
        console.log("   • Black-themed heatmap in top right");
        console.log("   • Perfect 1584x396px LinkedIn dimensions");

        console.log("\n💡 LinkedIn Header Tips:");
        console.log("   • Use the PNG version for best quality");
        console.log("   • Upload to LinkedIn Profile > Edit > Background photo");
        console.log("   • Ensure text is readable on mobile devices");

        return customBannerSvg;

    } catch (error) {
        console.error("❌ Error:", error);

        if (error instanceof Error) {
            if (error.message.includes("Bad credentials")) {
                console.error("🔑 Please set your GitHub token in .env file");
            } else if (error.message.includes("Could not resolve to a User")) {
                console.error("👤 Username not found. Please check the username.");
            }
        }
    }
}

// Function to convert SVG to PNG
async function convertSvgToPng(svgContent: string, filename: string, width: number, height: number) {
    try {
        // Try to use sharp for high-quality PNG conversion
        const sharp = require('sharp');
        const svgBuffer = Buffer.from(svgContent);

        await sharp(svgBuffer)
            .resize(width, height)
            .png({ quality: 100 })
            .toFile(filename);

        console.log(`✅ PNG saved: ${filename}`);
    } catch (error) {
        console.log(`⚠️  Sharp not available. SVG saved instead. Install sharp for PNG: bun add sharp`);
        // Fallback: save SVG with PNG extension (browsers can handle this)
        const fs = require('fs');
        fs.writeFileSync(filename.replace('.png', '.svg'), svgContent);
    }
}

// Quick function to create a custom black-themed heatmap
async function createCustomBlackHeatmap() {
    const fetcher = new GitHubContributionFetcher(process.env.GITHUB_TOKEN);
    const svgGenerator = new SVGHeatmapGenerator();

    try {
        const username = "rndmcodeguy20";
        const contributionData = await fetcher.fetchContributionData(username);
        const processedData = fetcher.processContributionDataForHeatmap(contributionData);
        const heatmapData = createHeatmapData(processedData, username);

        // Black theme heatmap
        const blackSvg = svgGenerator.generateSVG(heatmapData, {
            cellSize: 16,
            cellPadding: 3,
            borderRadius: 3,
            showMonthLabels: false,
            showDayLabels: false,
            showLegend: false,
            showTitle: false,
            showSummary: true,
            showTooltips: true,

            // Black color scheme
            colors: [
                '#161b22',  // Dark background
                '#0d1117',  // Darker 
                '#21262d',  // Medium dark
                '#30363d',  // Medium
                '#484f58'   // Lightest (still dark)
            ],

            padding: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 20,
            }
        });

        svgGenerator.saveSVGToFile(blackSvg, `${username}-black-theme.svg`);
        console.log("🖤 Black theme heatmap created!");

        return blackSvg;

    } catch (error) {
        console.error("Error creating black theme:", error);
    }
}

// Run the LinkedIn header creation
createLinkedInHeatmap();

// Uncomment to create additional black theme heatmap
// createCustomBlackHeatmap();

export { createLinkedInHeatmap, createCustomBlackHeatmap };
