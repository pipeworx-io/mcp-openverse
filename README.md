# @pipeworx/openverse

[Openverse](https://openverse.org) MCP — search the union catalog of Creative-Commons-licensed images + audio (Wikimedia, Flickr, museums, etc). Keyless (anonymous tier is rate-limited but usable).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `search_images(query, filters?)` — search CC-licensed images
- `search_audio(query, filters?)` — search CC-licensed audio
- `get_image(id)` — single image record
- `get_audio(id)` — single audio record
- `image_related(id)` — related images
- `audio_related(id)` — related audio

## Data source

`https://api.openverse.engineering/v1/`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "openverse": {
      "url": "https://gateway.pipeworx.io/openverse/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Openverse data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
