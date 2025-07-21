import { GitHubContributionFetcher } from "./index";
import { SVGHeatmapGenerator, createHeatmapData } from "./svg-heatmap";

async function generateModularHeatmap() {
    const fetcher = new GitHubContributionFetcher(process.env.GITHUB_TOKEN);
    const svgGenerator = new SVGHeatmapGenerator();

    try {
        const username = "rndmcodeguy20"; // Replace with your GitHub username

        // Fetch contribution data
        const contributionData = await fetcher.fetchContributionData(username);
        const processedData = fetcher.processContributionDataForHeatmap(contributionData);
        const heatmapData = createHeatmapData(processedData, username);

        console.log("Generating modular heatmaps...");

        // 1. Minimal heatmap with your specifications:
        // - Bigger boxes (16px instead of 11px)
        // - No month labels
        // - No day labels  
        // - No legend
        // - Keep total contributions
        const minimalSvg = svgGenerator.generateMinimalSVG(heatmapData, {
            cellSize: 18,
            cellPadding: 4,
            showTooltips: true,
        });
        svgGenerator.saveSVGToFile(minimalSvg, `${username}-minimal.svg`);

        // 2. Ultra clean version - just grid and total
        const ultraCleanSvg = svgGenerator.generateModularSVG(heatmapData, {
            includeGrid: true,
            includeTitle: false,
            includeSummary: true,
            includeLegend: false,
            includeMonthLabels: false,
            includeDayLabels: false,
        }, {
            cellSize: 20,
            cellPadding: 5,
            showTooltips: false,
            padding: {
                top: 15,
                right: 15,
                bottom: 40,
                left: 15,
            }
        });
        svgGenerator.saveSVGToFile(ultraCleanSvg, `${username}-ultra-clean.svg`);

        // 3. Medium size with rounded corners effect (using CSS)
        const mediumSvg = svgGenerator.generateSVG(heatmapData, {
            cellSize: 16,
            cellPadding: 3,
            showMonthLabels: false,
            showDayLabels: false,
            showLegend: false,
            showTitle: false,
            showSummary: true,
            showTooltips: true,
            padding: {
                top: 20,
                right: 20,
                bottom: 35,
                left: 20,
            }
        });
        svgGenerator.saveSVGToFile(mediumSvg, `${username}-medium-clean.svg`);

        // 4. Large boxes version
        const largeSvg = svgGenerator.generateSVG(heatmapData, {
            cellSize: 24,
            cellPadding: 6,
            showMonthLabels: false,
            showDayLabels: false,
            showLegend: false,
            showTitle: false,
            showSummary: true,
            showTooltips: true,
            padding: {
                top: 25,
                right: 25,
                bottom: 45,
                left: 25,
            }
        });
        svgGenerator.saveSVGToFile(largeSvg, `${username}-large-boxes.svg`);

        // 5. Custom colors with bigger boxes
        const customColorSvg = svgGenerator.generateSVG(heatmapData, {
            cellSize: 18,
            cellPadding: 4,
            showMonthLabels: false,
            showDayLabels: false,
            showLegend: false,
            showTitle: false,
            showSummary: true,
            showTooltips: true,
            colors: ['#1e293b', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'], // Dark theme
            padding: {
                top: 20,
                right: 20,
                bottom: 35,
                left: 20,
            }
        });
        svgGenerator.saveSVGToFile(customColorSvg, `${username}-custom-colors.svg`);

        console.log("✅ Modular heatmaps generated successfully!");
        console.log("Files created:");
        console.log(`- ${username}-minimal.svg (recommended)`);
        console.log(`- ${username}-ultra-clean.svg`);
        console.log(`- ${username}-medium-clean.svg`);
        console.log(`- ${username}-large-boxes.svg`);
        console.log(`- ${username}-custom-colors.svg`);

        // Return data for further use
        return {
            contributionData,
            processedData,
            heatmapData,
        };

    } catch (error) {
        console.error("Error generating modular heatmap:", error);

        if (error instanceof Error && error.message.includes("Bad credentials")) {
            console.error("Please set your GitHub token in the GITHUB_TOKEN environment variable");
        }
    }
}

// Function to create a heatmap with only specific components
async function createCustomComponentHeatmap() {
    const fetcher = new GitHubContributionFetcher(process.env.GITHUB_TOKEN);
    const svgGenerator = new SVGHeatmapGenerator();

    try {
        const username = "rndmcodeguy20";
        const contributionData = await fetcher.fetchContributionData(username);
        const processedData = fetcher.processContributionDataForHeatmap(contributionData);
        const heatmapData = createHeatmapData(processedData, username);

        // Create exactly what you asked for:
        // - Bigger boxes
        // - No month labels
        // - No day labels
        // - No legend
        // - Keep total contributions
        const perfectSvg = svgGenerator.generateModularSVG(heatmapData, {
            includeGrid: true,        // ✅ Keep the contribution squares
            includeTitle: false,      // ❌ Remove title
            includeSummary: true,     // ✅ Keep "X contributions this year"
            includeLegend: false,     // ❌ Remove legend
            includeMonthLabels: false,// ❌ Remove month labels
            includeDayLabels: false,  // ❌ Remove day labels
        }, {
            cellSize: 20,            // 🔳 Bigger boxes (20px instead of 11px)
            cellPadding: 4,          // More space between boxes
            showTooltips: true,      // Keep hover info
            padding: {
                top: 20,
                right: 20,
                bottom: 40,          // Extra space for summary text
                left: 20,
            }
        });

        svgGenerator.saveSVGToFile(perfectSvg, `${username}-perfect.svg`);
        console.log(`✨ Perfect heatmap created: ${username}-perfect.svg`);

        return perfectSvg;

    } catch (error) {
        console.error("Error creating custom component heatmap:", error);
    }
}

// Uncomment to run
generateModularHeatmap();
// createCustomComponentHeatmap();

export { generateModularHeatmap, createCustomComponentHeatmap };
