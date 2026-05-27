/**
 * Converts an ISO date-only string ("yyyy-MM-dd") to a Date object at UTC midnight.
 *
 * Angular's DatePipe interprets plain date strings as local midnight, which causes
 * the displayed date to shift by one day in timezones east of UTC. By explicitly
 * appending "T00:00:00Z" the date is pinned to UTC midnight and the pipe's 'UTC'
 * timezone parameter produces a stable, timezone-independent result.
 *
 * @param value - ISO date string in the format "yyyy-MM-dd".
 * @returns A Date at 00:00:00 UTC on the given day.
 */
export function isoDateToUtc(value: string): Date {
    return new Date(`${value}T00:00:00Z`);
}

/**
 * Asserts that a string is a valid ISO date string in the format "yyyy-MM-dd".
 *
 * Validation strategy: parse via {@link Date} and verify that the normalized
 * ISO string starts with the original input. This catches both format violations
 * and calendar overflow (e.g. "2026-02-30" → Date normalises to "2026-03-02",
 * which no longer matches the input). The length check rejects date-time strings.
 *
 * @param value - The date string to validate.
 * @throws {Error} if the value is not a valid ISO date string.
 */
export function assertIsoDate(value: string): void {
    const parsed = new Date(value);
    const isValid =
        value.length === 10 &&
        !isNaN(parsed.getTime()) &&
        parsed.toISOString().startsWith(value);

    if (!isValid) {
        throw new Error(`Invalid ISO date "${value}"`);
    }
}
