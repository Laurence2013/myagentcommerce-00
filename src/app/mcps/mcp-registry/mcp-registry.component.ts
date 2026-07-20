import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { McpRegistryService } from './mcp-registry.service';
import type { McpServerResponse } from './interfaces/mcp-registry.interface';

@Component({
  selector: 'app-mcp-registry',
  standalone: true,
  imports: [],
  template: `
    <div class="registry-container">
      <!-- Header Section -->
      <header class="registry-header">
        <div class="header-badge">
          <span class="dot"></span>
          <span>v0.1 Official Protocol Registry</span>
        </div>
        <h1 class="header-title">Model Context Protocol Registry</h1>
        <p class="header-subtitle">
          Explore and discover official MCP servers for AI agents, tools, and integrations.
        </p>

        <!-- API Testing & Postman Banner -->
        <div class="api-info-card" id="api-endpoint-info">
          <div class="api-info-header">
            <span class="api-tag">GET</span>
            <code class="api-url">{{ apiUrl }}</code>
            <button
              type="button"
              class="copy-btn"
              [class.copied]="copied()"
              (click)="copyApiUrl()"
              id="copy-api-url-btn"
              [attr.aria-label]="copied() ? 'API URL Copied' : 'Copy API URL'"
            >
              @if (copied()) {
                ✓ Copied
              } @else {
                📋 Copy Endpoint URL
              }
            </button>
          </div>
          <p class="api-note">
            💡 <strong>Testing with Postman or Browser:</strong> You can send a <code>GET</code> request directly to the endpoint URL above in Postman or open it in a new browser tab to inspect the raw JSON payload returned by the MCP Registry API.
          </p>
        </div>
      </header>

      <!-- Toolbar: Search & Refresh -->
      <section class="toolbar-section">
        <div class="search-box">
          <span class="search-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            id="mcp-search-input"
            class="search-input"
            placeholder="Search by server name, title, or description..."
            [value]="searchInputValue()"
            (input)="onSearchInput($event)"
            aria-label="Search MCP servers"
          />
          @if (searchInputValue()) {
            <button
              type="button"
              class="clear-search-btn"
              (click)="clearSearch()"
              id="clear-search-btn"
              aria-label="Clear search query"
            >
              ✕
            </button>
          }
        </div>

        <button
          type="button"
          class="fetch-btn"
          id="fetch-servers-btn"
          [disabled]="isLoading()"
          (click)="onFetchServers()"
        >
          @if (isLoading()) {
            <span class="spinner" aria-hidden="true"></span>
            <span>Fetching...</span>
          } @else {
            <span>🔄 Fetch Live Data</span>
          }
        </button>
      </section>

      <!-- Error / CORS Warning Banner -->
      @if (error()) {
        <div class="warning-banner" id="mcp-error-banner" role="alert">
          <span class="warning-icon" aria-hidden="true">⚠️</span>
          <div class="warning-content">
            <strong>API Status Note:</strong> {{ error() }}
          </div>
        </div>
      }

      <!-- Results Stats -->
      <div class="stats-bar">
        <span id="server-count-label">
          Showing <strong>{{ servers().length }}</strong> MCP server{{ servers().length === 1 ? '' : 's' }}
        </span>
      </div>

      <!-- Loading Skeleton -->
      @if (isLoading()) {
        <div class="grid-layout" id="loading-skeletons">
          @for (item of skeletonItems; track $index) {
            <div class="server-card skeleton-card">
              <div class="skeleton-line title-line"></div>
              <div class="skeleton-line subtitle-line"></div>
              <div class="skeleton-line desc-line"></div>
              <div class="skeleton-line desc-line short"></div>
            </div>
          }
        </div>
      } @else {
        <!-- Server Cards Grid -->
        <div class="grid-layout" id="mcp-servers-grid">
          @for (item of servers(); track item.server.name) {
            <article class="server-card" [id]="'server-card-' + item.server.name">
              <div class="card-top">
                <div class="card-heading">
                  <h2 class="server-title">
                    {{ item.server.title || item.server.name }}
                  </h2>
                  <span class="server-name-tag">{{ item.server.name }}</span>
                </div>
                <span
                  class="status-badge"
                  [class.status-active]="item._meta['io.modelcontextprotocol.registry/official'].status === 'active'"
                  [class.status-deprecated]="item._meta['io.modelcontextprotocol.registry/official'].status === 'deprecated'"
                >
                  {{ item._meta['io.modelcontextprotocol.registry/official'].status }}
                </span>
              </div>

              <p class="server-description">
                {{ item.server.description }}
              </p>

              @if (item.server.packages && item.server.packages.length > 0) {
                <div class="packages-section">
                  <span class="packages-label">Packages & Transport:</span>
                  <div class="package-list">
                    @for (pkg of item.server.packages; track pkg.identifier) {
                      <div class="package-item">
                        <span class="pkg-type">{{ pkg.registryType }}</span>
                        <code class="pkg-id">{{ pkg.identifier }}</code>
                        <span class="pkg-transport">{{ pkg.transport.type }}</span>
                      </div>
                    }
                  </div>
                </div>
              }

              <div class="card-footer">
                <span class="version-tag">v{{ item.server.version }}</span>
                @if (item.repository?.url) {
                  <a
                    [href]="item.repository?.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="repo-link"
                    [id]="'repo-link-' + item.server.name"
                  >
                    Repository ↗
                  </a>
                }
              </div>
            </article>
          } @empty {
            <div class="empty-state" id="no-servers-found">
              <div class="empty-icon">🔎</div>
              <h3>No MCP Servers Found</h3>
              <p>No servers match your search criteria. Try a different search query.</p>
              <button type="button" class="reset-btn" (click)="clearSearch()">Reset Search</button>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      background-color: #0b0f19;
      color: #f3f4f6;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-sizing: border-box;
    }

    .registry-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem;
    }

    .registry-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.9rem;
      border-radius: 9999px;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #818cf8;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #10b981;
      box-shadow: 0 0 8px #10b981;
    }

    .header-title {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      margin: 0 0 0.75rem 0;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      font-size: 1.1rem;
      color: #94a3b8;
      max-width: 650px;
      margin: 0 auto 1.5rem auto;
      line-height: 1.6;
    }

    .api-info-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      max-width: 800px;
      margin: 0 auto;
      text-align: left;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }

    .api-info-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 0.75rem;
    }

    .api-tag {
      background: #059669;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.8rem;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      letter-spacing: 0.05em;
    }

    .api-url {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.9rem;
      color: #38bdf8;
      background: #0f172a;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      border: 1px solid #1e293b;
      flex: 1;
      min-width: 280px;
      overflow-x: auto;
    }

    .copy-btn {
      background: #3b82f6;
      color: #ffffff;
      border: none;
      padding: 0.45rem 0.9rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .copy-btn:hover {
      background: #2563eb;
    }

    .copy-btn.copied {
      background: #10b981;
    }

    .api-note {
      font-size: 0.875rem;
      color: #cbd5e1;
      margin: 0;
      line-height: 1.5;
    }

    .toolbar-section {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 280px;
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      font-size: 1rem;
      pointer-events: none;
      opacity: 0.6;
    }

    .search-input {
      width: 100%;
      background: #1e293b;
      border: 1px solid #334155;
      color: #ffffff;
      padding: 0.75rem 2.5rem 0.75rem 2.75rem;
      border-radius: 10px;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .search-input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }

    .clear-search-btn {
      position: absolute;
      right: 0.75rem;
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1rem;
      cursor: pointer;
      padding: 0.25rem;
    }

    .clear-search-btn:hover {
      color: #ffffff;
    }

    .fetch-btn {
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: #ffffff;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .fetch-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
    }

    .fetch-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .warning-banner {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #fbbf24;
      padding: 1rem 1.25rem;
      border-radius: 10px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 0.95rem;
    }

    .stats-bar {
      color: #94a3b8;
      font-size: 0.9rem;
      margin-bottom: 1.25rem;
    }

    .grid-layout {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.5rem;
    }

    .server-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 14px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .server-card:hover {
      transform: translateY(-2px);
      border-color: #475569;
      box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.4);
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .server-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: #f8fafc;
      margin: 0 0 0.25rem 0;
    }

    .server-name-tag {
      font-family: ui-monospace, monospace;
      font-size: 0.78rem;
      color: #818cf8;
      word-break: break-all;
    }

    .status-badge {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      letter-spacing: 0.05em;
    }

    .status-active {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .status-deprecated {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .server-description {
      color: #cbd5e1;
      font-size: 0.925rem;
      line-height: 1.5;
      margin: 0 0 1.25rem 0;
      flex: 1;
    }

    .packages-section {
      background: #0f172a;
      border-radius: 8px;
      padding: 0.75rem;
      margin-bottom: 1.25rem;
    }

    .packages-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      display: block;
      margin-bottom: 0.5rem;
    }

    .package-list {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .package-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      flex-wrap: wrap;
    }

    .pkg-type {
      background: #334155;
      color: #e2e8f0;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-size: 0.7rem;
    }

    .pkg-id {
      color: #38bdf8;
      font-family: ui-monospace, monospace;
    }

    .pkg-transport {
      color: #94a3b8;
      font-size: 0.75rem;
      margin-left: auto;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #334155;
    }

    .version-tag {
      font-size: 0.8rem;
      color: #64748b;
      font-family: ui-monospace, monospace;
    }

    .repo-link {
      color: #6366f1;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      transition: color 0.15s ease;
    }

    .repo-link:hover {
      color: #818cf8;
      text-decoration: underline;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 1rem;
      background: #1e293b;
      border-radius: 14px;
      border: 1px dashed #334155;
    }

    .empty-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .reset-btn {
      background: #334155;
      color: #ffffff;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      cursor: pointer;
    }

    .skeleton-card {
      min-height: 200px;
    }

    .skeleton-line {
      height: 1rem;
      background: #334155;
      border-radius: 4px;
      margin-bottom: 0.75rem;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .title-line { width: 60%; height: 1.25rem; }
    .subtitle-line { width: 40%; }
    .desc-line { width: 90%; }
    .desc-line.short { width: 70%; }

    @keyframes pulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }
  `]
})
export class McpRegistryComponent {
  private readonly registryService = inject(McpRegistryService);

  public readonly apiUrl = 'https://registry.modelcontextprotocol.io/v0.1/servers';

  // Signals for UI binding converted from service RxJS streams
  public readonly servers = toSignal(this.registryService.filteredServers$, { initialValue: [] as McpServerResponse[] });
  public readonly isLoading = toSignal(this.registryService.isLoading$, { initialValue: false });
  public readonly error = toSignal(this.registryService.error$, { initialValue: null as string | null });

  public readonly searchInputValue = signal<string>('');
  public readonly copied = signal<boolean>(false);

  public readonly skeletonItems = [1, 2, 3, 4, 5, 6];

  public onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchInputValue.set(val);
    this.registryService.searchQuery$.next(val);
  }

  public clearSearch(): void {
    this.searchInputValue.set('');
    this.registryService.searchQuery$.next('');
  }

  public onFetchServers(): void {
    this.registryService.fetchServers();
  }

  public copyApiUrl(): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.apiUrl).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      });
    }
  }
}
