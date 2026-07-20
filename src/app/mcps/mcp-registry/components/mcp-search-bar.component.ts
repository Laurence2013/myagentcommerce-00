import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-mcp-search-bar',
  template: `
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
            (click)="clearSearch.emit()"
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
        (click)="fetchServers.emit()"
      >
        @if (isLoading()) {
          <span class="spinner" aria-hidden="true"></span>
          <span>Fetching...</span>
        } @else {
          <span>🔄 Fetch Live Data</span>
        }
      </button>
    </section>
  `,
  styles: [`
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
  `]
})
export class McpSearchBarComponent {
  public readonly searchInputValue = input<string>('');
  public readonly isLoading = input<boolean>(false);

  public readonly searchInput = output<string>();
  public readonly clearSearch = output<void>();
  public readonly fetchServers = output<void>();

  public onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchInput.emit(val);
  }
}
