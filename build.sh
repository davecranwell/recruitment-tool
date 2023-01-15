#!/bin/bash

# The premise of this file is that without running a `turbo prune` before interacting with docker,
# we're force to run a prune within docker, which requires the entire monorepo be copied to docker
# each time. This means every file change invalidates pretty much the entire layer cache!
#
# Instead we run turbo prune before talking to docker, than have docker only build the contents
# of the turbobuild directory, created below.
# We can have docker pull in first the 'json' dir, made with the `--docker` flag, which means we can
# run a full `pnpm i` without any source code present, creating a nicely cachable layer.
# We can then pull in the rest of the source code after.

set -e

if [ $# -eq 0 ]; then
  echo "Error: No arguments were supplied."
  exit 1
fi

rm -rf turbobuild && mkdir turbobuild

rsync -av --exclude-from='.dockerignore' --exclude="turbobuild" . turbobuild/

cd turbobuild
# This creates the out subdir of turbobuild
pnpx turbo prune --scope="$1" --docker

cd -
docker build . -t xcession2k/recruitment-$1:dev --build-arg SCOPE=$1

rm -rf turbobuild
