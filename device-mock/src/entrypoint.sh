#!/usr/bin/env bash
exec python3 -u fakesensor.py --endpoint "$ENDPOINT" --columns $COLUMNS --time time --replay-speed "$REPLAY_SPEED" --auth-token "$AUTH_TOKEN" $FILES
