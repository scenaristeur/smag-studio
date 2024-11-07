import { rawlist } from '@inquirer/prompts'
import inquirer from 'inquirer'
import { Organ } from './organ/index.js'
// Or
// import rawlist from '@inquirer/rawlist';

console.log('Organizm')
let organs = []

const commands = [
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
]

async function form_create() {
  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'name of the Organ?',
      default: Date.now().toString(),
    },
    {
      type: 'confirm',
      name: 'autostart',
      message: 'autostart?',
      default: false,
    },
  ]

  inquirer.prompt(questions).then(answers => {
    // console.log('\nOrder receipt:')
    console.log(JSON.stringify(answers, null, '  '))
    const organ = new Organ({
      name: answers.name,
      autostart: answers.autostart,
    })

    organs.push(organ)
  })
}

let answer = null

while (answer !== 'exit') {
  console.log(organs)
  answer = await rawlist({
    message: 'Select a command',
    choices: commands,
  })

  console.log(answer)

  if (answer === 'create') {
    await form_create()
  }
}
