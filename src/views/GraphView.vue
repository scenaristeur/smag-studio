<template>
  <div class="mx-auto mb-5">
    Graph
    <div id="graph" ref="graph">Loading graph...</div>
  </div>
</template>

<script>
export default {
  name: "GraphView",
  mounted() {
    this.$graphInit({ domElement: this.$refs.graph, test: true });
    // this.test();
  },
  methods: {
    update() {
      console.log("update", this.nodes, this.links);
      if (this.graph != undefined) {
        let nodes = this.nodes.map((a) => {
          return { ...a };
        });
        let links = this.links.map((a) => {
          return { ...a };
        });
        this.graph.graphData({ nodes: nodes, links: links });
        console.log(this.graph.graphData());
      }
    },
  },
  watch: {
    nodes() {
      console.log("nodes", this.nodes);
      this.update();
    },
    links() {
      this.update();
    },
    graph() {
      this.update();
    },
  },
  computed: {
    nodes() {
      return this.$store.state.graphstore.nodes;
    },
    links() {
      return this.$store.state.graphstore.links;
    },
    graph() {
      return this.$store.state.graphstore.graph;
    },
  },
};
</script>

<style scoped>
.node-label {
  font-size: 12px;
  padding: 1px 4px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  user-select: none;
}
</style>
