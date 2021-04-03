import requests

root="http://localhost:8080"
auth=("username1","password")
x = requests.get(root+"/order/cartInfo",auth=auth,params={})
print(x.status_code)
#print(x.text)
print(x.json())


# User that sign up
#TODO....

