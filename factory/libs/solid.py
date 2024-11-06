import requests
import json

headers = {'Accept': 'application/json'}

class Solid:
  def __init__(self, baseUrl: str = 'http://localhost:3000') -> None:
    self.baseUrl = baseUrl
 
    

  def get_groups(self):
    # Groups
    groups_folder = requests.get(
        self.baseUrl+'/data/groups/', headers=headers)
    json_groups = groups_folder.json()[0]
    #print(json_groups)
    self.groups_ids = json_groups['http://www.w3.org/ns/ldp#contains']
    #print("\n Groups", json.dumps(groups_ids, indent=4))
    return self.groups_ids
  
  def get_nodes(self):
    nodes_folder = requests.get(
    self.baseUrl+'/data/nodes/', headers=headers)
    json_nodes = nodes_folder.json()[0]
    self.nodes_ids = json_nodes['http://www.w3.org/ns/ldp#contains']
    # print("\nNodes_IDS", json.dumps(nodes_ids, indent=4))
    return self.nodes_ids

  def nodes_in_group(self):
    groups = []
    for gi in self.groups_ids:
      group = requests.get(
          gi['@id'], headers=headers)
      group = group.json()
      print("\n Group", json.dumps(group, indent=4))
      nodes = []
      for n_id in group['graph']['nodes']:
        # print("\n Node id", n_id)
          for x in self.nodes_ids:
              if x['@id'] == 'http://localhost:3000/data/nodes/' + n_id:
                  nodes.append(x)
      print("\n Nodes in ", group['name'], json.dumps(nodes, indent=4))
      groups.append(group)
    self.groups = groups


  def clean_nodes(self):
    nodes = []
    for ni in self.nodes_ids:
        node = requests.get(
            ni['@id'], headers=headers)
        node = node.json()
        del node["__threeObj"]  # graph properties
        del node["x"]
        del node["y"]
        del node["z"]
        del node["vx"]
        del node["vy"]
        del node["vz"]
        del node["index"]
        nodes.append(node)
    print("\n NodeSSSSSSS\n", json.dumps(nodes, indent=4))
    self.nodes = nodes
     
  
  # def get_container(self):
  #   return
  
  # def get_resources(self, container):
  #   return