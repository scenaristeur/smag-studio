<template>
  <div>
    Agent List
    <div class="list-group">
      <button
        v-for="node in nodes"
        type="button"
        class="list-group-item list-group-item-action"
        :key="node.id"
        @click="$store.dispatch('graphstore/select', node.id)"
      >
        {{ node.name }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AgentList",
  computed: {
    nodes() {
      return this.$store.state.graphstore.nodes;
    },
    // links() {
    //   return this.$store.state.graphstore.links;
    // },
    // graph() {
    //   return this.$store.state.graphstore.graph;
    // },
  },
};
</script>

<style scoped></style>
