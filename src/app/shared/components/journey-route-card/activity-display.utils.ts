import { PlanStatus, ResponsibilityType } from '../../../shared/models/api.models';

const RESPONSIBILITY_LABELS: Record<ResponsibilityType, string> = {
    rim: 'rim – Responsible Infrastructure Manager',
    pim: 'pim – Planning Infrastructure Manager',
    ra: 'ra – Responsible Applicant',
    rru: 'rru – Responsible RU',
    tru: 'tru – Traction RU',
    pru: 'pru – Personnel RU',
};

export function responsibilityTypeLabel(type: string): string {
    return RESPONSIBILITY_LABELS[type as ResponsibilityType] ?? type;
}

export function planStatusLabel(status: string): string {
    const labels: Record<PlanStatus, string> = {
        proposed: $localize`:@@planStatus.proposed:Proposed`,
        requested: $localize`:@@planStatus.requested:Requested`,
        confirmed: $localize`:@@planStatus.confirmed:Confirmed`,
        refused: $localize`:@@planStatus.refused:Refused`,
        dropped: $localize`:@@planStatus.dropped:Dropped`,
    };
    return labels[status as PlanStatus] ?? status;
}
