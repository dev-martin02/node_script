import chalk from "chalk";
import readline from "node:readline/promises";
import ora from "ora";
import { createProject } from "./index.js";
import { showHeader, showSection, showInfo, showSuccess, askYesNo, showError, ask,  } from "./utils/cli-util.js";
import { showCurrentDependencies, editDependencies } from "./functions/dependencies.js";
import { askProjectType, showProjectSummary } from "./functions/project.js";


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

const dependenciesArr = ['express', 'nodemon', 'better-sqlite3', 'dotenv', 'cors'];


async function main() {
    // Step 1: Welcome and project name
    showHeader('1', '5');
    showSection('Welcome to Node CLI Accelerator');
    showInfo('Let\'s create your new Node.js project!');
    console.log();
    
    const project_name = await ask(rl,"Enter your project name", "my-project");
    
    if (!project_name || project_name.trim() === '') {
        showError('Project name cannot be empty');
        return;
    }
    
    showSuccess(`Project name: ${project_name}`);

    // Step 2: Project type
    showHeader('2', '5');
    const project_type = await askProjectType(rl);

    // Step 3: Dependencies configuration
    showHeader('3', '5');
    showSection('Default Dependencies');
    showInfo('These packages will be included by default:');
    dependenciesArr.forEach(dep => {
        console.log(chalk.green(`  ✓ ${dep}`));
    });
    console.log();
    
    const customizeDeps = await askYesNo(rl, 'Would you like to customize dependencies?', 'no');
    /*
    this function is used to get the latest version of a package
    In main.js, add this option
    ASK FOR WHICH VERSION TO USE BY DEFAULT LASTEST
const useLatest = await askYesNo('Use latest package versions? (recommended for new projects)', 'yes');
    */


    if (customizeDeps) {
        showHeader('3', '5');
        await editDependencies(rl, dependenciesArr);
    }
    
    // Ensure we have at least some dependencies
    if (dependenciesArr.length === 0) {
        showHeader('3', '5');
        showError('Your project needs at least one dependency!');
        console.log();
        await editDependencies(rl, dependenciesArr);
    }
 
    // Add TypeScript dependencies automatically
    if (project_type === 'ts') {
        const typescript_dependencies = ['typescript', 'ts-node'];
        
        // Add @types for existing dependencies
        for (let i = 0; i < dependenciesArr.length; i++) {
            typescript_dependencies.push(`@types/${dependenciesArr[i]}`);
        }
        
        // Add TypeScript dependencies to main array
        typescript_dependencies.forEach(dep => {
            dependenciesArr.push(dep);
        });
        
        showSuccess('TypeScript dependencies added automatically');
    }

    // Step 4: ESLint configuration
    showHeader('4', '5');
    showSection('Code Quality Tools');
    const use_eslint = await askYesNo(rl, 'Would you like to include ESLint for code linting?', 'yes');
    
    if (use_eslint) {
        const eslint_dependencies = ['eslint', '@eslint/js', 'globals'];
        if (project_type === 'ts') {
            eslint_dependencies.push('@typescript-eslint/eslint-plugin', '@typescript-eslint/parser');
        }
        
        eslint_dependencies.forEach(dep => {
            dependenciesArr.push(dep);
        });
        
        showSuccess('ESLint dependencies added');
    }

    // Step 5: Final confirmation and project creation
    showHeader('5', '5');
    await showProjectSummary(project_name, project_type, dependenciesArr, use_eslint);
    
    const confirmed = await askYesNo(rl,'Create project with these settings?', 'yes');
    
    if (!confirmed) {
        showInfo('Project creation cancelled');
        rl.close();
        return;
    }
    
    // Create the project with loading spinner
    showHeader();
    showSection('Creating Your Project');
    
    const spinner = ora({
        text: 'Setting up project structure...',
        color: 'cyan'
    }).start();
    
    try {
        const success = createProject(project_name, project_type, dependenciesArr, use_eslint);
        
        if (success) {
            spinner.succeed('Project created successfully!');
            console.log();
            console.log(chalk.green('🎉 Your project is ready!'));
            console.log();
            console.log(chalk.cyan('Next steps:'));
            console.log(chalk.gray(`  1. cd ${project_name}`));
            console.log(chalk.gray(`  2. npm install`));
            console.log(chalk.gray(`  3. npm run dev`));
            console.log();
            console.log(chalk.yellow('Happy coding! 🚀'));
        } else {
            spinner.fail('Failed to create project');
            showError('Something went wrong. Please try again.');
        }
    } catch (error) {
        spinner.fail('Failed to create project');
        showError(`Error: ${error.message}`);
    }
    
    // Close readline interface
    rl.close();
}

main();