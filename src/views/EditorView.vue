<template>
  <div>
    Agent EDITOR
    <div class="container text-center">
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1">nom</span>
        <input
          type="text"
          class="form-control"
          placeholder="Nom de l'agent"
          aria-label="name"
          aria-describedby="basic-addon1"
          v-model="agent.name"
          v-on:keyup.enter="updateAgent"
        />
      </div>
      <div class="row">
        <textarea
          class="form-control"
          placeholder="system prompt"
          id="floatingTextarea"
          v-model="agent.system_message"
        ></textarea>
        <label for="floatingTextarea">System Prompt</label>
      </div>
    </div>

    <button type="button" class="btn btn-success btn-sm" @click="updateAgent">
      <span v-if="agent.id == null">Create</span><span v-else>Update</span>
    </button>

    <br />
    currentNode : {{ currentNode }}

    <button
      v-if="agent.id != null"
      type="button"
      class="btn btn-danger btn-sm"
      @click="deleteAgent"
    >
      <span>Delete</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "EditorView",

  data() {
    return {
      agent: {},
    };
  },
  mounted() {
    this.initAgent();
  },
  methods: {
    initAgent() {
      this.agent = {
        id: null,
        name: "",
        description: "",
        system_message: "You are a helpfull Agent",
        llm_config: "",
        human_input_mode: "",
        created: "",
      };
    },
    updateAgent() {
      console.log("createAgent", this.agent);
      this.$store.commit("graphstore/agentUpdate", this.agent);
      this.initAgent();
    },
    deleteAgent() {
      let confirmation = confirm("Are you sure you want to delete this agent ?");
      if (confirmation) {
        this.$store.commit("graphstore/agentDelete", this.agent.id);
        this.initAgent();
      }
    },
  },
  watch: {
    currentNode() {
      console.log("currentNode", this.currentNode);
      this.agent = this.currentNode;
    },
  },
  computed: {
    currentNode() {
      return this.$store.state.graphstore.currentNode;
    },
  },
};
</script>

<style scoped></style>
