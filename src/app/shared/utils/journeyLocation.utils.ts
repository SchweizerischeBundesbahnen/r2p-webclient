import { ARRIVAL_TIMING_TYPES, DEPARTURE_TIMING_TYPES, Train } from '../models/api.models';
import { durationToMinutes } from './date.utils';

/**
 * Returns the name of the first location of the first journey location of the given train,
 * or `undefined` if no such name exists.
 */
export function getFirstJourneyLocationName(train: Train | null | undefined): string | undefined {
    return train?.journey?.journeylocations?.[0]?.locations?.[0]?.name;
}

/**
 * Returns the name of the first location of the last journey location of the given train,
 * or `undefined` if no such name exists.
 */
export function getLastJourneyLocationName(train: Train | null | undefined): string | undefined {
    return train?.journey?.journeylocations?.at(-1)?.locations?.[0]?.name;
}

/**
 * Searches all journey-location activities of the given train for timings of type
 * `departure`, `earliestdeparture`, or `latestdeparture`, and returns the `duration`
 * string of the earliest one (smallest ISO-8601 duration value).
 *
 * Returns `undefined` if the train is `null`/`undefined` or no matching timing exists.
 */
export function getEarliestJourneyLocationDeparture(train: Train | null | undefined): string | undefined {
    const durations = (train?.journey?.journeylocations ?? [])
        .flatMap(jl => jl.activities ?? [])
        .flatMap(activity => activity.timings ?? [])
        .filter(t => DEPARTURE_TIMING_TYPES.has(t.type))
        .map(t => t.duration)
        .filter((d): d is string => d != null);

    if (durations.length === 0) return undefined;

    const sorted = durations.sort((a, b) => durationToMinutes(a) - durationToMinutes(b));
    return sorted[0];
}

/**
 * Searches all journey-location activities of the given train for timings of type
 * `arrival`, `earliestarrival`, or `latestarrival`, and returns the `duration`
 * string of the latest one (smallest ISO-8601 duration value).
 *
 * Returns `undefined` if the train is `null`/`undefined` or no matching timing exists.
 */
export function getLatestJourneyLocationArrival(train: Train | null | undefined): string | undefined {
    const durations = (train?.journey?.journeylocations ?? [])
        .flatMap(jl => jl.activities ?? [])
        .flatMap(activity => activity.timings ?? [])
        .filter(t => ARRIVAL_TIMING_TYPES.has(t.type))
        .map(t => t.duration)
        .filter((d): d is string => d != null);

    if (durations.length === 0) return undefined;

    const sorted = durations.sort((a, b) => durationToMinutes(a) - durationToMinutes(b));
    return sorted.at(-1);
}
