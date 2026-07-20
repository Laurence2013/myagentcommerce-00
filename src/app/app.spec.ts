// @vitest-environment jsdom
import { describe, it, beforeEach, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { App } from './app';

try {
  TestBed.initTestEnvironment(
    BrowserTestingModule,
    platformBrowserTesting()
  );
} catch {
  // Already initialized
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});





