export class Organ {
  constructor(options = {}) {
    this.options = options

    if (this.options.autostart == true) {
      this._start()
    }
  }

  start() {
    if (!this.running) {
      this._start()
    }
  }
  async _start() {
    this.running = Date.now()
    console.log('Hello => number 1');

    setImmediate(() => {
      console.log('Running before the timeout => number 3');
    });

    setTimeout(() => {
      console.log('The timeout running last => number 4');
    }, 0);

    process.nextTick(() => {
      console.log('Running at next tick => number 2');
    });
    this.thread = setInterval(this._step.bind(this), 1000);
    // process.nextTick(this._step.bind(this))
  }

  async _step() {
    console.log(this.options.name + " " + Date.now())
    let age= Date.now()- this.running
    console.log(this.options.name, age)
    if (age > 10000){
      clearInterval(this.thread);
      await this._stop()
    }

  }

async _stop(){
  console.log('Hello => number 1');

  setImmediate(() => {
    console.log(this.options.name,'Running before the timeout => number 3 STOPPING');
  });

  setTimeout(() => {
    console.log(this.options.name,'The timeout running last => number 4 STOPPED');
  }, 0);

  process.nextTick(() => {
    console.log(this.options.name,'Running at next tick => number 2 AFTER STOP');
  });
}

create() {
    console.log("create", this.options)
  }
}