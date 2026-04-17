FROM node:22-alpine AS build

WORKDIR /workspace

COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/server/package.json apps/server/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json

RUN npm ci

COPY apps/server ./apps/server
COPY packages/shared-types ./packages/shared-types

RUN npm run build --workspace @expressa/server

FROM node:22-alpine AS runtime

WORKDIR /workspace
ENV NODE_ENV=production

COPY --from=build /workspace/package.json ./package.json
COPY --from=build /workspace/package-lock.json ./package-lock.json
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/apps/server/package.json ./apps/server/package.json
COPY --from=build /workspace/apps/server/dist ./apps/server/dist
COPY --from=build /workspace/packages/shared-types ./packages/shared-types

WORKDIR /workspace/apps/server

EXPOSE 3000

CMD ["node", "dist/main.js"]
