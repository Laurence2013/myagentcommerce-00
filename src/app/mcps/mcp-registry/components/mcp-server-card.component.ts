import { Component, input } from '@angular/core';
import type { McpServerResponse } from '../interfaces/mcp-registry.interface';

@Component({
  selector: 'app-mcp-server-card',
  template: `
    <article class="server-card" [id]="'server-card-' + item().server.name">
      <div class="card-top">
        <div class="card-heading">
          <h2 class="server-title">
            {{ item().server.title || item().server.name }}
          </h2>
          <span class="server-name-tag">{{ item().server.name }}</span>
        </div>
        <span
          class="status-badge"
          [class.status-active]="item()._meta['io.modelcontextprotocol.registry/official'].status === 'active'"
          [class.status-deprecated]="item()._meta['io.modelcontextprotocol.registry/official'].status === 'deprecated'"
        >
          {{ item()._meta['io.modelcontextprotocol.registry/official'].status }}
        </span>
      </div>

      <p class="server-description">
        {{ item().server.description }}
      </p>

      @if (item().server.packages?.length) {
        <div class="packages-section">
          <span class="packages-label">Packages & Transport:</span>
          <div class="package-list">
            @for (pkg of item().server.packages; track pkg.identifier) {
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
        <span class="version-tag">v{{ item().server.version }}</span>
        @if (item().server.repository?.url) {
          <a
            [href]="item().server.repository?.url"
            target="_blank"
            rel="noopener noreferrer"
            class="repo-link"
            [id]="'repo-link-' + item().server.name"
          >
            Repository ↗
          </a>
        }
      </div>
    </article>
  `,
  styles: [`
    :host {
      display: flex;
    }

    .server-card {
      width: 100%;
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
  `]
})
export class McpServerCardComponent {
  public readonly item = input.required<McpServerResponse>();
}
