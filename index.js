import { spawnSync, execSync } from "node:child_process";
import fs from "node:fs";

let folderExits = false;
try {
  const folder = fs.mkdirSync("./test", { recursive: true });
  if (!folder) {
    folderExits = true;
  } else {
    console.log("Folder created successfully!");
    folderExits = true;
  }
} catch (err) {
  console.error("Error creating folder synchronously:", err);
}

if (folderExits) {
  // Create project structure with domain-driven organization
  const folders = [
    './test/src'
  ];

  folders.forEach(folder => {
    try {
      fs.mkdirSync(folder, { recursive: true });
      console.log(`Created directory: ${folder}`);
    } catch (err) {
      console.error(`Error creating directory ${folder}:`, err);
    }
  });

  // Write content for the main file
  const serverContent = `
import express, { Express, Request, Response } from 'express';
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
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  return res.status(500).json({
    error: 'Something broke!'
  });
});
`;

  fs.writeFileSync('./test/src/server.ts', serverContent, 'utf8');
  fs.writeFileSync('./test/.env', 'PORT=3000\nNODE_ENV=development', 'utf8');
  fs.writeFileSync('./test/.gitignore', 'node_modules\n.env\ndist\n.DS_Store\ncoverage\n', 'utf8');
  

  // Package list, which will be installed 
  const dependenciesArr = ['express', 'nodemon', 'better-sqlite3', 'dotenv', 'cors'];
  const typescriptDependencies = ['@types/node', '@types/express', '@types/cors', '@types/better-sqlite3', 'typescript', 'ts-node'];

  let dependenciesStr = "npm install ";
  for (let i = 0; i < dependenciesArr.length; i++) {
    dependenciesStr += dependenciesArr[i] + " ";
  }

  let tsDependenciesStr = "npm install ";
  for (let i = 0; i < typescriptDependencies.length; i++) {
    tsDependenciesStr += typescriptDependencies[i] + " ";
  }
  tsDependenciesStr += "--save-dev";


  // Install ESLint and TypeScript ESLint plugins
  let installLint = "npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin"
  let devDependencies = "npm install @eslint/js @types/better-sqlite3 @types/cors @types/express @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint ts-node typescript typescript-eslint --save-dev";
  const initTS = "npx tsc --init";
  const eslintConfig = "touch eslint.config.mjs"

  const initStr = "npm init -y";
  
  const commandsArr = [initStr, dependenciesStr, devDependencies, initTS, installLint, eslintConfig];
  for (let i = 0; i < commandsArr.length; i++) {
     execSync(commandsArr[i], { cwd: "./test" }, (error, stdout, stderr) => {
      if (error) {
      console.error(`Error executing command: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    })
  }}
  const eslinitConfigContent = `
    import js from '@eslint/js';
    import tseslint from 'typescript-eslint';
    import globals from 'globals';
    
    const config = await tseslint.config({
      files: ['**/*.ts'],
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          sourceType: 'module',
        },
        globals: {
          ...globals.node,
        },
      },
      plugins: {
        '@typescript-eslint': tseslint.plugin,
      },
      rules: {
        '@typescript-eslint/no-unused-vars': ['warn'],
        'arrow-body-style': ['error', 'always'],
      },
    });
    export default [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...config,
    ];
  `
  const eslinitConfigPath = "./test/eslint.config.mjs";
  fs.writeFileSync(eslinitConfigPath, eslinitConfigContent, 'utf8', (err) => {
    if (err) {
      console.error("Error writing ESLint config file:", err);
    }
  }) 
