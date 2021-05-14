from basepublisher import BasePublisher
import json
from threading import Event

class StatusService:
    _publisher: BasePublisher
    _battery: int
    _version: str
    _interval: int # seconds to wait before publishing status again
    _exit: Event

    def __init__(self, publisher: BasePublisher, interval=10, battery=100, version="1.0.0"):
        self._publisher = publisher
        self._battery = battery
        self._version = version
        self._interval = interval
        self._exit = Event()

    def start(self):
        print("=== STARTING STATUS SERVICE ===")
        while not self._exit.is_set():
            data = {
                "battery": self._battery,
                "version": self._version
            }
            print("Sending status data")
            self._publisher.publish(data)

            # Simulate discharging
            self._battery = self._battery - 1
            if self._battery < 0:
                self._battery = 100

            self._exit.wait(self._interval)

        print("Status service exiting")

    def stop(self):
        self._exit.set()
        print("FileReplay will stop playing after sleep cycle")
