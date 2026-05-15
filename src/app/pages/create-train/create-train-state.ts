import { Injectable, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';

/**
 * Not provided in root, cause state should be destroyed after switching page.
 */
@Injectable()
export class CreatePageState {
    createTrainRunning = false;
    createTrainSuccess = false;

    createTrainForm = form(model, (schemaPath) => {
        required(schemaPath.name, { message: 'Name is required' });
        required(schemaPath.operationalDay, { message: 'Operational Day is required' });
        required(schemaPath.creationComment, { message: 'Creation Comment is required' });
    });
}


export const model = signal<{
    name: string;
    operationalDay: Date;
    creationComment: string;
}>({
    name: '',
    operationalDay: null as unknown as Date,
    creationComment: '',
});
