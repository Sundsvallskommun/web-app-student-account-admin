# Install dependencies only when needed
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# If using npm with a `package-lock.json` comment out above and use below instead
# COPY package.json package-lock.json ./
# RUN npm ci

# Rebuild the source code only when needed
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

# Production image, copy all the files and run next
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/ ./

# The only runtime writes are rotating log files under /app/data/logs (and ./data/sessions when
# SESSION_STORE=file, which is not used in OpenShift). Sessions and the gateway token live in Redis
# (SESSION_STORE=redis), so the pod needs no volume and can run with several replicas.
# OpenShift runs the container as an arbitrary UID in group 0, so group write is required.
RUN mkdir -p /app/data \
 && chown 1001:0 /app/data \
 && chmod g+w /app/data

USER nodejs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "./dist/server.js"]
