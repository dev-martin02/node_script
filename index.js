import { execSync } from "node:child_process";
import fs from "node:fs";

// Function to create project structure
export function createProject(projectName, projectType, dependencies, useEslint = false) {
  let folderExists = false;

  try {
    const folder = fs.mkdirSync(`./${projectName}`, { recursive: true });
    if (!folder) {
      folderExists = true;
    } else {
      console.log("Folder created successfully!");
      folderExists = true;
    }
  } catch (err) {
    console.error("Error creating folder synchronously:", err);
    return false;
  }

  if (folderExists) {
    // Create project structure
    const folders = [
      `./${projectName}/src`
    ];

    folders.forEach(folder => {
      try {
        fs.mkdirSync(folder, { recursive: true });
        console.log(`Created directory: ${folder}`);
      } catch (err) {
        console.error(`Error creating directory ${folder}:`, err);
      }
    });

    // Determine file extension and content based on project type
    const fileExtension = projectType === 'ts' ? 'ts' : 'js';
    const serverContent = projectType === 'ts' ? 
      getTypeScriptServerContent() : 
      getJavaScriptServerContent();

    // Write main server file
    fs.writeFileSync(`./${projectName}/src/server.${fileExtension}`, serverContent, 'utf8');
    
    // Write configuration files
    fs.writeFileSync(`./${projectName}/.env`, 'PORT=3000\nNODE_ENV=development', 'utf8');
    fs.writeFileSync(`./${projectName}/.gitignore`, 'node_modules\n.env\ndist\n.DS_Store\ncoverage\n', 'utf8');
  
    // Install dependencies
    try {
      console.log('Initializing npm...');
      execSync('npm init -y', { cwd: `./${projectName}`, stdio: 'inherit' });

      if (dependencies.length > 0) {
        const dependenciesStr = dependencies.join(' ');
        console.log('Installing dependencies...');
        execSync(`npm install ${dependenciesStr}`, { cwd: `./${projectName}`, stdio: 'inherit' });
      }

      // Initialize TypeScript if needed
      if (projectType === 'ts') {
        console.log('Initializing TypeScript...');
        execSync('npx tsc --init', { cwd: `./${projectName}`, stdio: 'inherit' });
      }

      // Setup ESLint if requested
      if (useEslint) {
        console.log('Setting up ESLint...');
        const eslintConfigContent = getEslintConfig(projectType);
        fs.writeFileSync(`./${projectName}/eslint.config.mjs`, eslintConfigContent, 'utf8');
      }

      console.log('Project created successfully!');
      return true;
    } catch (error) {
      console.error('Error during project setup:', error.message);
      return false;
    }
  }
  
  return false;
}
// Helper function to get TypeScript server content
function getTypeScriptServerContent() {
  return `import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    message: 'Hello World!!!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(port, () => {
  console.log(\`⚡️[server]: Server is running at http://localhost:\${port}\`);
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  return res.status(500).json({
    error: 'Something broke!'
  });
});
`;
}

// Helper function to get JavaScript server content
function getJavaScriptServerContent() {
  return `const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Hello World!!!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(port, () => {
  console.log(\`⚡️[server]: Server is running at http://localhost:\${port}\`);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.status(500).json({
    error: 'Something broke!'
  });
});
`;
}

// Helper function to get ESLint configuration
function getEslintConfig(projectType) {
  if (projectType === 'ts') {
    return `import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn'],
      'arrow-body-style': ['error', 'always'],
    },
  },
];
`;
  } else {
    return `import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': ['warn'],
      'arrow-body-style': ['error', 'always'],
    },
  },
];
`;
  }
} 
