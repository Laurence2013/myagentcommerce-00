import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-mcp-header',
  template: `
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
          <code class="api-url">{{ apiUrl() }}</code>
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
  `,
  styles: [`
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
  `]
})
export class McpHeaderComponent {
  public readonly apiUrl = input.required<string>();
  public readonly copied = signal<boolean>(false);

  public copyApiUrl(): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.apiUrl()).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      });
    }
  }
}
