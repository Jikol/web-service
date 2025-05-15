# base stage
FROM oven/bun:1.2-alpine AS base

ARG DOCKER_TAG
ARG API_PORT

ENV DOCKER_TAG=${DOCKER_TAG} \
    API_PORT=${API_PORT}

WORKDIR /app

RUN apk add --no-cache --update nodejs

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile --no-save

# testing stage
FROM base AS test

COPY . .

RUN bun run docs && \
    bun run lint

# build stage
FROM base AS build

RUN apk add --no-cache --update jq

COPY . .

RUN bun run docs && \
    bun run prod

# prod stage
FROM alpine:3.19 AS final

ARG DOCKER_TAG

WORKDIR /app

EXPOSE ${API_PORT}

RUN apk add --no-cache --update nodejs curl

COPY --from=build /app/dist/. .

HEALTHCHECK --interval=5s --timeout=5s --retries=3 \
  CMD /bin/sh -c "curl --silent --fail --insecure http://localhost:${API_PORT}/api/v1/foo || exit 1"

CMD ["node", "index.js"]

# meta additions
LABEL org.opencontainers.image.title="image-provider"
LABEL org.opencontainers.image.description="Express API for upload and serve retina images"
LABEL org.opencontainers.image.vendor="VSB"
LABEL org.opencontainers.image.version="${DOCKER_TAG}"
LABEL org.opencontainers.image.base.name="node:alpine3.19"

# for debug purpose only
# CMD ["sleep", "infinity"]




