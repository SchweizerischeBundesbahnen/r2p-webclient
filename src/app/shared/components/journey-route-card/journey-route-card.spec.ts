import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { JourneyRouteCard, parseDurationToHHMM } from './journey-route-card';
import { Journey, TimingType } from '../../models/api.models';

describe('JourneyRouteCard', () => {
    let fixture: ComponentFixture<JourneyRouteCard>;
    let component: JourneyRouteCard;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [JourneyRouteCard],
        }).compileComponents();

        fixture = TestBed.createComponent(JourneyRouteCard);
        component = fixture.componentInstance;
    });

    it('should show "No journey stops defined." when no journey is provided', () => {
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement;
        expect(el.textContent).toContain('No journey stops defined.');
        expect(component.stops()).toEqual([]);
    });

    it('should display journey stop names when a journey is provided', () => {
        const journey: Journey = {
            journeylocations: [
                {
                    locations: [{ name: 'Bern' }],
                    activities: [
                        {
                            type: 'journey',
                            responsibility: { type: 'carrier', id: 'SBB', status: 'accepted' },
                            timings: [{ type: TimingType.Departure, duration: 'PT8H30M' }],
                        },
                    ],
                },
                {
                    locations: [{ name: 'Zürich HB' }],
                    activities: [
                        {
                            type: 'journey',
                            responsibility: { type: 'carrier', id: 'SBB', status: 'accepted' },
                            timings: [{ type: TimingType.Arrival, duration: 'PT9H30M' }],
                        },
                    ],
                },
            ],
        };

        fixture.componentRef.setInput('journey', journey);
        fixture.detectChanges();

        const el: HTMLElement = fixture.nativeElement;
        expect(el.textContent).not.toContain('No journey stops defined.');
        expect(el.textContent).toContain('Bern');
        expect(el.textContent).toContain('Zürich HB');

        const stops = component.stops();
        expect(stops.length).toBe(2);
        expect(stops[0].stopName).toBe('Bern');
        expect(stops[0].isFirst).toBe(true);
        expect(stops[0].isLast).toBe(false);
        expect(stops[1].stopName).toBe('Zürich HB');
        expect(stops[1].isFirst).toBe(false);
        expect(stops[1].isLast).toBe(true);
    });

    it('should display arrival and departure times', () => {
        const journey: Journey = {
            journeylocations: [
                {
                    locations: [{ name: 'Bern' }],
                    activities: [
                        {
                            type: 'journey',
                            timings: [
                                { type: TimingType.Arrival, duration: 'PT7H00M' },
                                { type: TimingType.Departure, duration: 'PT7H05M' },
                            ],
                            capability: {
                                type: 'path',
                            },
                        },
                    ],
                },
            ],
        };

        fixture.componentRef.setInput('journey', journey);
        fixture.detectChanges();

        const el: HTMLElement = fixture.nativeElement;
        expect(el.textContent).toContain('07:00');
        expect(el.textContent).toContain('07:05');
    });

    it('should display earliest arrival and departure times', () => {
        const journey: Journey = {
            journeylocations: [
                {
                    locations: [{ name: 'Bern' }],
                    activities: [
                        {
                            type: 'journey',
                            timings: [
                                { type: TimingType.EarliestArrival, duration: 'PT7H00M' },
                                { type: TimingType.EarliestDeparture, duration: 'PT7H05M' },
                            ],
                            capability: {
                                type: 'path',
                            },
                        },
                    ],
                },
            ],
        };

        fixture.componentRef.setInput('journey', journey);
        fixture.detectChanges();

        const el: HTMLElement = fixture.nativeElement;
        expect(el.textContent).toContain('07:00');
        expect(el.textContent).toContain('07:05');
    });

    it('should display latest arrival and departure times', () => {
        const journey: Journey = {
            journeylocations: [
                {
                    locations: [{ name: 'Bern' }],
                    activities: [
                        {
                            type: 'journey',
                            timings: [
                                { type: TimingType.LatestArrival, duration: 'PT7H00M' },
                                { type: TimingType.LatestDeparture, duration: 'PT7H05M' },
                            ],
                            capability: {
                                type: 'path',
                            },
                        },
                    ],
                },
            ],
        };

        fixture.componentRef.setInput('journey', journey);
        fixture.detectChanges();

        const el: HTMLElement = fixture.nativeElement;
        expect(el.textContent).toContain('07:00');
        expect(el.textContent).toContain('07:05');
    });

    it('should display first arrival and departure times', () => {
        const journey: Journey = {
            journeylocations: [
                {
                    locations: [{ name: 'Bern' }],
                    activities: [
                        {
                            type: 'journey',
                            timings: [
                                { type: TimingType.Arrival, duration: 'PT7H00M' },
                                { type: TimingType.LatestArrival, duration: 'PT7H03M' },
                                { type: TimingType.Departure, duration: 'PT7H05M' },
                                { type: TimingType.LatestDeparture, duration: 'PT7H07M' },
                            ],
                            capability: {
                                type: 'path',
                            },
                        },
                    ],
                },
            ],
        };

        fixture.componentRef.setInput('journey', journey);
        fixture.detectChanges();

        const el: HTMLElement = fixture.nativeElement;
        expect(el.textContent).toContain('07:00');
        expect(el.textContent).toContain('07:05');
    });

    it('should hide actions column when readonly', () => {
        fixture.componentRef.setInput('readonly', true);
        fixture.detectChanges();

        const el: HTMLElement = fixture.nativeElement;
        const headers = el.querySelectorAll('th');
        const headerTexts = Array.from(headers).map((h: Element) => h.textContent?.trim());
        expect(headerTexts).not.toContain('Actions');
    });

    it('should list activity with capability type rollingStock in rollingStockActivities column', () => {
        const journey: Journey = {
            journeylocations: [
                {
                    locations: [{ name: 'Bern' }],
                    activities: [
                        {
                            type: 'formation',
                            capability: { type: 'rollingStock' },
                        },
                    ],
                },
            ],
        };

        fixture.componentRef.setInput('journey', journey);
        fixture.detectChanges();

        const stops = component.stops();
        expect(stops[0].rollingStockActivities.length).toBe(1);
        expect(stops[0].rollingStockActivities[0].type).toBe('formation');
        expect(stops[0].staffActivities.length).toBe(0);
        expect(stops[0].pathActivities.length).toBe(0);
    });

    it('should list activity with capability type staff in staffActivities column', () => {
        const journey: Journey = {
            journeylocations: [
                {
                    locations: [{ name: 'Zürich HB' }],
                    activities: [
                        {
                            type: 'crewing',
                            capability: { type: 'staff' },
                        },
                    ],
                },
            ],
        };

        fixture.componentRef.setInput('journey', journey);
        fixture.detectChanges();

        const stops = component.stops();
        expect(stops[0].staffActivities.length).toBe(1);
        expect(stops[0].staffActivities[0].type).toBe('crewing');
        expect(stops[0].rollingStockActivities.length).toBe(0);
        expect(stops[0].pathActivities.length).toBe(0);
    });

    it('should list activity with capability type path in pathActivities column', () => {
        const journey: Journey = {
            journeylocations: [
                {
                    locations: [{ name: 'Basel SBB' }],
                    activities: [
                        {
                            type: 'routing',
                            capability: { type: 'path' },
                        },
                    ],
                },
            ],
        };

        fixture.componentRef.setInput('journey', journey);
        fixture.detectChanges();

        const stops = component.stops();
        expect(stops[0].pathActivities.length).toBe(1);
        expect(stops[0].pathActivities[0].type).toBe('routing');
        expect(stops[0].rollingStockActivities.length).toBe(0);
        expect(stops[0].staffActivities.length).toBe(0);
    });
});

describe('parseDurationToHHMM', () => {
    it('parses hours and minutes without days', () => {
        expect(parseDurationToHHMM('PT8H12M')).toBe('08:12');
    });

    it('parses hours only', () => {
        expect(parseDurationToHHMM('PT10H')).toBe('10:00');
    });

    it('parses minutes only', () => {
        expect(parseDurationToHHMM('PT45M')).toBe('00:45');
    });

    it('converts days to hours', () => {
        expect(parseDurationToHHMM('P1DT14H35M')).toBe('38:35');
    });

    it('pads single-digit hours and minutes', () => {
        expect(parseDurationToHHMM('PT7H5M')).toBe('07:05');
    });

    it('returns undefined for invalid input', () => {
        expect(parseDurationToHHMM('invalid')).toBeUndefined();
    });
});

