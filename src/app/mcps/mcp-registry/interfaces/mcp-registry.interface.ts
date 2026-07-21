export interface McpIcon {
  src: string;
  mimeType?: string;
  sizes?: string[];
  theme?: 'light' | 'dark';
}

export interface McpPackage {
  registryType: string;
  identifier: string;
  version: string;
  transport: {
    type: string;
    url?: string;
  };
  environmentVariables?: Array<{ name: string; description?: string }>;
  packageArguments?: Array<{
    name: string;
    type: string;
    description?: string;
    value?: string;
    default?: string;
    placeholder?: string;
  }>;
}

export interface McpRepository {
  url?: string;
  source?: string;
  id?: string;
  subfolder?: string;
}

export interface McpServerJSON {
  name: string;
  description: string;
  version: string;
  title?: string;
  websiteUrl?: string;
  icons?: McpIcon[];
  packages?: McpPackage[];
  repository?: McpRepository;
}

export interface McpServerResponse {
  server: McpServerJSON;
  _meta: {
    'io.modelcontextprotocol.registry/official': {
      status: 'active' | 'deprecated' | 'deleted';
      publishedAt: string;
      updatedAt: string;
      isLatest: boolean;
    };
  };
}

export interface McpRegistryResponse {
  servers: McpServerResponse[];
  metadata: {
    count: number;
    nextCursor?: string;
  };
}

export interface CommerceKeywordCategories {
  transactions: string[];
  catalogInfrastructure: string[];
  pricingB2bRules: string[];
  agenticProtocols: string[];
  autonomousProcurement: string[];
}

export const COMMERCE_KEYWORDS: CommerceKeywordCategories = {
  transactions: ['payment', 'checkout', 'cart', 'invoice', 'stripe', 'tokenized'],
  catalogInfrastructure: ['shopify', 'woocommerce', 'medusa', 'catalog', 'inventory', 'sku', 'gtin'],
  pricingB2bRules: ['pricing', 'discount', 'wholesale', 'negotiation', 'elasticity'],
  agenticProtocols: ['ap2', 'x402', 'a2a', 'acp', 'ucp', 'mcp'],
  autonomousProcurement: ['procurement', 'rfq', 'fulfillment', 'logistics', 'order', 'supply', 'settlement']
};

export interface ParsedCommerceMetadata {
  isCommerceTool: boolean;
  matchedCategories: Array<'transactions' | 'catalogInfrastructure' | 'pricingB2bRules' | 'agenticProtocols' | 'autonomousProcurement'>;
  matchedKeywords: {
    transactions: string[];
    catalogInfrastructure: string[];
    pricingB2bRules: string[];
    agenticProtocols: string[];
    autonomousProcurement: string[];
  };
}

export interface CommerceServerCategorization {
  transactions: McpServerResponse[];
  catalogInfrastructure: McpServerResponse[];
  pricingB2bRules: McpServerResponse[];
  agenticProtocols: McpServerResponse[];
  autonomousProcurement: McpServerResponse[];
  allCommerceServers: McpServerResponse[];
}

