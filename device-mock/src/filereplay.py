import os.path
from threading import Event
from typing import List

import pandas as pd

from basepublisher import BasePublisher


class FileReplay:
    _exit: Event
    _publisher: BasePublisher
    _data = None

    def __init__(self, publisher: BasePublisher):
        self._publisher = publisher
        self._exit = Event()

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

    def play(self, replay_speed: float = 1.0):
        if self._data is None:
            print("No data to play\n Hint: use load(self, path_to_file: str) to load data from a csv file")
            return

        print("Replaying %d measurements at speed %.2f\n" % (len(self._data), replay_speed))

        row_iterator = self._data.iterrows()
        last_index, last_row = row_iterator.__next__()
        for index, row in row_iterator:
            # Calculating timeout from last index to current index
            timeout = (index - last_index).total_seconds() / replay_speed
            print(last_row.to_dict())
            print("\n-----")
            # Converting row into dict before publishing
            data_dict = last_row.to_dict()
            data_dict.update(time=str(last_index.to_pydatetime()))
            self._publisher.publish(data_dict)

            # Setting current values to be published next
            last_index = index
            last_row = row

            self._exit.wait(timeout)
            if self._exit.is_set():
                self._publisher.shutdown()
                return

    def stop(self):
        self._exit.set()
        print("Will stop playing after sleep cycle")
