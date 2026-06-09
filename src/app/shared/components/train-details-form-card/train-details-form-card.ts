import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

export interface TrainFormModel { name: string; operationalDay: string; creationComment: string }
type TrainForm = ReturnType<typeof form<TrainFormModel>>;

@Component({
    selector: 'app-train-details-form-card',
    imports: [FormField, MatFormField, MatLabel, MatError, MatInput],
    template: `
        <div class="card">
            <div class="card-header">
                <span class="card-title" i18n="@@trainForm.section.trainDetails">📋 Train Details</span>
            </div>
            <div class="card-body">
                <div class="form-row">
                    <mat-form-field appearance="outline">
                        <mat-label i18n="@@trainForm.field.name">Name</mat-label>
                        <input
                            matInput
                            id="train-name"
                            [placeholder]="namePlaceholder()"
                            [formField]="trainForm().name"
                        />
                        @if (trainForm().name().touched() && trainForm().name().invalid()) {
                            @for (error of trainForm().name().errors(); track error) {
                                <mat-error>{{ error.message }}</mat-error>
                            }
                        }
                    </mat-form-field>
                    <mat-form-field appearance="outline" (click)="opDayInput.showPicker()">
                        <mat-label i18n="@@trainForm.field.opDay">Operational Day</mat-label>
                        <input
                            #opDayInput
                            matInput
                            type="date"
                            id="train-opday"
                            [formField]="trainForm().operationalDay"
                        />
                        @if (
                            trainForm().operationalDay().touched() &&
                            trainForm().operationalDay().invalid()
                        ) {
                            @for (error of trainForm().operationalDay().errors(); track error) {
                                <mat-error>{{ error.message }}</mat-error>
                            }
                        }
                    </mat-form-field>
                </div>
                <mat-form-field appearance="outline" style="width:100%">
                    <mat-label>{{ commentLabel() }}</mat-label>
                    <textarea
                        matInput
                        id="save-comment"
                        rows="3"
                        [placeholder]="commentPlaceholder()"
                        [formField]="trainForm().creationComment"
                    ></textarea>
                    @if (
                        trainForm().creationComment().touched() &&
                        trainForm().creationComment().invalid()
                    ) {
                        @for (error of trainForm().creationComment().errors(); track error) {
                            <mat-error>{{ error.message }}</mat-error>
                        }
                    }
                </mat-form-field>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainDetailsFormCard {
    readonly trainForm = input.required<TrainForm>();
    readonly commentLabel = input.required<string>();
    readonly namePlaceholder = input('');
    readonly commentPlaceholder = input('');
}
