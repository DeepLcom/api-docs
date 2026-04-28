# DeepL Developer Docs

This repo is home to the [DeepL Developer Docs](https://developers.deepl.com/).

## Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mint) to preview the documentation changes locally. To install, use the following command

```
npm i -g mint
```

Run the following command at the root of your documentation (where docs.json is)

```
mint dev
```

### Migrating from the old `mintlify` CLI

If you have the deprecated `mintlify` package installed, replace it with `mint`:

```
npm uninstall -g mintlify
npm cache clean --force
npm i -g mint
```

### Publishing Changes

Install our Github App to auto propagate changes from your repo to your deployment. Changes will be deployed to production automatically after pushing to the default branch. Find the link to install on your dashboard.

#### Troubleshooting

- Mint dev isn't running - Run `mint install` to re-install dependencies.
- Page loads as a 404 - Make sure you are running in a folder with `docs.json`

## AI Workflow

Agents in `.claude/agents/` are automatically available to anyone who clones this repo:

| Agent | Purpose | When to use |
|-------|---------|-------------|
| `diataxis` | Full Diataxis framework expert for both writing and reviewing | Writing new content or checking type adherence |
| `docs-review` | Orchestrator that runs editorial + Diataxis reviews in parallel and writes a single report | Before opening a PR, or reviewing someone else's PR |
| `editorial-reviewer` | Checks style, structure, code examples against CLAUDE.md | Called by `docs-review` (you don't need to invoke directly) |

### Recommended Workflow

**Writing new content:**
```
Use the diataxis agent to help me write a how-to guide for [topic]
```

**Before opening a PR:**
```
Use the docs-review agent on [filename]
```

**Check for broken links:**
```
mint broken-links
mint broken-links --check-anchors
```

