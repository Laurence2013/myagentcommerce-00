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
