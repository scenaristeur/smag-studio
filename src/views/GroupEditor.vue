<template>
  <div>
    Persistance
    <button v-if="group.id != null" type="button" class="btn btn-success btn-sm" @click="persistGroup">
      Persist Group
    </button>
    <button type="button" class="btn btn-success btn-sm" @click="loadGroups">
      Load Groups
    </button>
    <hr>
    Export/import :

    <button type="button" class="btn btn-success btn-sm" @click="download">Download</button>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text">Import</span>
      </div>
      <div class="custom-file">
        <input type="file" class="custom-file-input" id="inputGroupFile01" @change="upload" multiple> 
        <!-- <label class="custom-file-label" for="inputGroupFile01">Choose file</label> -->
      </div>
    </div>

    <hr>
    Group EDITOR
    <div class="container text-center">
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1">nom</span>
        <input type="text" class="form-control" placeholder="Nom du groupe" aria-label="name"
          aria-describedby="basic-addon1" v-model="group.name" v-on:keyup.enter="updateGroup" />
      </div>
      <div class="row">
        <textarea class="form-control" placeholder="description" id="floatingTextarea"
          v-model="group.description"></textarea>
        <label for="floatingTextarea">Description</label>
      </div>
    </div>

    <button type="button" class="btn btn-success btn-sm" @click="updateGroup">
      <span v-if="group.id == null">Create</span><span v-else>Update</span>
    </button>

    <br />

    <button v-if="group.id != null" type="button" class="btn btn-danger btn-sm" @click="deleteGroup">
      <span>Delete</span>
    </button>

    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addAgentToGroupModal">
      Agents in group
    </button>

    <!-- Modal -->
    <div class="modal fade" id="addAgentToGroupModal" tabindex="-1" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Add Agent to {{ group.name }} Group
            </h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="list-group">
              <button v-for="node in nodes" type="button" :class="activeClass(node.id)" :key="node.id"
                @click="toggleInGroup(node.id)">
                {{ node.name }}
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
          </div>
        </div>
      </div>
    </div>
    <!-- End Modal -->
    <br />
    currentGroup : {{ currentGroup }}
  </div>
</template>

<script>
export default {
  name: "GroupEditor",
  data() {
    return {
      group: {},
    };
  },
  mounted() {
    this.initGroup();
  },
  methods: {
    initGroup() {
      this.group = {
        id: null,
        name: "",
        description: "You are a helpuf group",
        graph: { nodes: [], links: [] },
        created: "",
      };
    },
    updateGroup() {
      console.log("creategroup", this.group);
      this.$store.commit("graphstore/groupUpdate", this.group);
      this.initGroup();
    },
    deletegroup() {
      let confirmation = confirm("Are you sure you want to delete this group ?");
      if (confirmation) {
        this.$store.commit("graphstore/groupDelete", this.group.id);
        this.initGroup();
      }
    },
    persistGroup() {
      this.$store.dispatch("graphstore/persistGroup");
    },
    loadGroups() {
      this.$store.dispatch("graphstore/loadGroups");
    },
    toggleInGroup(id) {
      console.log(id);
      this.group.graph.nodes.includes(id)
        ? (this.group.graph.nodes = this.group.graph.nodes.filter((n) => n != id))
        : this.group.graph.nodes.push(id);
      console.log(this.group.graph.nodes);
    },
    activeClass(id) {
      return this.group.graph.nodes.includes(id)
        ? "list-group-item list-group-item-action active"
        : "list-group-item list-group-item-action";
    },
    download() {
      this.$store.dispatch('graphstore/download')
    },
    upload(event) {
      console.log(event.target.files)
      let files = event.target.files
      this.$store.dispatch('graphstore/upload', files)
    }
  },
  watch: {
    currentGroup() {
      console.log("currentGroup", this.currentGroup);
      this.group = this.currentGroup;
    },
  },
  computed: {
    currentGroup() {
      return this.$store.state.graphstore.currentGroup;
    },
    nodes() {
      return this.$store.state.graphstore.nodes;
    },
  },
};
</script>

<style scoped></style>
