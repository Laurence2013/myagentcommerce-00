import { Service, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, BehaviorSubject, combineLatest } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import type { McpIcon, McpPackage, McpRepository, McpServerJSON, McpServerResponse, McpRegistryResponse } from './interfaces/mcp-registry.interface';
import { MOCK_MCP_SERVERS } from './mcp-registry.mock';

export type { McpIcon, McpPackage, McpRepository, McpServerJSON, McpServerResponse, McpRegistryResponse };
@Service()
export class McpRegistryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://registry.modelcontextprotocol.io/v0.1/servers';

  private readonly serverState$ = new BehaviorSubject<McpServerResponse[]>(MOCK_MCP_SERVERS);
  private readonly loadingState$ = new BehaviorSubject<boolean>(false);
  private readonly errorState$ = new BehaviorSubject<string | null>(null);

  public readonly searchQuery$ = new BehaviorSubject<string>('');

  readonly isLoading$ = this.loadingState$.asObservable();
  readonly error$ = this.errorState$.asObservable();

	readonly filteredServers$ = combineLatest([this.serverState$,this.searchQuery$]).pipe(
    map(([servers, query]) => {
      const cleanQuery = query.toLowerCase().trim();
      if (!cleanQuery) { return servers; }
      return servers.filter(item => {
        const title = (item.server.title || '').toLowerCase();
        const name = item.server.name.toLowerCase();
        const description = item.server.description.toLowerCase();
        return title.includes(cleanQuery) || name.includes(cleanQuery) || description.includes(cleanQuery);
      });
    })
  );
  /**
   * Fetches official MCP servers from the API registry.
   * Falls back to high-quality mock data on error or offline.
   */
  public fetchServers(): void {
    this.loadingState$.next(true);
    this.errorState$.next(null);

    this.http.get<McpRegistryResponse>(this.apiUrl).pipe(
        tap((response) => {
          if (response && response.servers && response.servers.length > 0) {
            this.serverState$.next(response.servers);
          } else {
            // Default to mock data if response format is unexpected
            this.serverState$.next(MOCK_MCP_SERVERS);
          }
          this.loadingState$.next(false);
        }),
        catchError((err) => {
          console.warn('Failed to load official MCP registry API, using mock fallback:', err);
          // Keep mock servers, update status to reflect offline/CORS warning but don't break UI
          this.errorState$.next('Registry API unavailable or blocked by CORS. Using offline backup metadata.');
          this.serverState$.next(MOCK_MCP_SERVERS);
          this.loadingState$.next(false);
          return of(null);
        })
      )  .subscribe();
  }
}
