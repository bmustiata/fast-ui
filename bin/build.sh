#!/usr/bin/env bash

tsc -c --out src/gallery-fast-ui/js src/gallery-fast-ui/ts/*.ts
pushd src/gallery-fast-ui
shifter
popd
