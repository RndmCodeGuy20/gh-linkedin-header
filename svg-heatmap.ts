import type { ContributionDay, ContributionWeek } from "./index";

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
                    compressionLevel: 0, // No compression for best quality
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

    svgLogos = [
        `<svg height="32px" width="32px" viewBox="0 -160 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M292.533152,13.2950639 L293.657233,14.0455076 C306.869315,22.7704678 316.342129,34.7361275 322.574244,49.1946331 C324.069951,51.4381943 323.072813,52.6846171 320.081398,53.4324709 L315.017741,54.7277932 C303.571167,57.6768058 294.487155,60.1566573 283.191384,63.10567 L276.74841,64.7843862 C274.428264,65.3583626 273.787695,65.1170696 271.320433,62.3073717 L270.972336,61.9081465 C267.453024,57.9195933 264.816991,55.2559574 260.154613,52.878088 L259.255961,52.4353326 C243.551033,44.7075107 228.344673,46.9510719 214.135452,56.1746012 C197.184101,67.1431227 188.459141,83.3466202 188.708425,103.538671 C188.95771,123.481438 202.668362,139.93422 222.361843,142.67635 C239.313195,144.919911 253.522416,138.937081 264.740222,126.223568 C266.983783,123.481438 268.978059,120.490023 271.470905,117.000039 L223.358982,117.000039 C218.124006,117.000039 216.877583,113.759339 218.622575,109.521501 L219.486848,107.487264 C222.690544,100.033179 227.659682,89.3185944 230.887235,83.1925665 L231.591356,81.8743455 C232.452883,80.3801337 234.202861,78.3609287 237.568203,78.3609287 L317.791861,78.3603482 C321.394911,66.9456209 327.24084,56.159659 335.038473,45.9539335 C353.236247,22.0226141 375.17329,9.55838523 404.838154,4.32340907 C430.265181,-0.163713323 454.196501,2.32913245 475.884259,17.0369225 C495.577741,30.4982897 507.792685,48.6960639 511.033385,72.6273834 C515.271222,106.280802 505.549124,133.702105 482.365658,157.134856 C465.912876,173.836922 445.720825,184.306875 422.537359,189.043282 C415.806676,190.289704 409.075992,190.538989 402.594593,191.286843 C379.909697,190.788274 359.219077,184.306875 341.769156,169.3498 C329.496056,158.740849 321.041799,145.701725 316.840932,130.522127 C313.926247,136.409796 310.44016,142.04853 306.370746,147.412757 C288.422257,171.094792 264.989506,185.802582 235.324641,189.791135 C210.894753,193.031835 188.209856,188.295428 168.26709,173.338353 C149.820031,159.378417 139.350079,140.931358 136.607949,117.997177 C133.367249,90.8251575 141.344356,66.3952689 157.797138,44.9567952 C175.496343,21.7733295 198.929093,7.06553943 227.59682,1.8305633 C250.59563,-2.32879605 272.633891,0.235689133 292.533152,13.2950639 L292.533152,13.2950639 Z M411.120284,49.0171223 L410.322415,49.1946331 C387.138949,54.4296092 372.181875,69.1373993 366.697614,92.5701496 C362.210492,112.014347 371.683306,131.707829 389.631795,139.684935 C403.342447,145.667765 417.053099,144.919911 430.265181,138.189228 C449.958663,127.96856 460.6779,112.014347 461.924323,90.575873 C461.675038,87.3351735 461.675038,84.8423277 461.176469,82.3494819 C456.739764,57.9476028 434.511926,44.025432 411.120284,49.0171223 L411.120284,49.0171223 Z M116.415898,94.5644262 C117.413036,94.5644262 117.911605,95.3122799 117.911605,96.3094183 L117.413036,102.292248 C117.413036,103.289387 116.415898,104.03724 115.668044,104.03724 L61.3240061,103.787956 C60.3268678,103.787956 60.0775833,103.040102 60.5761524,102.292248 L64.0661365,96.0601337 C64.5647057,95.3122799 65.561844,94.5644262 66.5589823,94.5644262 L116.415898,94.5644262 Z M121.900159,71.6302451 C122.897297,71.6302451 123.395866,72.3780988 123.146581,73.1259525 L121.152305,79.1087824 C120.90302,80.1059207 119.905882,80.6044899 118.908744,80.6044899 L0.99713831,80.8537744 C0,80.8537744 -0.249284578,80.3552053 0.249284578,79.6073515 L5.48426071,72.8766679 C5.98282987,72.1288142 7.22925276,71.6302451 8.22639107,71.6302451 L121.900159,71.6302451 Z M134.862957,48.6960639 C135.860095,48.6960639 136.109379,49.4439176 135.61081,50.1917714 L131.372973,56.6731704 C130.874403,57.4210241 129.62798,58.1688779 128.880127,58.1688779 L38.6391096,57.9195933 C37.6419713,57.9195933 37.3926867,57.4210241 37.8912558,56.6731704 L43.126232,49.9424868 C43.6248011,49.1946331 44.871224,48.6960639 45.8683623,48.6960639 L134.862957,48.6960639 Z" fill="#00ACD7" fill-rule="nonzero"> </path> </g> </g></svg>`, // golang
        `
        <svg height="32px" width="32px" viewBox="0 0 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="#000000">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier"> 
                <g> 
                    <polygon fill="#007ACC" transform="translate(128.000000, 128.000000) scale(1, -1) translate(-128.000000, -128.000000) " points="0 128 0 0 128 0 256 0 256 128 256 256 128 256 0 256"></polygon> 
                    <path d="M146.658132,223.436863 L146.739401,212.953054 L130.079084,212.953054 L113.418767,212.953054 L113.418767,165.613371 L113.418767,118.273689 L101.63464,118.273689 L89.8505126,118.273689 L89.8505126,165.613371 L89.8505126,212.953054 L73.1901951,212.953054 L56.5298776,212.953054 L56.5298776,223.233689 C56.5298776,228.922577 56.6517824,233.676863 56.8143221,233.798768 C56.9362269,233.961308 77.2130522,234.042577 101.797179,234.001943 L146.536227,233.880038 L146.658132,223.436863 Z" fill="#FFFFFF" transform="translate(101.634640, 176.142993) rotate(-180.000000) translate(-101.634640, -176.142993) "></path> 
                    <path d="M206.566631,234.272145 C213.068219,232.646748 218.025679,229.761668 222.57679,225.048018 C224.933616,222.528653 228.428219,217.936907 228.712663,216.839764 C228.793933,216.514684 217.659965,209.037859 210.914568,204.852462 C210.670758,204.689922 209.69552,205.74643 208.598377,207.371827 C205.306949,212.166748 201.852981,214.239129 196.570441,214.604843 C188.809171,215.133097 183.811076,211.069605 183.851711,204.283573 C183.851711,202.292462 184.136155,201.114049 184.948854,199.488653 C186.65552,195.953414 189.825044,193.840399 199.7806,189.533097 C218.106949,181.649922 225.949489,176.448653 230.825679,169.053097 C236.270758,160.804208 237.489806,147.638494 233.792028,137.845478 C229.728536,127.199129 219.651076,119.966113 205.469489,117.568653 C201.080917,116.796589 190.678377,116.918494 185.964727,117.771827 C175.684092,119.600399 165.931711,124.679764 159.917743,131.343891 C157.560917,133.944526 152.969171,140.730557 153.253616,141.218176 C153.37552,141.380716 154.432028,142.030875 155.610441,142.721668 C156.748219,143.371827 161.05552,145.850557 165.119012,148.207383 L172.473933,152.474049 L174.01806,150.198494 C176.171711,146.907065 180.885362,142.396589 183.729806,140.893097 C191.897425,136.585795 203.112663,137.195319 208.639012,142.15278 C210.995838,144.30643 211.971076,146.541351 211.971076,149.83278 C211.971076,152.799129 211.605362,154.099446 210.061235,156.334367 C208.070123,159.178811 204.006631,161.576272 192.466314,166.574367 C179.259965,172.263256 173.571076,175.798494 168.369806,181.406113 C165.362822,184.656907 162.518377,189.858176 161.339965,194.206113 C160.364727,197.822621 160.120917,206.884208 160.892981,210.541351 C163.61552,223.300716 173.245996,232.199764 187.143139,234.841034 C191.653616,235.694367 202.137425,235.369287 206.566631,234.272145 Z" fill="#FFFFFF" transform="translate(194.578507, 176.190240) scale(1, -1) translate(-194.578507, -176.190240) "></path> 
                </g> 
            </g>
        </svg>
` // typescript
        ,
        `<svg height="32px" width="32px" viewBox="0 -0.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <linearGradient x1="12.9593594%" y1="12.0393928%" x2="79.6388325%" y2="78.2008538%" id="linearGradient-1"> <stop stop-color="#387EB8" offset="0%"> </stop> <stop stop-color="#366994" offset="100%"> </stop> </linearGradient> <linearGradient x1="19.127525%" y1="20.5791813%" x2="90.7415328%" y2="88.4290372%" id="linearGradient-2"> <stop stop-color="#FFE052" offset="0%"> </stop> <stop stop-color="#FFC331" offset="100%"> </stop> </linearGradient> </defs> <g> <path d="M126.915866,0.0722755491 C62.0835831,0.0722801733 66.1321288,28.1874648 66.1321288,28.1874648 L66.2044043,57.3145115 L128.072276,57.3145115 L128.072276,66.0598532 L41.6307171,66.0598532 C41.6307171,66.0598532 0.144551098,61.3549438 0.144551098,126.771315 C0.144546474,192.187673 36.3546019,189.867871 36.3546019,189.867871 L57.9649915,189.867871 L57.9649915,159.51214 C57.9649915,159.51214 56.8001363,123.302089 93.5968379,123.302089 L154.95878,123.302089 C154.95878,123.302089 189.434218,123.859386 189.434218,89.9830604 L189.434218,33.9695088 C189.434218,33.9695041 194.668541,0.0722755491 126.915866,0.0722755491 L126.915866,0.0722755491 L126.915866,0.0722755491 Z M92.8018069,19.6589497 C98.9572068,19.6589452 103.932242,24.6339846 103.932242,30.7893845 C103.932246,36.9447844 98.9572068,41.9198193 92.8018069,41.9198193 C86.646407,41.9198239 81.6713721,36.9447844 81.6713721,30.7893845 C81.6713674,24.6339846 86.646407,19.6589497 92.8018069,19.6589497 L92.8018069,19.6589497 L92.8018069,19.6589497 Z" fill="url(#linearGradient-1)"> </path> <path d="M128.757101,254.126271 C193.589403,254.126271 189.540839,226.011081 189.540839,226.011081 L189.468564,196.884035 L127.600692,196.884035 L127.600692,188.138693 L214.042251,188.138693 C214.042251,188.138693 255.528417,192.843589 255.528417,127.427208 C255.52844,62.0108566 219.318366,64.3306589 219.318366,64.3306589 L197.707976,64.3306589 L197.707976,94.6863832 C197.707976,94.6863832 198.87285,130.896434 162.07613,130.896434 L100.714182,130.896434 C100.714182,130.896434 66.238745,130.339138 66.238745,164.215486 L66.238745,220.229038 C66.238745,220.229038 61.0044225,254.126271 128.757101,254.126271 L128.757101,254.126271 L128.757101,254.126271 Z M162.87116,234.539597 C156.715759,234.539597 151.740726,229.564564 151.740726,223.409162 C151.740726,217.253759 156.715759,212.278727 162.87116,212.278727 C169.026563,212.278727 174.001595,217.253759 174.001595,223.409162 C174.001618,229.564564 169.026563,234.539597 162.87116,234.539597 L162.87116,234.539597 L162.87116,234.539597 Z" fill="url(#linearGradient-2)"> </path> </g> </g></svg>` // python
        , `<svg height="32px" width="32px" viewBox="-4 0 264 264" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M255.007926,158.085617 C253.473109,153.437413 249.452194,150.199279 244.251788,149.42182 C241.799982,149.055852 238.991667,149.211935 235.668988,149.897164 C229.877358,151.092028 225.580342,151.546679 222.44449,151.635363 C234.280794,131.650217 243.905921,108.859714 249.446873,87.4065589 C258.406282,52.7182633 253.61855,36.9154365 248.023797,29.7669469 C233.217182,10.8477783 211.614448,0.683454965 185.55152,0.371879908 C171.649478,0.202198614 159.443658,2.94725173 153.077358,4.92075751 C147.149155,3.87547344 140.774577,3.29134411 134.08606,3.18315012 C121.550337,2.9833164 110.473164,5.71595381 101.008259,11.332582 C95.7670577,9.56127483 87.3580785,7.06335335 77.6460416,5.46882217 C54.8035104,1.71868822 36.3939769,4.64110855 22.9282587,14.153903 C6.62230023,25.6721293 -0.937090069,45.6838799 0.461154734,73.6339954 C0.904572748,82.5082679 5.86908083,109.507695 13.6850624,135.114199 C18.1771824,149.831538 22.9672794,162.053912 27.9223279,171.443732 C34.9490254,184.758688 42.4676212,192.600092 50.9085266,195.415501 C55.6400924,196.992296 64.2358984,198.09552 73.2774873,190.566873 C74.4232794,191.953885 75.9515935,193.33321 77.9812656,194.613801 C80.5578199,196.239076 83.7090439,197.566965 86.8555381,198.353885 C98.1969885,201.189395 108.820102,200.479926 117.882975,196.506309 C117.93855,198.117986 117.981709,199.658125 118.018365,200.987788 C118.07867,203.145164 118.137792,205.259972 118.217016,207.237617 C118.753848,220.612286 119.663741,231.011326 122.359723,238.286928 C122.507529,238.687778 122.706771,239.29733 122.917247,239.943538 C124.261691,244.062005 126.511298,250.955677 132.232573,256.355326 C138.158411,261.947714 145.325229,263.663446 151.888998,263.662855 C155.180933,263.662855 158.322106,263.231261 161.076619,262.640628 C170.897441,260.536462 182.050291,257.329663 190.118134,245.84218 C197.745515,234.981986 201.453672,218.625182 202.124711,192.851363 C202.211621,192.122975 202.292028,191.427104 202.369478,190.763751 C202.421506,190.316194 202.474716,189.858587 202.528517,189.402162 L204.325838,189.560018 L204.788767,189.591353 C214.791095,190.047187 227.021155,187.925875 234.532065,184.437062 C240.467363,181.68255 259.485857,171.642383 255.007926,158.085617" fill="#000000"> </path> <path d="M237.905589,160.722476 C208.165838,166.857016 206.121386,156.78788 206.121386,156.78788 C237.521885,110.194697 250.64824,51.0516028 239.320388,36.5766651 C208.417109,-2.90823095 154.921977,15.7655797 154.029229,16.2503834 L153.741894,16.3018199 C147.866309,15.0821247 141.290716,14.3555104 133.900416,14.2349007 C120.443566,14.0143741 110.236083,17.7627344 102.490457,23.636545 C102.490457,23.636545 7.06039723,-15.6768961 11.4987159,73.0806097 C12.4429007,91.9631224 38.5625866,215.954032 69.7171363,178.502947 C81.1041109,164.808425 92.1061986,153.229303 92.1061986,153.229303 C97.5708822,156.859418 104.112776,158.711132 110.970975,158.046005 L111.503667,157.593718 C111.338125,159.294079 111.413801,160.957192 111.717099,162.925968 C103.691233,171.893062 106.049626,173.467492 90.0055797,176.770069 C73.7711594,180.115806 83.308194,186.072388 89.5349654,187.629081 C97.0837136,189.516859 114.54788,192.190965 126.34812,175.672166 L125.877506,177.556988 C129.022226,180.075603 131.230448,193.940397 130.860342,206.508637 C130.490236,219.077469 130.243104,227.706383 132.720924,234.446337 C135.198744,241.186291 137.668286,256.351187 158.759612,251.831871 C176.383409,248.055132 185.516046,238.268009 186.786587,221.94254 C187.688203,210.336222 189.728517,212.051954 189.857404,201.675381 L191.493912,196.762901 C193.381099,181.029838 191.793663,175.95418 202.651492,178.314938 L205.290125,178.546697 C213.2817,178.9103 223.741044,177.261376 229.879723,174.408129 C243.098309,168.273589 250.93794,158.031224 237.904406,160.722476 L237.905589,160.722476" fill="#336791"> </path> <path d="M108.076342,81.5250624 C105.396915,81.152 102.969349,81.4972748 101.741376,82.426679 C101.050236,82.9499122 100.836804,83.5559169 100.779455,83.973321 C100.625145,85.0783187 101.399649,86.2997875 101.874993,86.9300323 C103.220619,88.7137552 105.18703,89.9399538 107.133339,90.2101432 C107.415353,90.249164 107.695594,90.2680831 107.974651,90.2680831 C111.220471,90.2680831 114.170679,87.7411917 114.430818,85.8758799 C114.755991,83.5399538 111.36473,81.9826697 108.076342,81.5250624" fill="#FFFFFF"> </path> <path d="M196.860453,81.5989654 L196.859861,81.5989654 C196.604453,79.7679446 193.345626,79.2458938 190.253524,79.6757136 C187.166152,80.1061247 184.171603,81.4996397 184.421691,83.3347991 C184.622707,84.7620139 187.19867,87.198448 190.249386,87.1978568 C190.506568,87.1978568 190.766707,87.1807113 191.028619,87.1440554 C193.064794,86.8620416 194.558818,85.5690346 195.268286,84.8235012 C196.349635,83.688351 196.974559,82.4219492 196.860453,81.5989654" fill="#FFFFFF"> </path> <path d="M247.802088,160.025423 C246.66812,156.596323 243.018494,155.492508 236.954309,156.745312 C218.949173,160.461155 212.501284,157.886965 210.38352,156.327908 C224.378975,135.007187 235.89188,109.236323 242.102688,85.1906513 C245.04521,73.8007206 246.670485,63.2231316 246.802919,54.601903 C246.949543,45.1375889 245.338457,38.1842032 242.014005,33.9362587 C228.611547,16.8108637 208.942115,7.62501617 185.131751,7.37256351 C168.763122,7.18869284 154.93321,11.3781062 152.252009,12.5558245 C146.60582,11.1516674 140.450587,10.2896628 133.750245,10.1796952 C121.461654,9.98104388 110.840314,12.9229746 102.045857,18.9191686 C98.2259584,17.4978661 88.3536998,14.10897 76.2814965,12.1644342 C55.4089238,8.80332564 38.8233164,11.3497275 26.9870115,19.7350577 C12.8638522,29.740933 6.34383372,47.626642 7.60727945,72.8943741 C8.03236952,81.3961755 12.8756767,107.547788 20.5202032,132.593219 C30.5822448,165.556915 41.5192979,184.218309 53.0280647,188.056536 C54.374873,188.505866 55.9286097,188.820397 57.6407945,188.820397 C61.8390762,188.820397 66.9856813,186.927889 72.3409885,180.490051 C81.2359538,169.788896 89.5408776,160.821801 92.6022356,157.563566 C97.1262818,159.992314 102.09552,161.347991 107.179455,161.483972 C107.188323,161.616998 107.201921,161.750023 107.213746,161.882457 C106.193885,163.092102 105.357303,164.152166 104.644286,165.05733 C101.122365,169.528166 100.389247,170.458753 89.0519353,172.793497 C85.8273995,173.458624 77.2611547,175.224018 77.1364065,181.227898 C76.9998337,187.787529 87.2605266,190.542633 88.4299677,190.834697 C92.5040924,191.854559 96.4286374,192.357691 100.171677,192.357691 C109.275344,192.357099 117.285838,189.365506 123.688203,183.576831 C123.490734,206.962697 124.466254,230.006836 127.273977,237.028212 C129.573247,242.775501 135.191649,256.822984 152.93842,256.821801 C155.54158,256.821801 158.408425,256.519095 161.561423,255.843326 C180.082106,251.872074 188.124527,243.686577 191.236139,225.640055 C192.901025,215.995418 195.758411,192.963695 197.101672,180.610069 C199.937774,181.49454 203.589173,181.899529 207.536185,181.898938 C215.768388,181.898938 225.266993,180.150097 231.224166,177.384942 C237.91564,174.277469 249.991982,166.650679 247.802088,160.025423 L247.802088,160.025423 Z M203.696185,76.5445912 C203.634697,80.1918522 203.132748,83.5027067 202.600647,86.9590023 C202.028342,90.6760277 201.435935,94.5189838 201.286947,99.1843326 C201.139732,103.724342 201.706716,108.444674 202.255372,113.008924 C203.363326,122.228471 204.500249,131.720573 200.098587,141.086744 C199.41454,139.871778 198.754143,138.546254 198.14873,137.078245 C197.601848,135.752129 196.414079,133.621949 194.769885,130.673515 C188.370476,119.197857 173.385312,92.3243603 181.056443,81.3583372 C183.340933,78.0935982 189.139658,74.7384018 203.696185,76.5445912 L203.696185,76.5445912 Z M186.052286,14.7581339 C207.386014,15.2293395 224.261321,23.2102725 236.209958,38.4780416 C245.373931,50.1890069 235.282919,103.476028 206.069949,149.446651 C205.781432,149.080092 205.487594,148.709986 205.183704,148.33042 C205.062503,148.178476 204.938938,148.024166 204.814189,147.868083 C212.362938,135.400942 210.886651,123.066236 209.572952,112.129774 C209.033164,107.641792 208.523529,103.402716 208.653007,99.4214134 C208.787215,95.2000739 209.34533,91.5811917 209.884527,88.0811455 C210.548471,83.7675751 211.223058,79.3050162 211.036822,74.0437136 C211.17576,73.4921016 211.231926,72.8399815 211.159206,72.0660693 C210.683861,67.0205635 204.924157,51.9224758 193.18363,38.2551501 C186.762346,30.7808961 177.396767,22.4156674 164.609774,16.7736166 C170.109931,15.6337367 177.631483,14.5707159 186.052286,14.7581339 L186.052286,14.7581339 Z M66.6741062,175.777995 C60.7742818,182.871501 56.6995658,181.512277 55.3598522,181.065903 C46.6292471,178.153533 36.499806,159.702023 27.568776,130.441755 C19.8408868,105.123769 15.3245266,79.6650716 14.9674273,72.5260416 C13.8387806,49.9483788 19.3117413,34.2129515 31.2349561,25.7572656 C50.6389284,11.9965266 82.5413764,20.2328684 95.3602956,24.4104573 C95.1758337,24.591963 94.9842771,24.7622356 94.8015889,24.9466975 C73.7664296,46.1911501 74.2654226,82.4875751 74.3168591,84.7058476 C74.3150855,85.56194 74.3866236,86.7739492 74.485358,88.4412009 C74.8471871,94.5455889 75.5205912,105.907732 73.7214965,118.775132 C72.0489238,130.732046 75.7346143,142.435326 83.8320185,150.883917 C84.6703741,151.758337 85.5453857,152.579547 86.4493672,153.352277 C82.8446744,157.212379 75.0115473,165.74788 66.6741062,175.777995 L66.6741062,175.777995 Z M89.1530346,145.78461 C82.6265127,138.975483 79.6627067,129.503483 81.020157,119.795584 C82.920351,106.202753 82.2185681,94.3646744 81.8419584,88.0048776 C81.7893395,87.1150855 81.7426328,86.335261 81.7148453,85.7197968 C84.7880277,82.9954365 99.0288406,75.3645081 109.184296,77.6915658 C113.819492,78.7534042 116.642587,81.9087667 117.816758,87.3373857 C123.893358,115.440037 118.621413,127.153367 114.385293,136.565654 C113.512055,138.504868 112.687298,140.337663 111.982559,142.234309 L111.436859,143.699954 C110.054577,147.406337 108.768665,150.851991 107.971695,154.124416 C101.034273,154.103132 94.2848591,151.139917 89.1530346,145.78461 L89.1530346,145.78461 Z M90.2178291,183.685025 C88.1922956,183.178938 86.3701432,182.299788 85.3012102,181.570808 C86.1939584,181.150448 87.7831686,180.579326 90.5388637,180.011751 C103.876286,177.265515 105.93552,175.328074 110.433552,169.61685 C111.465238,168.30788 112.634088,166.823316 114.252859,165.015353 C114.25345,165.014171 114.254042,165.01358 114.254633,165.012988 C116.666236,162.31346 117.768868,162.771067 119.768979,163.600554 C121.390115,164.271594 122.968684,166.303039 123.608979,168.539048 C123.911686,169.594975 124.252231,171.599815 123.138956,173.158873 C113.742633,186.31479 100.051067,186.1457 90.2178291,183.685025 L90.2178291,183.685025 Z M160.016554,248.637487 C143.700545,252.133395 137.923695,243.80837 134.116804,234.291436 C131.659677,228.146845 130.452397,200.440314 131.309081,169.84388 C131.320314,169.436527 131.262374,169.043363 131.150042,168.673848 C131.05249,167.96024 130.902319,167.238356 130.694208,166.511741 C129.419529,162.059824 126.315012,158.335704 122.5903,156.792018 C121.110467,156.178919 118.393792,155.05382 115.129644,155.888628 C115.826106,153.0206 117.033386,149.782467 118.341764,146.275326 L118.891012,144.79963 C119.509432,143.136517 120.284527,141.413691 121.105145,139.590356 C125.538143,129.741746 131.609423,116.25297 125.020231,85.7795104 C122.551871,74.3659307 114.310208,68.7924619 101.815871,70.0866513 C94.3250624,70.861746 87.472776,73.8840831 84.0549099,75.6169607 C83.3200185,75.9894319 82.6477968,76.3488961 82.0199169,76.6994919 C82.9735612,65.1990023 86.578254,43.707418 100.060527,30.1098568 C108.54873,21.548933 119.854115,17.3210901 133.628453,17.5487113 C160.768591,17.9933118 178.172453,31.9213672 187.994457,43.5276859 C196.457829,53.5294226 201.040998,63.6038799 202.870245,69.0372286 C189.115418,67.6389838 179.76048,70.3544758 175.017681,77.1340416 C164.700822,91.8815335 180.662097,120.506236 188.333229,134.262836 C189.739751,136.784406 190.954125,138.963067 191.336055,139.888924 C193.833977,145.943058 197.067972,149.984665 199.429321,152.935464 C200.152979,153.839446 200.855353,154.716231 201.389229,155.481866 C197.223464,156.683233 189.740342,159.457848 190.422023,173.328554 C189.872185,180.289035 185.960647,212.874938 183.974134,224.387843 C181.351464,239.597672 175.754346,245.263372 160.016554,248.637487 L160.016554,248.637487 Z M228.120831,170.700564 C223.861062,172.678208 216.732083,174.161589 209.959612,174.479667 C202.479446,174.830263 198.671963,173.641903 197.776259,172.91115 C197.355307,164.267455 200.573339,163.364065 203.978199,162.408055 C204.513256,162.257293 205.035307,162.111261 205.53903,161.935076 C205.852379,162.189894 206.195289,162.442938 206.570716,162.690661 C212.582873,166.658956 223.306494,167.087002 238.444785,163.962383 C238.50036,163.950559 238.555935,163.939917 238.610919,163.928684 C236.569423,165.837746 233.075289,168.400111 228.120831,170.700564 L228.120831,170.700564 Z" fill="#FFFFFF"> </path> </g> </g></svg>`,// postgres
        `<svg height="32px" width="32px" viewBox="0 -18 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M245.969687,168.943256 C232.308259,176.064479 161.536048,205.163388 146.468577,213.017633 C131.402107,220.873879 123.031844,220.797876 111.129473,215.107699 C99.2271007,209.417521 23.9127473,178.99557 10.3463234,172.511368 C3.56511141,169.270267 0,166.535181 0,163.9511 L0,138.075292 C0,138.075292 98.0490639,116.729625 113.878559,111.051447 C129.707053,105.372269 135.199225,105.167264 148.669646,110.101418 C162.141067,115.036572 242.686583,129.569026 256,134.445178 C256,134.445178 255.993999,157.5559 255.993999,159.954975 C255.996,162.513055 252.923904,165.319143 245.969687,168.943256" fill="#912626"> </path> <path d="M245.964922,143.220067 C232.303935,150.33806 161.534003,179.438032 146.467017,187.292024 C131.401031,195.149018 123.031039,195.072017 111.12905,189.382023 C99.2260618,183.696028 23.9151336,153.269057 10.3491466,146.788063 C-3.21684053,140.303069 -3.50184026,135.840074 9.82514705,130.622079 C23.1511343,125.402084 98.0490629,96.0171117 113.880047,90.3381172 C129.708033,84.6611226 135.199028,84.4541228 148.669014,89.3901181 C162.140002,94.3241134 232.487935,122.325087 245.799922,127.200082 C259.11491,132.081078 259.625908,136.099073 245.964922,143.220067" fill="#C6302B"> </path> <path d="M245.969687,127.074354 C232.308259,134.195577 161.536048,163.294486 146.468577,171.151732 C131.402107,179.004977 123.031844,178.928975 111.129473,173.238797 C99.2261007,167.551619 23.9127473,137.126668 10.3463234,130.642465 C3.56511141,127.401364 0,124.669279 0,122.085199 L0,96.2063895 C0,96.2063895 98.0490639,74.8617226 113.878559,69.182545 C129.707053,63.5043676 135.199225,63.2983612 148.669646,68.2325154 C162.141067,73.1676697 242.686583,87.6971237 256,92.5742761 C256,92.5742761 255.993999,115.684998 255.993999,118.087073 C255.996,120.644153 252.923904,123.450241 245.969687,127.074354" fill="#912626"> </path> <path d="M245.964922,101.351164 C232.303935,108.471157 161.534003,137.569129 146.467017,145.426122 C131.401031,153.280114 123.031039,153.203114 111.12905,147.51312 C99.2260618,141.827125 23.9151336,111.401154 10.3491466,104.91916 C-3.21684053,98.4361664 -3.50184026,93.9721706 9.82514705,88.7521756 C23.1511343,83.5351806 98.0490629,54.1482087 113.880047,48.4702141 C129.708033,42.7922195 135.199028,42.5862197 148.669014,47.521215 C162.140002,52.4552102 232.487935,80.4541835 245.799922,85.3311789 C259.11491,90.2101742 259.625908,94.2301704 245.964922,101.350163 L245.964922,101.351164" fill="#C6302B"> </path> <path d="M245.969687,83.6525661 C232.308259,90.7737887 161.536048,119.873698 146.468577,127.730944 C131.402107,135.585189 123.031844,135.508187 111.129473,129.818008 C99.2261007,124.130831 23.9127473,93.7048802 10.3463234,87.2226777 C3.56511141,83.9805764 0,81.2474909 0,78.6654102 L0,52.7856015 C0,52.7856015 98.0490639,31.4419345 113.878559,25.7637571 C129.707053,20.0845797 135.199225,19.8795733 148.669646,24.8137275 C162.141067,29.7488817 242.686583,44.2783357 256,49.1554881 C256,49.1554881 255.993999,72.2662103 255.993999,74.6672853 C255.996,77.2223652 252.923904,80.0284528 245.969687,83.6525661" fill="#912626"> </path> <path d="M245.964922,57.929387 C232.303935,65.0493802 161.534003,94.1493524 146.467017,102.004345 C131.401031,109.858338 123.031039,109.781338 111.12905,104.093343 C99.2270617,98.4053484 23.9151336,67.9813773 10.3491466,61.4983836 C-3.21684053,55.0153898 -3.50184026,50.550394 9.82514705,45.331399 C23.1511343,40.113404 98.0490629,10.729432 113.880047,5.04943744 C129.708033,-0.629557148 135.199028,-0.833556953 148.669014,4.10143834 C162.140002,9.03643363 232.487935,37.0354069 245.799922,41.9124022 C259.11491,46.7883976 259.625908,50.8093938 245.964922,57.929387" fill="#C6302B"> </path> <path d="M159.282977,32.7570853 L137.273922,35.0422326 L132.346419,46.8976124 L124.387597,33.667969 L98.973147,31.383814 L117.936992,24.5452403 L112.247442,14.0472558 L130.001736,20.9910078 L146.739969,15.5108217 L142.21631,26.3660155 L159.282977,32.7570853" fill="#FFFFFF"> </path> <path d="M131.03169,90.2747287 L89.9546047,73.2378295 L148.815752,64.2034109 L131.03169,90.2747287" fill="#FFFFFF"> </path> <path d="M74.0816124,39.3466047 C91.4568682,39.3466047 105.541829,44.8069457 105.541829,51.5413333 C105.541829,58.2767132 91.4568682,63.736062 74.0816124,63.736062 C56.7073488,63.736062 42.6213953,58.2767132 42.6213953,51.5413333 C42.6213953,44.8069457 56.7073488,39.3466047 74.0816124,39.3466047" fill="#FFFFFF"> </path> <path d="M185.29476,35.9977674 L220.130605,49.7642171 L185.324527,63.5167752 L185.29476,35.9977674" fill="#621B1C"> </path> <path d="M146.754853,51.2426667 L185.29476,35.9977674 L185.324527,63.5167752 L181.546047,64.9952248 L146.754853,51.2426667" fill="#9A2928"> </path> </g> </g></svg>`, // redis
        `<svg height="32px" width="32px" viewBox="0 -41 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill="#00979C"> <path d="M14.044,130.399 L0.919,173.242 L11.247,173.242 L13.616,165.259 L26.419,165.259 L28.724,173.242 L39.955,173.242 L26.831,130.399 L14.044,130.399 L14.044,130.399 Z M16.21,156.641 L20.109,143.316 L23.964,156.641 L16.21,156.641 L16.21,156.641 Z"> </path> <path d="M64.632,153.696 C64.477,153.53 64.319,153.373 64.158,153.226 C64.481,153.104 64.796,152.974 65.104,152.832 C66.354,152.258 67.449,151.489 68.359,150.552 C69.279,149.606 70.002,148.466 70.507,147.163 C71.007,145.876 71.261,144.397 71.261,142.77 C71.261,140.527 70.856,138.587 70.06,137.002 C69.255,135.399 68.09,134.079 66.599,133.078 C65.152,132.108 63.392,131.407 61.367,130.996 C59.421,130.601 57.229,130.399 54.854,130.399 L41.456,130.399 L41.456,173.242 L51.731,173.242 L51.731,156.502 L52.036,156.502 C53.16,156.502 54.097,156.749 54.9,157.259 C55.697,157.764 56.308,158.509 56.771,159.541 L62.981,173.242 L74.936,173.242 L67.391,157.959 C66.477,156.103 65.574,154.71 64.632,153.696 L64.632,153.696 Z M60.163,145.477 C59.866,146.043 59.454,146.507 58.903,146.895 C58.322,147.303 57.601,147.616 56.757,147.826 C55.866,148.049 54.849,148.161 53.733,148.161 L51.731,148.161 L51.731,139.142 L53.989,139.142 C56.341,139.142 58.089,139.511 59.184,140.24 C60.138,140.875 60.602,141.945 60.602,143.513 C60.602,144.271 60.458,144.914 60.163,145.477 L60.163,145.477 Z"> </path> <path d="M105.04,135.487 C103.31,133.748 101.128,132.446 98.555,131.619 C96.047,130.81 93.095,130.399 89.782,130.399 L76.193,130.399 L76.193,173.242 L88.022,173.242 C91.839,173.242 95.178,172.722 97.945,171.697 C100.755,170.658 103.102,169.15 104.919,167.216 C106.733,165.286 108.085,162.928 108.935,160.209 C109.769,157.547 110.191,154.553 110.191,151.31 C110.191,147.775 109.768,144.674 108.932,142.093 C108.078,139.449 106.769,137.227 105.04,135.487 L105.04,135.487 Z M96.639,161.524 C94.855,163.506 92.267,164.469 88.727,164.469 L86.467,164.469 L86.467,139.172 L89.27,139.172 C91.251,139.172 92.914,139.452 94.211,140.005 C95.469,140.54 96.442,141.296 97.186,142.314 C97.946,143.358 98.497,144.668 98.823,146.205 C99.166,147.831 99.341,149.715 99.341,151.805 C99.341,156.263 98.432,159.533 96.639,161.524 L96.639,161.524 Z"> </path> <path d="M134.942,157.654 C134.942,159.131 134.806,160.39 134.535,161.396 C134.283,162.335 133.912,163.102 133.43,163.675 C132.968,164.226 132.403,164.615 131.704,164.864 C130.943,165.136 129.97,165.273 128.81,165.273 C127.583,165.273 126.571,165.116 125.802,164.805 C125.063,164.505 124.469,164.076 123.985,163.495 C123.499,162.91 123.151,162.176 122.95,161.31 C122.726,160.354 122.613,159.229 122.613,157.963 L122.613,130.399 L112.339,130.399 L112.339,158.427 C112.339,160.743 112.626,162.869 113.19,164.745 C113.777,166.694 114.745,168.379 116.068,169.75 C117.391,171.12 119.123,172.18 121.216,172.897 C123.25,173.598 125.708,173.953 128.521,173.953 C131.036,173.953 133.344,173.598 135.378,172.897 C137.458,172.184 139.251,171.103 140.708,169.683 C142.166,168.261 143.297,166.471 144.07,164.363 C144.83,162.293 145.216,159.869 145.216,157.158 L145.216,130.399 L134.942,130.399 L134.942,157.654"> </path> <path d="M150.47,139.018 L159.69,139.018 L159.69,164.562 L150.47,164.562 L150.47,173.242 L179.313,173.242 L179.313,164.562 L170.093,164.562 L170.093,139.018 L179.313,139.018 L179.313,130.399 L150.47,130.399 L150.47,139.018"> </path> <path d="M207.905,154.811 L196.419,130.399 L184.79,130.399 L184.79,173.242 L194.359,173.242 L194.359,148.366 L205.906,173.242 L217.476,173.242 L217.476,130.399 L207.905,130.399 L207.905,154.811"> </path> <path d="M250.738,135.468 C247.738,131.653 243.241,129.719 237.374,129.719 C234.864,129.719 232.47,130.164 230.258,131.041 C228.015,131.93 226.033,133.314 224.366,135.158 C222.714,136.986 221.402,139.337 220.469,142.144 C219.546,144.915 219.078,148.238 219.078,152.022 C219.078,159.012 220.565,164.45 223.497,168.188 C226.497,172.014 230.994,173.953 236.861,173.953 C239.372,173.953 241.768,173.508 243.98,172.631 C246.224,171.741 248.205,170.356 249.87,168.515 C251.52,166.688 252.832,164.338 253.768,161.529 C254.689,158.759 255.157,155.436 255.157,151.65 C255.157,144.64 253.67,139.195 250.738,135.468 L250.738,135.468 Z M243.976,157.729 C243.682,159.31 243.223,160.643 242.612,161.692 C242.032,162.691 241.314,163.423 240.419,163.928 C239.527,164.431 238.416,164.686 237.118,164.686 C234.55,164.686 232.76,163.73 231.646,161.765 C230.422,159.606 229.801,156.204 229.801,151.65 C229.801,149.512 229.955,147.591 230.261,145.944 C230.555,144.366 231.017,143.035 231.637,141.986 C232.227,140.983 232.947,140.249 233.838,139.742 C234.717,139.241 235.82,138.987 237.118,138.987 C239.706,138.987 241.501,139.941 242.604,141.903 C243.819,144.063 244.435,147.468 244.435,152.022 C244.435,154.166 244.281,156.086 243.976,157.729 L243.976,157.729 Z"> </path> <path d="M240.315,5.74 L242.138,5.74 L242.138,10.533 L243.431,10.533 L243.431,5.74 L245.269,5.74 L245.269,4.55 L240.315,4.55 L240.315,5.74"> </path> <path d="M249.768,4.55 L248.521,8.628 L247.231,4.55 L245.544,4.55 L245.544,10.533 L246.76,10.533 L246.76,6.711 L247.966,10.533 L249.076,10.533 L250.22,6.81 L250.22,10.533 L251.43,10.533 L251.43,4.55 L249.768,4.55"> </path> <path d="M190.275,120.327 C173.987,120.327 160.061,114.835 147.805,103.602 C140.234,96.665 133.992,88.166 128.249,79.329 C122.507,88.166 116.264,96.665 108.694,103.602 C95.525,115.671 80.427,121.113 62.545,120.236 C28.444,120.088 0.747,93.176 0.747,60.118 C0.747,26.969 28.596,0 62.827,0 C81.559,0 97.33,6.199 111.037,18.95 C117.621,25.075 123.179,32.18 128.249,39.614 C133.319,32.18 138.878,25.075 145.461,18.95 C159.168,6.199 174.939,0 193.671,0 C227.903,0 255.751,26.969 255.751,60.118 C255.751,93.176 228.055,120.088 193.953,120.236 C192.714,120.297 191.487,120.327 190.275,120.327 L190.275,120.327 Z M140.72,59.316 C147.514,70.339 154.108,80.599 162.14,87.959 C171.206,96.268 180.762,99.686 193.115,99.033 L193.671,99.018 C216.202,99.018 234.533,81.568 234.533,60.118 C234.533,38.669 216.202,21.218 193.671,21.218 C180.37,21.218 169.643,25.434 159.913,34.485 C152.646,41.246 146.646,49.908 140.72,59.316 L140.72,59.316 Z M62.827,21.218 C40.296,21.218 21.965,38.669 21.965,60.118 C21.965,81.568 40.296,99.018 62.827,99.018 L63.384,99.033 C75.738,99.686 85.292,96.268 94.358,87.959 C102.39,80.599 108.985,70.339 115.778,59.316 C109.852,49.908 103.852,41.246 96.586,34.485 C86.855,25.434 76.128,21.218 62.827,21.218 L62.827,21.218 Z"> </path> <path d="M196.477,52.407 L196.477,40.901 L184.501,40.901 L184.501,52.407 L172.996,52.407 L172.996,64.325 L184.501,64.325 L184.501,75.916 L196.477,75.916 L196.477,64.325 L207.983,64.325 L207.983,52.407 L196.477,52.407"> </path> <path d="M45.599,52.263 L83.416,52.263 L83.416,64.555 L45.599,64.555 L45.599,52.263 Z"> </path> </g> </g></svg>`, //arduino
        ``, // mongo
        ``, // docker
        ``, // aws
        ``, // node.js
        ``, // react
        ``, // next.js
        ``, // flutter
        ``, // swiftui
        ``, // tailwind
        ``, // kafka
        ``, // langchain
    ]

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
            ? ['#f1f5f9', '#cbd5e1', '#64748b', '#334155', '#0f172a'] // Light to dark for white background
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
                  font-size="16" font-weight="600" fill="${headerTextColor}">
                @${username}20
            </text>
        `;

        // Main header text "Software engineer" - positioned more to the right
        svg += `
            <text x="60" y="130" 
                  font-family="${this.getFontFamily(fonts.headerText)}" 
                  font-size="48" font-weight="700" fill="${headerTextColor}">
                ${headerText}
            </text>
        `;

        // Subheading with opacity - positioned below header, also moved to the right
        svg += `
            <text x="60" y="170" 
                  font-family="${this.getFontFamily(fonts.subheaderText)}" 
                  font-size="18" font-weight="400" fill="${subTextColor}" opacity="${subTextOpacity}">
                ${subText}
            </text>
        `;

        //         svg += `
        //     <g transform="translate(${centerX - 32}, ${bannerHeight / 2 - 16})">

        //     </g>
        // `;

        //     this.svgLogos.forEach((logo, index) => {
        //         const col = index % 5;  // Column position (0-4)
        //         const row = Math.floor(index / 5);  // Row position (0, 1, 2, ...)

        //         // Calculate position
        //         const logoSize = 32;
        //         const logoSpacing = 60;
        //         const rowSpacing = 40;

        //         // Center the entire grid
        //         const totalGridWidth = 4 * logoSpacing; // 4 gaps between 5 logos
        //         const startX = centerX - (totalGridWidth / 2);
        //         const startY = bannerHeight / 2 - 16; // Center vertically, adjust as needed

        //         const x = startX + (col * logoSpacing) + 64;
        //         const y = startY + (row * rowSpacing);

        //         svg += `
        //     <g transform="translate(${x}, ${y})">
        //         ${logo}
        //     </g>
        // `;
        //     });

        // Motivational text in bottom right corner - large, bold, independent positioning
        // Handle multi-line text by splitting on \n characters
        const motivationalLines = motivationalText.split('\n');
        const motivationalX = bannerWidth - 60; // Fixed distance from right edge
        const lineSpacing = 45; // Spacing between lines for 54px font
        const motivationalStartY = bannerHeight - (motivationalLines.length * lineSpacing) - 40; // Bottom positioning with line spacing

        motivationalLines.forEach((line, index) => {
            const lineY = motivationalStartY + (index * lineSpacing);
            svg += `
                <text x="${motivationalX}" y="${lineY}" 
                      text-anchor="end"
                      font-family="${this.getFontFamily(fonts.motivationalText)}" 
                      font-size="54" font-weight="700" fill="${motivationalTextColor}"
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
            <line x1="60" y1="75" x2="200" y2="75" 
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
