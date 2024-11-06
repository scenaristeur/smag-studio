import os
import autogen
from autogen import ConversableAgent
from simple_term_menu import TerminalMenu

from libs.solid import Solid

config_list = autogen.config_list_from_json(
    env_or_file="OAI_CONFIG_LIST",
    filter_dict={
        "model": {
            "Llama-3.2",
            # "llama3-groq-70b-8192-tool-use-preview", # for functions and tools
            # "gpt-4",
            # "gpt4",
            # "gpt-4-32k",
            # "gpt-4-32k-0314",
            # "gpt-4-32k-v0314",
            # "gpt-3.5-turbo",
            # "gpt-3.5-turbo-16k",
            # "gpt-3.5-turbo-0301",
            # "chatgpt-35-turbo-0301",
            # "gpt-35-turbo-v0301",
            # "gpt",
        }
    }
)

llm_config = {
    "config_list": config_list,
    "timeout": 120,
    "cache_seed": 25,  # seed for caching and reproducibility
}

# get groups
# choose group
# get agents
# run


# cathy = ConversableAgent(
#     "cathy",
#     system_message="Your name is Cathy and you are a part of a duo of comedians.",
#     # llm_config={"config_list": [{"model": "gpt-4", "temperature": 0.9, "api_key": os.environ.get("OPENAI_API_KEY")}]},
#         llm_config=llm_config,
#     human_input_mode="NEVER",  # Never ask for human input.
# )

# joe = ConversableAgent(
#     "joe",
#     system_message="Your name is Joe and you are a part of a duo of comedians.",
#     # llm_config={"config_list": [{"model": "gpt-4", "temperature": 0.7, "api_key": os.environ.get("OPENAI_API_KEY")}]},
#         llm_config=llm_config,
#     human_input_mode="NEVER",  # Never ask for human input.
# )

# result = joe.initiate_chat(cathy, message="Cathy, tell me a joke.", max_turns=2)

solid = Solid(baseUrl='http://localhost:3000')

groups_ids = solid.get_groups()
print("get groups", groups_ids)

nodes_ids = solid.get_nodes()
print("get nodes", nodes_ids)

solid.nodes_in_group()
solid.clean_nodes()

print("GGGGG", solid.groups)


# def main():
#     options = ["entry 1", "entry 2", "entry 3"]
#     terminal_menu = TerminalMenu(options)
#     menu_entry_index = terminal_menu.show()
#     print(f"You have selected {options[menu_entry_index]}!")

# if __name__ == "__main__":
#     main()

agents = {}
first = None
for node in solid.nodes:
    if first is None:
        first = node['name']
    agents[node['name']] = ConversableAgent(
        node['name'],
        system_message=node['system_message'],
        # llm_config={"config_list": [{"model": "gpt-4", "temperature": 0.9, "api_key": os.environ.get("OPENAI_API_KEY")}]},
        llm_config=llm_config,
        human_input_mode="TERMINATE",  # Never ask for human input.
    )


user_proxy = autogen.UserProxyAgent(
    name="User_proxy",
    system_message="A human admin.",
    # code_execution_config={
    #     "last_n_messages": 2,
    #     "work_dir": "groupchat",
    #     "use_docker": False,
    # },  # Please set use_docker=True if docker is available to run the generated code. Using docker is safer than running the generated code directly.
    human_input_mode="TERMINATE",
)

# first_agent = agents.pop(first)
# print(first_agent)
print(agents.values())
# result = first_agent.initiate_chat(agents.pop('joe'), message="Raconte-moi une blague.", max_turns=2)
groupchat = autogen.GroupChat(
    agents=agents.values(), messages=[], max_round=6,
    speaker_selection_method="auto",
    allow_repeat_speaker=False,
)
manager = autogen.GroupChatManager(
    groupchat=groupchat, llm_config=llm_config)

user_proxy.initiate_chat(
    manager, message="Imaginez une blague"
)
