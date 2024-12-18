import { v4 as uuidv4 } from 'uuid'
import { Solid } from '@/lib/persistance/solid.js'
let persist = new Solid({ baseURL: 'http://localhost:3000' })
// import { Localstorage } from '@/lib/persistance/localstorage.js'
// let persist = new Localstorage()
// import { FS } from '@/lib/persistance/fs.js'
// // let persist = new FS()
// console.log(FS)

// const persist = new FS()

const state = () => ({
  graph: undefined,
  nodes: [],
  links: [],
  currentNode: undefined,
  highlightNodes: new Set(),
  highlightLinks: new Set(),
  groups: [],
  currentGroup: undefined,
})

const mutations = {
  // AGENT CRUD
  agentUpdate(state, agent) {
    if (agent.id == null) {
      agent.id = uuidv4()
      agent.createdIsoString = new Date().toISOString()
      agent.createdTimestamp = Date.now()
      state.nodes = [...state.nodes, agent]
      console.log('new')
    } else {
      // let node = state.nodes.find(n => n.id == agent.id)
      agent.updatedIsoString = new Date().toISOString()
      agent.updatedTimestamp = Date.now()
      state.nodes = state.nodes.filter(n => n.id != agent.id)
      state.nodes = [...state.nodes, agent]
      console.log('update')
    }
  },

  agentDelete(state, id) {
    state.nodes = state.nodes.filter(n => n.id != id)
    console.log('delete', state.nodes)
  },

  // GROUP CRUD
  groupUpdate(state, group) {
    if (group.id == null) {
      group.id = uuidv4()
      group.createdIsoString = new Date().toISOString()
      group.createdTimestamp = Date.now()
      state.groups = [...state.groups, group]
      console.log('new group')
    } else {
      // let node = state.nodes.find(n => n.id == agent.id)
      group.updatedIsoString = new Date().toISOString()
      group.updatedTimestamp = Date.now()
      state.groups = state.groups.filter(g => g.id != group.id)
      state.groups = [...state.groups, group]
      console.log('update group')
    }
  },

  setGraph(state, g) {
    console.log('graph', g)
    state.graph = g
  },

  async setNodes(state, nodes) {
    state.nodes = nodes
  },
  async setLinks(state, links) {
    state.links = links
  },
  setCurrentNode(state, node) {
    state.currentNode = node
    console.log(node)
    //  this.dispatch('graphstore/select', node.id, { root: true })
  },
  setCurrentGroup(state, group) {
    state.currentGroup = group
    console.log(group)
    //  this.dispatch('graphstore/select', node.id, { root: true })
  },
}

const actions = {
  // graph actions
  async select(context, id) {
    // let url = new URL(id)
    // console.log(url)
    console.log(id)
    let node = context.state.nodes.find(n => n.id == id)
    if (node == undefined) {
      node = context.state.node.find(n => n.id == id)
    }

    context.commit('setCurrentNode', node)
  },
  async groupSelect(context, id) {
    // let url = new URL(id)
    // console.log(url)
    console.log(id)
    let group = context.state.groups.find(n => n.id == id)
    if (group == undefined) {
      group = context.state.groups.find(n => n.id == id)
    }

    context.commit('setCurrentGroup', group)
  },
  // Persist Group

  async persistGroup(context) {
    let result = await persist.update({
      groups: context.state.groups,
      graph: context.state.graph.graphData(),
    })
    console.log('PERSIST RESULT', result)
  },
  async loadGroups(context) {
    const loaded = await persist.load()
    console.log('LOADED', loaded)
    console.log(loaded, context)
    context.state.groups = loaded.groups
    context.state.nodes = loaded.graph.nodes
    context.state.links = loaded.graph.links
  },

  async saveNode({ dispatch, commit }, node) {
    console.log(dispatch, commit, node)
    //   commit('setNodes', [...state.nodes, node])
    
  },
  async   upload  (context, files){
// TODO manage multiple files
for (let f of files){
  let content = new FileReader();

  content.addEventListener("load", e => {
    // console.log(e.target.result,)
    let result = JSON.parse(content.result)
    console.log("result",result)
    console.log("groups",result.groups)  
      console.log("nodes",result.graph.nodes)
    console.log("links",result.graph.links)
    context.state.groups = result.groups
    context.state.nodes = result.graph.nodes
    context.state.links = result.graph.links
//     let groups = context.state.groups
// groups.concat(result.groups)

// context.state.groups = groups
// console.log("GROUPES", groups, context.state.groups)
    // context.state.groups = [...context.state.groups, result.groups]
    // context.state.nodes = [...context.state.nodes, result.graph.nodes]
    // context.state.links = [...context.state.links, result.graph.links]
// console.log(context.state.groups)
  });
  
  content.readAsText(f);


}



  },
  async download(context){
    let data = {
      groups: context.state.groups,
      graph: context.state.graph.graphData(),
    }

    let exportName = prompt("Please enter the filename", Date.now());
    if (exportName != null) {

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    }

  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
