import { GitHubContributionFetcher } from "./index";
import { SVGHeatmapGenerator, createHeatmapData } from "./svg-heatmap";

async function createAestheticBlackHeatmaps() {
    const fetcher = new GitHubContributionFetcher(process.env.GITHUB_TOKEN);
    const svgGenerator = new SVGHeatmapGenerator();

    try {
        const username = "rndmcodeguy20"; // Change to your username

        console.log(`🎨 Creating aesthetic black-themed heatmaps for ${username}...`);

        const contributionData = await fetcher.fetchContributionData(username);
        const processedData = fetcher.processContributionDataForHeatmap(contributionData);
        const heatmapData = createHeatmapData(processedData, username);

        // 1. Modern Black Theme - Perfect for LinkedIn
        console.log("🖤 Generating modern black theme...");
        const modernBlackSvg = svgGenerator.generateAestheticHeatmap(heatmapData, {
            style: 'modern',
            primaryColor: '#ffffff',
            backgroundColor: '#000000',
            borderRadius: 6
        });
        svgGenerator.saveSVGToFile(modernBlackSvg, `${username}-modern-black.svg`);

        // 2. Neon Black Theme - Cyberpunk aesthetic
        console.log("⚡ Generating neon black theme...");
        const neonSvg = svgGenerator.generateAestheticHeatmap(heatmapData, {
            style: 'neumorphism',
            primaryColor: '#00ff88',
            backgroundColor: '#0a0a0a',
            borderRadius: 4
        });
        svgGenerator.saveSVGToFile(neonSvg, `${username}-neon-black.svg`);

        // 3. Professional Black LinkedIn Header
        console.log("💼 Generating LinkedIn header...");
        const linkedinBlackSvg = svgGenerator.generateLinkedInHeader(heatmapData, {
            theme: 'black',
            includeProfile: true,
            headerText: `${heatmapData.totalContributions} contributions • Software Developer`,
            subText: "Building innovative solutions, one commit at a time"
        });
        svgGenerator.saveSVGToFile(linkedinBlackSvg, `${username}-linkedin-black.svg`);

        // 4. Gradient Black Theme
        console.log("🌈 Generating gradient theme...");
        const gradientSvg = svgGenerator.generateLinkedInHeader(heatmapData, {
            theme: 'gradient',
            includeProfile: true,
            headerText: `${heatmapData.totalContributions} GitHub contributions`,
            subText: "Passionate developer • Open source contributor"
        });
        svgGenerator.saveSVGToFile(gradientSvg, `${username}-gradient.svg`);

        // 5. Custom Black with White accents
        console.log("⚪ Generating custom black & white...");
        const customBlackSvg = svgGenerator.generateSVG(heatmapData, {
            cellSize: 20,
            cellPadding: 5,
            borderRadius: 8,
            showMonthLabels: false,
            showDayLabels: false,
            showLegend: false,
            showTitle: false,
            showSummary: true,
            showTooltips: true,

            // Custom black-to-white gradient
            colors: [
                '#000000',  // Pure black
                '#1a1a1a',  // Very dark grey
                '#333333',  // Dark grey
                '#666666',  // Medium grey
                '#ffffff'   // Pure white
            ],

            padding: {
                top: 40,
                right: 40,
                bottom: 60,
                left: 40,
            }
        });
        svgGenerator.saveSVGToFile(customBlackSvg, `${username}-black-white.svg`);

        // 6. Minimal Black for Profile
        console.log("📱 Generating minimal profile version...");
        const profileSvg = svgGenerator.generateCleanHeatmap(heatmapData, {
            cellSize: 14,
            cellPadding: 2,
            borderRadius: 3,
            colors: [
                '#111111',  // Near black
                '#222222',  // Dark
                '#444444',  // Medium dark  
                '#888888',  // Light grey
                '#ffffff'   // White
            ]
        });
        svgGenerator.saveSVGToFile(profileSvg, `${username}-minimal-black.svg`);

        console.log("✅ All aesthetic black heatmaps created!");
        console.log("\n📁 Files generated:");
        console.log(`   🖤 ${username}-modern-black.svg (recommended for LinkedIn)`);
        console.log(`   ⚡ ${username}-neon-black.svg (cyberpunk style)`);
        console.log(`   💼 ${username}-linkedin-black.svg (1584x396px header)`);
        console.log(`   🌈 ${username}-gradient.svg (gradient background)`);
        console.log(`   ⚪ ${username}-black-white.svg (black to white)`);
        console.log(`   📱 ${username}-minimal-black.svg (compact profile)`);

        console.log("\n💡 Usage tips:");
        console.log("   • Use the LinkedIn header file for your LinkedIn banner");
        console.log("   • Modern black works great for portfolio websites");
        console.log("   • Minimal black is perfect for GitHub profile READMEs");
        console.log("   • Neon style is great for tech presentations");

        // Try to install sharp for PNG conversion
        console.log("\n📸 To convert to PNG format:");
        console.log("   1. Run: bun add sharp");
        console.log("   2. Re-run this script for automatic PNG generation");

        return {
            modernBlack: modernBlackSvg,
            linkedinHeader: linkedinBlackSvg,
            totalContributions: heatmapData.totalContributions
        };

    } catch (error) {
        console.error("❌ Error creating aesthetic heatmaps:", error);

        if (error instanceof Error) {
            if (error.message.includes("Bad credentials")) {
                console.error("🔑 Please set your GitHub token:");
                console.error("   1. Copy .env.example to .env");
                console.error("   2. Add your token from https://github.com/settings/tokens");
            }
        }
    }
}

// Function to create specific color schemes
function createColorSchemeExamples() {
    console.log("\n🎨 Black Theme Color Schemes:");
    console.log("1. Classic Black & White:");
    console.log("   ['#000000', '#1a1a1a', '#333333', '#666666', '#ffffff']");

    console.log("\n2. GitHub Dark:");
    console.log("   ['#0d1117', '#161b22', '#21262d', '#30363d', '#8b949e']");

    console.log("\n3. Neon Green:");
    console.log("   ['#0a0a0a', '#001a0a', '#003d1a', '#00ff8820', '#00ff88']");

    console.log("\n4. Blue Accent:");
    console.log("   ['#000000', '#001122', '#002244', '#004488', '#0088ff']");

    console.log("\n5. Purple Gradient:");
    console.log("   ['#0a0a0a', '#1a0a1a', '#2a1a2a', '#4a2a4a', '#8a4a8a']");
}

// Quick demo function
async function quickBlackDemo() {
    const svgGenerator = new SVGHeatmapGenerator();

    // Sample data for quick testing
    const sampleData = {
        weeks: Array.from({ length: 53 }, (_, weekIndex) => ({
            firstDay: `2024-${String(Math.floor(weekIndex / 4) + 1).padStart(2, '0')}-01`,
            contributionDays: Array.from({ length: 7 }, (_, dayIndex) => ({
                date: `2024-${String(Math.floor(weekIndex / 4) + 1).padStart(2, '0')}-${String(dayIndex + 1).padStart(2, '0')}`,
                contributionCount: Math.floor(Math.random() * 12),
                color: '#40c463',
                weekday: dayIndex
            }))
        })),
        totalContributions: 1247,
        username: "YourUsername"
    };

    console.log("🚀 Quick demo - generating sample black heatmap...");

    const demoSvg = svgGenerator.generateLinkedInHeader(sampleData, {
        theme: 'black',
        headerText: "1247 contributions • Software Developer",
        subText: "Turning ideas into code"
    });

    svgGenerator.saveSVGToFile(demoSvg, "demo-black-linkedin.svg");
    console.log("✅ Demo file created: demo-black-linkedin.svg");
}

// Run the main function
createAestheticBlackHeatmaps();

// Show color scheme examples
createColorSchemeExamples();

// Uncomment for quick demo without API:
// quickBlackDemo();

export { createAestheticBlackHeatmaps, quickBlackDemo };
