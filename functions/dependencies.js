import chalk from "chalk";
import { showSection, showInfo, showSuccess, showError, ask } from "../utils/cli-util.js";

export async function showCurrentDependencies( dependencies) {
    console.log();
    console.log(chalk.cyan('📦 Current dependencies:'));
    if (dependencies.length === 0) {
        console.log(chalk.gray('  (none)'));
    } else {
        dependencies.forEach(dep => {
            console.log(chalk.green(`  ✓ ${dep}`));
        });
    }
    console.log();
}

export async function editDependencies(rl, dependenciesArr) {
    showSection('Customize Dependencies');
    
    await showCurrentDependencies(dependenciesArr);
    
    showInfo('Commands:');
    console.log(chalk.gray('  • add <package1> <package2> ... - Add packages'));
    console.log(chalk.gray('  • remove <package1> <package2> ... - Remove packages'));
    console.log(chalk.gray('  • skip - Continue with current dependencies'));
    console.log();

    while (true) {
        const command = await ask(rl, 'What would you like to do?', 'skip');
        
        if (command === 'skip' || command === '') {
            break;
        }
        
        const [action, ...packages] = command.toLowerCase().trim().split(' ');

        if (action === 'add') {
            if (packages.length === 0) {
                showError('Please specify packages to add (e.g., "add express mongoose")');
                continue;
            }
            
            const validPackages = packages.filter(pkg => pkg.trim() !== '');
            const newPackages = [];
            
            validPackages.forEach(pkg => {
                if (dependenciesArr.includes(pkg)) {
                    showError(`${pkg} is already in the list`);
                } else {
                    dependenciesArr.push(pkg);
                    newPackages.push(pkg);
                }
            });
            
            if (newPackages.length > 0) {
                showSuccess(`Added: ${newPackages.join(', ')}`);
                await showCurrentDependencies(dependenciesArr);
            }
            
        } else if (action === 'remove') {
            if (packages.length === 0) {
                showError('Please specify packages to remove (e.g., "remove express")');
                continue;
            }
            
            const validPackages = packages.filter(pkg => pkg.trim() !== '');
            const removedPackages = [];
            
            validPackages.forEach(pkg => {
                const index = dependenciesArr.indexOf(pkg);
                if (index > -1) {
                    dependenciesArr.splice(index, 1);
                    removedPackages.push(pkg);
                } else {
                    showError(`${pkg} is not in the list`);
                }
            });
            
            if (removedPackages.length > 0) {
                showSuccess(`Removed: ${removedPackages.join(', ')}`);
                await showCurrentDependencies(dependenciesArr);
            }
            
        } else {
            showError('Invalid command. Use "add", "remove", or "skip"');
        }
    }
}
