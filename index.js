// Write a script that will automate your setup
import { spawnSync, execSync } from "node:child_process";
import fs from "node:fs";
let folderExits = false;
try {
  const folder = fs.mkdirSync("./test", { recursive: true });
  if (!folder) {
    folderExits = true;
  } else {
    console.log("Synchronous folder created successfully!");
    folderExits = true;
  }
} catch (err) {
  console.error("Error creating folder synchronously:", err);
}

if (folderExits) {
  // Create project structure with domain-driven organization
  const folders = [
    './test/src',
    './test/src/shared',
    './test/src/shared/middleware',
    './test/src/shared/utils',
    './test/src/shared/config',
    './test/src/modules',
    './test/src/modules/users',
    './test/src/modules/users/controllers',
    './test/src/modules/users/services',
    './test/src/modules/users/models',
    './test/src/modules/users/repositories',
    './test/src/modules/auth',
    './test/src/modules/auth/controllers',
    './test/src/modules/auth/services',
    './test/src/modules/auth/middleware',
    './test/public',
    './test/test/integration',
    './test/test/unit'
  ];

  folders.forEach(folder => {
    try {
      fs.mkdirSync(folder, { recursive: true });
      console.log(`Created directory: ${folder}`);
    } catch (err) {
      console.error(`Error creating directory ${folder}:`, err);
    }
  });

  // Create initial files
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
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    message: 'Welcome to the API'
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({
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

export default app;
`;

  fs.writeFileSync('./test/src/server.ts', serverContent, 'utf8');
  fs.writeFileSync('./test/.env', 'PORT=3000\nNODE_ENV=development', 'utf8');
  fs.writeFileSync('./test/.gitignore', 'node_modules\n.env\ndist\n.DS_Store\ncoverage\n', 'utf8');
  
  // Syntax ->  spawn(command, arr => argument, obj => folderPath/filePath)
  // Syntax ->  exec(command, obj => folderPath/filePath, callback)
  const exc = execSync("npm init -y", { cwd: "./test" });

  // Create the commands which will be executed
  const installCommand = "npm install express nodemon better-sqlite3 dotenv cors";
  const installTS = "npm install --save-dev @types/node @types/express @types/cors @types/better-sqlite3 typescript ts-node";

  const dependencies = "npm install express nodemon better-sqlite3 dotenv cors globals";

  const installLint = "npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin"
  const devDependencies = "npm install --save-dev @eslint/js @types/better-sqlite3 @types/cors @types/express @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint ts-node typescript typescript-eslint";
  const initTS = "npx tsc --init";

  

  const excCommands = execSync(dependencies, { cwd: "./test" });
  const excTs = execSync(devDependencies, { cwd: "./test" });
  
  const excInitTs = execSync(initTS, { cwd: "./test" }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
  
   const excLint = execSync(installLint, { cwd: "./test" }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
  
  // TODO: handle the errors
  const createEslintConfig = spawnSync("touch", ["eslint.config.mjs"], { cwd: "./test" });

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
  });

} 
