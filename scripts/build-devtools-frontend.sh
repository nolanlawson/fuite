#!/usr/bin/env bash

set -e
set -x

cd ../devtools-frontend

node ../fuite/node_modules/rollup/dist/bin/rollup --config ../fuite/scripts/devtools.rollup.config.js

cd ../fuite
rm -fr src/thirdparty/devtools-frontend/{front_end,inspector_overlay,test}
