import { Octokit } from "octokit";

// Types for contribution data
interface ContributionDay {
    date: string;
    contributionCount: number;
    color: string;
    weekday: number;
}

interface ContributionWeek {
    contributionDays: ContributionDay[];
    firstDay: string;
}

interface ContributionCalendar {
    totalContributions: number;
    weeks: ContributionWeek[];
}

interface ContributionData {
    user: {
        login: string;
        contributionsCollection: {
            contributionCalendar: ContributionCalendar;
            totalCommitContributions: number;
            totalIssueContributions: number;
            totalPullRequestContributions: number;
            totalPullRequestReviewContributions: number;
            totalRepositoryContributions: number;
        };
    };
}

class GitHubContributionFetcher {
    private octokit: Octokit;

    constructor(token?: string) {
        this.octokit = new Octokit({
            auth: token || process.env.GITHUB_TOKEN,
        });
    }

    /**
     * Fetch contribution data for a GitHub user using GraphQL API
     * This provides the most comprehensive data for heatmap visualization
     */
    async fetchContributionData(
        username: string,
        fromDate?: string,
        toDate?: string
    ): Promise<ContributionData> {
        const from = fromDate || this.getDateOneYearAgo();
        const to = toDate || this.getCurrentDate();

        const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          login
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  color
                  weekday
                }
                firstDay
              }
            }
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            totalPullRequestReviewContributions
            totalRepositoryContributions
          }
        }
      }
    `;

        try {
            const response = await this.octokit.graphql<ContributionData>(query, {
                username,
                from,
                to,
            });

            return response;
        } catch (error) {
            console.error("Error fetching contribution data:", error);
            throw error;
        }
    }

    /**
     * Fetch user's repositories and their commit activity
     * Useful for additional context in the heatmap
     */
    async fetchRepositoryActivity(username: string, page = 1, perPage = 100) {
        try {
            const { data: repos } = await this.octokit.rest.repos.listForUser({
                username,
                type: "owner",
                sort: "updated",
                per_page: perPage,
                page,
            });

            const repoActivity = await Promise.all(
                repos.map(async (repo) => {
                    try {
                        // Get commit activity for the repository
                        const { data: commitActivity } =
                            await this.octokit.rest.repos.getCommitActivityStats({
                                owner: username,
                                repo: repo.name,
                            });

                        return {
                            name: repo.name,
                            fullName: repo.full_name,
                            description: repo.description,
                            language: repo.language,
                            stargazersCount: repo.stargazers_count,
                            forksCount: repo.forks_count,
                            updatedAt: repo.updated_at,
                            commitActivity: commitActivity || [],
                        };
                    } catch (error) {
                        console.warn(`Could not fetch activity for ${repo.name}:`, error);
                        return {
                            name: repo.name,
                            fullName: repo.full_name,
                            description: repo.description,
                            language: repo.language,
                            stargazersCount: repo.stargazers_count,
                            forksCount: repo.forks_count,
                            updatedAt: repo.updated_at,
                            commitActivity: [],
                        };
                    }
                })
            );

            return repoActivity;
        } catch (error) {
            console.error("Error fetching repository activity:", error);
            throw error;
        }
    }

    /**
     * Process contribution data for heatmap visualization
     * Returns data in a format suitable for creating a calendar heatmap
     */
    processContributionDataForHeatmap(contributionData: ContributionData) {
        const { contributionCalendar } = contributionData.user.contributionsCollection;

        // Flatten the weeks into a single array of contribution days
        const allDays = contributionCalendar.weeks.flatMap(week => week.contributionDays);

        // Create a map for easy date lookup
        const contributionMap = new Map(
            allDays.map(day => [day.date, day])
        );

        // Generate statistics
        const stats = {
            totalContributions: contributionCalendar.totalContributions,
            averageContributions: contributionCalendar.totalContributions / allDays.length,
            maxContributions: Math.max(...allDays.map(day => day.contributionCount)),
            streaks: this.calculateStreaks(allDays),
            contributionsByDay: this.groupContributionsByDayOfWeek(allDays),
            contributionsByMonth: this.groupContributionsByMonth(allDays),
        };

        return {
            calendar: contributionCalendar,
            contributionMap,
            allDays,
            stats,
            summary: contributionData.user.contributionsCollection,
        };
    }

    /**
     * Calculate contribution streaks
     */
    private calculateStreaks(days: ContributionDay[]) {
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        // Sort days by date
        const sortedDays = days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        for (let i = sortedDays.length - 1; i >= 0; i--) {
            const day = sortedDays[i];

            if (day !== undefined && day.contributionCount > 0) {
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);

                // Current streak (from today backwards)
                if (
                    i === sortedDays.length - 1 ||
                    (sortedDays !== undefined && sortedDays[i + 1] !== undefined && this.isConsecutiveDay(sortedDays[i + 1].date, day.date))
                ) {
                    currentStreak = tempStreak;
                }
            } else {
                tempStreak = 0;
            }
        }

        return {
            current: currentStreak,
            longest: longestStreak,
        };
    }

    /**
     * Group contributions by day of week (0 = Sunday, 6 = Saturday)
     */
    private groupContributionsByDayOfWeek(days: ContributionDay[]) {
        const byDayOfWeek = Array(7).fill(0);

        days.forEach(day => {
            byDayOfWeek[day.weekday] += day.contributionCount;
        });

        return byDayOfWeek.map((count, index) => ({
            dayOfWeek: index,
            dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][index],
            totalContributions: count,
        }));
    }

    /**
     * Group contributions by month
     */
    private groupContributionsByMonth(days: ContributionDay[]) {
        const byMonth = new Map<string, number>();

        days.forEach(day => {
            const month = day.date.substring(0, 7); // YYYY-MM format
            byMonth.set(month, (byMonth.get(month) || 0) + day.contributionCount);
        });

        return Array.from(byMonth.entries()).map(([month, count]) => ({
            month,
            totalContributions: count,
        })).sort((a, b) => a.month.localeCompare(b.month));
    }

    /**
     * Check if two dates are consecutive days
     */
    private isConsecutiveDay(date1: string, date2: string): boolean {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 1;
    }

    /**
     * Get date one year ago in ISO format
     */
    private getDateOneYearAgo(): string {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        return date.toISOString();
    }

    /**
     * Get current date in ISO format
     */
    private getCurrentDate(): string {
        return new Date().toISOString();
    }
}

// Example usage
async function main() {
    try {
        // Initialize the fetcher with your GitHub token
        // You can set GITHUB_TOKEN environment variable or pass it directly
        const fetcher = new GitHubContributionFetcher();

        // Replace 'octocat' with the username you want to fetch data for
        const username = "octocat";

        console.log(`Fetching contribution data for ${username}...`);

        // Fetch contribution data
        const contributionData = await fetcher.fetchContributionData(username);

        // Process data for heatmap
        const heatmapData = fetcher.processContributionDataForHeatmap(contributionData);

        console.log("Contribution Summary:");
        console.log(`Total Contributions: ${heatmapData.stats.totalContributions}`);
        console.log(`Average Daily Contributions: ${heatmapData.stats.averageContributions.toFixed(2)}`);
        console.log(`Max Contributions in a Day: ${heatmapData.stats.maxContributions}`);
        console.log(`Current Streak: ${heatmapData.stats.streaks.current} days`);
        console.log(`Longest Streak: ${heatmapData.stats.streaks.longest} days`);

        console.log("\nContributions by Day of Week:");
        heatmapData.stats.contributionsByDay.forEach(day => {
            console.log(`${day.dayName}: ${day.totalContributions}`);
        });

        // You can access individual day data like this:
        // heatmapData.allDays.forEach(day => {
        //   console.log(`${day.date}: ${day.contributionCount} contributions`);
        // });

        // Optional: Fetch repository activity for additional context
        console.log("\nFetching repository activity...");
        const repoActivity = await fetcher.fetchRepositoryActivity(username);
        console.log(`Found ${repoActivity.length} repositories`);

        return {
            contributionData,
            heatmapData,
            repoActivity,
        };

    } catch (error) {
        console.error("Error in main function:", error);

        if (error instanceof Error && error.message.includes("Bad credentials")) {
            console.error("Please set your GitHub token in the GITHUB_TOKEN environment variable");
            console.error("You can create a token at: https://github.com/settings/tokens");
        }
    }
}

// Uncomment the line below to run the example
// main();

export { GitHubContributionFetcher, type ContributionData, type ContributionDay, type ContributionWeek };