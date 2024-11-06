# https://llama-cpp-agent.readthedocs.io/en/latest/knowledge-graph-example/

from llama_cpp_agent.providers import LlamaCppPythonProvider
from llama_cpp import Llama
from typing import List

from graphviz import Digraph
from pydantic import BaseModel, Field

from llama_cpp_agent import LlamaCppAgent
from llama_cpp_agent.llm_output_settings import LlmStructuredOutputSettings, LlmStructuredOutputType
from llama_cpp_agent import MessagesFormatterType
from llama_cpp_agent.providers import TGIServerProvider

provider = TGIServerProvider("http://localhost:5677/v1")


class Node(BaseModel):
    id: int
    label: str  # https://llama-cpp-agent.readthedocs.io/en/latest/knowledge-graph-example/


# from llama_cpp_agent.providers import TGIServerProvider

# provider = TGIServerProvider("http://localhost:5677/v1")
# Import the LlamaCppServerProvider of llama-cpp-agent
# from llama_cpp_agent.providers import LlamaCppServerProvider

# # Create the provider by passing the server URL to the LlamaCppServerProvider class, you can also pass an API key for authentication and a flag to use a llama-cpp-python server.
# provider = LlamaCppServerProvider("http://127.0.0.1:5677")

# Import the VLLMServerProvider of llama-cpp-agent
# from llama_cpp_agent.providers import VLLMServerProvider
# # Create the provider by passing the server URL and the used model to the VLLMServerProvider class, you can also pass an API key for authentication.
# provider = VLLMServerProvider(
#     "http://localhost:5677/v1", "TheBloke/Llama-2-7b-Chat-AWQ", "token-abc123")
# Create an instance of the Llama class and load the model
llama_model = Llama(r"./models/Llama-3.2-1B-Instruct.Q4_K_M.gguf",
                    n_batch=1024, n_threads=10, n_gpu_layers=40)

# Create the provider by passing the Llama class instance to the LlamaCppPythonProvider class
provider = LlamaCppPythonProvider(llama_model)


class Node(BaseModel):
    id: int
    label: str
    color: str


class Edge(BaseModel):
    source: int
    target: int
    label: str
    color: str = "black"


class KnowledgeGraph(BaseModel):
    nodes: List[Node] = Field(..., default_factory=list)
    edges: List[Edge] = Field(..., default_factory=list)


output_settings = LlmStructuredOutputSettings.from_pydantic_models(
    [KnowledgeGraph], output_type=LlmStructuredOutputType.object_instance)

agent = LlamaCppAgent(
    provider,
    debug_output=True,
    system_prompt="You are an advanced AI assistant responding in JSON format.",
    predefined_messages_formatter_type=MessagesFormatterType.CHATML,
)


def visualize_knowledge_graph(kg):
    dot = Digraph(comment="Knowledge Graph")

    # Add nodes
    for node in kg.nodes:
        dot.node(str(node.id), node.label, color=node.color)

    # Add edges
    for edge in kg.edges:
        dot.edge(str(edge.source), str(edge.target),
                 label=edge.label, color=edge.color)

    # Render the graph
    dot.render("knowledge_graph6.gv", view=True)


def generate_graph(user_input: str):
    prompt = f"""Help me understand the following by describing it as a extremely detailed knowledge graph with at least 20 nodes: {user_input}""".strip(
    )
    response = agent.get_chat_response(
        message=prompt,
        structured_output_settings=output_settings
    )

    return response


graph = generate_graph("Teach me about quantum mechanics")
visualize_knowledge_graph(graph)

color: str


class Edge(BaseModel):
    source: int
    target: int
    label: str
    color: str = "black"


class KnowledgeGraph(BaseModel):
    nodes: List[Node] = Field(..., default_factory=list)
    edges: List[Edge] = Field(..., default_factory=list)


output_settings = LlmStructuredOutputSettings.from_pydantic_models(
    [KnowledgeGraph], output_type=LlmStructuredOutputType.object_instance)

agent = LlamaCppAgent(
    provider,
    debug_output=True,
    system_prompt="You are an advanced AI assistant responding in JSON format.",
    predefined_messages_formatter_type=MessagesFormatterType.CHATML,
)


def visualize_knowledge_graph(kg):
    dot = Digraph(comment="Knowledge Graph")

    # Add nodes
    for node in kg.nodes:
        dot.node(str(node.id), node.label, color=node.color)

    # Add edges
    for edge in kg.edges:
        dot.edge(str(edge.source), str(edge.target),
                 label=edge.label, color=edge.color)

    # Render the graph
    dot.render("knowledge_graph6.gv", view=True)


def generate_graph(user_input: str):
    prompt = f"""Help me understand the following by describing it as a extremely detailed knowledge graph with at least 20 nodes: {user_input}""".strip(
    )
    response = agent.get_chat_response(
        message=prompt,
        structured_output_settings=output_settings
    )

    return response


graph = generate_graph("Teach me about quantum mechanics")
visualize_knowledge_graph(graph)
