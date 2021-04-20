import requests
import unittest
from json import dumps

root="http://localhost:8080"    

class TestRequests(unittest.TestCase):

    def test_cart_info(self):
        auth=("username1","password")
        response = requests.get(root+"/order/cartInfo",auth=auth,params={})
        self.assertEqual(response.status_code, 200)

        json = response.json()
        self.assertTrue("order" in json)
        self.assertTrue("orderProducts" in json)

    def test_devices(self):
        auth=("username1","password")
        response = requests.get(root+"/devices",auth=auth,params={})
        self.assertEqual(response.status_code, 200)

        json = response.json()
        self.assertTrue(type(json) is list)
        if len(json) > 0:
            device = json[0]["device"]
            self.assertTrue("id" in device)
            self.assertTrue("deviceStatus" in device)
            self.assertTrue("config" in device)

    def test_devices_with_last_data(self):
        auth=("username1","password")
        response = requests.get(root+"/devices",auth=auth,params={"includeLastData": True})
        self.assertEqual(response.status_code, 200)

        json = response.json()
        self.assertTrue(type(json) is list)
        if len(json) > 0:
            device = json[0]["device"]
            self.assertTrue("data" in json[0])
            self.assertTrue("id" in device)
            self.assertTrue("deviceStatus" in device)
            self.assertTrue("config" in device)

    def test_devices_filtered_by_group(self):
        auth=("username1","password")
        response = requests.get(root+"/devices",auth=auth,params={"groupId": 1})
        self.assertEqual(response.status_code, 200)
        json = response.json()

    def test_device_status(self):
        # post device status
        headers = {"Authorization": "Bearer 987",
                'content-type': 'application/json'}
        data = {
            "battery": 73,
            "version": "1.0.3"
        }
        response = requests.post(root+"/device/status", json=data, headers=headers)
        self.assertEqual(response.status_code, 200)

        json = response.json()
        self.assertTrue(json["message"] == "Device status updated")

        #check device status
        auth=("username1","password")
        response = requests.get(root+"/devices/4",auth=auth,params={})
        self.assertEqual(response.status_code, 200)
        json = response.json()
        assert(json["deviceStatus"]["battery"] == 73)
        assert(json["deviceStatus"]["version"] == "1.0.3")

    def test_device_config(self):
        auth=("username1","password")
        response = requests.put(root+"/devices/1/config",auth=auth,params={"updateFrequency": 114, "enabled":False})
        self.assertEqual(response.status_code, 200)


        #check device status
        response = requests.get(root+"/devices/1",auth=auth,params={})
        self.assertEqual(response.status_code, 200)
        json = response.json()
        assert(json["config"]["update_frequency"] == 114)
        assert(json["config"]["enabled"] == False)

    def test_device_generate_new_token(self):
        auth=("username1","password")
        response = requests.put(root+"/devices/1/generatetoken",auth=auth,params={})
        self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()