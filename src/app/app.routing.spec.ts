import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { ORGANIZATION_OPTIONS } from './settings/settings.service';

const SERVER_URL_KEY = 'r2p-serverUrl';
const ORGANIZATION_KEY = 'r2p-organization';

describe('App routing', () => {
    let fixture: ComponentFixture<App>;
    let router: Router;
    let location: Location;

    beforeEach(async () => {
        localStorage.clear();
        localStorage.setItem(SERVER_URL_KEY, 'https://api.example.com');
        localStorage.setItem(ORGANIZATION_KEY, ORGANIZATION_OPTIONS[0].name);

        await TestBed.configureTestingModule({
            imports: [App],
            providers: [provideRouter(routes)],
        }).compileComponents();

        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        fixture = TestBed.createComponent(App);
        await fixture.whenStable();
    });

    async function navigateTo(url: string): Promise<void> {
        await router.navigateByUrl(url);
        await fixture.whenStable();
    }

    it('redirects from root to /traffic-overview', async () => {
        await navigateTo('/');

        expect(location.path()).toBe('/traffic-overview');
    });

    it('renders traffic overview on /traffic-overview', async () => {
        await navigateTo('/traffic-overview');

        const content = (fixture.nativeElement as HTMLElement).textContent ?? '';

        expect(location.path()).toBe('/traffic-overview');
        expect(content).toContain('Traffic Overview');
    });

    it('renders the create train page on /create-train', async () => {
        await navigateTo('/create-train');

        expect(location.path()).toBe('/create-train');
    });

    it('renders the 404 page for an unknown route', async () => {
        await navigateTo('/unknown-route');

        const content = (fixture.nativeElement as HTMLElement).textContent ?? '';

        expect(location.path()).toBe('/unknown-route');
        expect(content).toContain('404');
        expect(content).toContain('Page not found');
    });
});
