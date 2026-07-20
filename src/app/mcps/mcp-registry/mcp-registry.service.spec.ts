// @vitest-environment jsdom
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { McpRegistryService } from './mcp-registry.service';
import { MOCK_MCP_SERVERS } from './mcp-registry.mock';

try {
  TestBed.initTestEnvironment(
    BrowserTestingModule,
    platformBrowserTesting()
  );
} catch {
  // Already initialized by ng test builder
}


describe('McpRegistry Mock Data', () => {
  it('should have a valid list of mock servers', () => {
    expect(Array.isArray(MOCK_MCP_SERVERS)).toBe(true);
    expect(MOCK_MCP_SERVERS.length).toBeGreaterThan(0);
  });

  it('should contain expected official servers', () => {
    const serverNames = MOCK_MCP_SERVERS.map(s => s.server.name);
    expect(serverNames).toContain('modelcontextprotocol/server-postgres');
    expect(serverNames).toContain('modelcontextprotocol/server-filesystem');
    expect(serverNames).toContain('modelcontextprotocol/server-github');
    expect(serverNames).toContain('modelcontextprotocol/server-google-search');
    expect(serverNames).toContain('modelcontextprotocol/server-sqlite');
    expect(serverNames).toContain('modelcontextprotocol/server-slack');
    expect(serverNames).toContain('modelcontextprotocol/server-memory');
  });

  it('should have valid metadata and package structure for each server', () => {
    for (const item of MOCK_MCP_SERVERS) {
      expect(item.server.name).toBeDefined();
      expect(item.server.description).toBeDefined();
      expect(item.server.version).toBeDefined();
      expect(item._meta['io.modelcontextprotocol.registry/official']).toBeDefined();
      expect(['active', 'deprecated', 'deleted']).toContain(item._meta['io.modelcontextprotocol.registry/official'].status);

      if (item.server.packages) {
        for (const pkg of item.server.packages) {
          expect(pkg.registryType).toBeDefined();
          expect(pkg.identifier).toBeDefined();
          expect(pkg.transport.type).toBeDefined();
        }
      }
    }
  });
});

describe('McpRegistryService', () => {
  let service: McpRegistryService;
  let httpMock: HttpTestingController;
  let consoleWarnSpy: any;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    TestBed.configureTestingModule({
      providers: [
        McpRegistryService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(McpRegistryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    consoleWarnSpy.mockRestore();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with mock data', () => {
    let servers: any[] = [];
    let loading = true;
    let err: string | null = 'init';

    service.filteredServers$.subscribe(res => servers = res);
    service.isLoading$.subscribe(res => loading = res);
    service.error$.subscribe(res => err = res);

    expect(servers.length).toBeGreaterThan(0);
    expect(loading).toBe(false);
    expect(err).toBeNull();
  });

  it('should filter servers based on search query', () => {
    let filtered: any[] = [];
    service.filteredServers$.subscribe(res => filtered = res);

    service.searchQuery$.next('postgres');
    expect(filtered.length).toBe(1);
    expect(filtered[0].server.name).toBe('modelcontextprotocol/server-postgres');
  });

  it('should handle case insensitivity and spaces in search query', () => {
    let filtered: any[] = [];
    service.filteredServers$.subscribe(res => filtered = res);

    service.searchQuery$.next('  POSTgres  ');
    expect(filtered.length).toBe(1);
    expect(filtered[0].server.name).toBe('modelcontextprotocol/server-postgres');
  });

  it('should return empty array if search query does not match any server', () => {
    let filtered: any[] = [];
    service.filteredServers$.subscribe(res => filtered = res);

    service.searchQuery$.next('nonexistent-server-query');
    expect(filtered.length).toBe(0);
  });

  it('should return all servers when search query is empty', () => {
    let filtered: any[] = [];
    service.filteredServers$.subscribe(res => filtered = res);

    service.searchQuery$.next('   ');
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('should handle successful API fetches and update servers state', () => {
    let loading = false;
    let err: string | null = null;
    let filtered: any[] = [];

    service.isLoading$.subscribe(res => loading = res);
    service.error$.subscribe(res => err = res);
    service.filteredServers$.subscribe(res => filtered = res);

    const customResponse = {
      servers: [
        {
          server: {
            name: 'custom/mcp-server',
            title: 'Custom Server',
            description: 'A custom mock server description.',
            version: '1.0.0'
          },
          _meta: {
            'io.modelcontextprotocol.registry/official': {
              status: 'active' as const,
              publishedAt: '2026-01-01T00:00:00Z',
              updatedAt: '2026-01-01T00:00:00Z',
              isLatest: true
            }
          }
        }
      ],
      metadata: { count: 1 }
    };

    service.fetchServers();
    expect(loading).toBe(true);

    const req = httpMock.expectOne('https://registry.modelcontextprotocol.io/v0.1/servers');
    expect(req.request.method).toBe('GET');
    req.flush(customResponse);

    expect(loading).toBe(false);
    expect(err).toBeNull();
    expect(filtered.length).toBe(1);
    expect(filtered[0].server.name).toBe('custom/mcp-server');
  });

  it('should handle API fetches and fall back to mock data on empty response', () => {
    let loading = false;
    let err: string | null = null;
    let filtered: any[] = [];

    service.isLoading$.subscribe(res => loading = res);
    service.error$.subscribe(res => err = res);
    service.filteredServers$.subscribe(res => filtered = res);

    service.fetchServers();
    expect(loading).toBe(true);

    const req = httpMock.expectOne('https://registry.modelcontextprotocol.io/v0.1/servers');
    expect(req.request.method).toBe('GET');

    req.flush({ servers: [], metadata: { count: 0 } });

    expect(loading).toBe(false);
    expect(err).toBeNull();
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('should handle API fetch errors by returning mock data and setting error message', () => {
    let loading = false;
    let err: string | null = null;
    let filtered: any[] = [];

    service.isLoading$.subscribe(res => loading = res);
    service.error$.subscribe(res => err = res);
    service.filteredServers$.subscribe(res => filtered = res);

    service.fetchServers();
    expect(loading).toBe(true);

    const req = httpMock.expectOne('https://registry.modelcontextprotocol.io/v0.1/servers');
    expect(req.request.method).toBe('GET');

    // Simulate an error response (e.g. 500 Internal Server Error)
    req.flush('Error fetching servers', { status: 500, statusText: 'Internal Server Error' });

    expect(loading).toBe(false);
    expect(err).toContain('Registry API unavailable or blocked by CORS');
    expect(filtered.length).toBeGreaterThan(0);
  });
});


