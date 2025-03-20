#!/bin/bash

set -a
[ -f .env.testing ] && source .env.testing
set +a

# check if fork url is set
if [ -z "$ANVIL_FORK_URL" ]; then
  echo "Error: ANVIL_FORK_URL environment variable is required"
  echo "Please set it in your .env file or environment"
  exit 1
fi

CHAIN_ID=${ANVIL_CHAIN_ID:-84532}
FORK_BLOCK=${ANVIL_FORK_BLOCK_NUMBER:-22922126}
BLOCK_TIME=${ANVIL_BLOCK_TIME:-1}
PORT=${ANVIL_PORT:-8545}
CHAIN_STATE_FILE="cypress/chain-state.json"

echo "Starting anvil..."

anvil \
  --chain-id $CHAIN_ID \
  --fork-block-number $FORK_BLOCK \
  --block-time $BLOCK_TIME \
  --fork-url $ANVIL_FORK_URL \
  --load-state $CHAIN_STATE_FILE \
  $([ "$1" = "-s" ] && echo --silent) \
  --port $PORT