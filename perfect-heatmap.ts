import { GitHubContributionFetcher } from "./index";
import { SVGHeatmapGenerator, createHeatmapData } from "./svg-heatmap";

async function createYourPerfectHeatmap() {
    const fetcher = new GitHubContributionFetcher(process.env.GITHUB_TOKEN);
    const svgGenerator = new SVGHeatmapGenerator();

    try {
        const username = "rndmcodeguy20"; // Change this to any GitHub username

        // Fetch data
        console.log(`Fetching data for ${username}...`);
        const contributionData = await fetcher.fetchContributionData(username);
        const processedData = fetcher.processContributionDataForHeatmap(contributionData);
        const heatmapData = createHeatmapData(processedData, username);

        // Method 1: Use the preset clean method (recommended) - now with rounded corners!
        console.log("Generating clean heatmap with rounded corners...");
        const cleanSvg = svgGenerator.generateCleanHeatmap(heatmapData, {
            cellSize: 20,        // Bigger boxes as requested
            cellPadding: 4,      // Nice spacing
            borderRadius: 4,     // 🔄 Rounded corners!
            showTooltips: true,  // Keep hover info
        });
        svgGenerator.saveSVGToFile(cleanSvg, `${username}-clean.svg`);

        // Method 2: Manual configuration for full control
        console.log("Generating custom heatmap with rounded corners...");
        const customSvg = svgGenerator.generateSVG(heatmapData, {
            // Your specifications:
            cellSize: 22,              // 🔳 Bigger boxes
            cellPadding: 5,            // More space between boxes
            borderRadius: 5,           // 🔄 Nice rounded corners
            showMonthLabels: false,    // ❌ No month labels
            showDayLabels: false,      // ❌ No day labels  
            showLegend: false,         // ❌ No legend
            showTitle: false,          // ❌ No title
            showSummary: true,         // ✅ Keep "X contributions this year"
            showTooltips: true,        // ✅ Keep hover information

            // Clean padding
            padding: {
                top: 25,
                right: 25,
                bottom: 45,            // Extra space for summary text
                left: 25,
            },

            // Optional: Custom colors
            // colors: ['#f1f5f9', '#60a5fa', '#3b82f6', '#1d4ed8', '#1e40af'], // Blue theme
        });
        svgGenerator.saveSVGToFile(customSvg, `${username}-custom.svg`);

        // Method 3: Ultra minimal - just boxes and total
        console.log("Generating ultra minimal heatmap...");
        const minimalSvg = svgGenerator.generateModularSVG(heatmapData, {
            includeGrid: true,         // ✅ Just the contribution squares
            includeTitle: false,       // ❌ No title
            includeSummary: true,      // ✅ Keep total contributions
            includeLegend: false,      // ❌ No legend
            includeMonthLabels: false, // ❌ No months
            includeDayLabels: false,   // ❌ No days
        }, {
            cellSize: 18,
            cellPadding: 3,
            showTooltips: false,       // Even cleaner - no tooltips
            padding: {
                top: 15,
                right: 15,
                bottom: 35,
                left: 15,
            }
        });
        svgGenerator.saveSVGToFile(minimalSvg, `${username}-minimal.svg`);

        console.log("✅ All heatmaps generated!");
        console.log("Files created:");
        console.log(`📁 ${username}-clean.svg    (recommended - preset method)`);
        console.log(`📁 ${username}-custom.svg   (manual configuration)`);
        console.log(`📁 ${username}-minimal.svg  (ultra minimal)`);

        console.log(`\n📊 Stats: ${heatmapData.totalContributions} total contributions`);

        return cleanSvg; // Return the recommended version

    } catch (error) {
        console.error("❌ Error:", error);

        if (error instanceof Error) {
            if (error.message.includes("Bad credentials")) {
                console.error("🔑 Please set your GitHub token:");
                console.error("   1. Copy .env.example to .env");
                console.error("   2. Add your token from https://github.com/settings/tokens");
            } else if (error.message.includes("Could not resolve to a User")) {
                console.error("👤 Username not found. Please check the username.");
            }
        }
    }
}

// Quick test function
async function quickTest() {
    const svgGenerator = new SVGHeatmapGenerator();

    // Sample data for testing without API calls
    const sampleData = {
        weeks: [
            {
                firstDay: "2024-01-01",
                contributionDays: [
                    { date: "2024-01-01", contributionCount: 3, color: "#40c463", weekday: 1 },
                    { date: "2024-01-02", contributionCount: 0, color: "#ebedf0", weekday: 2 },
                    // ... more days
                ]
            }
            // ... more weeks
        ],
        totalContributions: 234,
        username: "TestUser"
    };

    const testSvg = svgGenerator.generateCleanHeatmap(sampleData);
    svgGenerator.saveSVGToFile(testSvg, "test-clean.svg");
    console.log("Test heatmap created: test-clean.svg");
}

// Run the main function
createYourPerfectHeatmap();

// Uncomment to test without API:
// quickTest();

export { createYourPerfectHeatmap };
