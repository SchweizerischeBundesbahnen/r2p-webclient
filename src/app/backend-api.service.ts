import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Branch, PartnerToken, Train, TrainListElement } from './shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class BackendApiService {
    private readonly httpClient = inject(HttpClient);

    public listTrains(): Observable<TrainListElement[]> {
        const headers = new HttpHeaders().set('Token', 'SBB');
        return this.httpClient
            .get<TrainListElement[]>('http://localhost:8080/v1/trains', {
                headers,
            })
            .pipe(tap((data) => console.log('Received train list:', data)));
    }

    public createTrain(
        name: string,
        operationalDay: Date,
        comment: string,
        token: PartnerToken,
    ): Observable<TrainListElement> {
        return this.httpClient.post<TrainListElement>(
            'http://localhost:8080/v1/trains',
            { ...minimalTrain, id: crypto.randomUUID(), name, startdate: operationalDay },
            {
                params: { comment },
                headers: { token },
            },
        );
    }

    createBranch(trainId: string, branchName: string, comment: string): Observable<Branch> {
        return this.httpClient.post<Branch>(
            'http://localhost:8080/v1/trains/' + trainId + '/branches',
            { ...minimalTrain, id: crypto.randomUUID() },
            {
                params: { branchName, comment },
                headers: new HttpHeaders().set('Token', 'SBB'),
            },
        );
    }

    getTrainById(trainId: string) {
        const headers = new HttpHeaders().set('Token', 'SBB');
        return this.httpClient
            .get<TrainListElement>('http://localhost:8080/v1/trains/' + trainId, {
                headers,
            })
            .pipe(tap((data) => console.log('Received train by id:', data)));
    }

    getTrainByVersion(version: string): Observable<Train> {
        const headers = new HttpHeaders().set('Token', 'SBB');
        return this.httpClient
            .get<Train>('http://localhost:8080/v1/trains/versions/' + version, {
                headers,
            })
            .pipe(tap((data) => console.log('Received train by version:', data)));
    }

    getByTrainIdAndBranchId(trainId: string, branchId: string): Observable<Branch> {
        return this.httpClient
            .get<Branch>('http://localhost:8080/v1/trains/' + trainId + '/branches/' + branchId, {
                params: { trainId, branchId },
                headers: new HttpHeaders().set('Token', 'SBB'),
            })
            .pipe(tap((data) => console.log('ReceivedgetByTrainIdAndBranchId:', data)));
    }

    updateTrain(
        trainId: string,
        train: Train,
        branchId: string,
        name: string,
        comment: string,
        operationalDay: Date,
    ): Observable<Train> {
        return this.httpClient.put<Train>(
            `http://localhost:8080/v1/trains/${trainId}/branches/${branchId}`,
            { ...train, name, startdate: operationalDay },
            {
                params: { comment },
                headers: new HttpHeaders().set('Token', 'SBB'),
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
    name: 'Zug 11062 Buchs Dällikon – Brugg AG',
    startdate: '2026-04-16',
    timestamp: '2026-03-12T12:00:00+01:00',
    journey: {
        featuresets: [],
        journeylocations: [
            {
                locations: [
                    {
                        type: 'PLC',
                        code: 'CH-3527',
                        name: 'Buchs Dällikon',
                    },
                ],
                activities: [
                    {
                        id: 'a1-01',
                        type: 'path.halt.11',
                        timings: [
                            {
                                type: 'earliestdeparture',
                                duration: 'PT8H30M',
                                focus: 'planning',
                            },
                        ],
                        responsibility: {
                            type: 'rim',
                            id: '0085',
                            status: 'confirmed',
                        },
                        relations: [],
                    },
                ],
            },
            {
                locations: [
                    {
                        type: 'PLC',
                        code: 'CH-309',
                        name: 'Brugg AG',
                    },
                ],
                activities: [
                    {
                        id: 'a2-01',
                        type: 'path.halt.11',
                        timings: [
                            {
                                type: 'arrival',
                                duration: 'PT4H2M',
                                focus: 'planning',
                            },
                        ],
                        responsibility: {
                            type: 'rim',
                            id: '0085',
                            status: 'confirmed',
                        },
                        relations: [],
                    },
                ],
            },
        ],
    },
};
