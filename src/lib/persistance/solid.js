// import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

export class Solid {
  constructor(options = {}) {
    this.options = options
    this.baseURL = options.baseURL || 'http://localhost:3000/'
    this.headers = options.headers || {}
  }
  async update(data) {
    console.log('persist', data)
    // let query = { params: context.state.params, resource: context.state.resource }
    const result = {}
    // Promises all https://stackoverflow.com/questions/72266921/javascript-working-with-multiple-promises-inside-loop-how-to-return-data-out
    await Promise.all(
      data.groups.map(group =>
        Promise.all([this.create_or_update(group, 'groups')]).then(
          ([create_or_update_result]) => {
            result[group.id] = [create_or_update_result]
          },
        ),
      ),
      data.graph.nodes.map(nodes =>
        Promise.all([this.create_or_update(nodes, 'nodes')]).then(
          ([create_or_update_result]) => {
            result[nodes.id] = [create_or_update_result]
          },
        ),
      ),
      data.graph.links.map(links =>
        Promise.all([this.create_or_update(links, 'links')]).then(
          ([create_or_update_result]) => {
            result[links.id] = [create_or_update_result]
          },
        ),
      ),
    )
    console.log(result)
    return result
    // localStorage.setItem('smag-studio-groups', JSON.stringify(data.groups))
    // localStorage.setItem('smag-studio-graph', JSON.stringify(data.graph))
  }

  async getItem(id) {
    let headers = this.headers
    headers.Accept = 'application/json'
    // let result = 'Inconnu'

    let config = {
      baseURL: this.baseURL.trim(),
      url: id.split(this.baseURL.trim())[1],
      method: 'GET',
      headers: headers,
    }
    try {
      const response = await axios(config)
      console.log(response)
      return response.data
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async get(path) {
    let headers = this.headers
    headers.Accept = 'application/ld+json'
    // let result = 'Inconnu'

    let config = {
      baseURL: this.baseURL.trim(),
      url: 'data/' + path + '/', // query.params.url.trim(),
      method: 'GET', //query.params.method.trim(),
      headers: headers,
      // responseType: 'json',
    }
    console.log(config)
    try {
      const response = await axios(config)
      console.log(response)
      let resources =
        await response.data[0]['http://www.w3.org/ns/ldp#contains']
      console.log('resources', resources)
      let items = []
      await Promise.all(
        resources.map(res =>
          Promise.all([this.getItem(res['@id'])]).then(([item]) => {
            items.push(item)
          }),
        ),
      )

      return items
      //console.log(response)
      // result = {
      //   state: 'ok',
      //   query: query,
      //   message: response,
      //   location: response.headers.location,
      //   notification: response.headers.link
      // }
    } catch (error) {
      console.log(error)
      return error
    }

    // if (url.pathname.endsWith('/')) {
    //   query.params.headers.Accept = 'application/ld+json'
    // }
  }

  async load() {
    const result = { groups: [], graph: { nodes: [], links: [] } }
    // Promises all https://stackoverflow.com/questions/72266921/javascript-working-with-multiple-promises-inside-loop-how-to-return-data-out
    // await Promise.all(
    //   // groups
    //   (
    result.groups = (await this.get('groups')) || []
    // nodes
    result.graph.nodes = (await this.get('nodes')) || []
    // links
    // result.graph.links = await this.get('links') || []
    // data.groups.map(group =>
    //   Promise.all([this.create_or_update(group, 'groups')]).then(
    //     ([create_or_update_result]) => {
    //       result[group.id] = [create_or_update_result]
    //     },
    //   ),
    // ),
    // data.graph.nodes.map(nodes =>
    //   Promise.all([this.create_or_update(nodes, 'nodes')]).then(
    //     ([create_or_update_result]) => {
    //       result[nodes.id] = [create_or_update_result]
    //     },
    //   ),
    // ),
    // data.graph.links.map(links =>
    //   Promise.all([this.create_or_update(links, 'links')]).then(
    //     ([create_or_update_result]) => {
    //       result[links.id] = [create_or_update_result]
    //     },
    //   ),
    // ),
    // )
    console.log(result)
    return result

    // return {
    //   groups: groups,
    //   graph: {nodes, links}],
    // }
  }

  async create_or_update(data, path) {
    let headers = this.headers
    // let result = 'Inconnu'

    let config = {
      baseURL: this.baseURL.trim(),
      url: 'data/' + path + '/' + data.id, // query.params.url.trim(),
      method: 'PUT', //query.params.method.trim(),
      headers: headers,
      responseType: 'json',
      data: data,
    }
    console.log(config)
    try {
      const response = await axios(config)
      console.log(response)
      return response
      //console.log(response)
      // result = {
      //   state: 'ok',
      //   query: query,
      //   message: response,
      //   location: response.headers.location,
      //   notification: response.headers.link
      // }
    } catch (error) {
      console.log(error)
      return error
    }

    // console.log('create_or_update', query, Object.assign({}, result))
    // return Object.assign({}, result)
  }

  async remove(url) {
    url = new URL(url)
    console.log(url)
    let query = {
      params: {
        baseURL: url.origin,
        method: 'DELETE',
        url: url.pathname,
        headers: {},
      },
    }
    let result = await this.create_or_update(query)

    return result
  }
}
