# https://microsoft.github.io/autogen/blog/2024/06/24/AltModels-Classes#function-calls

from typing_extensions import Annotated, Optional
import autogen
import requests
import json
import os
from typing import Literal

OPENAI_API_KEY="none"

config_list = autogen.config_list_from_json(
    env_or_file="OAI_CONFIG_LIST",
    filter_dict={
        "model": {
            "llama3-8b-8192",
        }
    })


llm_config = {
    "config_list": config_list,
    "timeout": 120,
    "cache_seed": 55,  # seed for caching and reproducibility
}


# Our functionbot, who will be assigned two functions and
# given directions to use them.
functionbot = autogen.AssistantAgent(
    name="functionbot",
    system_message="""Pour les 'http_request' vers le 'serveur solid',
    utilise seulement les fonctions qui t'ont été fournies.
        tu dois formater les requetes (methode, url et eventuellement payload), les transmettre à funcionbot, 
    et utiliser le résultat pour avancer dans tes explorations et fournir une information pertinente.
    le serveur http://localhost:3000/ est un serveur Solid. Fortement structuré en LinkedData, jsonld.
    chaque container se termine toujours par '/' et contient des ressources qu'il faut explorer avec 'http_request'.
    dans chaque ressource, il y a des liens vers d'autres ressources
      qu'il faut aussi explorer pour comprendre les relations entre ces ressources.  
    une http_request sur http://localhost:3000/ te permet de trouver
      le container approprié dans lequel il faut chercher les ressources.
      stocke une synthèse des informations dans ta mémoire.
      Si tu ne trouve pas une ressource, repart de la racine http://localhost:3000/ 
      pour trouver le container approprié, et explorer les ressources qu'il contient avec http_request.
    Pour finir dis simplement 'TERMINATE'""",
    is_termination_msg=lambda x: x.get("content", "") and (x.get(
        "content", "").rstrip().endswith("TERMINATE") or x.get("content", "") == ""),
    llm_config=llm_config,
)

# Our user proxy agent, who will be used to manage the customer
# request and conversation with the functionbot, terminating
# when we have the information we need.
user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    system_message="""
    Tu t'exprimes toujours en français lorsque tu t'adresse à l'utilisateur (fonction send_message).
    Pour les 'http_request' vers le 'serveur solid',
    utilise seulement les fonctions qui t'ont été fournies.
        tu dois formater les requetes (methode, url et eventuellement payload), les transmettre à funcionbot, 
    et utiliser le résultat pour avancer dans tes explorations et fournir une information pertinente.
    le serveur http://localhost:3000/ est un serveur Solid. Fortement structuré en LinkedData, jsonld.
    chaque container se termine toujours par '/' et contient des ressources qu'il faut explorer avec 'http_request'.
    dans chaque ressource, il y a des liens vers d'autres ressources
      qu'il faut aussi explorer pour comprendre les relations entre ces ressources.  
    une http_request sur http://localhost:3000/ te permet de trouver
      le container approprié dans lequel il faut chercher les ressources.
      stocke une synthèse des informations dans ta mémoire.
      Si tu ne trouve pas une ressource, repart de la racine http://localhost:3000/ 
      pour trouver le container approprié, et explorer les ressources qu'il contient avec http_request.
    Pour finir dis simplement 'TERMINATE'""",
    is_termination_msg=lambda x: x.get("content", "") and (x.get(
        "content", "").rstrip().endswith("TERMINATE") or x.get("content", "") == ""),
    human_input_mode="TERMINATE",
    max_consecutive_auto_reply=5,
)

# name="user_proxy",
# system_message=""""Tu es le compagnon d'exploration idéal qui
# fournis des informations précises aux explorateurs.
# Les urls des containers se terminent toujours par '/'.
# Recherche dans les ressources que tu as trouvées.
# Si une information te manque,
# effectue 'http_request' sur http://localhost:3000/
# pour trouver le container approprié, et scanner les ressources qu'il contient avec http_request.
# Si tu n'as pas l'information, demande-toi d'abord dans quel container et quelle ressource
# elle pourrait être, execute les http_requetes nécessaires et vérifie.
# Ne fais pas de suppositions, ne reponds que avec des informations pertinentes,
# et seulement les informations demandées, pas de conseils...
# Lorsque tu découvre des containers, liste les sous-containers
#   et les ressources avec 'http_request'.
# Lorsque tu découvres des ressources, utilise également http_request
# prendre connaissance de soleur contenu, et
# des relations avec les autres ressources.
# Lorsque tu as des infos sur un container ou une ressources,
# présente les sous la forme de liste, et sous-listes, évite de présenter du json.
# Pour finir dis simplement 'TERMINATE'""",


def make_http_request(method: str, url: str, payload_json: Optional[str] = None):
    """
    Generates an HTTP request and returns the response.

    Args:
        method (str): The HTTP method (e.g., 'GET', 'POST').
        url (str): The URL for the request.
        payload_json (Optional[str]): A JSON string representing the request payload.

    Returns:
        dict: The response from the HTTP request.
    """
    try:
        headers = {"Content-Type": "application/ld+json",
                   "Accept": "application/ld+json",
                   "User-Agent": "http-request/1.0 scenaristeur/dady/llm/functions-call"}

        # For GET requests, ignore the payload
        if method.upper() == "GET":
            print(f"[HTTP] launching GET request to {url}")
            response = requests.get(url, headers=headers)
        else:
            # Validate and convert the payload for other types of requests
            if payload_json:
                payload = json.loads(payload_json)
            else:
                payload = {}
            print(
                f"[HTTP] launching {method} request to {url}, payload=\n{json.dumps(payload, indent=2)}")
            response = requests.request(
                method, url, json=payload, headers=headers)

        # return {"status_code": response.status_code, "headers": dict(response.headers), "body": response.text}
        return response.text
    except Exception as e:
        return {"error": str(e)}


@user_proxy.register_for_execution()
@functionbot.register_for_llm(description="Generates an HTTP request and returns the response.")
def http_request(
    method: Annotated[str, "The HTTP method (e.g., 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS')."],
    url: Annotated[str, "The URL for the request."],
    payload: Optional[Annotated[str, "A JSON string representing the request payload."]],
) -> dict:
    result = make_http_request(method, url, payload)
    return result


# start the conversation
res = user_proxy.initiate_chat(
    functionbot,
    message="""
    commence par une http_request sur http://localhost:3000/ pour trouver les containers
    et ressources appropriés. 
    Trouve la ressource de BioThek.
    Qui est la fiancée de BioThek ?
    Où travaille-t-elle et qui sont ses collègues ?

    """,

)

# Une fois que tu as récupéré les containers,
# tu pourras tenter de répondre aux questions suivantes (détaille les ressources que tu parcours):
# Qui est la fiancée de BioThek ?
# Où travaille-t-elle ?
# De quelle couleur sont les cheveux de collègues de la fiancée ?
# Tu es un assistant explorateur, toutes les informations dont tu as besoin
#  sur le monde à découvrir sont accessibles par la fonction
#  'http_request' sur http://localhost:3000/ ou http://localhost:3000/**/*
# Si tu as besoin d'information sur un personnage, un lieu ou un objet,
# commence par trouver le container adapté, et lis les ressources qu'il contient.
# http_request sur les ressources pertinentes.
# Et suis les liens vers les autres ressources pour connaitre les relations.
# Ne donne pas tes réponses sous formes de json (sauf si c'est explicitement demandé).
# Résume les informations déjà obtenues en quelques lignes.


"""

python basic_functions.py 
user_proxy (to functionbot):


    commence par une http_request sur http://localhost:3000/ pour trouver les containers
    et ressources appropriés. 
    Qui est la fiancée de BioThek ?
    Où travaille-t-elle et qui sont ses collègues ?
    Que sais-tu de la famille 'Mechanic' (dans personnages/) ?
    

--------------------------------------------------------------------------------
functionbot (to user_proxy):

***** Suggested tool call (call_n550): http_request *****
Arguments: 
{"url":"http://localhost:3000/","method":"GET","payload":null}
*********************************************************

--------------------------------------------------------------------------------

>>>>>>>> USING AUTO REPLY...

>>>>>>>> EXECUTING FUNCTION http_request...
[HTTP] launching GET request to http://localhost:3000/
user_proxy (to functionbot):

user_proxy (to functionbot):

***** Response from calling tool (call_n550) *****
[
  {
    "@id": "http://localhost:3000/",
    "@type": [
      "http://www.w3.org/ns/pim/space#Storage"
      ,
      "http://www.w3.org/ns/ldp#Container"
      ,
      "http://www.w3.org/ns/ldp#BasicContainer"
      ,
      "http://www.w3.org/ns/ldp#Resource"
    ],
    "http://purl.org/dc/terms/modified": [
      {
        "@value": "2024-09-15T13:44:34.000Z",
        "@type": "http://www.w3.org/2001/XMLSchema#dateTime"
      }
    ],
    "http://www.w3.org/ns/ldp#contains": [
      {
        "@id": "http://localhost:3000/index.html"
      }
      ,
      {
        "@id": "http://localhost:3000/personnages/"
      }
      ,
      {
        "@id": "http://localhost:3000/lieux/"
      }
      ,
      {
        "@id": "http://localhost:3000/objets/"
      }
    ]
  }
]

**************************************************

--------------------------------------------------------------------------------
functionbot (to user_proxy):

***** Suggested tool call (call_fy4e): http_request *****
Arguments: 
{"url":"http://localhost:3000/personnages/BioThek","method":"GET","payload":null}
*********************************************************

--------------------------------------------------------------------------------

>>>>>>>> USING AUTO REPLY...

>>>>>>>> EXECUTING FUNCTION http_request...
[HTTP] launching GET request to http://localhost:3000/personnages/BioThek
user_proxy (to functionbot):

user_proxy (to functionbot):

***** Response from calling tool (call_fy4e) *****
{
  "@context": "https://json-ld.org/contexts/person.jsonld",
  "@id": "http://localhost:3000/personnages/BioThek",
  "name": "BioThek",
  "born": "1940-10-09",
  "worksAt": {
    "@id": "http://localhost:3000/lieux/Brumeville"
  },
  "sellsAt": {
    "@id": "http://localhost:3000/lieux/marche"
  },
  "traits": {
    "personality": [
      "kind",
      "caring"
    ],
    "physical": [
      "black hair",
      "brown eyes",
      "average height"
    ]
  },
  "fiance": {
    "@id": "http://localhost:3000/personnages/Anne_Prop"
  }
}
**************************************************

--------------------------------------------------------------------------------
functionbot (to user_proxy):

***** Suggested tool call (call_537q): http_request *****
Arguments: 
{"url":"http://localhost:3000/personnages/Anne_Prop","method":"GET","payload":null}
*********************************************************

--------------------------------------------------------------------------------

>>>>>>>> USING AUTO REPLY...

>>>>>>>> EXECUTING FUNCTION http_request...
[HTTP] launching GET request to http://localhost:3000/personnages/Anne_Prop
user_proxy (to functionbot):

user_proxy (to functionbot):

***** Response from calling tool (call_537q) *****
{
  "@context": "https://json-ld.org/contexts/person.jsonld",
  "@id": "http://localhost:3000/personnages/Anne_Prop",
  "name": "Anne Prop",
  "born": "1940-10-09",
  "worksAt": {
    "@id": "http://localhost:3000/lieux/bibliotheque"
  },
  "colleague": [
    {
      "@id": "http://localhost:3000/personnages/Alice_Storia"
    },
    {
      "@id": "http://localhost:3000/personnages/Anne_But"
    }
  ],
  "traits": {
    "personality": [
      "creative",
      "dreamy"
    ],
    "physical": [
      "red hair",
      "green eyes",
      "short"
    ]
  },
  "fiance": {
    "@id": "http://localhost:3000/personnages/BioThek"
  }
}
**************************************************

--------------------------------------------------------------------------------
functionbot (to user_proxy):

BioThek's fiancée is Anne Prop, and she works at the library, along with her colleagues Alice Storia and Anne But.

--------------------------------------------------------------------------------

>>>>>>>> USING AUTO REPLY...
user_proxy (to functionbot):



--------------------------------------------------------------------------------
functionbot (to user_proxy):

TERMINATE

--------------------------------------------------------------------------------
Please give feedback to functionbot. Press enter or type 'exit' to stop the conversation: 



"""
