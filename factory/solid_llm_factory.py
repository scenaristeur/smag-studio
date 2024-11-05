
# import requests module
import requests
import json

headers = {'Accept': 'application/json'}

# Groups
groups_folder = requests.get(
    'http://localhost:3000/data/groups/', headers=headers)
json_groups = groups_folder.json()[0]
print(json_groups)
groups_ids = json_groups['http://www.w3.org/ns/ldp#contains']
print("\n Groups", json.dumps(groups_ids, indent=4))


# Nodes
nodes_folder = requests.get(
    'http://localhost:3000/data/nodes/', headers=headers)
json_nodes = nodes_folder.json()[0]
nodes_ids = json_nodes['http://www.w3.org/ns/ldp#contains']
print("\nNodes_IDS", json.dumps(nodes_ids, indent=4))


# Links
# links_folder = requests.get(
#     'http://localhost:3000/data/links/', headers=headers)
# json_links = links_folder.json()[0]
# links_ids = json_links['http://www.w3.org/ns/ldp#contains']
# print("\nLinks", json.dumps(links_ids, indent=4))


for gi in groups_ids:
    group = requests.get(
        gi['@id'], headers=headers)
    group = group.json()
    print("\n Group", json.dumps(group, indent=4))
    nodes = []
    for n_id in group['graph']['nodes']:
       # print("\n Node id", n_id)
        for x in nodes_ids:
            if x['@id'] == 'http://localhost:3000/data/nodes/' + n_id:
                nodes.append(x)
    print("\n Nodes in ", group['name'], json.dumps(nodes, indent=4))


nodes = []
for ni in nodes_ids:
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
