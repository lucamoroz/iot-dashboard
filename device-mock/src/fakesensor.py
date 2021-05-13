import argparse
import signal

import sys
import threading

from filereplay import FileReplay
from restpublisher import RestPublisher
from configservice import ConfigService
from statusservice import StatusService

file_player: FileReplay
cfg_service: ConfigService
status_service: StatusService
arg_parser: argparse.ArgumentParser
args: argparse.Namespace


def sigterm_handler(_signo, _stack_frame):
    print("\nGot signal " + str(_signo))
    if file_player:
        file_player.stop()
    if cfg_service:
        cfg_service.stop()
    if status_service:
        status_service.stop()


def setup_args_parser():
    global arg_parser
    global args
    arg_parser = argparse.ArgumentParser(description='Send data from a csv file to a topic in an MQTT broker')
    arg_parser.add_argument('files', metavar='FILE', type=str, nargs='+',
                            help='file names of csv file data will be read from')
    arg_parser.add_argument('--backend', type=str, nargs=1, required=True,
                            help='the endpoint of the REST server the messages will be published to (e.g. http://localhost:8080')
    arg_parser.add_argument('--columns', type=str, nargs='+', required=True,
                            help='the name of the columns in the csv file that will be sent as messages')
    arg_parser.add_argument('--time', type=str, nargs=1, default=['time'],
                            help='the column name that contains the unix timestamps')
    arg_parser.add_argument('--auth-token', type=str, nargs=1, required=True,
                            help='the device authorization token')
    arg_parser.add_argument('--cfg-poll-interval', type=int, default=10,
                            help='How many seconds to wait before polling device config again')
    arg_parser.add_argument('--status-interval', type=int, default=10,
                            help='How many seconds to wait before publishing device status again')
    args = arg_parser.parse_args()


def setup_signal_handlers():
    print("Registering signal handler")
    signal.signal(signal.SIGTERM, sigterm_handler)
    signal.signal(signal.SIGINT, sigterm_handler)


print("argv: ", sys.argv)
if __name__ == '__main__':
    setup_args_parser()
    setup_signal_handlers()

    print("Starting fake sensor")
    if args.files:
        print("Reading %d file(s)" % len(args.files))
    else:
        raise ValueError("No file paths")

    # Setup data file replay
    data_publisher = RestPublisher(args.backend[0] + "/device/sensordata", args.auth_token[0])
    file_player = FileReplay(data_publisher)

    for file in args.files:
        try:
            file_player.load(file, args.columns, args.time[0])
        except FileNotFoundError:
            print("File %s does not exist" % file)
            exit(1)

    # Setup config service
    new_cfg_cb = lambda new_interval, is_enabled: file_player.set_config(new_interval, is_enabled)
    cfg_service = ConfigService(args.backend[0] + "/device/config", args.auth_token[0], args.cfg_poll_interval, new_cfg_cb)

    # Setup status service
    status_publisher = RestPublisher(args.backend[0] + "/device/status", args.auth_token[0])
    status_service = StatusService(status_publisher, args.status_interval)

    t1 = threading.Thread(target=file_player.start)
    t2 = threading.Thread(target=cfg_service.start)
    t3 = threading.Thread(target=status_service.start)

    print("Starting services")
    t1.start()
    t2.start()
    t3.start()

    t1.join()
    t2.join()
    t3.join()

    print("[end of program]")
