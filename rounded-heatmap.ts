import { GitHubContributionFetcher } from "./index";
import { SVGHeatmapGenerator, createHeatmapData } from "./svg-heatmap";

async function createRoundedHeatmaps() {
    const fetcher = new GitHubContributionFetcher(process.env.GITHUB_TOKEN);
    const svgGenerator = new SVGHeatmapGenerator();

    try {
        const username = "rndmcodeguy20"; // Change this to any GitHub username

        // Fetch data
        console.log(`Fetching data for ${username}...`);
        const contributionData = await fetcher.fetchContributionData(username);
        const processedData = fetcher.processContributionDataForHeatmap(contributionData);
        const heatmapData = createHeatmapData(processedData, username);

        console.log("🔄 Generating rounded corner heatmaps...");

        // 1. Clean heatmap with default rounded corners (3px)
        const cleanRoundedSvg = svgGenerator.generateCleanHeatmap(heatmapData, {
            cellSize: 20,
            cellPadding: 4,
            // borderRadius: 3 is already set by default in generateCleanHeatmap
        });
        svgGenerator.saveSVGToFile(cleanRoundedSvg, `${username}-rounded-clean.svg`);

        // 2. Subtle rounded corners (2px)
        const subtleRoundedSvg = svgGenerator.generateSVG(heatmapData, {
            cellSize: 18,
            cellPadding: 3,
            borderRadius: 2,           // 🔲 Subtle rounded corners
            showMonthLabels: false,
            showDayLabels: false,
            showLegend: false,
            showTitle: false,
            showSummary: true,
            showTooltips: true,
            padding: { top: 20, right: 20, bottom: 40, left: 20 },
        });
        svgGenerator.saveSVGToFile(subtleRoundedSvg, `${username}-subtle-rounded.svg`);

        // 3. Very rounded corners (6px - more pill-like)
        const veryRoundedSvg = svgGenerator.generateSVG(heatmapData, {
            cellSize: 22,
            cellPadding: 5,
            borderRadius: 6,           // 🔵 Very rounded (pill-like)
            showMonthLabels: false,
            showDayLabels: false,
            showLegend: false,
            showTitle: false,
            showSummary: true,
            showTooltips: true,
            padding: { top: 25, right: 25, bottom: 45, left: 25 },
        });
        svgGenerator.saveSVGToFile(veryRoundedSvg, `${username}-very-rounded.svg`);

        // 4. Perfect circles (borderRadius = half of cellSize)
        const circleSize = 20;
        const circleSvg = svgGenerator.generateSVG(heatmapData, {
            cellSize: circleSize,
            cellPadding: 4,
            borderRadius: circleSize / 2,  // ⭕ Perfect circles
            showMonthLabels: false,
            showDayLabels: false,
            showLegend: false,
            showTitle: false,
            showSummary: true,
            showTooltips: true,
            padding: { top: 20, right: 20, bottom: 40, left: 20 },
        });
        svgGenerator.saveSVGToFile(circleSvg, `${username}-circles.svg`);

        // 5. Comparison: No rounded corners (square)
        const squareSvg = svgGenerator.generateSVG(heatmapData, {
            cellSize: 20,
            cellPadding: 4,
            borderRadius: 0,           // ⬜ Square corners
            showMonthLabels: false,
            showDayLabels: false,
            showLegend: false,
            showTitle: false,
            showSummary: true,
            showTooltips: true,
            padding: { top: 20, right: 20, bottom: 40, left: 20 },
        });
        svgGenerator.saveSVGToFile(squareSvg, `${username}-square.svg`);

        // 6. Medium rounded with custom colors
        const customRoundedSvg = svgGenerator.generateSVG(heatmapData, {
            cellSize: 18,
            cellPadding: 3,
            borderRadius: 4,           // 🎨 Medium rounded with custom colors
            colors: ['#f8fafc', '#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a'], // Blue theme
            showMonthLabels: false,
            showDayLabels: false,
            showLegend: false,
            showTitle: false,
            showSummary: true,
            showTooltips: true,
            padding: { top: 20, right: 20, bottom: 40, left: 20 },
        });
        svgGenerator.saveSVGToFile(customRoundedSvg, `${username}-custom-rounded.svg`);

        console.log("✅ All rounded corner heatmaps generated!");
        console.log("Files created:");
        console.log(`📁 ${username}-rounded-clean.svg    (default 3px rounded)`);
        console.log(`📁 ${username}-subtle-rounded.svg   (2px subtle)`);
        console.log(`📁 ${username}-very-rounded.svg     (6px very rounded)`);
        console.log(`📁 ${username}-circles.svg          (perfect circles)`);
        console.log(`📁 ${username}-square.svg           (comparison - no rounds)`);
        console.log(`📁 ${username}-custom-rounded.svg   (4px + custom colors)`);

        console.log(`\n📊 Stats: ${heatmapData.totalContributions} total contributions`);

        return cleanRoundedSvg;

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

// Quick demo function showing different rounded corner options
function demonstrateRoundedOptions() {
    console.log("🔄 Rounded Corner Options:");
    console.log("borderRadius: 0   → ⬜ Square corners (default)");
    console.log("borderRadius: 2   → 🔲 Subtle rounded");
    console.log("borderRadius: 3   → 🔳 Nice rounded (recommended)");
    console.log("borderRadius: 4   → 🔲 Medium rounded");
    console.log("borderRadius: 6   → 🔵 Very rounded (pill-like)");
    console.log("borderRadius: cellSize/2 → ⭕ Perfect circles");
    console.log("\nFor cellSize: 20px");
    console.log("- borderRadius: 10 = perfect circle");
    console.log("- borderRadius: 3-5 = nice rounded rectangle");
    console.log("- borderRadius: 1-2 = subtle rounding");
}

// Run the main function
createRoundedHeatmaps();

// Show options info
demonstrateRoundedOptions();

export { createRoundedHeatmaps };
