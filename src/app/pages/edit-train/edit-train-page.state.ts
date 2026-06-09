import { inject, Injectable, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, Observable, switchMap, tap } from 'rxjs';
import { BackendApiService } from '../../backend-api.service';
import { Branch, Train } from '../../shared/models/api.models';
import { assertIsoDate } from '../../shared/utils/date.utils';
import { TrainFormModel } from '../../shared/components/train-details-form-card/train-details-form-card';

/**
 * Not provided in root, cause state should be destroyed after switching page.
 */
@Injectable()
export class EditTrainPageState {
    editTrainRunning = signal(false);
    readonly apiService = inject(BackendApiService);

    model = signal<TrainFormModel>({
        name: '',
        operationalDay: '',
        creationComment: '',
    });

    editTrainForm = form(this.model, (schemaPath) => {
        required(schemaPath.name, { message: 'Name is required' });
        required(schemaPath.operationalDay, { message: 'Operational Day is required' });
        required(schemaPath.creationComment, { message: 'Creation Comment is required' });
    });
    trainId = signal<string | undefined>(undefined);

    branchId = signal<string | undefined>(undefined);

    readonly branch = rxResource({
        params: () => {
            const trainId = this.trainId();
            const branchId = this.branchId();
            return trainId && branchId ? { trainId, branchId } : undefined;
        },
        stream: ({ params: { trainId, branchId } }): Observable<BranchAndTrain> =>
            this.apiService.getByTrainIdAndBranchId(trainId, branchId).pipe(
                tap((branch) => {
                    const {
                        business: { trainNumber, operationalDay },
                        technical: { comment },
                    } = branch;
                    this.editTrainForm.name().value.set(trainNumber);
                    assertIsoDate(operationalDay);
                    this.editTrainForm.operationalDay().value.set(operationalDay);
                    this.editTrainForm.creationComment().value.set(comment);
                }),
                switchMap((branch) =>
                    this.apiService
                        .getTrainByVersion(branch.technical.version)
                        .pipe(map((train) => ({ train, branch }))),
                ),
            ),
    });
}

export interface BranchAndTrain {
    branch: Branch;
    train: Train;
}
