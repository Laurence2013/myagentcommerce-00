import type { McpServerResponse } from './interfaces/mcp-registry.interface';

// Comprehensive mockup data for popular official and community MCP servers.
export const MOCK_MCP_SERVERS: McpServerResponse[] = [
  {
    server: {
      name: 'modelcontextprotocol/server-postgres',
      title: 'PostgreSQL Server',
      description: 'Provides read/write access to PostgreSQL databases, enabling schema inspection and SQL queries.',
      version: '0.6.0',
      websiteUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres',
      icons: [
        { src: 'https://registry.modelcontextprotocol.io/icons/postgres.png', mimeType: 'image/png' }
      ],
      packages: [
        {
          registryType: 'npm',
          identifier: '@modelcontextprotocol/server-postgres',
          version: '0.6.0',
          transport: { type: 'stdio' },
          environmentVariables: [
            { name: 'PG_CONNECTION_STRING', description: 'PostgreSQL connection URL (postgresql://...)' }
          ]
        }
      ],
      repository: {
        url: 'https://github.com/modelcontextprotocol/servers',
        source: 'github',
        subfolder: 'src/postgres'
      }
    },
    _meta: {
      'io.modelcontextprotocol.registry/official': {
        status: 'active',
        publishedAt: '2025-12-15T08:00:00Z',
        updatedAt: '2026-03-01T12:00:00Z',
        isLatest: true
      }
    }
  },
  {
    server: {
      name: 'modelcontextprotocol/server-filesystem',
      title: 'Filesystem Access',
      description: 'Enables safe read/write operations to specific directories on the local filesystem.',
      version: '0.5.2',
      websiteUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
      packages: [
        {
          registryType: 'npm',
          identifier: '@modelcontextprotocol/server-filesystem',
          version: '0.5.2',
          transport: { type: 'stdio' },
          packageArguments: [
            { name: 'allowed-directories', type: 'positional', description: 'List of directories the server is allowed to access' }
          ]
        }
      ],
      repository: {
        url: 'https://github.com/modelcontextprotocol/servers',
        source: 'github',
        subfolder: 'src/filesystem'
      }
    },
    _meta: {
      'io.modelcontextprotocol.registry/official': {
        status: 'active',
        publishedAt: '2025-12-15T08:00:00Z',
        updatedAt: '2026-02-14T09:30:00Z',
        isLatest: true
      }
    }
  },
  {
    server: {
      name: 'modelcontextprotocol/server-github',
      title: 'GitHub API Integration',
      description: 'Integrate with GitHub to create repositories, issues, pull requests, search code, and manage workflows.',
      version: '0.7.1',
      websiteUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
      packages: [
        {
          registryType: 'npm',
          identifier: '@modelcontextprotocol/server-github',
          version: '0.7.1',
          transport: { type: 'stdio' },
          environmentVariables: [
            { name: 'GITHUB_PERSONAL_ACCESS_TOKEN', description: 'Personal Access Token with repo scope' }
          ]
        }
      ],
      repository: {
        url: 'https://github.com/modelcontextprotocol/servers',
        source: 'github',
        subfolder: 'src/github'
      }
    },
    _meta: {
      'io.modelcontextprotocol.registry/official': {
        status: 'active',
        publishedAt: '2025-12-20T10:00:00Z',
        updatedAt: '2026-04-10T14:22:00Z',
        isLatest: true
      }
    }
  },
  {
    server: {
      name: 'modelcontextprotocol/server-google-search',
      title: 'Google Custom Search',
      description: 'Connect AI agents with real-time web search capabilities using Google Custom Search JSON API.',
      version: '0.4.0',
      websiteUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/google-custom-search',
      packages: [
        {
          registryType: 'npm',
          identifier: '@modelcontextprotocol/server-google-search',
          version: '0.4.0',
          transport: { type: 'stdio' },
          environmentVariables: [
            { name: 'GOOGLE_API_KEY', description: 'Google Cloud API Key' },
            { name: 'GOOGLE_CSE_ID', description: 'Google Custom Search Engine ID' }
          ]
        }
      ],
      repository: {
        url: 'https://github.com/modelcontextprotocol/servers',
        source: 'github',
        subfolder: 'src/google-custom-search'
      }
    },
    _meta: {
      'io.modelcontextprotocol.registry/official': {
        status: 'active',
        publishedAt: '2025-12-15T08:00:00Z',
        updatedAt: '2026-01-20T11:05:00Z',
        isLatest: true
      }
    }
  },
  {
    server: {
      name: 'modelcontextprotocol/server-sqlite',
      title: 'SQLite Database Helper',
      description: 'Lightweight SQLite database inspector and query executor for fast local relational storage.',
      version: '0.3.1',
      websiteUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite',
      packages: [
        {
          registryType: 'npm',
          identifier: '@modelcontextprotocol/server-sqlite',
          version: '0.3.1',
          transport: { type: 'stdio' },
          environmentVariables: [
            { name: 'SQLITE_DB_PATH', description: 'Path to SQLite database file' }
          ]
        }
      ],
      repository: {
        url: 'https://github.com/modelcontextprotocol/servers',
        source: 'github',
        subfolder: 'src/sqlite'
      }
    },
    _meta: {
      'io.modelcontextprotocol.registry/official': {
        status: 'active',
        publishedAt: '2026-01-05T09:00:00Z',
        updatedAt: '2026-02-18T16:45:00Z',
        isLatest: true
      }
    }
  },
  {
    server: {
      name: 'modelcontextprotocol/server-slack',
      title: 'Slack Webhook & API Client',
      description: 'Enables chat updates, channel reading, history viewing, and direct message actions in Slack.',
      version: '0.5.0',
      websiteUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/slack',
      packages: [
        {
          registryType: 'npm',
          identifier: '@modelcontextprotocol/server-slack',
          version: '0.5.0',
          transport: { type: 'stdio' },
          environmentVariables: [
            { name: 'SLACK_BOT_TOKEN', description: 'Bot User OAuth Token (xoxb-...)' }
          ]
        }
      ],
      repository: {
        url: 'https://github.com/modelcontextprotocol/servers',
        source: 'github',
        subfolder: 'src/slack'
      }
    },
    _meta: {
      'io.modelcontextprotocol.registry/official': {
        status: 'active',
        publishedAt: '2026-01-12T15:30:00Z',
        updatedAt: '2026-03-24T10:12:00Z',
        isLatest: true
      }
    }
  },
  {
    server: {
      name: 'modelcontextprotocol/server-memory',
      title: 'Persistent Graph Memory',
      description: 'Maintains long-term semantic knowledge in a dynamic entity-relationship knowledge graph.',
      version: '0.8.2',
      websiteUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/memory',
      packages: [
        {
          registryType: 'npm',
          identifier: '@modelcontextprotocol/server-memory',
          version: '0.8.2',
          transport: { type: 'stdio' }
        }
      ],
      repository: {
        url: 'https://github.com/modelcontextprotocol/servers',
        source: 'github',
        subfolder: 'src/memory'
      }
    },
    _meta: {
      'io.modelcontextprotocol.registry/official': {
        status: 'active',
        publishedAt: '2025-12-15T08:00:00Z',
        updatedAt: '2026-05-02T11:40:00Z',
        isLatest: true
      }
    }
  },
  {
    server: {
      name: 'agentic-commerce/server-stripe-payment',
      title: 'Stripe Payment & Escrow Gateway',
      description: 'Agentic payment processing, tokenized checkout, cart invoice generation, AP2 & L402 protocol support for automated transactions.',
      version: '1.0.0',
      websiteUrl: 'https://github.com/agentic-commerce/server-stripe-payment',
      packages: [
        {
          registryType: 'npm',
          identifier: '@agentic-commerce/server-stripe-payment',
          version: '1.0.0',
          transport: { type: 'stdio' },
          environmentVariables: [
            { name: 'STRIPE_SECRET_KEY', description: 'Stripe API secret key for tokenized payments' }
          ]
        }
      ],
      repository: {
        url: 'https://github.com/agentic-commerce/server-stripe-payment',
        source: 'github'
      }
    },
    _meta: {
      'io.modelcontextprotocol.registry/official': {
        status: 'active',
        publishedAt: '2026-02-01T00:00:00Z',
        updatedAt: '2026-06-15T00:00:00Z',
        isLatest: true
      }
    }
  },
  {
    server: {
      name: 'agentic-commerce/server-catalog-infrastructure',
      title: 'Shopify & Medusa Catalog Infrastructure',
      description: 'Unified catalog inventory management across Shopify, WooCommerce, and Medusa. Supports SKU search, GTIN tracking, and product updates.',
      version: '1.1.0',
      websiteUrl: 'https://github.com/agentic-commerce/server-catalog-infrastructure',
      packages: [
        {
          registryType: 'npm',
          identifier: '@agentic-commerce/server-catalog-infrastructure',
          version: '1.1.0',
          transport: { type: 'stdio' }
        }
      ],
      repository: {
        url: 'https://github.com/agentic-commerce/server-catalog-infrastructure',
        source: 'github'
      }
    },
    _meta: {
      'io.modelcontextprotocol.registry/official': {
        status: 'active',
        publishedAt: '2026-03-01T00:00:00Z',
        updatedAt: '2026-07-01T00:00:00Z',
        isLatest: true
      }
    }
  },
  {
    server: {
      name: 'agentic-commerce/server-b2b-pricing',
      title: 'A2A Dynamic Pricing & Negotiation',
      description: 'B2B rules engine for dynamic pricing, wholesale discount calculation, price elasticity modeling, and A2A negotiation workflows.',
      version: '1.2.0',
      websiteUrl: 'https://github.com/agentic-commerce/server-b2b-pricing',
      packages: [
        {
          registryType: 'npm',
          identifier: '@agentic-commerce/server-b2b-pricing',
          version: '1.2.0',
          transport: { type: 'stdio' }
        }
      ],
      repository: {
        url: 'https://github.com/agentic-commerce/server-b2b-pricing',
        source: 'github'
      }
    },
    _meta: {
      'io.modelcontextprotocol.registry/official': {
        status: 'active',
        publishedAt: '2026-04-10T00:00:00Z',
        updatedAt: '2026-07-15T00:00:00Z',
        isLatest: true
      }
    }
  }
];

