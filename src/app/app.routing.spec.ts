import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { ORGANIZATION_OPTIONS } from './settings/settings.service';
import { TRAINS } from './trains/trains';

const SETTINGS_KEY = 'r2p-settings';

describe('App routing', () => {
    let fixture: ComponentFixture<App>;
    let router: Router;
    let location: Location;

    beforeEach(async () => {
        localStorage.clear();
        localStorage.setItem(
            SETTINGS_KEY,
            JSON.stringify({
                serverUrl: 'https://api.example.com',
                organization: ORGANIZATION_OPTIONS[0].name,
            }),
        );

        await TestBed.configureTestingModule({
            imports: [ App ],
            providers: [ provideRouter(routes) ],
        }).compileComponents();

        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        fixture = TestBed.createComponent(App);
        fixture.detectChanges();
    });

    async function navigateTo(url: string): Promise<void> {
        await router.navigateByUrl(url);
        fixture.detectChanges();
        await fixture.whenStable();
    }

    it('renders traffic overview on the root route', async () => {
        await navigateTo('/');

        const compiled = fixture.nativeElement as HTMLElement;
        const content = compiled.textContent ?? '';

        expect(location.path()).toBe('');
        expect(content).toContain('Traffic Overview');
        expect(content).toContain(TRAINS[0].name);
        expect(compiled.querySelectorAll('a').length).toBe(TRAINS.length);
    });

    it('renders the selected train on /train/:id', async () => {
        const train = TRAINS[1];
        await navigateTo(`/train/${train.id}`);

        const content = (fixture.nativeElement as HTMLElement).textContent ?? '';

        expect(location.path()).toBe(`/train/${train.id}`);
        expect(content).toContain(train.name);
        expect(content).toContain(`ID: ${train.id}`);
    });

    it('renders the not found message for an unknown train id', async () => {
        await navigateTo('/train/9999999');

        const content = (fixture.nativeElement as HTMLElement).textContent ?? '';

        expect(location.path()).toBe('/train/9999999');
        expect(content).toContain('Train not found.');
    });
});

