import chalk from "chalk";
import { showHeader, showSection, showInfo, showSuccess, showError, ask } from "../utils/cli-util.js";


export async function askProjectType(rl) {
    while (true) {
        showSection('Project Language');
        showInfo('Choose your preferred language:');
        console.log(chalk.gray('  • js  - JavaScript'));
        console.log(chalk.gray('  • ts  - TypeScript'));
        console.log();
        
        const project_type = await ask(rl, 'Select language (js/ts)', 'js');
        const normalized = project_type.toLowerCase().trim();
        
        if (normalized === 'js' || normalized === 'javascript') {
            showSuccess('JavaScript selected');
            return 'js';
        } else if (normalized === 'ts' || normalized === 'typescript') {
            showSuccess('TypeScript selected');
            return 'ts';
        } else {
            showError('Please enter "js" or "ts"');
            console.log();
        }
    }
}

export async function showProjectSummary(projectName, projectType, dependencies, useEslint) {
    showHeader();
    showSection('Project Summary');
    
    console.log(chalk.cyan('📋 Review your project configuration:'));
    console.log();
    console.log(chalk.white(`  Project Name: `) + chalk.green(projectName));
    console.log(chalk.white(`  Language: `) + chalk.yellow(projectType.toUpperCase()));
    console.log(chalk.white(`  ESLint: `) + (useEslint ? chalk.green('Yes') : chalk.red('No')));
    console.log();
    
    console.log(chalk.cyan('📦 Dependencies:'));
    if (dependencies.length === 0) {
        console.log(chalk.gray('  (none)'));
    } else {
        dependencies.forEach(dep => {
            console.log(chalk.green(`  ✓ ${dep}`));
        });
    }
    console.log();
}