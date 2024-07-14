# Fly Setup

```bash
curl -L https://fly.io/install.sh | sh
# and add the following to ~/.bashrc
export FLYCTL_INSTALL="/home/dave/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"
```

# Running

`pnpm run docker`
`pnpm run dev`

## Regenerating prisma client

`pnpm run db:generate`
`pnpm run db:migrate`
`pnpm run db:seed` does first DB installation from a seed of sample data

# Generating docker images

Run from root of repository

`pnpm run docker:build:server`
`pnpm run docker:build:client`

# Deploying to fly

Run from corresponding apps/\* folder

`fly secrets import < production.env`
`fly deploy --local-only`

# Debugging local docker container

`docker run --interactive --tty --entrypoint /bin/sh [imagename]`

# Links

- [Client readme](client/README.md)
- [Server readme](<(server/README.md)>)
- [Server ER diagram](server/prisma/ER.md)
- [Architectural Decision Record](ADR.md)
