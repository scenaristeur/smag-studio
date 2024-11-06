import os
import autogen
from autogen import ConversableAgent

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
    "cache_seed": 250,  # seed for caching and reproducibility
}

agent = ConversableAgent(
    "chatbot",
    llm_config=llm_config,
    # llm_config={"config_list": [{"model": "gpt-4", "api_key": os.environ.get("OPENAI_API_KEY")}]},

    code_execution_config=False,  # Turn off code execution, by default it is off.
    function_map=None,  # No registered functions, by default it is None.
    human_input_mode="NEVER",  # Never ask for human input.
)


reply = agent.generate_reply(messages=[{"content": "Quelle est la capitale de l'Espagne'?", "role": "user"}])
print(reply)