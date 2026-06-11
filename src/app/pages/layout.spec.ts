import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { afterEach, describe, expect, it } from 'vitest';
import { MatDialog } from '@angular/material/dialog';
import { Layout } from './layout';
import { version } from '../../../package.json';

describe('Layout', () => {
    let fixture: ComponentFixture<Layout>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Layout],
            providers: [
                provideRouter([]),
                provideAnimationsAsync(),
                { provide: MatDialog, useValue: { open: () => {} } },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(Layout);
        fixture.detectChanges();
    });

    afterEach(() => TestBed.resetTestingModule());

    it('displays the app version from package.json in the version-tag', () => {
        const versionTag: HTMLElement = fixture.nativeElement.querySelector('.version-tag');
        expect(versionTag.textContent?.trim()).toBe(`v${version}`);
    });
});
