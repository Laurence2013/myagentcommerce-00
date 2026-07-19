import { Service, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import type {
  McpIcon,
  McpPackage,
  McpRepository,
  McpServerJSON,
  McpServerResponse,
  McpRegistryResponse
} from './interfaces/mcp-registry.interface';
import { MOCK_MCP_SERVERS } from './mcp-registry.mock';

export type {
  McpIcon,
  McpPackage,
  McpRepository,
  McpServerJSON,
  McpServerResponse,
  McpRegistryResponse
};
@Service()
export class McpRegistryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://registry.modelcontextprotocol.io/v0.1/servers';

  // Signals for state management
  private readonly serversState = signal<McpServerResponse[]>(MOCK_MCP_SERVERS);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  // Search query signal
  readonly searchQuery = signal<string>('');

  // Read-only public signals
  readonly servers = computed(() => this.serversState());
  readonly isLoading = computed(() => this.loadingState());
  readonly error = computed(() => this.errorState());

  // Derived filtered state using computed signals
  readonly filteredServers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.serversState();
    }
    return this.serversState().filter(item => {
      const title = (item.server.title || '').toLowerCase();
      const name = item.server.name.toLowerCase();
      const description = item.server.description.toLowerCase();
      return title.includes(query) || name.includes(query) || description.includes(query);
    });
  });

  /**
   * Fetches official MCP servers from the API registry.
   * Falls back to high-quality mock data on error or offline.
   */
  public fetchServers(): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.http.get<McpRegistryResponse>(this.apiUrl)
      .pipe(
        tap((response) => {
          if (response && response.servers && response.servers.length > 0) {
            this.serversState.set(response.servers);
          } else {
            // Default to mock data if response format is unexpected
            this.serversState.set(MOCK_MCP_SERVERS);
          }
          this.loadingState.set(false);
        }),
        catchError((err) => {
          console.warn('Failed to load official MCP registry API, using mock fallback:', err);
          // Keep mock servers, update status to reflect offline/CORS warning but don't break UI
          this.errorState.set('Registry API unavailable or blocked by CORS. Using offline backup metadata.');
          this.serversState.set(MOCK_MCP_SERVERS);
          this.loadingState.set(false);
          return of(null);
        })
      )
      .subscribe();
  }
}
