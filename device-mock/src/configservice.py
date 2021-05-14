from typing import Callable
import requests
from threading import Event


class ConfigService:
    _endpoint: str
    _auth_token: str
    _poll_interval: int
    _new_cfg_cb: Callable[[int, bool], None]
    _exit: Event
    _update_frequency = 100
    _is_enabled = False

    def __init__(self, endpoint: str, auth_token: str, poll_interval: int, on_new_cfg: Callable[[int, bool], None]):
        '''
        :param endpoint:
        :param auth_token:
        :param poll_interval: time to wait to poll again for config
        :param on_new_cfg: Callback containing the new update frequency and is_enabled flag
        '''
        self._endpoint = endpoint
        self._auth_token = auth_token
        self._poll_interval = poll_interval
        self._new_cfg_cb = on_new_cfg
        self._exit = Event()

    def start(self):
        print("=== STARTING CONFIG SERVICE ===")
        while not self._exit.is_set():
            try:
                headers = {'Authorization': 'Bearer %s' % self._auth_token}
                print("Polling cfg")
                res = requests.get(self._endpoint, headers=headers)
                if res.status_code != 200:
                    print("Server returned unexpected status code: %s" % str(res.status_code))
                else:
                    body = res.json()
                    if (body['update_frequency'] != self._update_frequency) or (body['enabled'] != self._is_enabled):
                        self._update_frequency = body['update_frequency']
                        self._is_enabled = body['enabled']
                        self._new_cfg_cb(self._update_frequency, self._is_enabled)
            except:
                print("Couldn't get config!")

            self._exit.wait(self._poll_interval)

        print("Config service exiting")

    def stop(self):
        self._exit.set()
        print("ConfigService will stop playing after sleep cycle")
