#!/usr/bin/env bash

set -e

cd ../devtools-frontend

node ../fuite/node_modules/rollup/dist/bin/rollup --config ../fuite/scripts/devtools.rollup.config.js
