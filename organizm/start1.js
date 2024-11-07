import inquirer from 'inquirer'
// examples https://github.com/SBoudrias/Inquirer.js/tree/main/packages/inquirer/examples
// https://github.com/SBoudrias/Inquirer.js/blob/main/packages/inquirer/examples/hierarchical.mjs

console.log('Organizm, "help" for help ')

const questions = [
  {
    type: 'rawlist',
    name: 'command',
    message: 'What do you want?',
    choices: [
      {
        key: 'c',
        name: 'Create a new organ',
        value: 'create',
      },
      {
        key: 'r',
        name: 'Read / List organs',
        value: 'read',
      },
      {
        key: 'u',
        name: 'Update an organ',
        value: 'update',
      },
      {
        key: 'd',
        name: 'Delete an organ',
        value: 'delete',
      },
      {
        key: 'h',
        name: 'Help',
        value: 'help',
      },
      {
        key: 'q',
        name: 'Exit / Quit',
        value: 'exit',
      },
    ],
  },
]
let lastAnswers = null

while (lastAnswers !== 'exit') {
  await inquirer.prompt(questions).then(answers => {
    // console.log('\nOrder receipt:')
    console.log(JSON.stringify(answers, null, '  '))
    lastAnswers = answers.command
  })
}
