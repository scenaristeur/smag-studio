import { createStore } from 'vuex'
// import core from './modules/core'
// import nodes from './modules/nodes'
import graphstore from './modules/graphstore'
import solid from './modules/solid'

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    // core,
    // nodes,
    graphstore, solid
  },
})
