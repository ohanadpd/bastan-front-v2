FROM public.ecr.aws/docker/library/node:22-bookworm-slim AS builder

WORKDIR /app

# Install system dependencies
RUN set -eux; \
    apt-get \
        -o Acquire::ForceIPv4=true \
        -o Acquire::Retries=3 \
        -o Acquire::http::Timeout=60 \
        update; \
    apt-get \
        -o Acquire::ForceIPv4=true \
        -o Acquire::Retries=3 \
        install -y --no-install-recommends \
        git \
        openssh-client \
        ca-certificates; \
    update-ca-certificates; \
    rm -rf /var/lib/apt/lists/*

# Copy package manifests
COPY package.json package-lock.json ./

# Configure SSH and install dependencies
RUN --mount=type=secret,id=TILE_SSH_KEY_B64,required=true \
    --mount=type=tmpfs,target=/root/.ssh \
    set -eux; \
    chmod 700 /root/.ssh; \
    base64 -d /run/secrets/TILE_SSH_KEY_B64 > /root/.ssh/tile_key; \
    chmod 600 /root/.ssh/tile_key; \
    printf '%s\n' \
      'github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl' \
      > /root/.ssh/known_hosts; \
    git config --global \
      url."ssh://git@github.com/ohanadpd/tile-visualizer".insteadOf \
      "https://github.com/ohanadpd/tile-visualizer"; \
    export GIT_TERMINAL_PROMPT=0; \
    export GIT_SSH_COMMAND="ssh -i /root/.ssh/tile_key -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o ConnectTimeout=20 -o ServerAliveInterval=15 -o ServerAliveCountMax=3 -vv"; \
    echo "Testing GitHub SSH access..."; \
    git ls-remote ssh://git@github.com/ohanadpd/tile-visualizer.git HEAD; \
    export GIT_SSH_COMMAND="ssh -i /root/.ssh/tile_key -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o ConnectTimeout=20 -o ServerAliveInterval=15 -o ServerAliveCountMax=3"; \
    echo "Starting npm ci..."; \
    npm ci --verbose --fetch-retries=3 --fetch-timeout=120000

# Copy source code
COPY . .

# Build arguments
ARG NEXT_PUBLIC_IS_SHOPPING_MODE=true
ARG NEXT_PUBLIC_BASE_URL=https://contino-bastan.bastantile.com
ARG NEXT_PUBLIC_API_BASE_URL=https://contino-bastan.bastantile.com/api/v1
ARG NEXT_PUBLIC_API_URL=https://contino-bastan.bastantile.com/api/v1

ENV NEXT_PUBLIC_IS_SHOPPING_MODE=$NEXT_PUBLIC_IS_SHOPPING_MODE \
    NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL \
    NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build Next.js
RUN npm run build

# Production stage
FROM public.ecr.aws/docker/library/node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app ./

USER node

EXPOSE 3000

CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0"]
