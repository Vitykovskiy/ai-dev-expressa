FROM node:22-alpine AS build

WORKDIR /workspace

COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/backoffice-web/package.json apps/backoffice-web/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json

RUN npm ci

COPY apps/backoffice-web ./apps/backoffice-web
COPY packages/shared-types ./packages/shared-types

ARG VITE_APP_TITLE=Expressa Backoffice
ARG VITE_API_BASE_URL=/api
ARG VITE_DISABLE_TG_AUTH=false
ARG VITE_TEST_TELEGRAM_ID=

ENV VITE_APP_TITLE=${VITE_APP_TITLE}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_DISABLE_TG_AUTH=${VITE_DISABLE_TG_AUTH}
ENV VITE_TEST_TELEGRAM_ID=${VITE_TEST_TELEGRAM_ID}

RUN npm run build --workspace @expressa/backoffice-web

FROM nginx:1.27-alpine AS runtime

COPY apps/backoffice-web/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/apps/backoffice-web/dist /usr/share/nginx/html

EXPOSE 80
