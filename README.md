# smag-studio

## solid persistance

npx @solid/community-server

# GUI for building llm agents

- [ ] Microsoft Autogen https://microsoft.github.io/autogen/0.2/docs/Examples/
- [ ] Crewai
- [ ] langgraph
- [ ] MemGPT/ Letta Agents
- [ ] Human Agents
- [ ] Tools Agents
- Other LLM agents...

## Agents Teams/Crew/Graph

- config
- turn (round robin, hierarchy...)
  ...

## Autogen Agents props

- name
- (description)
- system_message / system prompt
- llm_config
- human_input_mode

* initiate_chat

## Crewai Agents props

### agent

- name
- role
- goal
- backstory

### tools

- name
- description
- code

* crew.kickoff

### task

- description
- expected output
- agent
- output_file

## langgraph Agents props

### global

- state
- flux / workflow
- tools
- agents (nodes) / edges
- should_continue (conditional_edge)
- call_model

* compilation

# vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# cluster

- https://github.com/vasturiano/d3-force-cluster-3d
- https://github.com/vasturiano/d3-force-3d
- https://github.com/vasturiano/3d-force-graph/issues/298
