import chalk from "chalk";
import readline from "node:readline/promises";
import { createProject } from "./index.js";

const cli_name = 'Node CLI ACCELERATOR'; 

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
async function ask(question) {
    const answer = await rl.question(question);
    return answer;
}
const dependenciesArr = ['express', 'nodemon', 'better-sqlite3', 'dotenv', 'cors'];

async function editDependencies(dependenciesArr) {

    let config_dependencies;
    while (true) {
        config_dependencies = await ask(`Would you like to ${chalk.green('add')} or ${chalk.red('remove')} any dependencies? (e.g. ${(chalk.green('add'))} express mongoose or ${chalk.red('remove')} express)`);
        if (config_dependencies === 'exit') {
            break;
        }
        config_dependencies = config_dependencies.toLowerCase().trim();

    if (config_dependencies.startsWith('add')) {
        const dependencies_to_add = config_dependencies
            .substring(3)  // Remove 'add'
            .trim()        // Remove leading/trailing spaces
            .split(" "); // Split by space
        
        if (dependencies_to_add.length > 0 && dependencies_to_add[0] !== '') {
            // Check if the dependencies are already in the list
            const no_duplicates = [];
            for (let i = 0; i < dependencies_to_add.length; i++) {
                if (dependenciesArr.includes(dependencies_to_add[i]) || no_duplicates.includes(dependencies_to_add[i])) {
                    console.log(chalk.red(`${dependencies_to_add[i]} already added in dependencies! `));
                } else {
                    no_duplicates.push(dependencies_to_add[i]);
                }
            }
            if (no_duplicates.length > 0) {
                console.log(chalk.green('Adding dependencies:'));
                no_duplicates.forEach(dep => {
                    console.log(chalk.yellow(`- ${dep}`));
                    dependenciesArr.push(dep);
                    });
            }
            console.log(chalk.yellow('\nCurrent dependencies:'));
            dependenciesArr.forEach(dep => {
                console.log(chalk.green(`- ${dep}`));
            });
            break;
        } else {
            console.log(chalk.red('No dependencies specified to add.'));
            break;
        }
    } else if (config_dependencies.startsWith('remove')) {
        const dependencies_to_remove = config_dependencies
            .substring(6)  // Remove 'remove'
            .trim()        // Remove leading/trailing spaces
            .split(" "); // Split by space
            
        if (dependencies_to_remove.length > 0 && dependencies_to_remove[0] !== '') {
            console.log(chalk.red('Removing dependencies:'));
            dependencies_to_remove.forEach(dep => {
                const index = dependenciesArr.indexOf(dep);
                if (index > -1) {
                    dependenciesArr.splice(index, 1);
                    console.log(chalk.yellow(`- ${dep}`));
                } else {
                    console.log(chalk.red(`! ${dep} already deleted in dependencies`));
                }
            });

            console.log(chalk.yellow('\nCurrent dependencies:'));
            dependenciesArr.forEach(dep => {
                console.log(chalk.green(`- ${dep}`));
            });

            break;
        } else {
            console.log(chalk.red('No dependencies specified to remove.'));
            break;
        } 
    } else {
            console.log(chalk.red('Invalid command. Please use "add" or "remove" followed by dependency names.'));
        }
    }
}

async function main() {
    // Welcome message
    console.log(chalk.blue('--------------------------------'));
    console.log( ` ${chalk.green(cli_name)} v1.0.0` );
    console.log(chalk.blue('--------------------------------'));

    // Project name
    const project_name = await ask("Enter the project name: (e.g. my-project) ");
    console.log(`Project name: ${chalk.green(`${project_name}`)}`);

    // Would you like JS or TS?
    let project_type;
    while (true) {
        project_type = await ask("Would you like to use JS or TS? (e.g. js or ts) ");
        project_type = project_type.toLowerCase();
        if (project_type === 'js') {
            console.log(`Project type: ${chalk.yellow(`${project_type}`)}`);
            break;
        } else if (project_type === 'ts') {
            console.log(`Project type: ${chalk.blue(`${project_type}`)}`);
            break;
        } else {
            console.log(chalk.red('Sorry, we only support JS and TS. Please try again.'));
        }
    }

    // Introduce dependencies    
    console.log(chalk.yellow('---------------------------------------------------'));
    console.log(chalk.yellow('These are the dependencies that will be installed:'));
    console.log(chalk.yellow('---------------------------------------------------'));

    for (let i = 0; i < dependenciesArr.length; i++) {
        console.log(chalk.green(`${dependenciesArr[i]}`));
    }

    // ask to add or remove dependencies
    await editDependencies(dependenciesArr);
    
    // Show updated dependencies list
    if (dependenciesArr.length > 0) {
        // ask if is okay to continue
        let can_continue;

        while (true) {
            can_continue = await ask("Are you okay with the dependencies? (e.g. yes or no) ");
            if (can_continue === 'yes') {
                break;
            } else if (can_continue === 'no') {
                await editDependencies(dependenciesArr);
            } else {
                console.log(chalk.red('Invalid command. Please use "yes" or "no ".'));

            }
        }
       

    } else {
        console.log(chalk.yellow('No dependencies in the list.'));
        console.log(chalk.yellow('Please add some dependencies.'));
        editDependencies(dependenciesArr);
    }
 
    // Add TypeScript dependencies
    if (project_type === 'ts') {
        console.log(chalk.yellow('--------------------------------'));
        console.log(chalk.yellow('Adding TypeScript dependencies...'));
        console.log(chalk.yellow('--------------------------------'));

        const typescript_dependencies = ['typescript', 'ts-node'];
        
        // Add @types for existing dependencies
        for (let i = 0; i < dependenciesArr.length; i++) {
            typescript_dependencies.push(`@types/${dependenciesArr[i]}`);
        }
        
        // Add TypeScript dependencies to main array
        for (let i = 0; i < typescript_dependencies.length; i++) {
            dependenciesArr.push(typescript_dependencies[i]);
            console.log(chalk.green(`- ${typescript_dependencies[i]}`));
        }
        
        console.log(chalk.yellow('--------------------------------'));
        console.log(chalk.yellow('TypeScript dependencies added.'));
        console.log(chalk.yellow('--------------------------------'));
    }

    // Would you like to use ESLint?
    let use_eslint = await ask("Would you like to use ESLint? (e.g. yes or no) ");
    if (use_eslint === 'yes') {
        console.log(chalk.yellow('--------------------------------'));
        console.log(chalk.yellow('Adding ESLint dependencies...'));
        console.log(chalk.yellow('--------------------------------'));
        
        const eslint_dependencies = ['eslint', '@eslint/js', 'globals'];
        if (project_type === 'ts') {
            eslint_dependencies.push('@typescript-eslint/eslint-plugin', '@typescript-eslint/parser');
        }
        
        for (let i = 0; i < eslint_dependencies.length; i++) {
            dependenciesArr.push(eslint_dependencies[i]);
            console.log(chalk.green(`- ${eslint_dependencies[i]}`));
        }
        
        console.log(chalk.yellow('--------------------------------'));
        console.log(chalk.yellow('ESLint dependencies added.'));
        console.log(chalk.yellow('--------------------------------'));
    } else {
        console.log(chalk.yellow('ESLint not added.'));
    }

    console.log(chalk.yellow('--------------------------------'));
    console.log(chalk.yellow('Creating project...'));
    console.log(chalk.yellow('--------------------------------'));
    
    // Create the project using the collected information
    const success = createProject(project_name, project_type, dependenciesArr, use_eslint === 'yes');
    
    if (success) {
        console.log(chalk.green('✅ Project created successfully!'));
        console.log(chalk.cyan(`📁 Navigate to your project: cd ${project_name}`));
        console.log(chalk.cyan(`🚀 Start development: npm run dev`));
    } else {
        console.log(chalk.red('❌ Failed to create project. Please try again.'));
    }
    
    // Close readline interface
    rl.close();
}

main();