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
 * and calendar overflow (e.g. "2026-02-30" → Date normalizes to "2026-03-02",
 * which no longer matches the input). The length check rejects date-time strings.
 *
 * @param value - The date string to validate.
 * @throws {Error} if the value is not a valid ISO date string.
 */
export function assertIsoDate(value: string): void {
    const parsed = new Date(value);
    const isValid =
        value.length === 10 && !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);

    if (!isValid) {
        throw new Error(`Invalid ISO date "${value}"`);
    }
}

/**
 * Converts an ISO-8601 duration string (e.g. "PT8H12M", "P1DT14H35M") to total minutes.
 * Returns `Infinity` if the string cannot be parsed.
 */
export function durationToMinutes(duration: string): number {
    const match = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/.exec(duration);
    if (!match) return Infinity;
    const days = Number.parseInt(match[1] ?? '0', 10);
    const hours = Number.parseInt(match[2] ?? '0', 10);
    const minutes = Number.parseInt(match[3] ?? '0', 10);
    return days * 24 * 60 + hours * 60 + minutes;
}

/**
 * Parses an ISO-8601 duration string (e.g. "PT8H12M", "P1DT14H35M") into a
 * zero-padded "HH:MM" clock string. Days are converted to hours so that
 * e.g. "P1DT14H35M" yields "38:35".
 */
export function parseDurationToHoursAndMinutes(duration: string): string | undefined {
    const match = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/.exec(duration);
    if (!match) return undefined;
    const days = Number.parseInt(match[1] ?? '0', 10);
    const hours = Number.parseInt(match[2] ?? '0', 10);
    const minutes = Number.parseInt(match[3] ?? '0', 10);
    const totalHours = days * 24 + hours;
    return `${String(totalHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Converts a "HH:MM" string to an ISO-8601 duration string (e.g. "PT8H30M").
 * Returns `undefined` if the input is empty or not a valid time string.
 */
export function hoursMinutesToDuration(time: string | undefined): string | undefined {
    if (!time) return undefined;
    const [h, m] = time.split(':').map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return undefined;
    if (h === 0 && m === 0) return undefined;
    const hours = h > 0 ? `${h}H` : '';
    const mins = m > 0 ? `${m}M` : '';
    return `PT${hours}${mins}`;
}

/**
 * Adds an ISO-8601 duration string (e.g. "PT8H12M", "P1DT14H35M") to a date
 * string (e.g. "2025-06-15") and returns the result as an ISO-8601 date-time
 * string (e.g. "2025-06-15T08:12:00.000Z").
 *
 * @param date - ISO date string in the format "yyyy-MM-dd".
 * @param duration - ISO-8601 duration string.
 * @returns An ISO-8601 date-time string, or `undefined`
 *          if either argument is missing or cannot be parsed.
 */
export function parseDurationToDate(
    date: string | undefined,
    duration: string | undefined,
): string | undefined {
    if (!date) return undefined;
    const dateUtc = isoDateToUtc(date);
    if (Number.isNaN(dateUtc.getTime())) return undefined;

    const match = duration ? /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/.exec(duration) : null;
    if (!match) return undefined;

    const days = Number.parseInt(match[1] ?? '0', 10);
    const hours = Number.parseInt(match[2] ?? '0', 10);
    const minutes = Number.parseInt(match[3] ?? '0', 10);
    const totalMs = (days * 24 * 60 + hours * 60 + minutes) * 60 * 1000;
    const result = new Date(dateUtc.getTime() + totalMs);

    return result.toISOString();
}
