import os.path
from threading import Event
from typing import List

import pandas as pd

from basepublisher import BasePublisher


class FileReplay:
    _exit: Event
    _publisher: BasePublisher
    _pub_frequency: int  # pub every 10 secs
    _is_enabled: bool
    _data = None
    _datatype_id = {
        'temperature': 1,
        'humidity': 2,
        'pressure': 3,
        'windSpeed': 4,
        'windBearing': 5
    }

    def __init__(self, publisher: BasePublisher, pub_frequency=10, is_enabled=False):
        self._publisher = publisher
        self._exit = Event()
        self._pub_frequency = pub_frequency
        self._is_enabled = is_enabled

    def load(self, path_to_file: str, columns: List[str], time_column: str = "time"):
        if not os.path.isfile(path_to_file):
            # Fallback to also handle relative paths
            dirname = os.path.dirname(__file__)
            path_to_file = os.path.join(dirname, path_to_file)
            if not os.path.isfile(path_to_file):
                raise FileNotFoundError(path_to_file)

        if not path_to_file.lower().endswith(".csv"):
            raise ValueError("Only .csv files are supported")

        df = pd.read_csv(path_to_file, index_col=time_column)
        # Storing only required columns in memory
        df = df[columns]
        df.index = pd.to_datetime(df.index, unit='s')

        if self._data is None:
            self._data = df
        else:
            self._data = self._data.append(df)

        self._data = self._data.sort_index()

    def start(self):
        if self._data is None:
            print("No data to play\n Hint: use load(self, path_to_file: str) to load data from a csv file")
            return
        print("=== STARTING DATA REPLAY SERVICE ===")

        row_iterator = self._data.iterrows()
        last_index, last_row = row_iterator.__next__()
        for index, row in row_iterator:
            # Converting row into dict before publishing
            data_dict = last_row.to_dict()

            body = []
            for key, value in data_dict.items():
                type_id = FileReplay.data_type_to_id(key)
                if type_id:
                    measurement = {
                        'value': value,
                        'dataType': {'id': type_id}
                    }
                    body.append(measurement)

            data_dict.update(time=str(last_index.to_pydatetime()))
            if self._is_enabled:
                self._publisher.publish(body)
            else:
                print("Device disabled: data not published")

            # Setting current values to be published next
            last_index = index
            last_row = row

            self._exit.wait(self._pub_frequency)
            if self._exit.is_set():
                self._publisher.shutdown()
                return

    def set_config(self, update_frequency: int, is_enabled: bool):
        print("FileReplay new config: update_freq %d, is_enabled %s" % (update_frequency, is_enabled))
        self._pub_frequency = update_frequency
        self._is_enabled = is_enabled

    def stop(self):
        self._exit.set()
        print("FileReplay will stop playing after sleep cycle")

    @staticmethod
    def data_type_to_id(name: str):
        if name in FileReplay._datatype_id.keys():
            return FileReplay._datatype_id[name]
        else:
            return None
