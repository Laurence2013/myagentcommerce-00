import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import {
  McpIcon,
  McpPackage,
  McpRepository,
  McpServerJSON,
  McpServerResponse,
  McpRegistryResponse,
  CommerceKeywordCategories,
  ParsedCommerceMetadata,
  CommerceServerCategorization,
  COMMERCE_KEYWORDS
} from './interfaces/mcp-registry.interface';
import { MOCK_MCP_SERVERS } from './mcp-registry.mock';

export type {
  McpIcon,
  McpPackage,
  McpRepository,
  McpServerJSON,
  McpServerResponse,
  McpRegistryResponse,
  CommerceKeywordCategories,
  ParsedCommerceMetadata,
  CommerceServerCategorization
};

export { COMMERCE_KEYWORDS };


/**
 * Utility to parse and extract Agentic AI Commerce keywords from an MCP server metadata object.
 */
export function parseCommerceKeywords(item: McpServerResponse): ParsedCommerceMetadata {
  const textContent = [
    item.server.name || '',
    item.server.title || '',
    item.server.description || '',
    ...(item.server.packages || []).map(p => `${p.identifier} ${p.registryType}`),
    item.server.repository?.url || '',
    item.server.repository?.subfolder || ''
  ].join(' ').toLowerCase();

  const matchedKeywords = {
    transactionEscrow: COMMERCE_KEYWORDS.transactionEscrow.filter(kw => textContent.includes(kw.toLowerCase())),
    catalogInfrastructure: COMMERCE_KEYWORDS.catalogInfrastructure.filter(kw => textContent.includes(kw.toLowerCase())),
    pricingB2bRules: COMMERCE_KEYWORDS.pricingB2bRules.filter(kw => textContent.includes(kw.toLowerCase())),
    agenticProtocols: COMMERCE_KEYWORDS.agenticProtocols.filter(kw => textContent.includes(kw.toLowerCase())),
    autonomousProcurement: COMMERCE_KEYWORDS.autonomousProcurement.filter(kw => textContent.includes(kw.toLowerCase()))
  };

  const matchedCategories: Array<'transactionEscrow' | 'catalogInfrastructure' | 'pricingB2bRules' | 'agenticProtocols' | 'autonomousProcurement'> = [];
  if (matchedKeywords.transactionEscrow.length > 0) { matchedCategories.push('transactionEscrow'); }
  if (matchedKeywords.catalogInfrastructure.length > 0) { matchedCategories.push('catalogInfrastructure'); }
  if (matchedKeywords.pricingB2bRules.length > 0) { matchedCategories.push('pricingB2bRules'); }
  if (matchedKeywords.agenticProtocols.length > 0) { matchedCategories.push('agenticProtocols'); }
  if (matchedKeywords.autonomousProcurement.length > 0) { matchedCategories.push('autonomousProcurement'); }

  return {
    isCommerceTool: matchedCategories.length > 0,
    matchedCategories,
    matchedKeywords
  };
}

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

  readonly filteredServers$ = combineLatest([this.serverState$, this.searchQuery$]).pipe(
    map(([servers, query]) => {
      const cleanQuery = query.toLowerCase().trim();
      if (!cleanQuery) { return servers; }
      return servers.filter(item => {
        const title = (item.server.title || '').toLowerCase();
        const name = item.server.name.toLowerCase();
        const description = item.server.description.toLowerCase();
        const commerceInfo = parseCommerceKeywords(item);
        const hasKeywordMatch = commerceInfo.matchedKeywords.transactionEscrow.includes(cleanQuery) ||
          commerceInfo.matchedKeywords.catalogInfrastructure.includes(cleanQuery) ||
          commerceInfo.matchedKeywords.pricingB2bRules.includes(cleanQuery);
        return title.includes(cleanQuery) || name.includes(cleanQuery) || description.includes(cleanQuery) || hasKeywordMatch;
      });
    })
  );

  /**
   * Observable emitting only Agentic AI Commerce servers.
   */
  readonly commerceServers$: Observable<McpServerResponse[]> = this.serverState$.pipe(
    map(servers => servers.filter(item => parseCommerceKeywords(item).isCommerceTool))
  );

  /**
   * Observable emitting commerce servers categorized into transaction/escrow, catalog infrastructure, and pricing/B2B rules.
   */
  readonly commerceCategorization$: Observable<CommerceServerCategorization> = this.serverState$.pipe(
    map(servers => this.categorizeCommerceServers(servers))
  );

  /**
   * Parses and filters a list of MCP servers for Agentic AI Commerce tools matching specific keywords.
   */
  public getCommerceServers(servers: McpServerResponse[] = this.serverState$.getValue()): McpServerResponse[] {
    return servers.filter(item => parseCommerceKeywords(item).isCommerceTool);
  }

  /**
   * Categorizes MCP servers into Commerce sub-domains based on key words.
   */
  public categorizeCommerceServers(servers: McpServerResponse[] = this.serverState$.getValue()): CommerceServerCategorization {
    const result: CommerceServerCategorization = {
      transactionEscrow: [],
      catalogInfrastructure: [],
      pricingB2bRules: [],
      agenticProtocols: [],
      autonomousProcurement: [],
      allCommerceServers: []
    };

    for (const item of servers) {
      const info = parseCommerceKeywords(item);
      if (info.isCommerceTool) {
        result.allCommerceServers.push(item);
        if (info.matchedCategories.includes('transactionEscrow')) {
          result.transactionEscrow.push(item);
        }
        if (info.matchedCategories.includes('catalogInfrastructure')) {
          result.catalogInfrastructure.push(item);
        }
        if (info.matchedCategories.includes('pricingB2bRules')) {
          result.pricingB2bRules.push(item);
        }
        if (info.matchedCategories.includes('agenticProtocols')) {
          result.agenticProtocols.push(item);
        }
        if (info.matchedCategories.includes('autonomousProcurement')) {
          result.autonomousProcurement.push(item);
        }
      }
    }

    return result;
  }

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
    ).subscribe();
  }
}

