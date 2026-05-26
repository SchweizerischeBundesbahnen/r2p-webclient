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
