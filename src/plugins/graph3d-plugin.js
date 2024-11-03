import ForceGraph3D from '3d-force-graph'
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import SpriteText from 'three-spritetext'
import * as THREE from 'three'

// plugins https://vuejs.org/guide/reusability/plugins.html#writing-a-plugin

export default {
  install: (app, options) => {
    // Plugin code goes here
    console.log('graph3d plugin installed', app, options)
    let store = options.store
    let size = getSize()

    app.config.globalProperties.$translate = key => {
      // retrieve a nested property in `options`
      // using `key` as the path
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }

    app.config.globalProperties.$zoomToFit = function (/*params*/) {
      // console.log(params.text)

      store.state.graphstore.graph.zoomToFit(10, 10, node => {
        store.state.graphstore.search == null ||
          (store.state.graphstore.search.text.length > 0 &&
            node.name.includes(store.state.graphstore.search.text))
        // let show = node.name.includes(store.state.graphstore.search.text)
        // console.log(node.name, show)
        //    return show
      })
    }

    app.config.globalProperties.$graphInit = async function (options) {
      // console.log(options)
      // let graphData = { nodes: [], links: [] }
      let graphData = { nodes: [], links: [] }
      if (options.test) {
        const N = 300
        const gData = {
          nodes: [...Array(N).keys()].map(i => ({ id: i })),
          links: [...Array(N).keys()]
            .filter(id => id)
            .map(id => ({
              source: id,
              target: Math.round(Math.random() * (id - 1)),
            })),
        }
        graphData = gData
      }
      let highlightNodes = store.state.graphstore.highlightNodes
      let highlightLinks = store.state.graphstore.highlightLinks
      let hoverNode = store.state.graphstore.hoverNode

      let graph = ForceGraph3D({ extraRenderers: [new CSS2DRenderer()] })(
        options.domElement,
      ).graphData(graphData)
      graph
        .width(size.w - 60)
        .height(size.h / 2)
        //.backgroundColor('#eafaff')
        // .nodeId('id')
        .nodeLabel('name')
        .nodeAutoColorBy('type')
        //.nodeRelSize(5)
        .nodeColor(node =>
          highlight(node)
            ? 'yellow'
            : highlightNodes.has(node)
              ? node === hoverNode
                ? 'rgb(255,0,0,1)'
                : 'rgba(255,160,0,0.8)'
              : node.color,
        )
        //.nodeColor(node => /*highlightNodes.has(node) ? node === hoverNode ? 'rgb(255,0,0,1)' : 'rgba(255,160,0,0.8)' :*/ node.color)
        //.onBackgroundClick(event => onBackgroundClick(event))
        .onNodeClick(node => onNodeClick(node))
        .onLinkClick(ln => onLinkClick(ln))
        .nodeThreeObjectExtend(
          node => node.shape == undefined || node.shape == null,
        )
        .nodeThreeObject(node => nodeThreeObject(node))
        // .nodeThreeObject(node => nodeThreeObjectGroup(node))
        .linkCurvature('curvature')
        .linkCurveRotation('rotation')
        .linkThreeObjectExtend(true)
        .linkThreeObject(link => {
          // extend link with text sprite
          if (link.label != undefined) {
            const sprite = new SpriteText(`${link.label}`)
            sprite.color = 'lightgrey'
            sprite.textHeight = 1.5
            return sprite
          }
        })
        .linkDirectionalArrowLength(3.5)
        .linkDirectionalArrowRelPos(1)
        //  .linkCurvature(0.25)
        .linkPositionUpdate((sprite, { start, end }) => {
          if (sprite != undefined) {
            const middlePos = Object.assign(
              ...['x', 'y', 'z'].map(c => ({
                [c]: start[c] + (end[c] - start[c]) / 4, // calc middle point
              })),
            )
            // Position sprite
            Object.assign(sprite.position, middlePos)
          }
        })
        .linkWidth(link => (highlightLinks.has(link) ? 4 : 1))
        .linkDirectionalParticles(link => (highlightLinks.has(link) ? 4 : 0))
        .linkDirectionalParticleWidth(4)
        .onNodeHover(node => {
          // no state change
          if ((!node && !highlightNodes.size) || (node && hoverNode === node))
            return

          highlightNodes.clear()
          highlightLinks.clear()
          if (node) {
            highlightNodes.add(node)
            //  node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
            //  node.links.forEach(link => highlightLinks.add(link));
          }

          hoverNode = node || null

          app.config.globalProperties.$updateHighlight()
        })
        .onLinkHover(link => {
          highlightNodes.clear()
          highlightLinks.clear()

          if (link) {
            highlightLinks.add(link)
            highlightNodes.add(link.source)
            highlightNodes.add(link.target)
          }
          app.config.globalProperties.$updateHighlight()
        })
        .onBackgroundClick(event => {
          console.log('bg click', event)
        })
      // console.log(graph)
      store.commit('graphstore/setGraph', graph)
    }

    app.config.globalProperties.$nodeFocus = function (node) {
      console.log('node', node)

      const distance = 50
      let pos = { x: distance, y: distance, z: distance }
      if (node.x != 0 && node.y != 0 && node.z != 0) {
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z)
        pos = {
          x: node.x * distRatio,
          y: node.y * distRatio,
          z: node.z * distRatio,
        }
      }
      store.state.graphstore.graph.cameraPosition(
        pos, // new position
        node, // lookAt ({ x, y, z })
        3000, // ms transition duration
      )
      // console.log(store.state.graphstore.graph)
      let n = store.state.graphstore.nodes.find(n => n.id == node.id)
      store.commit('graphstore/setCurrentNode', n)
    }

    app.config.globalProperties.$updateHighlight = function () {
      // trigger update of highlighted objects in scene
      //  console.log(store.state.graphstore.highlightNodes)
      let graph = store.state.graphstore.graph
      graph
        .nodeColor(graph.nodeColor())
        .linkWidth(graph.linkWidth())
        .linkDirectionalParticles(graph.linkDirectionalParticles())
    }
    // functions
    function highlight(node) {
      //console.log(node)
      return (
        store.state.graphstore.search != null &&
        store.state.graphstore.search.text.length > 0 &&
        node.name.includes(store.state.graphstore.search.text)
      )
    }

    function getSize() {
      //768 = medium bootstrap
      return {
        w:
          window.innerWidth > 768
            ? window.innerWidth / 2.05
            : window.innerWidth * 0.99,
        h:
          window.innerWidth > 768
            ? window.innerHeight * 0.9
            : window.innerHeight * 0.65,
      }
    }
    window.addEventListener('resize', function () {
      if (store.state.graphstore.graph != null) {
        size = getSize()
        store.state.graphstore.graph.width(size.w - 60)
        store.state.graphstore.graph.height(size.h / 2)
      }
    })

    function onLinkClick(ln) {
      console.log(ln)
    }

    function nodeThreeObject(node) {
      let shape = null
      let geometry = null
      let material = new THREE.MeshLambertMaterial({
        color: node.color || Math.round(Math.random() * Math.pow(2, 24)),
        transparent: true,
        opacity: 0.75,
      })
      let image,
        texture,
        sprite = null
      // console.log(material)
      // console.log(node.shape)
      switch (node.shape) {
        case 'box':
          geometry = new THREE.BoxGeometry(20, 20, 20)
          break
        case 'cylinder':
          geometry = new THREE.CylinderGeometry(10, 10, 20)
          break
        case 'cone':
          geometry = new THREE.ConeGeometry(10, 20)
          break
        case 'dodecahedron':
          geometry = new THREE.DodecahedronGeometry(10)
          break
        case 'sphere':
          geometry = new THREE.SphereGeometry(10)
          break
        case 'torus':
          geometry = new THREE.TorusGeometry(10, 2)
          break
        case 'torusKnot':
          geometry = new THREE.TorusKnotGeometry(10, 2)
          break
        case 'base64':
          //  console.log("base64",node)
          image = new Image()
          image.src = node.base64
          texture = new THREE.Texture()
          texture.image = image
          image.onload = function () {
            texture.needsUpdate = true
          }
          material = new THREE.SpriteMaterial({ map: texture })
          sprite = new THREE.Sprite(material)
          sprite.scale.set(2, 2)
          //return sprite;
          break
        default:
        //  geometry = null
      }
      if (sprite != null) {
        shape = sprite
        //  console.log("sprite", shape)
      } else {
        if (geometry == null) {
          const nodeEl = document.createElement('div')
          nodeEl.textContent = node.name //node.id;
          nodeEl.style.color = node.color || '#ffffff'
          nodeEl.className = 'node-label'
          shape = new CSS2DObject(nodeEl)
          // console.log(shape)
          // nodeEl.addEventListener('pointerdown', () => {
          //   alert(1)
          //   console.log(shape)
          //  })
        } else {
          shape = new THREE.Mesh(geometry, material)
        }
      }
      return shape
    }
    async function onNodeClick(node) {
      // Aim at node from outside it
      //  console.log(node)
      //this.selectedNodes.clear()
      //this.selectedNodes.has(node) ? this.selectedNodes.delete(node) : this.selectedNodes.add(node);
      // console.log(this.selectedNodes)
      // if(node.url != undefined && node.url.startsWith('http')){
      //   app.$store.commit ('app/mustExplore', node.url)
      // }
      app.config.globalProperties.$nodeFocus(node)
    }
  },
}
