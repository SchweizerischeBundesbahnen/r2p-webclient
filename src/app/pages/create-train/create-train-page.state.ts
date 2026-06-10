import { Injectable, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
import { Journey } from '../../shared/models/api.models';
import { TrainFormModel } from '../../shared/components/train-details-form-card/train-details-form-card';

@Injectable()
export class CreatePageState {
    createTrainRunning = signal(false);

    readonly journey = signal<Journey>({});

    private model = signal<TrainFormModel>({
        name: '',
        operationalDay: '',
        creationComment: '',
    });

    createTrainForm = form(this.model, (schemaPath) => {
        required(schemaPath.name, { message: 'Name is required' });
        required(schemaPath.operationalDay, { message: 'Operational Day is required' });
        required(schemaPath.creationComment, { message: 'Creation Comment is required' });
    });
}
