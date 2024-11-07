// import { v4 as uuidv4 } from 'uuid'
//import axios from 'axios'

const state = () => ({
  baseUrl: "http://localhost:3000",
  // session: null,
  // version: null,
  //controls: null,
  // authorization: null
})

const mutations = {

  // async setSession(state, session) {
  //   state.session = session
  // },
  // async setControls(state, data){
  //   state.controls = data.controls
  //   // state.version = data.version
  //   // console.log(state.controls)
  // },
  // async setAuthorization(state, auth){
  //   state.authorization = auth
  // }


}

const actions = {
  // async findApiUrls({commit, state}) {
  //   // console.log(dispatch, commit, node)
  //   let headers = {} //this.headers
  //   headers.Accept = 'application/json'
  //   // let result = 'Inconnu'
  //   let config = {
  //     baseURL: state.baseUrl.trim(),
  //     url: '.account/',
  //     method: 'GET',
  //     headers: headers,
  //   }
  //   try {
  //     const response = await axios(config)
  //     //console.log(response)
  //     commit('setControls',response.data)
  //     return response.data.status
  //   } catch (error) {
  //     console.log(error)
  //     return error
  //   }
  // },

async connect(context, user){
  try{
    
    let indexResponse = await fetch(context.state.baseUrl+'/.account/');
    let { controls } = await indexResponse.json();

    // And then we log in to the account API
    let response = await fetch(controls.password.login, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: user.email, password: user.password }),
    });
    // This authorization value will be used to authenticate in the next step
    const { authorization } = await response.json();
    // console.log(authorization)
    // context.commit('setAuthorization', authorization)

      // Now that we are logged in, we need to request the updated controls from the server.
      // These will now have more values than in the previous example.
      indexResponse = await fetch('http://localhost:3000/.account/', {
        headers: { authorization: `CSS-Account-Token ${authorization}` }
      });
       let contr = await indexResponse.json();
      controls = contr.controls
      // Here we request the server to generate a token on our account
       response = await fetch(controls.account.clientCredentials, {
        method: 'POST',
        headers: { authorization: `CSS-Account-Token ${authorization}`, 'content-type': 'application/json' },
        // The name field will be used when generating the ID of your token.
        // The WebID field determines which WebID you will identify as when using the token.
        // Only WebIDs linked to your account can be used.
        body: JSON.stringify({ name: 'my-token2', webId: 'http://localhost:3000/david/profile/card#me' }),
      });
      
      // These are the identifier and secret of your token.
      // Store the secret somewhere safe as there is no way to request it again from the server!
      // The `resource` value can be used to delete the token at a later point in time.
     const auth =await response.json();
console.log (auth) //  const { id, secret, resource } = 

  }
  catch(e){
    console.log("error", e)
  }
}



  // async save({ dispatch, commit }, node) {
  //   console.log(dispatch, commit, node)

  // },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
