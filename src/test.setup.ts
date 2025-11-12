import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { vi } from "vitest";

getTestBed().initTestEnvironment(
    BrowserTestingModule,
    platformBrowserTesting()
);

class MockIntersectionObserver implements IntersectionObserver {
    root: Element | null = null;
    rootMargin: string = '';
    thresholds: ReadonlyArray<number> = [];

    constructor() {}

    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
