import { Train } from '../../models/api.models';

export type OverallStatus = 'green' | 'yellow' | 'red';

export function computeOverallStatus(train: Train | null | undefined): OverallStatus {
    const statuses = (train?.journey?.journeylocations ?? [])
        .flatMap((jl) => jl.activities ?? [])
        .map((activity) => activity.responsibility?.status?.toLowerCase())
        .filter((s): s is string => s != null);

    if (statuses.some((s) => s === 'dropped' || s === 'refused')) return 'red';
    if (statuses.some((s) => s === 'proposed' || s === 'requested')) return 'yellow';
    return 'green';
}
