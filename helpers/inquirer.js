const inquirer = require('inquirer');
require('colors');



const questions = [
    {
        type: 'list',
        name: 'option',
        message: 'What want make?',
        choices: [
            {
                value: 1,
                name: `${ '1.'.yellow } Search city`
            },
            {
                value: 2,
                name: `${ '2.'.yellow } History`
            },
            {
                value: 0,
                name: `${ '3.'.yellow } Exit`
            }
        ]
    }
];



const inquirerMenu = async () => {
    console.clear();
    console.log('========================'.yellow);
    console.log('    Select an option    '.yellow);
    console.log('========================\n'.yellow);
    // destructuring the option because come the option in object and we need only value
    const { option } = await inquirer.prompt(questions);
    return option;
}



const pause = async () => {
    const stop = [
        {
            type: 'input',
            name: 'enter',
            message: `Press ${'ENTER'.yellow} to continue\n`
        }
    ];
    console.log('\n');
    await inquirer.prompt(stop);
}



const readInput = async ( message ) => {
    const question = [ 
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if( value.length === 0 ) {
                    return 'Please you enter a value';
                }
                return true;
            }
        }
    ];
    const { desc } = await inquirer.prompt(question);
    return desc;
}



const listPlaces = async ( places = [] ) => {
    // .Map return new array but the values of the array the transform in the that i wanna
    const choices = places.map( ( places, i ) => {
        const idx = `${i + 1}.`.yellow;
        return {
            value: places.id,
            name: `${ idx } ${ places.name }`
        }
    });
    choices.unshift({
        value: '0',
        name: '0.'.yellow + ' Cancel'
    });

    console.clear();
    console.log('------------------------'.yellow);
    console.log('      Select place      '.yellow);
    console.log('------------------------\n'.yellow);

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: ' ',
            choices
        }
    ]
    const { id } = await inquirer.prompt(questions);
    return id;
}



const confirm = async ( message ) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];
    const { ok } = await inquirer.prompt(question);
    return ok;
}



const showListCheck = async ( task = [] ) => {
    const choices = task.map( ( task, i ) => {
        const idx = `${i + 1}.`.yellow;
        return {
            value: task.id,
            name: `${ idx } ${ task.desc }`,
            checked: ( task.completedIn ) ? true : false
        }
    });
    const question = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Delete',
            choices
        }
    ]
    const { ids } = await inquirer.prompt(question);
    return ids;
}







module.exports = {
    inquirerMenu,
    pause,
    readInput,
    listPlaces,
    confirm,
    showListCheck
}
