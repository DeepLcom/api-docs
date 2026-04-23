# DeepL Developer Docs

This repo is home to the [DeepL Developer Docs](https://developers.deepl.com/).

## Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify) to preview the documentation changes locally. To install, use the following command

```
npm i -g mintlify
```

Run the following command at the root of your documentation (where docs.json is)

```
mintlify dev
```

### Publishing Changes

Install our Github App to auto propagate changes from your repo to your deployment. Changes will be deployed to production automatically after pushing to the default branch. Find the link to install on your dashboard.

#### Troubleshooting

- Mintlify dev isn't running - Run `mintlify install` it'll re-install dependencies.
- Page loads as a 404 - Make sure you are running in a folder with `docs.json`

## AI Workflow

### Setting Up the DeepL Claude Code Marketplace (DeepL Internal Only)

**DeepL team members:** Install our internal Claude Code marketplace to access the `diataxis-documentation` plugin for structured technical writing:

1. **Add the marketplace:**
```
/plugin marketplace add https://git.deepl.dev/deepl/devex/ai-tooling/claude-code-marketplace.git
```

2. **Install the diataxis-documentation plugin:**
```
/plugin install diataxis-documentation@deepl-claude-code-marketplace
```

This gives you access to the Diátaxis framework for creating tutorials, how-to guides, references, and explanations.

**The skill activates automatically** when you ask Claude to:
- "write documentation", "create tutorial", "create guide"
- "write how-to", "document this", "add documentation"
- "review documentation", "improve docs", "check documentation quality"
- Mention "technical writing", "reference docs", "explanation"

When creating new documentation, the skill will:
1. Help identify the correct documentation type (tutorial, how-to, reference, or explanation)
2. Guide you through following Diátaxis writing principles
3. Provide examples of good documentation structure

### Subagents (Available to Everyone)

Agents in `.claude/agents/` are automatically available to anyone who clones this repo:

| Agent | Purpose | When to use |
|-------|---------|-------------|
| `docs-review` | Orchestrator that runs editorial + Diataxis reviews in parallel and writes a single report | Before opening a PR, or reviewing someone else's PR |
| `diataxis` | Full Diataxis framework expert for both writing and reviewing | Writing new content or checking type adherence |
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
mintlify broken-links
mintlify broken-links --check-anchors
```

