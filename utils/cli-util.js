import chalk from "chalk";


// Utility functions for better CLI experience
export function clearConsole() {
    console.clear();
}

export function showHeader(step = '', total = '') {
    const cli_name = 'Node CLI ACCELERATOR'; 

    clearConsole();
    console.log(chalk.blue('━'.repeat(50)));
    console.log(chalk.blue.bold(`  ${cli_name} v1.0.0`));
    if (step && total) {
        console.log(chalk.gray(`  Step ${step} of ${total}`));
    }
    console.log(chalk.blue('━'.repeat(50)));
    console.log();
}

export function showSection(title) {

    console.log(chalk.yellow('─'.repeat(title.length + 4)));
    console.log(chalk.yellow.bold(`  ${title}`));
    console.log(chalk.yellow('─'.repeat(title.length + 4)));
    console.log();
}

export async function ask(rl, question, defaultValue = '') {
    const prompt = defaultValue ? 
        `${question} ${chalk.gray(`(default: ${defaultValue})`)} ` : 
        `${question} `;
    const answer = await rl.question(chalk.cyan('? ') + prompt);
    return answer.trim() || defaultValue;
}

export function showSuccess(message) {
    console.log(chalk.green('✓ ') + message);
}

export function showError(message) {
    console.log(chalk.red('✗ ') + message);
}

export function showInfo(message) {
    console.log(chalk.blue('ℹ ') + message);
}

export async function askYesNo(rl, question, defaultValue = 'yes') {
    while (true) {
        const answer = await ask(rl, `${question} (yes/no)`, defaultValue);
        const normalized = answer.toLowerCase().trim();
        
        if (normalized === 'yes' || normalized === 'y') {
            return true;
        } else if (normalized === 'no' || normalized === 'n') {
            return false;
        } else {
            showError('Please answer "yes" or "no"');
        }
    }
}