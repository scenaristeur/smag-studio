# https://microsoft.github.io/autogen/0.2/blog/2023/11/26/Agent-AutoBuild/


import autogen
from autogen.agentchat.contrib.agent_builder import AgentBuilder
config_file_or_env = 'OAI_CONFIG_LIST'  # modify path
default_llm_config = {
    'temperature': 0
}


# builder = AgentBuilder(config_file_or_env=config_file_or_env,
#                        builder_model='gpt-4-1106-preview', agent_model='gpt-4-1106-preview')
builder = AgentBuilder(config_file_or_env=config_file_or_env,
                       builder_model='Llama-3.2', agent_model='Llama-3.2')

# building_task = "Find a paper on arxiv by programming, and analyze its application in some domain. For example, find a latest paper about gpt-4 on arxiv and find its potential applications in software."
building_task = "créer une bande dessinée pour apprendre à coder une page HTML"

agent_list, agent_configs = builder.build(
    building_task, default_llm_config, coding=True)

# Transfer to the OpenAI Assistant API.
# agent_list, agent_config = new_builder.build(building_task, default_llm_config, use_oai_assistant=True)

print(agent_list)
print(agent_configs)


def start_task(execution_task: str, agent_list: list, llm_config: dict):
    config_list = autogen.config_list_from_json(config_file_or_env, filter_dict={
                                                "model": ["Llama-3.2"]})

    group_chat = autogen.GroupChat(
        agents=agent_list, messages=[], max_round=12)
    manager = autogen.GroupChatManager(
        groupchat=group_chat, llm_config={
            "config_list": config_list, **llm_config}
    )
    agent_list[0].initiate_chat(manager, message=execution_task)


start_task(
    # execution_task="Find a recent paper about gpt-4 on arxiv and find its potential applications in software.",
    execution_task="créer une bande dessinée pour apprendre à coder une page HTML",
    agent_list=agent_list,
    llm_config=default_llm_config
)

# builder.clear_all_agents(recycle_endpoint=True)

saved_path = builder.save()
