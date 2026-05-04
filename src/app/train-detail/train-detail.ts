import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TRAINS, Train } from '../trains/trains';

@Component({
  selector: 'app-train-detail',
  imports: [],
  templateUrl: './train-detail.html',
  styleUrl: './train-detail.scss',
})
export class TrainDetail {
  private readonly route = inject(ActivatedRoute);

  private readonly trainId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
  );

  protected readonly train = (): Train | undefined =>
    TRAINS.find((t) => t.id === this.trainId());
}
