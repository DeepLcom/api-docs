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

We have a custom subagent in `.claude/agents/` that is **automatically available to anyone** who clones this repo (no installation required):

- **`docs-reviewer.md`**: Designed to help edit our docs. Based on a sub-agent created by a GCP technical writer. (Read more in [this article](https://medium.com/google-cloud/supercharge-tech-writing-with-claude-code-subagents-and-agent-skills-44eb43e5a9b7), or [this repo](https://github.com/kazunori279/gcp-blogs/blob/main/.claude/agents/docs-reviewer.md).)

### Recommended Documentation Review Workflow

For the highest quality documentation, use both the diataxis plugin and docs-reviewer subagent together:

1. **Write or update documentation** - Simply ask Claude naturally:
   - "Create a tutorial for [feature]"
   - "Write a how-to guide for [task]"
   - "Document this API endpoint"

   The diataxis skill will activate automatically and ensure your content follows the correct documentation type (tutorial, how-to, reference, or explanation).

   If you prefer to write the documentation by hand, you can also say "Review this documentation".

2. **Review with the docs-reviewer subagent:**
   ```
   Use the docs-reviewer subagent on [filename]
   ```
   This checks for style, clarity, and consistency with our documentation standards.

This two-pass approach ensures both structural correctness (via diataxis) and editorial quality (via docs-reviewer).

3. **Check for broken links:**

Finally, you can run `mint broken-links` and `mint broken-links --check-anchors` to ensure all links are correct.

### Future Plans

- Add a subagent to search our codebase and backstage
- Further customize subagents to match our writing style

