# Node CLI Accelerator

A fast and interactive CLI tool for scaffolding Node.js/Express projects with customizable configurations.

## Features

- 🚀 **Quick Setup** - Interactive CLI for rapid project creation
- 🎯 **Language Choice** - Support for JavaScript or TypeScript
- 📦 **Smart Dependencies** - Pre-configured with Express, CORS, SQLite and more
- 🔧 **ESLint Integration** - Optional code linting setup
- ⚡ **Ready to Run** - Generated projects include dev/build scripts

## Usage

```bash
npm start
```

Follow the interactive prompts to:
1. Name your project
2. Choose JavaScript or TypeScript
3. Customize dependencies
4. Configure ESLint (optional)
5. Generate your project

## Generated Project Structure

```
my-project/
├── src/
│   └── server.js|ts    # Express server with basic setup
├── .env                # Environment variables
├── .gitignore         # Git ignore rules
├── package.json       # Dependencies and scripts
└── eslint.config.mjs  # ESLint config (if enabled)
```

The generated server includes CORS, environment config, error handling, and a basic "Hello World" endpoint.
