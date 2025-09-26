import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export function createProject(projectName, projectType, dependencies, useEslint) {
  try {
    // Create project directory
    const projectPath = `./${projectName}`;
    
    if (fs.existsSync(projectPath)) {
      console.error(`Error: Directory ${projectName} already exists!`);
      return false;
    }
    
    fs.mkdirSync(projectPath, { recursive: true });

    // Create project structure
    const folders = [
      path.join(projectPath, 'src')
    ];

    folders.forEach(folder => {
      try {
        fs.mkdirSync(folder, { recursive: true });
      } catch (err) {
        console.error(`Error creating directory ${folder}:`, err);
      }
    });

    // Create main server file content based on project type
    const serverContent = projectType === 'ts' ? createTypeScriptServerContent() : createJavaScriptServerContent();
    const serverFile = projectType === 'ts' ? 'server.ts' : 'server.js';
    
    // Write main server file
    fs.writeFileSync(path.join(projectPath, 'src', serverFile), serverContent, 'utf8');
    
    // Create environment file
    fs.writeFileSync(path.join(projectPath, '.env'), 'PORT=3000\nNODE_ENV=development', 'utf8');
    
    // Create gitignore
    fs.writeFileSync(path.join(projectPath, '.gitignore'), 'node_modules\n.env\ndist\n.DS_Store\ncoverage\n', 'utf8');
    
    // Create package.json
    createPackageJson(projectPath, projectName, projectType, useEslint, dependencies);
    
    // Create TypeScript config if needed
    if (projectType === 'ts') {
      createTypeScriptConfig(projectPath);
    }
    
    // Create ESLint config if needed
    if (useEslint) {
      createEslintConfig(projectPath, projectType);
    }
    
    return true;
    
  } catch (error) {
    console.error('Error creating project:', error);
    return false;
  }
}

function createTypeScriptServerContent() {
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
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  return res.status(500).json({
    error: 'Something broke!'
  });
});
`;
}

function createJavaScriptServerContent() {
  return `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

function createPackageJson(projectPath, projectName, projectType, useEslint, dependencies) {

  /*
    ****************************************************
    this function is used to get the latest version of a package
      async function getLatestVersion(packageName) {
        try {
          const { execSync } = await import('child_process');
          const result = execSync(`npm view ${packageName} version`, { encoding: 'utf8' });
          return result.trim();
        } catch (error) {
          return 'latest'; // fallback
        }
      }

  */
  const packageJson = {
    name: projectName,
    version: "1.0.0",
    description: "",
    main: projectType === 'ts' ? "dist/server.js" : "src/server.js",
    type: "module",
    scripts: {
      test: "echo \"Error: no test specified\" && exit 1"
    },
    keywords: [],
    author: "",
    license: "ISC",
    dependencies: {},
    devDependencies: {}
  };

  // Add scripts based on project type
  if (projectType === 'ts') {
    packageJson.scripts = {
      ...packageJson.scripts,
      dev: "ts-node src/server.ts",
      build: "tsc",
      start: "node dist/server.js"
    };
  } else {
    packageJson.scripts = {
      ...packageJson.scripts,
      dev: "nodemon src/server.js",
      start: "node src/server.js"
    };
  }

  // Add lint script if ESLint is enabled
  if (useEslint) {
    packageJson.scripts.lint = "eslint src/**/*";
    packageJson.scripts["lint:fix"] = "eslint src/**/* --fix";
  }

  // Separate dependencies into regular and dev dependencies
  const prodDependencies = [
    'express', 'cors', 'dotenv', 'better-sqlite3'
  ];
  
  const devDependencies = [
    'nodemon', 'eslint', '@eslint/js', 'globals',
    'typescript', 'ts-node', '@typescript-eslint/eslint-plugin', 
    '@typescript-eslint/parser'
  ];

  // Add dependencies to package.json
  dependencies.forEach(dep => {
    if (dep.startsWith('@types/')) {
      packageJson.devDependencies[dep] = 'latest';
    } else if (devDependencies.includes(dep)) {
      packageJson.devDependencies[dep] = 'latest';
    } else {
      packageJson.dependencies[dep] = 'latest';
    }
  });

  // Set specific versions for common packages
  const versions = {
    'express': "latest",
    'cors': "latest",
    'dotenv': "latest",
    'better-sqlite3': "latest",
    'nodemon': "latest",
    'typescript': "latest",
    'ts-node': "latest",
    'eslint': "latest",
    '@eslint/js': "latest",
    'globals': "latest",
    '@typescript-eslint/eslint-plugin': "latest",
    '@typescript-eslint/parser': "latest"
  };

  // Apply specific versions where available
  Object.keys(packageJson.dependencies).forEach(dep => {
    if (versions[dep]) {
      packageJson.dependencies[dep] = versions[dep];
    }
  });

  Object.keys(packageJson.devDependencies).forEach(dep => {
    if (versions[dep]) {
      packageJson.devDependencies[dep] = versions[dep];
    } else if (dep.startsWith('@types/')) {
      // Use latest version for @types packages
      packageJson.devDependencies[dep] = 'latest';
    }
  });

  fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8');
}

function createTypeScriptConfig(projectPath) {
  const tsConfig = {
    compilerOptions: {
      target: "ES2020",
      module: "ESNext",
      moduleResolution: "node",
      outDir: "./dist",
      rootDir: "./src",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist"]
  };

  fs.writeFileSync(path.join(projectPath, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2), 'utf8');
}

function createEslintConfig(projectPath, projectType) {
  if (projectType === 'ts') {
    const eslintConfig = `import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
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
  }
];
`;
    fs.writeFileSync(path.join(projectPath, 'eslint.config.mjs'), eslintConfig, 'utf8');
  } else {
    const eslintConfig = `import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': ['warn'],
      'arrow-body-style': ['error', 'always'],
    },
  }
];
`;
    fs.writeFileSync(path.join(projectPath, 'eslint.config.mjs'), eslintConfig, 'utf8');
  }
}