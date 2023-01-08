FROM node:16.19.0-alpine AS builder
ARG SCOPE
 
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
RUN npm i -g pnpm turbo
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch --prod

COPY . .

FROM builder as pruned
ARG SCOPE

RUN turbo prune --scope="${SCOPE}"
WORKDIR /app/out
#RUN pnpm i -g prisma
RUN pnpm i --prod --filter="${SCOPE}"
RUN turbo run build

FROM node:16.19.0-alpine AS runner
ARG SCOPE

WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=pruned /app/out .

WORKDIR /app/apps/"${SCOPE}"/

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
