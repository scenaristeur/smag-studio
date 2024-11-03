<template>
  <div>
    Group List
    <div class="list-group">
      <button
        v-for="group in groups"
        type="button"
        class="list-group-item list-group-item-action"
        :key="group.id"
        @click="$store.dispatch('graphstore/groupSelect', group.id)"
      >
        {{ group.name }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "GroupList",
  computed: {
    groups() {
      return this.$store.state.graphstore.groups;
    },
  },
};
</script>

<style scoped></style>
