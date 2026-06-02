import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JourneyRouteCard } from './journey-route-card';
import { Journey } from '../../models/api.models';

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
                            timings: [{ type: 'departure', duration: '08:30' }],
                        },
                    ],
                },
                {
                    locations: [{ name: 'Zürich HB' }],
                    activities: [
                        {
                            type: 'journey',
                            responsibility: { type: 'carrier', id: 'SBB', status: 'accepted' },
                            timings: [{ type: 'arrival', duration: '09:30' }],
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
                                { type: 'arrival', duration: '07:00' },
                                { type: 'departure', duration: '07:05' },
                            ],
                            capability: {
                                type: 'path'
                            }
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

