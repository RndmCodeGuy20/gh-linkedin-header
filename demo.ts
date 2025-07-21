import { SVGHeatmapGenerator, createHeatmapData } from "./svg-heatmap";
import type { ContributionDay, ContributionWeek } from "./index";

// Demo function to create heatmaps with sample data
function createSampleHeatmap() {
    const svgGenerator = new SVGHeatmapGenerator();

    // Create sample contribution data (365 days)
    const weeks: ContributionWeek[] = [];
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    let currentDate = new Date(startDate);
    let weekIndex = 0;

    while (currentDate <= new Date()) {
        const week: ContributionWeek = {
            contributionDays: [],
            firstDay: new Date(currentDate).toISOString().split('T')[0]!,
        };

        // Add 7 days to the week
        for (let day = 0; day < 7; day++) {
            if (currentDate <= new Date()) {
                const contributionCount = Math.floor(Math.random() * 15); // Random contributions 0-14

                const contributionDay: ContributionDay = {
                    date: new Date(currentDate).toISOString().split('T')[0]!,
                    contributionCount,
                    color: getColorForCount(contributionCount),
                    weekday: currentDate.getDay(),
                };

                week.contributionDays.push(contributionDay);
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        if (week.contributionDays.length > 0) {
            weeks.push(week);
        }
        weekIndex++;
    }

    const sampleData = {
        weeks,
        totalContributions: weeks.reduce((total, week) =>
            total + week.contributionDays.reduce((sum, day) => sum + day.contributionCount, 0), 0
        ),
        username: "SampleUser",
    };

    // Generate different variations
    console.log("Generating sample heatmaps...");

    // 1. Default GitHub style
    const defaultSvg = svgGenerator.generateSVG(sampleData);
    svgGenerator.saveSVGToFile(defaultSvg, "sample-heatmap-default.svg");

    // 2. Large cells with custom colors
    const largeSvg = svgGenerator.generateSVG(sampleData, {
        cellSize: 15,
        cellPadding: 3,
        colors: ['#f0f9ff', '#bfdbfe', '#60a5fa', '#3b82f6', '#1d4ed8'],
    });
    svgGenerator.saveSVGToFile(largeSvg, "sample-heatmap-large.svg");

    // 3. Compact version without labels
    const compactSvg = svgGenerator.generateSVG(sampleData, {
        cellSize: 8,
        cellPadding: 1,
        showMonthLabels: false,
        showDayLabels: false,
        showTooltips: false,
    });
    svgGenerator.saveSVGToFile(compactSvg, "sample-heatmap-compact.svg");

    // 4. Different color schemes
    const colorSchemes = ['github', 'green', 'blue', 'purple', 'orange'] as const;
    colorSchemes.forEach(scheme => {
        const colorSvg = svgGenerator.generateCustomColorHeatmap(sampleData, scheme);
        svgGenerator.saveSVGToFile(colorSvg, `sample-heatmap-${scheme}.svg`);
    });

    console.log("Sample heatmaps generated successfully!");
    console.log("Files created:");
    console.log("- sample-heatmap-default.svg");
    console.log("- sample-heatmap-large.svg");
    console.log("- sample-heatmap-compact.svg");
    colorSchemes.forEach(scheme => {
        console.log(`- sample-heatmap-${scheme}.svg`);
    });
}

function getColorForCount(count: number): string {
    const colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
    if (count === 0) return colors[0]!;
    if (count <= 3) return colors[1]!;
    if (count <= 6) return colors[2]!;
    if (count <= 9) return colors[3]!;
    return colors[4]!;
}

// Uncomment to run the demo
// createSampleHeatmap();

export { createSampleHeatmap };
