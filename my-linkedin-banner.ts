import { GitHubContributionFetcher } from "./index";
import { SVGHeatmapGenerator, createHeatmapData } from "./svg-heatmap";

async function createMyCustomLinkedInBanner() {
    const fetcher = new GitHubContributionFetcher(process.env.GITHUB_TOKEN);
    const svgGenerator = new SVGHeatmapGenerator();

    try {
        const username = "rndmcodeguy20"; // Your GitHub username

        console.log(`🚀 Creating your custom LinkedIn banner for ${username}...`);

        // Fetch your GitHub contribution data
        const contributionData = await fetcher.fetchContributionData(username);
        const processedData = fetcher.processContributionDataForHeatmap(contributionData);
        const heatmapData = createHeatmapData(processedData, username);

        // Generate your exact specifications with custom fonts (optional)
        const customBanner = svgGenerator.generateCustomLinkedInBanner(heatmapData, {
            username: "rndmcodeguy",
            headerText: "Software Engineer",
            subText: "Building refined user interfaces and the solid infrastructure that supports them",
            motivationalText: "Patience\nPerseverance\nDedication",
            backgroundColor: "#fff",
            headerTextColor: "#000",
            subTextColor: "#000",
            subTextOpacity: 0.54,
            motivationalTextColor: "#000",
            heatmapTheme: 'dark',
            // Optional: Custom fonts for enhanced typography
            fonts: {
                username: {
                    family: "JetBrains Mono",
                    url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap",
                    fallback: "Consolas, Monaco, monospace"
                },
                headerText: {
                    family: "Urbanist",
                    url: "https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap",
                    fallback: "-apple-system, BlinkMacSystemFont, sans-serif"
                },
                subheaderText: {
                    weight: 600,
                    family: "Urbanist",
                    url: "https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap",
                    fallback: "-apple-system, BlinkMacSystemFont, sans-serif"
                },
                motivationalText: {
                    // weight: 900,
                    // family: "Urbanist",
                    // url: "https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap",
                    // fallback: "-apple-system, BlinkMacSystemFont, sans-serif"
                    // weight: 500,
                    // family: "Barlow",
                    // url: "https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
                    // fallback: "-apple-system, BlinkMacSystemFont, sans-serif"
                    weight: 900,
                    family: "Alumni Sans Pinstripe",
                    url: "https://fonts.googleapis.com/css2?family=Alumni+Sans+Pinstripe:ital@0;1&display=swap",
                    fallback: "-apple-system, BlinkMacSystemFont, sans-serif"
                    // weight: 900,
                    // family: "Lexend Deca",
                    // url: "https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100..900&display=swap",
                    // fallback: "-apple-system, BlinkMacSystemFont, sans-serif"
                }
                // Note: subheaderText and motivationalText will use default system fonts
                // You can add them here too if you want custom fonts for those elements
            },
            customFonts: [
                {
                    family: "JetBrains Mono",
                    url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
                },
                {
                    family: "Urbanist",
                    url: "https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap"
                },
                {
                    family: "Barlow",
                    url: "https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                },
                {
                    family: "Alumni Sans Pinstripe",
                    url: "https://fonts.googleapis.com/css2?family=Alumni+Sans+Pinstripe:ital@0;1&display=swap"
                }
            ]
        });

        // Save SVG
        svgGenerator.saveSVGToFile(customBanner, "rndmcodeguy-linkedin-banner.svg");

        // Generate high-quality PNG files
        try {
            // Standard quality PNG
            await svgGenerator.convertToPNG("rndmcodeguy-linkedin-banner.svg", "rndmcodeguy-linkedin-banner.png");

            // High-quality PNG (2x resolution for crisp display)
            await svgGenerator.convertToHighQualityPNG("rndmcodeguy-linkedin-banner.svg", "rndmcodeguy-linkedin-banner-hq.png", 2);

            // Ultra high-quality PNG (3x resolution for print quality)
            await svgGenerator.convertToPNG("rndmcodeguy-linkedin-banner.svg", "rndmcodeguy-linkedin-banner-ultra.png", {
                quality: 100,
                scale: 3
            });
        } catch (error) {
            console.log("⚠️  Install Sharp for PNG conversion: bun add sharp");
        }

        console.log("🎯 Your custom LinkedIn banner is ready!");
        console.log("📁 Files created:");
        console.log("   • rndmcodeguy-linkedin-banner.svg");
        console.log("   • rndmcodeguy-linkedin-banner.png (standard quality)");
        console.log("   • rndmcodeguy-linkedin-banner-hq.png (high quality - 2x resolution)");
        console.log("   • rndmcodeguy-linkedin-banner-ultra.png (ultra quality - 3x resolution)");
        console.log("💡 Recommended: Use the -hq.png version for LinkedIn upload");

        console.log("\n✨ Banner specifications:");
        console.log("   📐 Dimensions: 1584x396px (perfect for LinkedIn)");
        console.log("   🎨 Background: White (#fff)");
        console.log("   📍 @rndmcodeguy: Top left");
        console.log("   💼 'Software engineer': Main header (black, bold)");
        console.log("   📝 Subheading: 54% opacity black");
        console.log("   💪 'Patience. Perseverance. Dedication': Bottom right below heatmap (large, bold)");
        console.log("   📊 Heatmap: Top right corner (black theme)");

        console.log("\n🚀 How to use:");
        console.log("   1. Go to your LinkedIn profile");
        console.log("   2. Click 'Edit' on your profile");
        console.log("   3. Click the camera icon on your banner area");
        console.log("   4. Upload the PNG file");
        console.log("   5. Position and save!");

        return customBanner;

    } catch (error) {
        console.error("❌ Error creating banner:", error);

        if (error instanceof Error) {
            if (error.message.includes("Bad credentials")) {
                console.error("🔑 Set your GitHub token in .env file");
                console.error("   Get token from: https://github.com/settings/tokens");
            } else if (error.message.includes("Could not resolve to a User")) {
                console.error("👤 GitHub username not found");
            }
        }
    }
}

// Quick demo with sample data (no API needed)
async function createDemoBanner() {
    const svgGenerator = new SVGHeatmapGenerator();

    // Sample contribution data
    const sampleData = {
        weeks: Array.from({ length: 53 }, (_, weekIndex) => ({
            firstDay: `2024-${String(Math.floor(weekIndex / 4) + 1).padStart(2, '0')}-01`,
            contributionDays: Array.from({ length: 7 }, (_, dayIndex) => ({
                date: `2024-${String(Math.floor(weekIndex / 4) + 1).padStart(2, '0')}-${String(dayIndex + 1).padStart(2, '0')}`,
                contributionCount: Math.floor(Math.random() * 8), // Random contributions
                color: '#40c463',
                weekday: dayIndex
            }))
        })),
        totalContributions: 892,
        username: "rndmcodeguy"
    };

    console.log("🎭 Creating demo banner with sample data...");

    const demoBanner = svgGenerator.generateCustomLinkedInBanner(sampleData, {
        username: "rndmcodeguy",
        headerText: "Software engineer",
        subText: "Building refined user interfaces and the solid infrastructure that supports them",
        motivationalText: "Patience. Perseverance. Dedication",
        backgroundColor: "#fff",
        headerTextColor: "#000",
        subTextColor: "#000",
        subTextOpacity: 0.54,
        motivationalTextColor: "#000",
        heatmapTheme: 'dark'
    });

    svgGenerator.saveSVGToFile(demoBanner, "demo-linkedin-banner.svg");
    console.log("✅ Demo banner created: demo-linkedin-banner.svg");

    return demoBanner;
}

// Run the function to create your banner
createMyCustomLinkedInBanner();

// Uncomment for demo without API:
// createDemoBanner();

export { createMyCustomLinkedInBanner, createDemoBanner };
