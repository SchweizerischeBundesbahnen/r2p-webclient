import { Injectable, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';

@Injectable()
export class CreatePageState {
    createTrainRunning = false;

    private model = signal<{
        name: string;
        operationalDay: Date;
        creationComment: string;
    }>({
        name: '',
        operationalDay: null as unknown as Date,
        creationComment: '',
    });

    createTrainForm = form(this.model, (schemaPath) => {
        required(schemaPath.name, { message: 'Name is required' });
        required(schemaPath.operationalDay, { message: 'Operational Day is required' });
        required(schemaPath.creationComment, { message: 'Creation Comment is required' });
    });
}

