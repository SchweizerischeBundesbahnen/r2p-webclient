import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JourneyRouteCard } from './journey-route-card';
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

    it('should not show edit button for stops when readonly', () => {
        const journey: Journey = {
            journeylocations: [{ locations: [{ name: 'Bern', type: 'UIC', code: '8507000' }] }],
        };
        fixture.componentRef.setInput('readonly', true);
        fixture.componentRef.setInput('journey', journey);
        fixture.detectChanges();

        const el: HTMLElement = fixture.nativeElement;
        expect(el.querySelector('.jt-edit-location-btn')).toBeNull();
    });

    it('should show edit button for stops when not readonly', () => {
        const journey: Journey = {
            journeylocations: [{ locations: [{ name: 'Bern', type: 'UIC', code: '8507000' }] }],
        };
        fixture.componentRef.setInput('readonly', false);
        fixture.componentRef.setInput('journey', journey);
        fixture.detectChanges();

        const el: HTMLElement = fixture.nativeElement;
        expect(el.querySelector('.jt-edit-location-btn')).not.toBeNull();
    });

    it('should open edit modal when edit button is clicked', () => {
        const journey: Journey = {
            journeylocations: [{ locations: [{ name: 'Bern', type: 'UIC', code: '8507000' }] }],
        };
        fixture.componentRef.setInput('readonly', false);
        fixture.componentRef.setInput('journey', journey);
        fixture.detectChanges();

        const el: HTMLElement = fixture.nativeElement;
        const editBtn = el.querySelector('.jt-edit-location-btn') as HTMLButtonElement;
        editBtn.click();
        fixture.detectChanges();

        expect(el.querySelector('#edit-location-modal')).not.toBeNull();
    });

    it('should close edit modal on cancel', () => {
        const journey: Journey = {
            journeylocations: [{ locations: [{ name: 'Bern', type: 'UIC', code: '8507000' }] }],
        };
        fixture.componentRef.setInput('readonly', false);
        fixture.componentRef.setInput('journey', journey);
        fixture.detectChanges();

        const el: HTMLElement = fixture.nativeElement;
        (el.querySelector('.jt-edit-location-btn') as HTMLButtonElement).click();
        fixture.detectChanges();

        const closeBtn = el.querySelector('.modal-close') as HTMLButtonElement;
        closeBtn.click();
        fixture.detectChanges();

        expect(el.querySelector('#edit-location-modal')).toBeNull();
    });

    it('should emit journeyChange and update stop name when location is saved', () => {
        const journey: Journey = {
            journeylocations: [{ locations: [{ name: 'Bern', type: 'UIC', code: '8507000' }] }],
        };
        fixture.componentRef.setInput('readonly', false);
        fixture.componentRef.setInput('journey', journey);
        fixture.detectChanges();

        const journeyChangeSpy = vi.fn();
        fixture.componentInstance.journeyChange.subscribe(journeyChangeSpy);

        const el: HTMLElement = fixture.nativeElement;
        (el.querySelector('.jt-edit-location-btn') as HTMLButtonElement).click();
        fixture.detectChanges();

        // Change the name field
        const nameInput = el.querySelector('#loc-name') as HTMLInputElement;
        nameInput.value = 'Zürich HB';
        nameInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const saveBtn = el.querySelector('.modal-footer .btn-primary') as HTMLButtonElement;
        saveBtn.click();
        fixture.detectChanges();

        expect(el.querySelector('#edit-location-modal')).toBeNull();
        expect(journeyChangeSpy).toHaveBeenCalledOnce();
        const emittedJourney = journeyChangeSpy.mock.calls[0][0] as Journey;
        expect(emittedJourney.journeylocations?.[0].locations?.[0].name).toBe('Zürich HB');

        // Table should reflect the new name
        expect(el.querySelector('.jt-stop-name')!.textContent).toBe('Zürich HB');
    });

    it('should expose location on JourneyStop', () => {
        const journey: Journey = {
            journeylocations: [{ locations: [{ name: 'Bern', type: 'UIC', code: '8507000' }] }],
        };
        fixture.componentRef.setInput('journey', journey);
        fixture.detectChanges();

        const stops = component.stops();
        expect(stops[0].location).toEqual({ name: 'Bern', type: 'UIC', code: '8507000' });
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
