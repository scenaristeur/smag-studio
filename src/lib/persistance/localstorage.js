export class Localstorage {
  constructor(options = {}) {
    this.options = options
  }
  update(data) {
    console.log('persist', data)

    localStorage.setItem('smag-studio-groups', JSON.stringify(data.groups))
    localStorage.setItem('smag-studio-graph', JSON.stringify(data.graph))
  }

  load() {
    return {
      groups: JSON.parse(localStorage.getItem('smag-studio-groups')),
      graph: JSON.parse(localStorage.getItem('smag-studio-graph')),
    }
  }
}
