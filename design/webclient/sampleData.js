/**
 * R2P Web Client - Sample Data for Design Mockups
 * Mirrors the real domain model from the R2P backend.
 */

const PARTNERS = ['SBB', 'BLS', 'SOB'];
const ALL_PLAN_STATUSES = ['proposed', 'requested', 'confirmed', 'dropped', 'refused'];
const BRANCH_STATES = { OPEN: 'OPEN', MERGED: 'MERGED', DELETED: 'DELETED', MERGE_REQUESTED: 'MERGE_REQUESTED' };

/* ── Sample Train Payloads (Train schema) ─────────────────────── */

const trainPayloadIC1234 = {
    id: "train-ic1234",
    name: "IC 1234 Zürich–Basel",
    startdate: "2025-06-15",
    timestamp: "2025-04-10T08:30:00Z",
    references: [],
    links: [],
    journey: {
        journeylocations: [
            {
                locations: [{ type: "SLC", code: "8503000", name: "Zürich HB" }],
                activities: [
                    {
                        type: "journey",
                        timings: [
                            { type: "departure", time: "08:00:00", offset: 0, focus: "planning" }
                        ],
                        responsibility: { type: "rru", id: "SBB", status: "confirmed" }
                    }
                ],
                requirements: []
            },
            {
                locations: [{ type: "SLC", code: "8500218", name: "Baden" }],
                activities: [
                    {
                        type: "train.halt.1",
                        timings: [
                            { type: "arrival", time: "08:18:00", offset: 0, focus: "planning" },
                            { type: "departure", time: "08:20:00", offset: 0, focus: "planning" }
                        ],
                        responsibility: { type: "rru", id: "SBB", status: "confirmed" }
                    },
                    {
                        type: "rollingStock",
                        timings: [],
                        responsibility: { type: "rp", id: "BLS", status: "proposed" },
                        capability: {
                            localOnly: false,
                            features: [],
                            rollingStock: { weight: 420000, length: 200000, maxSpeed: 200 }
                        }
                    },
                    {
                        type: "pathRequest",
                        timings: [
                            { type: "arrival", time: "08:18:00", offset: 0, focus: "planning" },
                            { type: "departure", time: "08:20:00", offset: 0, focus: "planning" }
                        ],
                        responsibility: { type: "rim", id: "SBB", status: "confirmed" }
                    }
                ],
                requirements: []
            },
            {
                locations: [{ type: "SLC", code: "8500010", name: "Basel SBB" }],
                activities: [
                    {
                        type: "journey",
                        timings: [
                            { type: "arrival", time: "08:55:00", offset: 0, focus: "planning" }
                        ],
                        responsibility: { type: "rru", id: "SBB", status: "confirmed" }
                    }
                ],
                requirements: []
            }
        ]
    }
};

const trainPayloadRE4711 = {
    id: "train-re4711",
    name: "RE 4711 Bern–Thun",
    startdate: "2025-06-15",
    timestamp: "2025-04-09T14:00:00Z",
    references: [],
    links: [],
    journey: {
        journeylocations: [
            {
                locations: [{ type: "SLC", code: "8507000", name: "Bern" }],
                activities: [
                    {
                        type: "journey",
                        timings: [{ type: "departure", time: "09:00:00", offset: 0, focus: "planning" }],
                        responsibility: { type: "rru", id: "BLS", status: "confirmed" }
                    },
                    {
                        type: "rollingStock",
                        timings: [],
                        responsibility: { type: "rp", id: "BLS", status: "confirmed" },
                        capability: {
                            localOnly: false,
                            features: [],
                            rollingStock: { weight: 280000, length: 150000, maxSpeed: 160 }
                        }
                    }
                ],
                requirements: []
            },
            {
                locations: [{ type: "SLC", code: "8500218", name: "Münsingen" }],
                activities: [
                    {
                        type: "train.halt.1",
                        timings: [
                            { type: "arrival", time: "09:17:00", offset: 0, focus: "planning" },
                            { type: "departure", time: "09:18:00", offset: 0, focus: "planning" }
                        ],
                        responsibility: { type: "rru", id: "BLS", status: "requested" }
                    },
                    {
                        type: "pathRequest",
                        timings: [
                            { type: "arrival", time: "09:17:00", offset: 0, focus: "planning" },
                            { type: "departure", time: "09:18:00", offset: 0, focus: "planning" }
                        ],
                        responsibility: { type: "rim", id: "BLS", status: "confirmed" }
                    }
                ],
                requirements: []
            },
            {
                locations: [{ type: "SLC", code: "8500200", name: "Thun" }],
                activities: [
                    {
                        type: "journey",
                        timings: [{ type: "arrival", time: "09:32:00", offset: 0, focus: "planning" }],
                        responsibility: { type: "rru", id: "BLS", status: "confirmed" }
                    }
                ],
                requirements: []
            }
        ]
    }
};

const trainPayloadS2050 = {
    id: "train-s2050",
    name: "S 2050 St. Gallen–Romanshorn",
    startdate: "2025-06-16",
    timestamp: "2025-04-08T11:00:00Z",
    references: [],
    links: [],
    journey: {
        journeylocations: [
            {
                locations: [{ type: "SLC", code: "8506302", name: "St. Gallen" }],
                activities: [
                    {
                        type: "journey",
                        timings: [{ type: "departure", time: "07:05:00", offset: 0, focus: "planning" }],
                        responsibility: { type: "rru", id: "SOB", status: "confirmed" }
                    },
                    {
                        type: "rollingStock",
                        timings: [],
                        responsibility: { type: "rp", id: "SOB", status: "confirmed" },
                        capability: {
                            localOnly: false,
                            features: [],
                            rollingStock: { weight: 180000, length: 100000, maxSpeed: 140 }
                        }
                    }
                ],
                requirements: []
            },
            {
                locations: [{ type: "SLC", code: "8506202", name: "Arbon" }],
                activities: [
                    {
                        type: "train.halt.1",
                        timings: [
                            { type: "arrival", time: "07:28:00", offset: 0, focus: "planning" },
                            { type: "departure", time: "07:29:00", offset: 0, focus: "planning" }
                        ],
                        responsibility: { type: "rru", id: "SOB", status: "refused" }
                    },
                    {
                        type: "pathRequest",
                        timings: [
                            { type: "arrival", time: "07:28:00", offset: 0, focus: "planning" },
                            { type: "departure", time: "07:29:00", offset: 0, focus: "planning" }
                        ],
                        responsibility: { type: "rim", id: "SOB", status: "refused" }
                    }
                ],
                requirements: []
            },
            {
                locations: [{ type: "SLC", code: "8506207", name: "Romanshorn" }],
                activities: [
                    {
                        type: "journey",
                        timings: [{ type: "arrival", time: "07:45:00", offset: 0, focus: "planning" }],
                        responsibility: { type: "rru", id: "SOB", status: "confirmed" }
                    }
                ],
                requirements: []
            }
        ]
    }
};

const trainPayloadIR2275 = {
    id: "train-ir2275",
    name: "IR 2275 Zürich–Chur",
    startdate: "2025-06-15",
    timestamp: "2025-04-14T07:00:00Z",
    references: [],
    links: [],
    journey: {
        journeylocations: [
            {
                locations: [{ type: "SLC", code: "8503000", name: "Zürich HB" }],
                activities: [
                    {
                        type: "journey",
                        timings: [{ type: "departure", time: "10:03:00", offset: 0, focus: "planning" }],
                        responsibility: { type: "rru", id: "SBB", status: "confirmed" }
                    },
                    {
                        type: "rollingStock",
                        timings: [],
                        responsibility: { type: "rp", id: "SBB", status: "confirmed" },
                        capability: {
                            localOnly: false,
                            features: [],
                            rollingStock: { weight: 380000, length: 190000, maxSpeed: 200 }
                        }
                    }
                ],
                requirements: []
            },
            {
                locations: [{ type: "SLC", code: "8509000", name: "Sargans" }],
                activities: [
                    {
                        type: "train.halt.1",
                        timings: [
                            { type: "arrival", time: "10:58:00", offset: 0, focus: "planning" },
                            { type: "departure", time: "11:00:00", offset: 0, focus: "planning" }
                        ],
                        responsibility: { type: "rru", id: "SBB", status: "confirmed" }
                    },
                    {
                        type: "pathRequest",
                        timings: [
                            { type: "arrival", time: "10:58:00", offset: 0, focus: "planning" },
                            { type: "departure", time: "11:00:00", offset: 0, focus: "planning" }
                        ],
                        responsibility: { type: "rim", id: "SBB", status: "confirmed" }
                    }
                ],
                requirements: []
            },
            {
                locations: [{ type: "SLC", code: "8509990", name: "Chur" }],
                activities: [
                    {
                        type: "journey",
                        timings: [{ type: "arrival", time: "11:20:00", offset: 0, focus: "planning" }],
                        responsibility: { type: "rru", id: "SBB", status: "confirmed" }
                    }
                ],
                requirements: []
            }
        ]
    }
};

const branchesIR2275 = [
    {
        branchId: "br-ir2275-main",
        trainId: "tid-2275",
        branchName: "main",
        business: { trainNumber: "IR 2275", operationalDay: "2025-06-15" },
        technical: { version: "v-030", timestamp: "2025-04-14T07:00:00Z", comment: "Initial creation", owner: "SBB", state: "OPEN" }
    }
];



const branchesIC1234 = [
    {
        branchId: "br-ic1234-main",
        trainId: "tid-1234",
        branchName: "main",
        business: { trainNumber: "IC 1234", operationalDay: "2025-06-15" },
        technical: { version: "v-001", timestamp: "2025-04-10T08:30:00Z", comment: "Initial creation", owner: "SBB", state: "OPEN" }
    },
    {
        branchId: "br-ic1234-bls",
        trainId: "tid-1234",
        branchName: "bls/rolling-stock-update",
        business: { trainNumber: "IC 1234", operationalDay: "2025-06-15" },
        technical: { version: "v-002", timestamp: "2025-04-11T10:00:00Z", comment: "Propose updated rolling stock at Baden", owner: "BLS", state: "MERGE_REQUESTED" }
    },
    {
        branchId: "br-ic1234-sbb-timing",
        trainId: "tid-1234",
        branchName: "sbb/adjust-timing",
        business: { trainNumber: "IC 1234", operationalDay: "2025-06-15" },
        technical: { version: "v-003", timestamp: "2025-04-12T09:15:00Z", comment: "Adjust departure time by 2 min", owner: "SBB", state: "OPEN" }
    }
];

const branchesRE4711 = [
    {
        branchId: "br-re4711-main",
        trainId: "tid-4711",
        branchName: "main",
        business: { trainNumber: "RE 4711", operationalDay: "2025-06-15" },
        technical: { version: "v-010", timestamp: "2025-04-09T14:00:00Z", comment: "Initial", owner: "BLS", state: "OPEN" }
    },
    {
        branchId: "br-re4711-sob",
        trainId: "tid-4711",
        branchName: "sob/staff-addition",
        business: { trainNumber: "RE 4711", operationalDay: "2025-06-15" },
        technical: { version: "v-011", timestamp: "2025-04-12T16:30:00Z", comment: "Add staff at Münsingen", owner: "SOB", state: "OPEN" }
    }
];

const branchesS2050 = [
    {
        branchId: "br-s2050-main",
        trainId: "tid-2050",
        branchName: "main",
        business: { trainNumber: "S 2050", operationalDay: "2025-06-16" },
        technical: { version: "v-020", timestamp: "2025-04-08T11:00:00Z", comment: "Initial creation", owner: "SOB", state: "OPEN" }
    },
    {
        branchId: "br-s2050-sbb",
        trainId: "tid-2050",
        branchName: "sbb/route-extension",
        business: { trainNumber: "S 2050", operationalDay: "2025-06-16" },
        technical: { version: "v-021", timestamp: "2025-04-13T07:00:00Z", comment: "Propose route extension to Kreuzlingen", owner: "SBB", state: "MERGED" }
    }
];

/* ── Train List Elements (as returned by GET /v1/trains) ────────── */

const sampleTrains = [
    {
        trainId: "tid-1234",
        mainTimestamp: "2025-04-10T08:30:00Z",
        partners: ["SBB", "BLS"],
        branches: branchesIC1234,
        mainPayload: trainPayloadIC1234
    },
    {
        trainId: "tid-4711",
        mainTimestamp: "2025-04-09T14:00:00Z",
        partners: ["BLS", "SOB"],
        branches: branchesRE4711,
        mainPayload: trainPayloadRE4711
    },
    {
        trainId: "tid-2050",
        mainTimestamp: "2025-04-08T11:00:00Z",
        partners: ["SBB", "BLS", "SOB"],
        branches: branchesS2050,
        mainPayload: trainPayloadS2050
    },
    {
        trainId: "tid-2275",
        mainTimestamp: "2025-04-14T07:00:00Z",
        partners: ["SBB", "SOB"],
        branches: branchesIR2275,
        mainPayload: trainPayloadIR2275
    }
];

/* ── Helpers ─────────────────────────────────────────────────────── */

/**
 * Get the overall traffic-light status for a train's main branch payload.
 * Green  = all responsibilities confirmed
 * Yellow = at least one proposed or requested (no red)
 * Red    = at least one dropped or refused
 */
function getTrafficLightStatus(trainPayload) {
    const statuses = [];
    for (const jl of trainPayload.journey.journeylocations) {
        for (const act of jl.activities) {
            statuses.push(act.responsibility.status);
        }
    }
    if (statuses.some(s => s === 'dropped' || s === 'refused')) return 'red';
    if (statuses.some(s => s === 'proposed' || s === 'requested')) return 'yellow';
    return 'green';
}

/**
 * Get origin and destination stop names and times from train payload.
 */
function getOriginDestination(trainPayload) {
    const locs = trainPayload.journey.journeylocations;
    const firstLoc = locs[0];
    const lastLoc = locs[locs.length - 1];

    const depTime = firstLoc?.activities
        .flatMap(a => a.timings ?? [])
        .find(t => t.type === 'departure')?.time;
    const arrTime = lastLoc?.activities
        .flatMap(a => a.timings ?? [])
        .find(t => t.type === 'arrival')?.time;

    return {
        from: firstLoc?.locations[0]?.name ?? '–',
        to: lastLoc?.locations[0]?.name ?? '–',
        depTime: depTime ? depTime.slice(0, 5) : null,
        arrTime: arrTime ? arrTime.slice(0, 5) : null
    };
}

/**
 * Get plan status color class (green / yellow / red).
 */
function planStatusColorClass(status) {
    if (status === 'confirmed') return 'status-dot-green';
    if (status === 'proposed' || status === 'requested') return 'status-dot-yellow';
    return 'status-dot-red';
}

/**
 * Classify an activity into column type: 'rs' | 'staff' | 'plan'
 */
function activityColumnType(actType) {
    if (actType === 'rollingStock' || actType === 'wagons' || actType === 'formation' || actType === 'traction') return 'rs';
    if (actType === 'journey' || actType === 'train.runthrough' || actType === 'commercial' ||
        actType.startsWith('train.halt')) return 'staff';
    return 'plan';
}

/**
 * Format date-time string to locale date.
 */
function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString('en-CH', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    });
}

/**
 * Format date-time string to locale date+time.
 */
function formatDateTime(isoString) {
    return new Date(isoString).toLocaleString('en-CH', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}

/**
 * Get main branch from branches array.
 */
function getMainBranch(branches) {
    return branches.find(b => b.branchName === 'main');
}

/**
 * Render a partner badge HTML string.
 */
function partnerBadgeHtml(partner) {
    const cls = PARTNERS.includes(partner) ? `partner-badge-${partner}` : 'partner-badge-default';
    return `<span class="partner-badge ${cls}">${partner}</span>`;
}

/**
 * Render a traffic light HTML string.
 */
function trafficLightHtml(status) {
    return `<span class="traffic-light tl-${status}"><span class="tl-dot"></span></span>`;
}

/* ── Settings (localStorage mock) ──────────────────────────────── */
const defaultSettings = {
    serverUrl: 'http://localhost:8080',
    partner: 'SBB'
};

/* ── Language Switcher ──────────────────────────────────────────── */
/**
 * Toggles the active state of the language switcher buttons.
 * No actual translation is performed – this is a pure UI visualisation.
 * @param {string} lang - Language code, e.g. 'en' or 'de'
 * @param {HTMLElement} clickedBtn - The button element that was clicked
 */
function setLang(lang, clickedBtn) {
    const switcher = clickedBtn.closest('.lang-switcher');
    if (!switcher) return;
    switcher.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
}


