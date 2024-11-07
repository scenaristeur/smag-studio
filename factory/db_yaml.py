# https://pypi.org/project/yamldb/
# https://github.com/cloudmesh/yamldb/blob/main/README.md

from yamldb import YamlDB

db = YamlDB(filename="data.yml")

db["a"] = "1"
db["b.c"] = "2"

d = db.get("a.b.c.d", default=3)

db.load()
  #reloads the file
  
db.delete("b.c")
    #deletes the key b.c
    #to save the state you have to also call db.save()
    
db.save()
  #saves the current db into the file

db.search("a.*.c")
   #quries the db
   #see: https://jmespath.org/tutorial.html