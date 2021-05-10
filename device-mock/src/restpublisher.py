import json

from basepublisher import BasePublisher
import requests


class RestPublisher(BasePublisher):
    datatype_id = {
        'temperature': 1,
        'humidity': 2,
        'pressure': 3,
        'windSpeed': 4,
        'windBearing': 5
    }

    def __init__(self, endpoint: str, auth_token: str):
        self._endpoint = endpoint
        self._auth_token = auth_token

    def publish(self, data: dict):
        # data = [{'value': 666, 'dataType': {'id': 1}}]
        headers = {'Authorization': 'Bearer %s' % self._auth_token}

        body = []
        for key, value in data.items():
            type_id = RestPublisher.data_type_to_id(key)
            if type_id:
                measurement = {
                    'value': value,
                    'dataType': {'id': type_id}
                }
                body.append(measurement)

        print("Sending data %s to %s" % (json.dumps(body), self._endpoint))
        try:
            res = requests.post(self._endpoint, json=body, headers=headers)
            if res.status_code != 200:
                print("Server returned unexpected status code: %s" % str(res.status_code))
        except:
            print("Couldn't send data!")

    @staticmethod
    def data_type_to_id(name: str):
        if name in RestPublisher.datatype_id.keys():
            return RestPublisher.datatype_id[name]
        else:
            return None

    def shutdown(self):
        print("Nothing to do")
