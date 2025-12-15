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

We have a subagent, `docs-reviewer.md`, designed to help us edit our docs. It's based on a sub-agent created by a GCP technical writer. (Read more in [this article](https://medium.com/google-cloud/supercharge-tech-writing-with-claude-code-subagents-and-agent-skills-44eb43e5a9b7), or [this repo](https://github.com/kazunori279/gcp-blogs/blob/main/.claude/agents/docs-reviewer.md).) It can be triggered via a Claude Code command like:

`Use the docs-reviewer subagent on [filename]`

Future plans for AI workflows:

- Add a subagent to search our codebase and backstage
- Further customize subagents to match our writing style

