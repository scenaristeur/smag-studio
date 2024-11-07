
import {Organ} from './organ/index.js'

let first = new Organ({name: "un"})
//manual start 
first.start()

// autostart
let second = new Organ({name: "deux", autostart: true})

// overwritting functions _start() / _step() / _stop()
second._stop = async function(){
  console.log("THIS is the end", this.options.name)
}