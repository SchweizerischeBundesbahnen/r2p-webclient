import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TRAINS, Train } from '../trains/trains';

@Component({
  selector: 'app-traffic-overview',
  imports: [RouterLink],
  templateUrl: './traffic-overview.html',
  styleUrl: './traffic-overview.scss',
})
export class TrafficOverview {
  protected readonly trains: Train[] = TRAINS;
}
