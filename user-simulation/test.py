import requests

root="http://localhost:8080"
auth=("username1","password")

x = requests.get(root+"/order/cartInfo",auth=auth,params={})

print(x.status_code)
print(x.json())

#print(x.text)

# User that sign up
#TODO....

