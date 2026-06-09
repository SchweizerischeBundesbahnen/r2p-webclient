import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branch, Journey, TimingType, Train, TrainListElement } from '../../shared/models/api.models';
import { assertIsoDate } from '../../shared/utils/date.utils';
import { SettingsService } from '../settings/settings.service';

@Injectable({ providedIn: 'root' })
export class BackendApiService {
    private readonly httpClient = inject(HttpClient);
    private readonly settingsService = inject(SettingsService);

    private get baseUrl(): string {
        return this.settingsService.settings().serverUrl;
    }

    private get tokenHeaders(): HttpHeaders {
        const org = this.settingsService.settings().organization;
        return new HttpHeaders().set('Token', org);
    }

    public listTrains(): Observable<TrainListElement[]> {
        const headers = this.tokenHeaders;
        return this.httpClient.get<TrainListElement[]>(`${this.baseUrl}/v1/trains`, {
            headers,
        });
    }

    public createTrain(
        name: string,
        operationalDay: string,
        comment: string,
        journey: Journey,
    ): Observable<TrainListElement> {
        assertIsoDate(operationalDay);
        const headers = this.tokenHeaders;
        return this.httpClient.post<TrainListElement>(
            `${this.baseUrl}/v1/trains`,
            { ...minimalTrain, id: crypto.randomUUID(), name, startdate: operationalDay, journey },
            {
                params: { comment },
                headers,
            },
        );
    }

    createBranch(trainId: string, branchName: string, comment: string): Observable<Branch> {
        const headers = this.tokenHeaders;
        return this.httpClient.post<Branch>(
            `${this.baseUrl}/v1/trains/${trainId}/branches`,
            { ...minimalTrain, id: crypto.randomUUID() },
            {
                params: { branchName, comment },
                headers,
            },
        );
    }

    getTrainById(trainId: string) {
        const headers = this.tokenHeaders;
        return this.httpClient.get<TrainListElement>(`${this.baseUrl}/v1/trains/${trainId}`, {
            headers,
        });
    }

    getTrainByVersion(version: string): Observable<Train> {
        const headers = this.tokenHeaders;
        return this.httpClient.get<Train>(`${this.baseUrl}/v1/trains/versions/${version}`, {
            headers,
        });
    }

    getByTrainIdAndBranchId(trainId: string, branchId: string): Observable<Branch> {
        const headers = this.tokenHeaders;
        return this.httpClient.get<Branch>(
            `${this.baseUrl}/v1/trains/${trainId}/branches/${branchId}`,
            {
                params: { trainId, branchId },
                headers,
            },
        );
    }

    shareTrain(trainId: string, shareWith: string, comment: string): Observable<TrainListElement> {
        return this.httpClient.post<TrainListElement>(
            `${this.baseUrl}/v1/trains/${trainId}/share`,
            null,
            { params: { shareWith, comment }, headers: this.tokenHeaders },
        );
    }

    requestMerge(trainId: string, branchId: string, comment: string): Observable<Branch> {
        return this.httpClient.post<Branch>(
            `${this.baseUrl}/v1/trains/${trainId}/branches/${branchId}/requestMerge`,
            null,
            { params: { comment }, headers: this.tokenHeaders },
        );
    }

    merge(trainId: string, branchId: string, reviewedVersion: string, comment: string): Observable<TrainListElement> {
        return this.httpClient.post<TrainListElement>(
            `${this.baseUrl}/v1/trains/${trainId}/branches/${branchId}/merge`,
            null,
            { params: { reviewedVersion, comment }, headers: this.tokenHeaders },
        );
    }

    rejectMerge(trainId: string, branchId: string, comment: string): Observable<Branch> {
        return this.httpClient.post<Branch>(
            `${this.baseUrl}/v1/trains/${trainId}/branches/${branchId}/rejectMerge`,
            null,
            { params: { comment }, headers: this.tokenHeaders },
        );
    }

    updateTrain(
        trainId: string,
        train: Train,
        branchId: string,
        name: string,
        comment: string,
        operationalDay: string,
    ): Observable<Train> {
        assertIsoDate(operationalDay);
        const headers = this.tokenHeaders;
        return this.httpClient.put<Train>(
            `${this.baseUrl}/v1/trains/${trainId}/branches/${branchId}`,
            { ...train, name, startdate: operationalDay },
            {
                params: { comment },
                headers,
            },
        );
    }
}

export const minimalTrain: Train = {
    id: '72',
    references: [
        {
            type: 'tttReferenceTrain',
            name: 'TR2185990010000000000021',
        },
    ],
    links: [],
    name: 'Zug 1234 Zürich HB – Bern',
    startdate: '2026-04-16',
    timestamp: '2026-03-12T12:00:00+01:00',
    journey: {
        featuresets: [],
        journeylocations: [
            {
                locations: [
                    {
                        type: 'PLC',
                        code: 'CH-8503000',
                        name: 'Zürich HB',
                    },
                ],
                activities: [
                    {
                        id: 'a1-01',
                        type: 'path.halt.11',
                        timings: [
                            {
                                type: TimingType.Departure,
                                duration: 'PT8H12M',
                                focus: 'planning',
                            },
                        ],
                        responsibility: {
                            type: 'rim',
                            id: '0085',
                            status: 'confirmed',
                        },
                        capability: {
                            type: 'path',
                            path: {
                                id: 'a1-01-002',
                                length: 1500,
                                weight: 3500,
                                maxSpeed: 250,
                            },
                            capabilityFeatures: [],
                        },
                        relations: [],
                    },
                    {
                        id: 'a1-02',
                        type: 'rollingStock',
                        timings: [],
                        responsibility: {
                            type: 'rim',
                            id: '0085',
                            status: 'confirmed',
                        },
                        capability: {
                            type: 'rollingStock',
                            capabilityFeatures: [],
                            featuresetRefs: [],
                            rollingStock: {
                                weight: 2868000,
                                length: 438000,
                                maxSpeed: 100,
                                brakingRatio: 70,
                                brakeType: 'G',
                                units: [
                                    {
                                        id: 'u1-loco-1',
                                        carbodies: [
                                            {
                                                type: '6185',
                                                vehiclenumber: '918061850020',
                                                weight: 84000,
                                                length: 18900,
                                                traction: 'electric',
                                                capabilityFeatures: [],
                                            },
                                        ],
                                        capabilityFeatures: [],
                                        featuresetRefs: [],
                                    },
                                    {
                                        id: 'u1-loco-2',
                                        carbodies: [
                                            {
                                                type: '6185',
                                                vehiclenumber: '918061850037',
                                                weight: 84000,
                                                length: 18900,
                                                traction: 'electric',
                                                capabilityFeatures: [],
                                            },
                                        ],
                                        capabilityFeatures: [],
                                        featuresetRefs: [],
                                    },
                                    {
                                        id: 'u1-wagons',
                                        wagoncount: 10,
                                        weight: 2700000,
                                        length: 400000,
                                        carbodies: [],
                                        capabilityFeatures: [],
                                        featuresetRefs: [],
                                    },
                                ],
                            },
                        },
                        relations: [],
                    },
                    {
                        id: 'a1-03',
                        type: 'rollingStock.traction',
                        timings: [
                            {
                                type: TimingType.Departure,
                                duration: 'PT8H12M',
                                focus: 'planning',
                            },
                        ],
                        responsibility: {
                            type: 'pru',
                            id: '2185',
                            status: 'confirmed',
                        },
                        capability: {
                            type: 'staff',
                            capabilityFeatures: [],
                            featuresetRefs: [],
                            staffs: [
                                {
                                    type: 'driver',
                                },
                            ],
                        },
                        relations: [],
                    },
                ],
            },
            {
                locations: [
                    {
                        type: 'PLC',
                        code: 'CH-8502204',
                        name: 'Lenzburg',
                    },
                ],
                activities: [
                    {
                        id: 'a2-01',
                        type: 'path.halt.11',
                        timings: [
                            {
                                type: TimingType.Arrival,
                                duration: 'PT8H25M',
                                focus: 'planning',
                            },
                            {
                                type: TimingType.Departure,
                                duration: 'PT8H27M',
                                focus: 'planning',
                            },
                        ],
                        responsibility: {
                            type: 'rim',
                            id: '0085',
                            status: 'confirmed',
                        },
                        capability: {
                            type: 'path',
                            capabilityFeatures: [],
                            path: {
                                id: 'a2-01-001',
                                length: 1500,
                                weight: 3500,
                                maxSpeed: 250,
                            },
                        },
                        relations: [],
                    },
                ],
            },
            {
                locations: [
                    {
                        type: 'PLC',
                        code: 'CH-8502113',
                        name: 'Aarau',
                    },
                ],
                activities: [
                    {
                        id: 'a3-01',
                        type: 'path.halt.11',
                        timings: [
                            {
                                type: TimingType.Arrival,
                                duration: 'PT8H35M',
                                focus: 'planning',
                            },
                            {
                                type: TimingType.EarliestDeparture,
                                duration: 'PT8H37M',
                                focus: 'planning',
                            },
                        ],
                        responsibility: {
                            type: 'rim',
                            id: '0085',
                            status: 'confirmed',
                        },
                        capability: {
                            type: 'path',
                            capabilityFeatures: [],
                            path: {
                                id: 'a3-01-001',
                                length: 1500,
                                weight: 3500,
                                maxSpeed: 250,
                            },
                        },
                        relations: [],
                    },
                    {
                        id: 'a3-02',
                        type: 'rollingStock',
                        timings: [],
                        responsibility: {
                            type: 'rim',
                            id: '0085',
                            status: 'confirmed',
                        },
                        capability: {
                            type: 'rollingStock',
                            capabilityFeatures: [],
                            featuresetRefs: [],
                            rollingStock: {
                                weight: 1284000,
                                length: 415400,
                                maxSpeed: 100,
                                brakingRatio: 76,
                                brakeType: 'R',
                                brakeWeight: 292000,
                                units: [
                                    {
                                        id: 'u2-loco-1',
                                        carbodies: [
                                            {
                                                type: '4601',
                                                vehiclenumber: '948046010012',
                                                weight: 80000,
                                                length: 18500,
                                                traction: 'electric',
                                                capabilityFeatures: [],
                                            },
                                        ],
                                        capabilityFeatures: [],
                                        featuresetRefs: [],
                                    },
                                    {
                                        id: 'u2-wagons',
                                        wagoncount: 8,
                                        weight: 1204000,
                                        length: 396900,
                                        carbodies: [],
                                        capabilityFeatures: [],
                                        featuresetRefs: [],
                                    },
                                ],
                            },
                        },
                        relations: [],
                    },
                ],
            },
            {
                locations: [
                    {
                        type: 'PLC',
                        code: 'CH-8500218',
                        name: 'Olten',
                    },
                ],
                activities: [
                    {
                        id: 'a4-01',
                        type: 'path.halt.11',
                        timings: [
                            {
                                type: TimingType.Arrival,
                                duration: 'PT8H48M',
                                focus: 'planning',
                            },
                            {
                                type: TimingType.EarliestDeparture,
                                duration: 'PT8H50M',
                                focus: 'planning',
                            },
                        ],
                        responsibility: {
                            type: 'rim',
                            id: '0085',
                            status: 'confirmed',
                        },
                        capability: {
                            type: 'path',
                            capabilityFeatures: [],
                            path: {
                                id: 'a4-01-001',
                                length: 1500,
                                weight: 3500,
                                maxSpeed: 250,
                            },
                        },
                        relations: [],
                    },
                ],
            },
            {
                locations: [
                    {
                        type: 'PLC',
                        code: 'CH-8507000',
                        name: 'Bern',
                    },
                ],
                activities: [
                    {
                        id: 'a5-01',
                        type: 'path.halt.11',
                        timings: [
                            {
                                type: TimingType.Arrival,
                                duration: 'PT9H16M',
                                focus: 'planning',
                            },
                        ],
                        responsibility: {
                            type: 'rim',
                            id: '0085',
                            status: 'confirmed',
                        },
                        capability: {
                            type: 'path',
                            capabilityFeatures: [],
                            path: {
                                id: 'a5-01-001',
                                length: 1500,
                                weight: 3500,
                                maxSpeed: 250,
                            },
                        },
                        relations: [],
                    },
                    {
                        id: 'a5-02',
                        type: 'rollingStock.traction',
                        timings: [
                            {
                                type: TimingType.Arrival,
                                duration: 'PT9H16M',
                                focus: 'planning',
                            },
                        ],
                        responsibility: {
                            type: 'pru',
                            id: '2185',
                            status: 'confirmed',
                        },
                        capability: {
                            type: 'staff',
                            capabilityFeatures: [],
                            featuresetRefs: [],
                            staffs: [
                                {
                                    type: 'driver',
                                },
                            ],
                        },
                        relations: [],
                    },
                ],
            },
        ],
    },
};
