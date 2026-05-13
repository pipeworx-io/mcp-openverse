interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Openverse MCP — Creative-Commons-licensed image + audio search.
 *
 * Auth: optional (anonymous rate-limited). Docs: https://api.openverse.engineering/v1/
 */


const BASE = 'https://api.openverse.engineering/v1';
const UA = 'pipeworx-mcp-openverse/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'search_images',
    description: 'Search Creative-Commons-licensed images.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        license: { type: 'string', description: 'comma-separated, e.g. "cc0,by"' },
        license_type: { type: 'string', description: '"commercial" | "modification" | "all"' },
        size: { type: 'string', description: '"small" | "medium" | "large"' },
        source: { type: 'string', description: 'Provider id, e.g. "flickr","met","wikimedia"' },
        page: { type: 'number' },
        page_size: { type: 'number', description: '1-500 (default 20)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_audio',
    description: 'Search Creative-Commons-licensed audio.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        license: { type: 'string' },
        license_type: { type: 'string' },
        source: { type: 'string' },
        page: { type: 'number' },
        page_size: { type: 'number' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_image',
    description: 'Single image record by id.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id'],
    },
  },
  {
    name: 'get_audio',
    description: 'Single audio record by id.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id'],
    },
  },
  {
    name: 'image_related',
    description: 'Related images for a given image id.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id'],
    },
  },
  {
    name: 'audio_related',
    description: 'Related audio for a given audio id.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_images':
      return ovGet(`/images?${buildSearch(args)}`);
    case 'search_audio':
      return ovGet(`/audio?${buildSearch(args)}`);
    case 'get_image':
      return ovGet(`/images/${encodeURIComponent(reqStr(args, 'id', '"<uuid>"'))}`);
    case 'get_audio':
      return ovGet(`/audio/${encodeURIComponent(reqStr(args, 'id', '"<uuid>"'))}`);
    case 'image_related':
      return ovGet(`/images/${encodeURIComponent(reqStr(args, 'id', '"<uuid>"'))}/related`);
    case 'audio_related':
      return ovGet(`/audio/${encodeURIComponent(reqStr(args, 'id', '"<uuid>"'))}/related`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function buildSearch(args: Record<string, unknown>): string {
  const params = new URLSearchParams({ q: reqStr(args, 'query', '"sunset"') });
  for (const key of ['license', 'license_type', 'size', 'source'] as const) {
    if (args[key]) params.set(key, String(args[key]));
  }
  params.set('page', String(Math.max(1, (args.page as number) ?? 1)));
  params.set('page_size', String(Math.min(500, Math.max(1, (args.page_size as number) ?? 20))));
  return params.toString();
}

async function ovGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 401 || res.status === 403) throw new Error('Openverse: anonymous access denied — upstream rate-limit?');
  if (res.status === 429) throw new Error('Openverse: rate-limit (HTTP 429)');
  if (res.status === 404) throw new Error('Openverse: not found');
  if (!res.ok) throw new Error(`Openverse: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
