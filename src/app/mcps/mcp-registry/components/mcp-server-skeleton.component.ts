import { Component } from '@angular/core';

@Component({
  selector: 'app-mcp-server-skeleton',
  template: `
    <div class="server-card skeleton-card">
      <div class="skeleton-line title-line"></div>
      <div class="skeleton-line subtitle-line"></div>
      <div class="skeleton-line desc-line"></div>
      <div class="skeleton-line desc-line short"></div>
    </div>
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
export class McpServerSkeletonComponent {}
