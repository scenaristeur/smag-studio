// import { v4 as uuidv4 } from 'uuid'
//import axios from 'axios'

import { createDpopHeader, generateDpopKeyPair, buildAuthenticatedFetch } from '@inrupt/solid-client-authn-core';

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
    let response1 = await fetch(controls.password.login, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: user.email, password: user.password }),
    });
    // This authorization value will be used to authenticate in the next step
    const { authorization } = await response1.json();
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
      let response2 = await fetch(controls.account.clientCredentials, {
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
     const auth =await response2.json();
console.log (auth) //  
const { id, secret, resource } = auth
console.log(resource)

// A key pair is needed for encryption.
// This function from `solid-client-authn` generates such a pair for you.
const dpopKey = await generateDpopKeyPair();

// These are the ID and secret generated in the previous step.
// Both the ID and the secret need to be form-encoded.
const authString = `${encodeURIComponent(id)}:${encodeURIComponent(secret)}`;
// This URL can be found by looking at the "token_endpoint" field at
// http://localhost:3000/.well-known/openid-configuration
// if your server is hosted at http://localhost:3000/.
const tokenUrl = 'http://localhost:3000/.oidc/token';
const response = await fetch(tokenUrl, {
  method: 'POST',
  headers: {
    // The header needs to be in base64 encoding.
    // https://stackoverflow.com/questions/43842793/basic-authentication-with-fetch
    authorization: `Basic ${btoa(authString)}`,
    'content-type': 'application/x-www-form-urlencoded',
    dpop: await createDpopHeader(tokenUrl, 'POST', dpopKey),
  },
  body: 'grant_type=client_credentials&scope=webid',
});

// This is the Access token that will be used to do an authenticated request to the server.
// The JSON also contains an "expires_in" field in seconds,
// which you can use to know when you need request a new Access token.
const { access_token: accessToken } = await response.json();
console.log("accessToken",accessToken)



// The DPoP key needs to be the same key as the one used in the previous step.
// The Access token is the one generated in the previous step.
const authFetch = await buildAuthenticatedFetch(accessToken, { dpopKey });
// authFetch can now be used as a standard fetch function that will authenticate as your WebID.
// This request will do a simple GET for example.
const response3 = await authFetch('http://localhost:3000/private');

console.log("response3",response3)


const response4 = await authFetch('http://localhost:3000/david/profile/card#me');

console.log("response4",response4)


let   headers= {
  Accept: "application/json"
  }
  const response5 = await authFetch('http://localhost:3000/david/profile/card#me', headers);
  
  console.log("response5",response5)

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
