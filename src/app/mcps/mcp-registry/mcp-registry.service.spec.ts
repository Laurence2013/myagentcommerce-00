import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { McpRegistryService } from './mcp-registry.service';
import { MOCK_MCP_SERVERS } from './mcp-registry.mock';

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

  beforeEach(() => {
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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with mock data', () => {
    expect(service.servers().length).toBeGreaterThan(0);
    expect(service.isLoading()).toBe(false);
  });

  it('should filter servers based on search query', () => {
    service.searchQuery.set('postgres');
    const filtered = service.filteredServers();
    expect(filtered.length).toBe(1);
    expect(filtered[0].server.name).toBe('modelcontextprotocol/server-postgres');
  });

  it('should handle API fetches and fall back to mock data on empty response', () => {
    service.fetchServers();
    expect(service.isLoading()).toBe(true);

    const req = httpMock.expectOne('https://registry.modelcontextprotocol.io/v0.1/servers');
    expect(req.request.method).toBe('GET');
    
    req.flush({ servers: [], metadata: { count: 0 } });

    expect(service.isLoading()).toBe(false);
    expect(service.servers().length).toBeGreaterThan(0);
  });
});

