import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branch, Journey, Train, TrainListElement } from '../../shared/models/api.models';
import { assertIsoDate } from '../../shared/utils/date.utils';
import { SettingsService } from '../settings/settings.service';
import { minimalTrain } from './backend-api.fixtures';

export { minimalTrain };

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
        trainNumber: string,
        operationalDay: string,
        comment: string,
        journey: Journey,
    ): Observable<TrainListElement> {
        assertIsoDate(operationalDay);
        const headers = this.tokenHeaders;
        return this.httpClient.post<TrainListElement>(
            `${this.baseUrl}/v1/trains`,
            { ...minimalTrain, id: trainNumber, name: trainNumber, startdate: operationalDay, journey },
            {
                params: { comment },
                headers,
            },
        );
    }

    createBranch(trainId: string, branchName: string, comment: string, train: Train): Observable<Branch> {
        const headers = this.tokenHeaders;
        return this.httpClient.post<Branch>(
            `${this.baseUrl}/v1/trains/${trainId}/branches`,
            { ...train },
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

    deleteBranch(trainId: string, branchId: string, comment: string): Observable<Branch> {
        return this.httpClient.delete<Branch>(
            `${this.baseUrl}/v1/trains/${trainId}/branches/${branchId}`,
            { params: { comment }, headers: this.tokenHeaders },
        );
    }

    updateTrain(
        trainId: string,
        train: Train,
        branchId: string,
        trainNumber: string,
        comment: string,
        operationalDay: string,
    ): Observable<Train> {
        assertIsoDate(operationalDay);
        const headers = this.tokenHeaders;
        return this.httpClient.put<Train>(
            `${this.baseUrl}/v1/trains/${trainId}/branches/${branchId}`,
            { ...train, id: trainNumber, name: trainNumber, startdate: operationalDay },
            {
                params: { comment },
                headers,
            },
        );
    }
}
