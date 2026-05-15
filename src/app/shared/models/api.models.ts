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

export type PartnerToken = 'SBB' | 'BLS' | 'SOB';

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
    /** date, e.g. "2025-06-15" */
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

export interface Featureset {
    id: string;
    name?: string;
    features?: Feature[];
}

export interface Timing {
    type: string;
    duration?: string;
    focus?: string;
    source?: string;
}

export interface Responsibility {
    type: string;
    id?: string;
    status?: string;
}

export interface Alignment {
    status?: string;
}

export interface Staff {
    type: string;
    capabilityfeature?: CapabilityFeature;
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
    staffs?: Staff[];
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
    type?: string;
    timings?: Timing[];
    responsibility?: Responsibility;
    alignment?: Alignment;
    capability?: Capability;
    requirement?: Requirement;
    relations?: ActivityRelation[];
}

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
    featuresets?: Featureset[];
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

