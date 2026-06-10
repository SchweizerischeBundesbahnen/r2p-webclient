import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

export interface TrainFormModel { trainNumber: string; operationalDay: string; creationComment: string }
type TrainForm = ReturnType<typeof form<TrainFormModel>>;

@Component({
    selector: 'app-train-details-form-card',
    imports: [FormField, MatFormField, MatLabel, MatError, MatInput],
    templateUrl: './train-details-form-card.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainDetailsFormCard {
    readonly trainForm = input.required<TrainForm>();
    readonly commentLabel = input.required<string>();
    readonly trainNumberPlaceholder = input('');
    readonly commentPlaceholder = input('');
}
