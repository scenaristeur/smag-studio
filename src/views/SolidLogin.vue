<template>
  <div>
    - solid available ? /persist system (solid/ filesystem)
- solid mode (inmemory / file + auth) <br>
- 

<!-- <div v-if="version!= null"> -->
  <div class="container text-center">
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1">email</span>
        <input
          type="email"
          class="form-control"
          placeholder="email"
          aria-label="name"
          aria-describedby="basic-addon1"
          v-model="user.email"
          v-on:keyup.enter="connect"
        />
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1">password</span>
        <input
          type="password"
          class="form-control"
          placeholder="password"
          aria-label="name"
          aria-describedby="basic-addon1"
          v-model="user.password"
          v-on:keyup.enter="connect"

        />
      </div>
    </div>

    <button type="button" class="btn btn-success btn-sm" @click="connect">
      Connect
    </button>


<!-- </div>
<div v-else>
  <h3>Solid Login</h3> <button type="button" class="btn btn-primary btn-sm" @click="findApiUrls">Login</button>
    <a href="https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/client-credentials/" target="_blank"> ? what is solid credentials</a>

{{ version }}
</div> -->


</div>
</template>

<script>
// https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/client-credentials/
// https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/account/json-api/#controlsaccountclientcredentials



export default {
  name: "SolidLogin",
  data(){
    return {
      user: {email: null, password: null}
    }
  },

  mounted(){
this.$store.dispatch('solid/connect')
  },
  methods:{
    // findApiUrls(){
    //   this.$store.dispatch('solid/findApiUrls')
    // },
    connect(){
      this.$store.dispatch('solid/connect', this.user)
    }
  },
  computed: {
    // version() {
    //   return this.$store.state.solid.version;
    // },
  },
};
</script>

<style scoped></style>
