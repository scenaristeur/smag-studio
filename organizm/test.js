/* eslint-disable no-undef */
import { Organ } from './organ/index.js'

import repl from 'node:repl'

const local = repl.start('>> ')

local.on('command', cmd => {
  console.log('command', cmd)
})

local.on('exit', () => {
  console.log('exiting repl')
  process.exit()
})

// let first = new Organ({ name: 'un' })
// //manual start
// first.start()

// // autostart
// let second = new Organ({ name: 'deux', autostart: true })

// // overwritting functions _start() / _step() / _stop()
// second._stop = async function () {
//   console.log('THIS is the end', this.options.name)
//   this._inbox_manager('stop')
// }
