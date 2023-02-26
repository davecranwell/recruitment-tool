# Make a base image with turbo and pnpm essentials.
FROM node:16.19.0-alpine@sha256:1298fd170c45954fec3d4d063437750f89802d72743816663664cfe9aa152b4b AS base
ARG SCOPE
 
RUN apk add --no-cache libc6-compat rsync
RUN apk update

WORKDIR /app
RUN npm i -g pnpm turbo
# Assuming a turbo prune has already occured outside docker, take just the json
# so we can pnpmi it in the next intermediate container
COPY ./turbobuild/out/json .

FROM base as builder
ARG SCOPE
ENV NODE_ENV production
ENV DISABLE_ERD true

WORKDIR /app
COPY --from=base /app .
COPY .npmrc . 
RUN pnpm i --prod --filter="${SCOPE}"

COPY ./turbobuild/out/full .
RUN turbo run build

FROM node:16.19.0-alpine@sha256:1298fd170c45954fec3d4d063437750f89802d72743816663664cfe9aa152b4b AS runner
RUN apk add dumb-init

ARG SCOPE

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /app
COPY --chown=appuser:appgroup --from=builder /app .

WORKDIR /app/apps/"${SCOPE}"/

EXPOSE 3000

CMD ["dumb-init", "npm", "run", "start:prod"]
