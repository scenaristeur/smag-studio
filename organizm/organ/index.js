import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import chokidar from 'chokidar'

const log = console.log.bind(console)

export class Organ {
  /*
  options = {
      name: 'my organ name',
      autostart: true, if false or absent, you choose when to start with my_organ.start()
      inbox: false, // don't create ./data/organ.id/inbox , default to true
      subscriptions: [one_organ.id, the_second.id], Array of outbox to follow
  }
  */

  constructor(options = {}) {
    this.options = options
    this.id = uuidv4()
    this.state = {} // internal state of this organ
    this.inbox = {} // where other organs can post objects and this organ can read
    this.outbox = {} // where this organ can put and other organs can read
    this.subscriptions = {} // realtime channel listening like yjs, websockets, rpc...
    this.followers = {} // the organs that are notified, when this organ $emit()
    this.fsInbox = './data/' + this.id + '/inbox/'
    this.fsOutbox = './data/' + this.id + '/outbox/'
    this.init()
  }

  async init() {
    console.log('INIT ', this.id)
    await this._beforeStart()

    if (this.options.autostart == true) {
      await this._start()
    }
  }
  log(data) {
    console.log('[ ' + this.options.name + ' ] ', data)
  }

  async _beforeStart() {
    log('inbox/outbox creation')
    await this._inbox_manager('start')

    //   fs.watch(this.fsInbox, function (event, filename) {
    //     console.log('event is: ' + event);
    //     if (filename) {
    //         console.log('filename provided: ' + filename);
    //     } else {
    //         console.log('filename not provided');
    //     }
    // });
    this.log('watch inbox and channels')
    this.log('say if something is strange')
  }

  start() {
    if (!this.running) {
      this._start()
    }
  }
  async _start() {
    this.running = Date.now()
    this.log('Hello => number 1')

    setImmediate(() => {
      this.log('Running before the timeout => number 3')
    })

    setTimeout(() => {
      this.log('The timeout running last => number 4')
    }, 0)

    process.nextTick(() => {
      this.log('Running at next tick => number 2')
    })
    this.thread = setInterval(this._step.bind(this), 1000)
    // process.nextTick(this._step.bind(this))
  }

  async _step() {
    this.log(this.options.name + ' ' + Date.now())
    let age = Date.now() - this.running
    this.log(this.options.name, age)
    if (age > 20000) {
      clearInterval(this.thread)
      await this._stop()
    }
  }

  async _stop() {
    this.log('Buenos Dias => number 1')

    this._inbox_manager('stop')

    setImmediate(() => {
      console.log(
        this.options.name,
        'Running before the timeout => number 3 STOPPING',
      )
    })

    setTimeout(() => {
      console.log(
        this.options.name,
        'The timeout running last => number 4 STOPPED',
      )
    }, 0)

    // eslint-disable-next-line no-undef
    process.nextTick(() => {
      console.log(
        this.options.name,
        'Running at next tick => number 2 AFTER STOP',
      )
    })
  }

  create() {
    console.log('create', this.options)
  }

  async _inbox_manager(action = 'stop') {
    if (action == 'start') {
      await fs.mkdirSync(this.fsInbox, { recursive: true })
      await fs.mkdirSync(this.fsOutbox, { recursive: true })
      // https://www.npmjs.com/package/chokidar
      this.inboxWatcher = await chokidar
        .watch(this.fsInbox)
        .on('all', (event, path) => {
          console.log(event, path)
        })
      if (this.options.subscriptions) {
        for (let sub of this.options.subscriptions) {
          this.subscriptions[sub] = await chokidar
            .watch('./data/' + sub + '/outbox/')
            .on('all', (event, path) => {
              console.log(event, path)
            })
        }
      }
    } else {
      let organ_folder = './data/' + this.id
      console.log('DELETE ', organ_folder)
      // force remove organ data https://stackoverflow.com/questions/18052762/remove-directory-which-is-not-empty
      await fs.rmSync(organ_folder, { recursive: true, force: true })
      await this.inboxWatcher.close().then(() => log(' inbox watcher closed'))

      for (let [id, sub] of Object.entries(this.subscriptions)) {
        sub.close().then(() => log(id, ' inbox watcher closed'))
      }
    }
  }
}
