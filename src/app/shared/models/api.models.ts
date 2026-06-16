/**
 * Auto-generated TypeScript interfaces based on the OpenAPI schema definition.
 */

export type BranchState = 'open' | 'merge_requested' | 'merged' | 'deleted';

export type MergeAction = 'merge_requested' | 'merge_rejected' | 'merged';

export type Action =
    | 'created'
    | 'updated'
    | 'merge_requested'
    | 'merge_rejected'
    | 'merged'
    | 'deleted'
    | 'shared'
    | 'unshared';

export type PartnerToken = 'SBB' | 'BLS' | 'SOB' | 'TI' | 'DBF' | 'DBC' | 'DBCNL' | 'SBBC' | 'SBBCI' | 'RCA' | 'MEV';

export interface TrainListElement {
    /** UUID */
    trainId: string;
    /** date-time */
    mainTimestamp: string;
    partners?: string[];
    branches: Branch[];
}

export interface Branch {
    /** UUID */
    branchId: string;
    /** max. 255 characters, e.g. "SBB-main" */
    branchName: string;
    business: BranchBusinessData;
    technical: BranchTechnicalData;
}

export interface BranchBusinessData {
    /** e.g. "IC 1234" */
    trainNumber: string;
    /** ISO date string, e.g. "2025-06-15" */
    operationalDay: string;
}

export interface BranchTechnicalData {
    /** e.g. "SOB" */
    owner?: string;
    /** UUID */
    version: string;
    branchState: BranchState;
    /** date-time */
    timestamp: string;
    comment: string;
    /** Indicates whether this branch is the main branch of the train */
    mainBranch: boolean;
}

export interface Change {
    action: Action;
    /** Partner that has performed this action */
    partner: string;
    /** Partner that is affected by this action (e.g. sharing or unsharing) */
    affectedPartner?: string;
    /** UUID */
    trainId: string;
    /** UUID */
    branchId?: string;
    /** max. 255 characters, e.g. "SBB-main" */
    branchName?: string;
    /** UUID */
    version?: string;
    /** date-time */
    timestamp: string;
    comment: string;
}

// ── Train Request Body ──────────────────────────────────────────────────────

export type ReferenceType =
    | 'tttReferenceTrain'
    | 'tttRoute'
    | 'tttTrain'
    | 'tttPath'
    | 'tttPathRequest'
    | 'tttCaseReference'
    | 'fpsPath'
    | 'fpsDebic'
    | 'plannedTrainNumber'
    | 'commercialTrainNumber'
    | 'infrastructureTrainNumber'
    | 'operationalTrainNumber';

export interface Reference {
    type: ReferenceType;
    /** date, e.g. "2026-05-14" */
    startdate?: string;
    /** e.g. "TR2185900000127853012025" */
    name: string;
}

export type LinkType = 'link' | 'doc';

export interface Link {
    type: LinkType;
    name: string;
    notes?: string;
}

export interface Feature {
    type: string;
    offeredservice?: string;
    capacity?: string;
}

export interface Restriction {
    type: string;
    restrictedvalue?: number;
    creator?: string;
    creationtime?: string;
    starttime?: string;
    endtime?: string;
    freetext?: string;
    resolution?: string;
    resolutiontime?: string;
}

export interface CapabilityFeature {
    feature: Feature;
    restriction?: Restriction;
}

export enum TimingType {
    EarliestArrival = 'earliestarrival',
    LatestArrival = 'latestarrival',
    EarliestDeparture = 'earliestdeparture',
    LatestDeparture = 'latestdeparture',
    RunThrough = 'runthrough',
    DwellTime = 'dwelltime',
    Departure = 'departure',
    Arrival = 'arrival',
}

export const DEPARTURE_TIMING_TYPES = new Set<TimingType>([
    TimingType.Departure,
    TimingType.EarliestDeparture,
    TimingType.LatestDeparture,
]);

export const ARRIVAL_TIMING_TYPES = new Set<TimingType>([
    TimingType.Arrival,
    TimingType.EarliestArrival,
    TimingType.LatestArrival,
]);

export interface Timing {
    type: TimingType;
    duration?: string;
    focus?: string;
    source?: string;
}

export type ResponsibilityType = 'rim' | 'pim' | 'ra' | 'rru' | 'tru' | 'pru';
export type PlanStatus = 'proposed' | 'requested' | 'confirmed' | 'refused' | 'dropped';

export interface Responsibility {
    type: ResponsibilityType;
    id?: string;
    status?: PlanStatus;
}

export interface Alignment {
    status?: string;
}

export type PathActivityType =
    | 'path.halt.1'
    | 'path.halt.11'
    | 'path.halt.14'
    | 'path.halt.15'
    | 'path.halt.16'
    | 'path.halt.18'
    | 'path.halt.19'
    | 'path.halt.22'
    | 'path.halt.28'
    | 'path.halt.32'
    | 'path.halt.33'
    | 'path.halt.41'
    | 'path.halt.44'
    | 'path.halt.45'
    | 'path.halt.46'
    | 'path.halt.51'
    | 'path.halt.54'
    | 'path.halt.55'
    | 'path.halt.56'
    | 'path.halt.70'
    | 'path.halt.73'
    | 'path.halt.74'
    | 'path.halt.75'
    | 'path.halt.76'
    | 'path.halt.77'
    | 'path.halt.78'
    | 'path.halt.79'
    | 'path.halt.80'
    | 'path.halt.81'
    | 'path.halt.82'
    | 'path.halt.83'
    | 'path.halt.84'
    | 'path.halt.88'
    | 'path.halt.90'
    | 'path.halt.91'
    | 'path.halt.92'
    | 'path.halt.93'
    | 'path.halt.94'
    | 'path.halt.95'
    | 'path.runthrough';

export type RollingStockActivityType = 'rollingStock' | 'rollingStock.traction' | 'rollingStock.wagons';

export type StaffActivityType =
    | 'rc.off'
    | 'rc.on'
    | 'inspect.train.technical'
    | 'inspect.train.technical.rc'
    | 'inspect.train.operational'
    | 'inspect.train.operational.rc'
    | 'shunting'
    | 'shunting.rc'
    | 'move'
    | 'move.rc';

export interface Staff {
    type: string;
    activityType: StaffActivityType;
}

export interface Carbody {
    position?: number;
    type?: string;
    length?: number;
    weight?: number;
    traction?: string;
    vehiclenumber?: string;
    frontcoupling?: string;
    backcoupling?: string;
    profile?: string;
    capabilityFeatures?: CapabilityFeature[];
}

export interface RollingStockUnit {
    id?: string;
    name?: string;
    length?: number;
    weight?: number;
    profile?: string;
    wagoncount?: number;
    carbodies?: Carbody[];
    capabilityFeatures?: CapabilityFeature[];
    featuresetRefs?: string[];
}

export interface RollingStock {
    activityType: RollingStockActivityType;
    length?: number;
    weight?: number;
    maxSpeed?: number;
    brakeType?: string;
    brakeWeight?: number;
    brakingRatio?: number;
    units?: RollingStockUnit[];
}

export interface Path {
    id?: string;
    activityType: PathActivityType;
    length?: number;
    weight?: number;
    maxSpeed?: number;
    trainCategory?: string;
    routeClass?: string;
}

export interface Stabling {
    length?: number;
}

export interface Capability {
    type?: string;
    featuresetRefs?: string[];
    capabilityFeatures?: CapabilityFeature[];
    staff?: Staff;
    rollingStock?: RollingStock;
    path?: Path;
    stabling?: Stabling;
}

export interface RequirementFeature {
    feature: Feature;
    condition?: {
        conditiontype?: string;
        comparetype?: string;
        reference?: string;
        mandatory?: boolean;
    };
}

export interface Requirement {
    requirementFeatures?: RequirementFeature[];
}

export interface ActivityRelation {
    activityid?: string;
    reference?: Reference;
    type?: string;
    focus?: string;
    lag?: string;
}

export interface Activity {
    id?: string;
    timings?: Timing[];
    responsibility?: Responsibility;
    alignment?: Alignment;
    capability?: Capability;
    requirement?: Requirement;
    relations?: ActivityRelation[];
}

export type LocationType = 'PLC' | 'SLC' | 'DIUM' | 'UIC';
export const LOCATION_TYPES: LocationType[] = ['PLC', 'SLC', 'DIUM', 'UIC'];

export interface Location {
    type?: string;
    typeCode?: string;
    code?: string;
    name?: string;
}

export interface JourneyLocation {
    locations?: Location[];
    activities?: Activity[];
    requirement?: Requirement;
}

export interface Journey {
    journeylocations?: JourneyLocation[];
}

export interface Train {
    id?: string;
    references?: Reference[];
    links?: Link[];
    name?: string;
    /** date, e.g. "2026-05-14" */
    startdate?: string;
    weekday?: string;
    /** date-time */
    timestamp?: string;
    journey?: Journey;
}

export interface InstanceOwner {
    name: string;
}

/** RFC 7807 Problem Details */
export interface ProblemDetail {
    /** A URI reference that identifies the problem type */
    type?: string;
    /** Short, human-readable summary of the problem type */
    title: string;
    /** HTTP status code (100–599) */
    status: number;
    /** Human-readable explanation specific to this occurrence */
    detail?: string;
    /** A URI reference that identifies the specific occurrence */
    instance?: string;
}

