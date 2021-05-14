import json

from basepublisher import BasePublisher
import requests


class RestPublisher(BasePublisher):

    def __init__(self, endpoint: str, auth_token: str):
        self._endpoint = endpoint
        self._auth_token = auth_token

    def publish(self, data: dict):
        headers = {'Authorization': 'Bearer %s' % self._auth_token}

        print("Sending data %s to %s" % (json.dumps(data), self._endpoint))
        try:
            res = requests.post(self._endpoint, json=data, headers=headers)
            if res.status_code != 200:
                print("Server returned unexpected status code: %s" % str(res.status_code))
        except:
            print("Couldn't send data!")

    def shutdown(self):
        print("Nothing to do")
