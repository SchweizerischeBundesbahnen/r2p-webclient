const RESPONSIBILITY_LABELS: Record<string, string> = {
    rru: 'rru – Responsible RU',
    rp: 'rp – Resource Provider',
    ra: 'ra – Responsible Applicant',
    rim: 'rim – Responsible Infrastructure Manager',
    pim: 'pim – Planning Infrastructure Manager',
};

export function responsibilityTypeLabel(type: string): string {
    return RESPONSIBILITY_LABELS[type] ?? type;
}

export function planStatusLabel(status: string): string {
    switch (status) {
        case 'proposed':
            return $localize`:@@planStatus.proposed:Proposed`;
        case 'requested':
            return $localize`:@@planStatus.requested:Requested`;
        case 'confirmed':
            return $localize`:@@planStatus.confirmed:Confirmed`;
        case 'refused':
            return $localize`:@@planStatus.refused:Refused`;
        case 'dropped':
            return $localize`:@@planStatus.dropped:Dropped`;
        default:
            return status;
    }
}
