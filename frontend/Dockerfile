FROM node:22-bookworm-slim AS build

WORKDIR /app

ARG VITE_BACKOFFICE_API_BASE_URL=
ARG VITE_BACKOFFICE_TEST_TELEGRAM_ID=

ENV VITE_BACKOFFICE_API_BASE_URL=${VITE_BACKOFFICE_API_BASE_URL}
ENV VITE_BACKOFFICE_TEST_TELEGRAM_ID=${VITE_BACKOFFICE_TEST_TELEGRAM_ID}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.29-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
