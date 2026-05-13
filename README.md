# mcp-openverse

Openverse Creative-Commons image + audio search

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_images` | Search Creative-Commons-licensed images. |
| `search_audio` | Search Creative-Commons-licensed audio. |
| `get_image` | Single image record by id. |
| `get_audio` | Single audio record by id. |
| `image_related` | Related images for a given image id. |
| `audio_related` | Related audio for a given audio id. |

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

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
