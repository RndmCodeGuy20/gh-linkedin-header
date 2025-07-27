import type { ContributionDay, ContributionWeek } from "./index";
import { svgLogos } from "./logos";

// Custom font configuration interface
interface CustomFont {
    family: string;
    url?: string;           // Google Fonts or web font URL
    localPath?: string;     // Local TTF/OTF file path
    fallback?: string;
    weight?: number | string;
    style?: 'normal' | 'italic' | 'oblique';
    format?: 'truetype' | 'opentype' | 'woff' | 'woff2'; // Font format for local files
}

// Font configuration for different text elements in LinkedIn banner
interface FontConfig {
    username?: CustomFont;
    headerText?: CustomFont;
    subheaderText?: CustomFont;
    motivationalText?: CustomFont;
}

interface HeatmapOptions {
    cellSize?: number;
    cellPadding?: number;
    fontSize?: number;
    fontFamily?: string;
    colors?: string[];
    showMonthLabels?: boolean;
    showDayLabels?: boolean;
    showTooltips?: boolean;
    showLegend?: boolean;
    showTitle?: boolean;
    showSummary?: boolean;
    borderRadius?: number;  // New option for rounded corners
    width?: number;
    height?: number;
    padding?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
}

interface LinkedInHeaderOptions {
    theme?: 'black' | 'professional' | 'minimal' | 'gradient';
    includeProfile?: boolean;
    headerText?: string;
    subText?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
}

interface CustomLinkedInBannerOptions {
    username?: string;
    headerText?: string;
    subText?: string;
    motivationalText?: string;
    backgroundColor?: string;
    headerTextColor?: string;
    subTextColor?: string;
    subTextOpacity?: number;
    motivationalTextColor?: string;
    heatmapTheme?: 'dark' | 'light';
    fonts?: FontConfig;
    customFonts?: CustomFont[];
}

interface HeatmapData {
    weeks: ContributionWeek[];
    totalContributions: number;
    username?: string;
}

interface LayoutDimensions {
    graphWidth: number;
    graphHeight: number;
    totalWidth: number;
    totalHeight: number;
    leftPadding: number;
    topPadding: number;
    rightPadding: number;
    bottomPadding: number;
}

export class SVGHeatmapGenerator {
    private defaultOptions: Required<HeatmapOptions> = {
        cellSize: 11,
        cellPadding: 2,
        fontSize: 9,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
        colors: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
        showMonthLabels: true,
        showDayLabels: true,
        showTooltips: true,
        showLegend: true,
        showTitle: true,
        showSummary: true,
        borderRadius: 0, // Default: square corners
        width: 0, // Will be calculated
        height: 0, // Will be calculated
        padding: {
            top: 10,
            right: 10,
            bottom: 20,
            left: 10,
        }
    };

    /**
     * Generate a minimal SVG heatmap with just the contribution squares and summary
     */
    generateMinimalSVG(data: HeatmapData, options: HeatmapOptions = {}): string {
        const minimalOptions: HeatmapOptions = {
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
                bottom: 30,
                left: 20,
            },
            ...options
        };

        return this.generateSVG(data, minimalOptions);
    }

    /**
     * Generate font definitions for custom fonts
     */
    private generateFontDefinitions(customFonts: CustomFont[] = []): string {
        if (!customFonts.length) return '';

        let fontDefs = '<defs><style>';

        customFonts.forEach(font => {
            if (font.url) {
                // For web fonts (Google Fonts, custom URLs)
                // Escape & characters for valid XML
                const escapedUrl = font.url.replace(/&/g, '&amp;');
                fontDefs += `
                    @import url('${escapedUrl}');
                `;
            } else if (font.localPath) {
                // For local font files (TTF, OTF, WOFF, etc.)
                const format = font.format || 'truetype'; // Default to truetype for TTF files
                fontDefs += `
                    @font-face {
                        font-family: '${font.family}';
                        src: url('${font.localPath}') format('${format}');
                        font-weight: ${font.weight || 'normal'};
                        font-style: ${font.style || 'normal'};
                        font-display: swap;
                    }
                `;
            } else {
                // For fonts that might be available locally without file path
                fontDefs += `
                    @font-face {
                        font-family: '${font.family}';
                        font-weight: ${font.weight || 'normal'};
                        font-style: ${font.style || 'normal'};
                    }
                `;
            }
        }); fontDefs += '</style></defs>';
        return fontDefs;
    }

    /**
     * Get font family string with fallbacks
     */
    private getFontFamily(customFont?: CustomFont): string {
        if (!customFont) {
            return "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif";
        }

        const fallback = customFont.fallback || 'Arial, sans-serif';
        // Use single quotes to avoid conflicts with SVG attribute double quotes
        return `'${customFont.family}', ${fallback}`;
    }

    /**
     * Get font weight, defaulting to 'normal' if not specified
     */
    private getFontWeight(customFont?: CustomFont): string | number {
        return customFont?.weight || 'normal';
    }

    /**
     * Generate modular SVG components separately
     */
    generateModularSVG(data: HeatmapData, components: {
        includeGrid?: boolean;
        includeTitle?: boolean;
        includeSummary?: boolean;
        includeLegend?: boolean;
        includeMonthLabels?: boolean;
        includeDayLabels?: boolean;
    } = {}, options: HeatmapOptions = {}): string {
        const opts = { ...this.defaultOptions, ...options };
        const dimensions = this.calculateDimensions(data, opts);

        let svg = `<svg width="${dimensions.totalWidth}" height="${dimensions.totalHeight}" xmlns="http://www.w3.org/2000/svg">`;

        // Add styles
        svg += this.generateStyles(opts);

        // Add components based on flags
        if (components.includeTitle !== false && data.username && opts.showTitle) {
            svg += this.generateTitle(data.username, dimensions, opts);
        }

        if (components.includeDayLabels !== false && opts.showDayLabels) {
            svg += this.generateDayLabels(dimensions.leftPadding, dimensions.topPadding, opts);
        }

        if (components.includeMonthLabels !== false && opts.showMonthLabels) {
            svg += this.generateMonthLabels(data.weeks, dimensions.leftPadding, dimensions.topPadding, opts);
        }

        if (components.includeGrid !== false) {
            svg += this.generateContributionSquares(data.weeks, dimensions.leftPadding, dimensions.topPadding, opts);
        }

        if (components.includeLegend !== false && opts.showLegend) {
            svg += this.generateLegend(dimensions.totalWidth, dimensions.totalHeight, opts);
        }

        if (components.includeSummary !== false && opts.showSummary) {
            svg += this.generateSummary(data.totalContributions, dimensions, opts);
        }

        svg += '</svg>';
        return svg;
    }

    /**
     * Calculate layout dimensions
     */
    private calculateDimensions(data: HeatmapData, opts: Required<HeatmapOptions>): LayoutDimensions {
        const weeksCount = data.weeks.length;
        const daysCount = 7;

        const graphWidth = weeksCount * (opts.cellSize + opts.cellPadding) - opts.cellPadding;
        const graphHeight = daysCount * (opts.cellSize + opts.cellPadding) - opts.cellPadding;

        const leftPadding = opts.showDayLabels ? 30 : (opts.padding.left || 10);
        const topPadding = opts.showMonthLabels ? 20 : (opts.padding.top || 10);
        const bottomPadding = opts.padding.bottom || 20;
        const rightPadding = opts.padding.right || 10;

        const totalWidth = leftPadding + graphWidth + rightPadding;
        const totalHeight = topPadding + graphHeight + bottomPadding;

        return {
            graphWidth,
            graphHeight,
            totalWidth,
            totalHeight,
            leftPadding,
            topPadding,
            rightPadding,
            bottomPadding
        };
    }

    /**
     * Generate SVG heatmap from contribution data
     */
    generateSVG(data: HeatmapData, options: HeatmapOptions = {}): string {
        const opts = { ...this.defaultOptions, ...options };
        const dimensions = this.calculateDimensions(data, opts);

        let svg = `<svg width="${dimensions.totalWidth}" height="${dimensions.totalHeight}" xmlns="http://www.w3.org/2000/svg">`;

        // Add styles
        svg += this.generateStyles(opts);

        // Add title if username is provided and enabled
        if (data.username && opts.showTitle) {
            svg += this.generateTitle(data.username, dimensions, opts);
        }

        // Add day labels (Mon, Wed, Fri)
        if (opts.showDayLabels) {
            svg += this.generateDayLabels(dimensions.leftPadding, dimensions.topPadding, opts);
        }

        // Add month labels
        if (opts.showMonthLabels) {
            svg += this.generateMonthLabels(data.weeks, dimensions.leftPadding, dimensions.topPadding, opts);
        }

        // Add contribution squares
        svg += this.generateContributionSquares(data.weeks, dimensions.leftPadding, dimensions.topPadding, opts);

        // Add legend
        if (opts.showLegend) {
            svg += this.generateLegend(dimensions.totalWidth, dimensions.totalHeight, opts);
        }

        // Add summary text
        if (opts.showSummary) {
            svg += this.generateSummary(data.totalContributions, dimensions, opts);
        }

        svg += '</svg>';
        return svg;
    }

    /**
     * Generate title component
     */
    private generateTitle(username: string, dimensions: LayoutDimensions, opts: Required<HeatmapOptions>): string {
        return `<text x="${dimensions.totalWidth / 2}" y="15" text-anchor="middle" class="title">${username}'s Contribution Graph</text>`;
    }

    /**
     * Generate summary component
     */
    private generateSummary(totalContributions: number, dimensions: LayoutDimensions, opts: Required<HeatmapOptions>): string {
        const x = dimensions.leftPadding;
        const y = dimensions.totalHeight - 5;
        return `<text x="${x}" y="${y}" class="summary">${totalContributions} contributions this year</text>`;
    }

    /**
     * Generate CSS styles for the SVG
     */
    private generateStyles(opts: Required<HeatmapOptions>): string {
        return `
      <style>
        .day-label { 
          font-family: ${opts.fontFamily}; 
          font-size: ${opts.fontSize}px; 
          fill: #656d76; 
        }
        .month-label { 
          font-family: ${opts.fontFamily}; 
          font-size: ${opts.fontSize}px; 
          fill: #656d76; 
        }
        .title { 
          font-family: ${opts.fontFamily}; 
          font-size: ${opts.fontSize + 2}px; 
          font-weight: 600; 
          fill: #24292f; 
        }
        .summary { 
          font-family: ${opts.fontFamily}; 
          font-size: ${opts.fontSize - 1}px; 
          fill: #656d76; 
        }
        .legend-text { 
          font-family: ${opts.fontFamily}; 
          font-size: ${opts.fontSize - 1}px; 
          fill: #656d76; 
        }
        .contribution-square { 
          stroke: rgba(27,31,35,0.06); 
          stroke-width: 1; 
          shape-rendering: crispEdges; 
        }
        ${opts.showTooltips ? '.contribution-square:hover { stroke: #24292f; stroke-width: 2; }' : ''}
      </style>
    `;
    }

    /**
     * Generate day labels (Mon, Wed, Fri)
     */
    private generateDayLabels(leftPadding: number, topPadding: number, opts: Required<HeatmapOptions>): string {
        const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
        let labels = '';

        dayLabels.forEach((label, index) => {
            if (label) {
                const y = topPadding + (index * (opts.cellSize + opts.cellPadding)) + (opts.cellSize / 2) + 3;
                labels += `<text x="${leftPadding - 10}" y="${y}" text-anchor="end" class="day-label">${label}</text>`;
            }
        });

        return labels;
    }

    /**
     * Generate month labels
     */
    private generateMonthLabels(weeks: ContributionWeek[], leftPadding: number, topPadding: number, opts: Required<HeatmapOptions>): string {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let labels = '';
        let lastMonth = -1;

        weeks.forEach((week, weekIndex) => {
            const firstDay = new Date(week.firstDay);
            const currentMonth = firstDay.getMonth();

            if (currentMonth !== lastMonth && weekIndex > 0) {
                const x = leftPadding + (weekIndex * (opts.cellSize + opts.cellPadding));
                labels += `<text x="${x}" y="${topPadding - 5}" class="month-label">${monthNames[currentMonth]}</text>`;
                lastMonth = currentMonth;
            }
        });

        return labels;
    }

    /**
     * Generate contribution squares
     */
    private generateContributionSquares(weeks: ContributionWeek[], leftPadding: number, topPadding: number, opts: Required<HeatmapOptions>): string {
        let squares = '';

        weeks.forEach((week, weekIndex) => {
            week.contributionDays.forEach((day) => {
                const x = leftPadding + (weekIndex * (opts.cellSize + opts.cellPadding));
                const y = topPadding + (day.weekday * (opts.cellSize + opts.cellPadding));

                const level = this.getContributionLevel(day.contributionCount);
                const color = opts.colors[level];

                const tooltip = opts.showTooltips
                    ? `<title>${this.formatTooltip(day)}</title>`
                    : '';

                // Add border radius attributes if specified
                const borderRadiusAttr = opts.borderRadius > 0
                    ? `rx="${opts.borderRadius}" ry="${opts.borderRadius}"`
                    : '';

                squares += `
          <rect 
            x="${x}" 
            y="${y}" 
            width="${opts.cellSize}" 
            height="${opts.cellSize}" 
            ${borderRadiusAttr}
            fill="${color}" 
            class="contribution-square"
            data-date="${day.date}"
            data-count="${day.contributionCount}"
            data-level="${level}"
          >
            ${tooltip}
          </rect>
        `;
            });
        });

        return squares;
    }

    /**
     * Generate legend
     */
    private generateLegend(totalWidth: number, totalHeight: number, opts: Required<HeatmapOptions>): string {
        const legendX = totalWidth - 150;
        const legendY = totalHeight - 15;

        let legend = `<text x="${legendX - 10}" y="${legendY}" text-anchor="end" class="legend-text">Less</text>`;

        opts.colors.forEach((color, index) => {
            const x = legendX + (index * (opts.cellSize + 2));
            const borderRadiusAttr = opts.borderRadius > 0
                ? `rx="${opts.borderRadius}" ry="${opts.borderRadius}"`
                : '';

            legend += `
        <rect 
          x="${x}" 
          y="${legendY - opts.cellSize}" 
          width="${opts.cellSize}" 
          height="${opts.cellSize}" 
          ${borderRadiusAttr}
          fill="${color}" 
          stroke="rgba(27,31,35,0.06)" 
          stroke-width="1"
        />
      `;
        });

        legend += `<text x="${legendX + (opts.colors.length * (opts.cellSize + 2)) + 5}" y="${legendY}" class="legend-text">More</text>`;

        return legend;
    }

    /**
     * Get contribution level (0-4) based on count
     */
    private getContributionLevel(count: number): number {
        if (count === 0) return 0;
        if (count <= 3) return 1;
        if (count <= 6) return 2;
        if (count <= 9) return 3;
        return 4;
    }

    /**
     * Format tooltip text
     */
    private formatTooltip(day: ContributionDay): string {
        const date = new Date(day.date);
        const dateString = date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const contributionText = day.contributionCount === 1
            ? '1 contribution'
            : `${day.contributionCount} contributions`;

        return `${contributionText} on ${dateString}`;
    }

    /**
     * Save SVG to file (for Node.js environments)
     */
    saveSVGToFile(svg: string, filename: string): void {
        try {
            const fs = require('fs');
            fs.writeFileSync(filename, svg, 'utf8');
            console.log(`SVG heatmap saved to ${filename}`);
        } catch (error) {
            console.error('Error saving SVG file:', error);
        }
    }

    /**
     * Convert SVG to PNG using Sharp (if available)
     */
    async convertToPNG(svgFilename: string, pngFilename: string, options?: {
        quality?: number;
        scale?: number;
        width?: number;
        height?: number;
    }): Promise<void> {
        try {
            const sharp = require('sharp');
            const fs = require('fs');

            const {
                quality = 100,
                scale = 1,
                width,
                height
            } = options || {};

            const svgBuffer = fs.readFileSync(svgFilename);
            let sharpInstance = sharp(svgBuffer);

            // Set dimensions if provided, otherwise use scale
            if (width && height) {
                sharpInstance = sharpInstance.resize(width, height);
            } else if (scale !== 1) {
                // Get SVG dimensions and scale them
                const metadata = await sharpInstance.metadata();
                const scaledWidth = Math.round((metadata.width || 1584) * scale);
                const scaledHeight = Math.round((metadata.height || 396) * scale);
                sharpInstance = sharpInstance.resize(scaledWidth, scaledHeight);
            }

            await sharpInstance
                .png({
                    quality: quality,
                    compressionLevel: 1, // No compression for best quality
                    adaptiveFiltering: true,
                    palette: false // Use full color instead of palette
                })
                .toFile(pngFilename);

            console.log(`PNG version created: ${pngFilename}`);
        } catch (error: any) {
            if (error?.code === 'MODULE_NOT_FOUND') {
                console.log('ℹ️  Sharp not installed - PNG conversion skipped. Install with: bun add sharp');
            } else {
                console.error('Error converting to PNG:', error);
            }
        }
    }

    /**
     * Convert SVG to high-quality PNG with enhanced settings
     */
    async convertToHighQualityPNG(svgFilename: string, pngFilename: string, scale: number = 2): Promise<void> {
        await this.convertToPNG(svgFilename, pngFilename, {
            quality: 100,
            scale: scale
        });
    }

    /**
     * Generate heatmap with custom color scheme
     */
    generateCustomColorHeatmap(data: HeatmapData, colorScheme: 'github' | 'green' | 'blue' | 'purple' | 'orange', options: HeatmapOptions = {}): string {
        const colorSchemes = {
            github: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
            green: ['#f0f9ff', '#c7f0c7', '#6cc04a', '#4a9e3d', '#2d5a27'],
            blue: ['#f0f9ff', '#bfdbfe', '#60a5fa', '#3b82f6', '#1d4ed8'],
            purple: ['#faf5ff', '#e9d5ff', '#c084fc', '#a855f7', '#7c3aed'],
            orange: ['#fff7ed', '#fed7aa', '#fb923c', '#ea580c', '#c2410c'],
        };

        return this.generateSVG(data, {
            ...options,
            colors: colorSchemes[colorScheme],
        });
    }

    /**
     * Preset: Clean heatmap with bigger boxes, no labels, only total contributions
     * Perfect for embedding or minimal displays
     */
    generateCleanHeatmap(data: HeatmapData, options: Partial<Pick<HeatmapOptions, 'cellSize' | 'cellPadding' | 'colors' | 'showTooltips' | 'borderRadius'>> = {}): string {
        return this.generateSVG(data, {
            cellSize: 18,
            cellPadding: 4,
            borderRadius: 3,        // Nice rounded corners by default
            showMonthLabels: false,
            showDayLabels: false,
            showLegend: false,
            showTitle: false,
            showSummary: true,
            showTooltips: true,
            padding: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 20,
            },
            ...options
        });
    }

    /**
     * Generate LinkedIn header with heatmap - optimized for 1584x396px
     */
    generateLinkedInHeader(data: HeatmapData, options: LinkedInHeaderOptions = {}): string {
        const {
            theme = 'black',
            includeProfile = true,
            headerText = `${data.totalContributions} contributions on GitHub`,
            subText = "Building in public, one commit at a time",
            backgroundColor,
            textColor,
            accentColor
        } = options;

        // LinkedIn header dimensions: 1584x396px (4:1 ratio)
        const headerWidth = 1584;
        const headerHeight = 396;

        // Theme configurations
        const themes = {
            black: {
                bg: backgroundColor || '#000000',
                text: textColor || '#ffffff',
                accent: accentColor || '#ffffff',
                colors: ['#161b22', '#0d1117', '#21262d', '#30363d', '#8b949e']
            },
            professional: {
                bg: backgroundColor || '#0a66c2',
                text: textColor || '#ffffff',
                accent: accentColor || '#ffffff',
                colors: ['#004182', '#0a66c2', '#378fe9', '#54a3ff', '#70b5f9']
            },
            minimal: {
                bg: backgroundColor || '#f8f9fa',
                text: textColor || '#212529',
                accent: accentColor || '#6c757d',
                colors: ['#e9ecef', '#dee2e6', '#ced4da', '#adb5bd', '#6c757d']
            },
            gradient: {
                bg: backgroundColor || 'url(#gradient)',
                text: textColor || '#ffffff',
                accent: accentColor || '#ffffff',
                colors: ['#1a1a2e', '#16213e', '#0f3460', '#533483', '#e94560']
            }
        };

        const currentTheme = themes[theme];

        // Calculate heatmap positioning - smaller and positioned on the right
        const heatmapCellSize = 8;
        const heatmapPadding = 1;
        const heatmapWidth = data.weeks.length * (heatmapCellSize + heatmapPadding);
        const heatmapHeight = 7 * (heatmapCellSize + heatmapPadding);

        const heatmapX = headerWidth - heatmapWidth - 60;
        const heatmapY = (headerHeight - heatmapHeight) / 2;

        let svg = `<svg width="${headerWidth}" height="${headerHeight}" xmlns="http://www.w3.org/2000/svg">`;

        // Add gradient definition if needed
        if (theme === 'gradient') {
            svg += `
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                    </linearGradient>
                </defs>
            `;
        }

        // Background
        svg += `<rect width="${headerWidth}" height="${headerHeight}" fill="${currentTheme.bg}"/>`;

        // Main content area
        const contentX = 80;
        const contentY = headerHeight / 2;

        // Header text
        svg += `
            <text x="${contentX}" y="${contentY - 20}" 
                  font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" 
                  font-size="36" font-weight="700" fill="${currentTheme.text}">
                ${headerText}
            </text>
        `;

        // Sub text
        if (subText) {
            svg += `
                <text x="${contentX}" y="${contentY + 20}" 
                      font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" 
                      font-size="18" font-weight="400" fill="${currentTheme.accent}" opacity="0.8">
                    ${subText}
                </text>
            `;
        }

        // Profile section (if enabled)
        if (includeProfile && data.username) {
            svg += `
                <text x="${contentX}" y="${contentY + 50}" 
                      font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" 
                      font-size="16" font-weight="500" fill="${currentTheme.accent}" opacity="0.9">
                    github.com/${data.username}
                </text>
            `;
        }

        // Generate mini heatmap
        data.weeks.forEach((week, weekIndex) => {
            week.contributionDays.forEach((day) => {
                const x = heatmapX + (weekIndex * (heatmapCellSize + heatmapPadding));
                const y = heatmapY + (day.weekday * (heatmapCellSize + heatmapPadding));

                const level = this.getContributionLevel(day.contributionCount);
                const color = currentTheme.colors[level];

                svg += `
                    <rect 
                        x="${x}" y="${y}" 
                        width="${heatmapCellSize}" height="${heatmapCellSize}" 
                        rx="2" ry="2"
                        fill="${color}" 
                        opacity="0.9"
                    />
                `;
            });
        });

        // Decorative elements for professional look
        if (theme !== 'minimal') {
            // Add some subtle decorative lines
            svg += `
                <line x1="${contentX}" y1="${contentY + 80}" x2="${contentX + 300}" y2="${contentY + 80}" 
                      stroke="${currentTheme.accent}" stroke-width="2" opacity="0.3"/>
                <line x1="${headerWidth - 400}" y1="50" x2="${headerWidth - 50}" y2="50" 
                      stroke="${currentTheme.accent}" stroke-width="1" opacity="0.2"/>
                <line x1="${headerWidth - 400}" y1="${headerHeight - 50}" x2="${headerWidth - 50}" y2="${headerHeight - 50}" 
                      stroke="${currentTheme.accent}" stroke-width="1" opacity="0.2"/>
            `;
        }

        svg += '</svg>';
        return svg;
    }

    /**
     * Generate aesthetic heatmap with modern design
     */
    generateAestheticHeatmap(data: HeatmapData, options: {
        style?: 'modern' | 'glassmorphism' | 'neumorphism' | 'neon';
        primaryColor?: string;
        backgroundColor?: string;
        borderRadius?: number;
    } = {}): string {
        const {
            style = 'modern',
            primaryColor = '#000000',
            backgroundColor = '#ffffff',
            borderRadius = 8
        } = options;

        const styleConfigs = {
            modern: {
                colors: [backgroundColor, `${primaryColor}20`, `${primaryColor}40`, `${primaryColor}60`, primaryColor],
                cellSize: 18,
                cellPadding: 4,
                borderRadius: borderRadius,
                shadow: 'filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));'
            },
            glassmorphism: {
                colors: ['rgba(255,255,255,0.1)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)'],
                cellSize: 16,
                cellPadding: 3,
                borderRadius: borderRadius,
                shadow: 'filter: blur(1px) drop-shadow(0 2px 4px rgba(0,0,0,0.2));'
            },
            neumorphism: {
                colors: [backgroundColor, '#e0e0e0', '#c0c0c0', '#a0a0a0', '#808080'],
                cellSize: 20,
                cellPadding: 6,
                borderRadius: borderRadius,
                shadow: 'filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2)) drop-shadow(-2px -2px 4px rgba(255,255,255,0.7));'
            },
            neon: {
                colors: ['#0a0a0a', `${primaryColor}30`, `${primaryColor}60`, `${primaryColor}90`, primaryColor],
                cellSize: 16,
                cellPadding: 3,
                borderRadius: borderRadius,
                shadow: `filter: drop-shadow(0 0 4px ${primaryColor}) drop-shadow(0 0 8px ${primaryColor});`
            }
        };

        const config = styleConfigs[style];

        return this.generateSVG(data, {
            cellSize: config.cellSize,
            cellPadding: config.cellPadding,
            borderRadius: config.borderRadius,
            colors: config.colors,
            showMonthLabels: false,
            showDayLabels: false,
            showLegend: false,
            showTitle: false,
            showSummary: true,
            showTooltips: true,
            padding: {
                top: 30,
                right: 30,
                bottom: 50,
                left: 30,
            }
        });
    }



    /**
     * Generate custom LinkedIn banner with specific layout and design
     */
    generateCustomLinkedInBanner(data: HeatmapData, options: CustomLinkedInBannerOptions = {}): string {
        const {
            username = "rndmcodeguy",
            headerText = "Software engineer",
            subText = "Building refined user interfaces and the solid infrastructure that supports them",
            motivationalText = "Patience. Perseverance. Dedication",
            backgroundColor = "#fff",
            headerTextColor = "#000",
            subTextColor = "#000",
            subTextOpacity = 0.54,
            motivationalTextColor = "#000",
            heatmapTheme = 'dark',
            fonts = {},
            customFonts = []
        } = options;

        // LinkedIn banner dimensions: 1584x396px
        const bannerWidth = 1584;
        const bannerHeight = 396;

        // Bigger heatmap configuration for top right positioning
        const heatmapCellSize = 12;  // Increased from 6 to 12
        const heatmapPadding = 2;    // Increased from 1 to 2
        const heatmapWidth = data.weeks.length * (heatmapCellSize + heatmapPadding);
        const heatmapHeight = 7 * (heatmapCellSize + heatmapPadding);

        const logoSize = 40;
        const logoSpacing = 60;
        const centerX = bannerWidth / 2;
        const logoY = 250; // Position below subtext

        // Position heatmap in top right corner
        const heatmapX = bannerWidth - heatmapWidth - 60;
        const heatmapY = 50;        // Heatmap colors based on theme
        const heatmapColors = heatmapTheme === 'dark'
            ? ['#e4e4e7', '#a1a1aa', '#52525b', '#27272a', '#09090b'] // Light to dark for white background
            : ['#161b22', '#0d1117', '#21262d', '#30363d', '#8b949e']; // Dark theme colors

        let svg = `<svg width="${bannerWidth}" height="${bannerHeight}" xmlns="http://www.w3.org/2000/svg">`;

        // Add font definitions if custom fonts are provided
        svg += this.generateFontDefinitions(customFonts);

        // Background
        svg += `<rect width="${bannerWidth}" height="${bannerHeight}" fill="${backgroundColor}"/>`;

        // Username in top left (@rndmcodeguy20)
        svg += `
            <text x="60" y="60" 
                  font-family="${this.getFontFamily(fonts.username)}" 
                  font-size="18" font-weight="600" fill="${headerTextColor}">
                @${username}20
            </text>
        `;

        // Main header text "Software engineer" - positioned more to the right
        // svg += `
        //     <text x="60" y="130" 
        //           font-family="${this.getFontFamily(fonts.headerText)}" 
        //           font-size="48" font-weight="700" fill="${headerTextColor}">
        //         ${headerText}
        //     </text>
        // `;

        // Subheading with opacity - positioned below header, also moved to the right
        // var subheaderTextLines = subText.split('\n');

        // subheaderTextLines.map((line, index) => {
        //     svg += `
        //         <text x="${bannerWidth / 2}" y="${bannerHeight / 2 + ((index + 1) * 30)}" 
        //               font-family="${this.getFontFamily(fonts.subheaderText)}" 
        //               font-size="28" font-weight="500" fill="${subTextColor}" opacity="${subTextOpacity}"
        //               text-anchor="middle" dominant-baseline="middle">
        //             ${line}
        //         </text>
        //     `;
        // });

        svg += `
    <text x="${bannerWidth / 2}" y="${bannerHeight / 2 + 30}" 
          font-family="${this.getFontFamily(fonts.subheaderText)}" 
          font-size="28" font-weight="500" fill="${subTextColor}" opacity="${subTextOpacity}"
          text-anchor="middle" dominant-baseline="middle">
        Building refined 
        <tspan fill="#F2541B">user interfaces</tspan> 
    </text>
`;

        svg += `
    <text x="${bannerWidth / 2}" y="${bannerHeight / 2 + 60}" 
          font-family="${this.getFontFamily(fonts.subheaderText)}" 
          font-size="28" font-weight="500" fill="${subTextColor}" opacity="${subTextOpacity}"
          text-anchor="middle" dominant-baseline="middle">
        and the 
        <tspan fill="#F2541B">solid infrastructure</tspan> 
        that supports them
    </text>
`;

        // svg += `
        //     <text x="${bannerWidth / 2}" y="${bannerHeight / 2 + 20}" 
        //           font-family="${this.getFontFamily(fonts.subheaderText)}" 
        //           font-size="24" font-weight="500" fill="${subTextColor}" opacity="${subTextOpacity}"
        //           text-anchor="middle" dominant-baseline="middle">
        //         ${subText}
        //     </text>
        // `;

        //         svg += `
        //     <g transform="translate(${centerX - 32}, ${bannerHeight / 2 - 16})">

        //     </g>
        // `;

        svgLogos.forEach((logo, index) => {
            const col = index % 6;  // Column position (0-4)
            const row = Math.floor(index / 6);  // Row position (0, 1, 2, ...)

            // Calculate position
            const logoSize = 32;
            const logoSpacing = 60;
            const rowSpacing = 44;

            // Center the entire grid
            const totalGridWidth = 4 * logoSpacing; // 4 gaps between 5 logos
            const startX = 0;
            const startY = bannerHeight / 3 - 32; // Center vertically, adjust as needed

            const x = startX + (col * logoSpacing) + 64;
            const y = startY + (row * rowSpacing);

            svg += `
            <g transform="translate(${x}, ${y})">
                ${logo}
            </g>
        `;
        });

        // Motivational text in bottom right corner - large, bold, independent positioning
        // Handle multi-line text by splitting on \n characters
        const motivationalLines = motivationalText.split('\n');
        const motivationalX = bannerWidth - 60; // Fixed distance from right edge
        const lineSpacing = 28; // Spacing between lines for 54px font
        const motivationalStartY = bannerHeight - (motivationalLines.length * lineSpacing) - 20; // Bottom positioning with line spacing

        motivationalLines.forEach((line, index) => {
            const lineY = motivationalStartY + (index * lineSpacing);
            svg += `
                <text x="${motivationalX}" y="${lineY}" 
                      text-anchor="end"
                      font-family="${this.getFontFamily(fonts.motivationalText)}" 
                      font-size="32" font-weight="${this.getFontWeight(fonts.motivationalText)}" fill="${motivationalTextColor}"
                      letter-spacing="0.1em">
                    ${line.trim()}
                </text>
            `;
        });

        // Generate heatmap in top right
        data.weeks.forEach((week, weekIndex) => {
            week.contributionDays.forEach((day) => {
                const x = heatmapX + (weekIndex * (heatmapCellSize + heatmapPadding));
                const y = heatmapY + (day.weekday * (heatmapCellSize + heatmapPadding));

                const level = this.getContributionLevel(day.contributionCount);
                const color = heatmapColors[level];

                const borderRadiusAttr = `rx="3" ry="3"`

                svg += `
                    <rect 
                        x="${x}" y="${y}" 
                        width="${heatmapCellSize}" height="${heatmapCellSize}" 
                        ${borderRadiusAttr}
                        fill="${color}" 
                        opacity="0.9"
                    />
                `;
            });
        });

        // Add subtle visual elements for enhanced aesthetics
        // Thin accent line under username
        svg += `
            <line x1="60" y1="75" x2="240" y2="75" 
                  stroke="${headerTextColor}" stroke-width="2" opacity="0.1"/>
        `;

        // Subtle decorative element near heatmap
        svg += `
            <rect x="${heatmapX - 20}" y="${heatmapY}" width="2" height="${heatmapHeight}" 
                  fill="${headerTextColor}" opacity="0.1"/>
        `;

        svg += '</svg>';
        return svg;
    }
}

// Utility function to create heatmap data from processed contribution data
export function createHeatmapData(processedData: any, username?: string): HeatmapData {
    return {
        weeks: processedData.calendar.weeks,
        totalContributions: processedData.stats.totalContributions,
        username,
    };
}
