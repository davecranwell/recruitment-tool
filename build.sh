#!/bin/bash

set -e

if [ $# -eq 0 ]; then
  echo "Error: No arguments were supplied."
  exit 1
fi

rm -rf turbobuild
mkdir turbobuild

rsync -av --exclude-from='.dockerignore' --exclude="turbobuild" . turbobuild/

cd turbobuild
# This creates the out subdir of turbobuild
pnpx turbo prune --scope="$1" --docker

cd -
docker build . -t recruitment-$1:latest --build-arg SCOPE=$1

rm -rf turbobuild