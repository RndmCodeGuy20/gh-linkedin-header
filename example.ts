import { GitHubContributionFetcher } from "./index";
import { SVGHeatmapGenerator, createHeatmapData } from "./svg-heatmap";

async function exampleUsage() {
    // Set your GitHub token as an environment variable or pass it directly
    const fetcher = new GitHubContributionFetcher(process.env.GITHUB_TOKEN);

    try {
        // Fetch data for a specific user
        const username = "rndmcodeguy20"; // Replace with any GitHub username

        const contributionData = await fetcher.fetchContributionData(username);
        const processedData = fetcher.processContributionDataForHeatmap(contributionData);

        // Example: Create data structure for a heatmap library
        const heatmapFormat = processedData.allDays.map(day => ({
            date: day.date,
            count: day.contributionCount,
            level: getContributionLevel(day.contributionCount, processedData.stats.maxContributions),
        }));

        console.log("Sample heatmap data:", heatmapFormat.slice(0, 10));

        // Example: Get contributions for a specific date range
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const recentContributions = processedData.allDays.filter(day =>
            new Date(day.date) >= lastMonth
        );

        console.log(`Contributions in the last month: ${recentContributions.reduce((sum, day) => sum + day.contributionCount, 0)}`);

        // Generate SVG heatmap
        console.log("\nGenerating SVG heatmap...");
        const svgGenerator = new SVGHeatmapGenerator();
        const heatmapData = createHeatmapData(processedData, username);

        // Generate with default GitHub colors
        const svgHeatmap = svgGenerator.generateSVG(heatmapData, {
            showTooltips: true,
            showMonthLabels: false,
            showDayLabels: false,
        });

        // Save to file
        svgGenerator.saveSVGToFile(svgHeatmap, `${username}-heatmap.svg`);

        // Generate with custom color scheme
        const blueSvg = svgGenerator.generateCustomColorHeatmap(heatmapData, 'orange', {
            cellSize: 12,
            cellPadding: 3,
        });
        svgGenerator.saveSVGToFile(blueSvg, `${username}-heatmap-blue.svg`);

        console.log("SVG heatmaps generated successfully!");

        return svgHeatmap;

    } catch (error) {
        console.error("Error fetching contribution data:", error);
    }
}

// Helper function to get contribution level (0-4) based on count
function getContributionLevel(count: number, maxCount: number): number {
    if (count === 0) return 0;
    if (count <= maxCount * 0.25) return 1;
    if (count <= maxCount * 0.5) return 2;
    if (count <= maxCount * 0.75) return 3;
    return 4;
}

// Uncomment to run the example
exampleUsage();
