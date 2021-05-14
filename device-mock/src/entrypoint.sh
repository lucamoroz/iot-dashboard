#!/usr/bin/env bash
exec python3 -u fakesensor.py --backend "$BACKEND" --columns $COLUMNS --time time --auth-token "$AUTH_TOKEN" --cfg-poll-interval $CFG_POLL_INTERVAL --status-interval $STATUS_INTERVAL $FILES
