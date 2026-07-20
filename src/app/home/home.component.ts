import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home-container">
      <header class="hero-section">
        <div class="hero-badge">
          <span>🚀 Agentic Commerce Hub</span>
        </div>
        <h1 class="hero-title">Welcome to MyAgentCommerce</h1>
        <p class="hero-description">
          The next-generation platform for AI agent commerce, protocol registries, and intelligent tool integrations.
        </p>

        <div class="cta-actions">
          <a routerLink="/mcp-registry" class="btn btn-primary" id="go-to-mcp-registry-btn">
            <span>🔌 Open MCP Registry</span>
            <span class="arrow">→</span>
          </a>
        </div>
      </header>

      <section class="features-section">
        <h2 class="section-title">Core Platform Modules</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🔌</div>
            <h3>MCP Registry</h3>
            <p>Discover, inspect, and connect official Model Context Protocol (MCP) servers.</p>
            <a routerLink="/mcp-registry" class="feature-link">Explore Registry &amp; API →</a>
          </div>

          <div class="feature-card disabled-card">
            <div class="feature-icon">🤖</div>
            <h3>Agent Marketplace</h3>
            <p>Deploy and manage autonomous commercial agents across networks.</p>
            <span class="coming-soon">Coming Soon</span>
          </div>

          <div class="feature-card disabled-card">
            <div class="feature-icon">⚡</div>
            <h3>Commerce APIs</h3>
            <p>High-throughput transactional pipelines tailored for AI agent execution.</p>
            <span class="coming-soon">Coming Soon</span>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      background: #0b0f19;
      color: #f3f4f6;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .home-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 4rem 1.5rem;
    }

    .hero-section {
      text-align: center;
      margin-bottom: 4rem;
    }

    .hero-badge {
      display: inline-block;
      padding: 0.35rem 0.9rem;
      border-radius: 9999px;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #818cf8;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin: 0 0 1rem 0;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-description {
      font-size: 1.2rem;
      color: #94a3b8;
      max-width: 650px;
      margin: 0 auto 2rem auto;
      line-height: 1.6;
    }

    .cta-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .btn {
      padding: 0.85rem 1.75rem;
      border-radius: 10px;
      font-weight: 700;
      font-size: 1rem;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: #ffffff;
      box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 30px -5px rgba(79, 70, 229, 0.55);
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: #e2e8f0;
      text-align: center;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .feature-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 14px;
      padding: 1.75rem;
      transition: all 0.2s ease;
    }

    .feature-card:hover:not(.disabled-card) {
      border-color: #6366f1;
      transform: translateY(-2px);
    }

    .disabled-card {
      opacity: 0.6;
    }

    .feature-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: #f8fafc;
    }

    .feature-card p {
      color: #94a3b8;
      font-size: 0.95rem;
      line-height: 1.5;
      margin: 0 0 1.25rem 0;
    }

    .feature-link {
      color: #818cf8;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .feature-link:hover {
      text-decoration: underline;
    }

    .coming-soon {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: #334155;
      color: #94a3b8;
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      font-weight: 600;
    }
  `]
})
export class HomeComponent {}
