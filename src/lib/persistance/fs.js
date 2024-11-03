import fs from 'fs'

export class FS {
  constructor(options = {}) {
    this.options = options

    if (!this.options.path) {
      this.options.path = './data/'
    }
  }
  update(group) {
    console.log('persist', group)
    fs.writeFile(
      this.options.path + group.name + '.json',
      JSON.stringify(group.graph),
      err => {
        if (err) {
          console.error(err)
        } else {
          // file written successfully
          console.log('file written successfully')
        }
      },
    )
  }

  load() {
    return []
  }
}
