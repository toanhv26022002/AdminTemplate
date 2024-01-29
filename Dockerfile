FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm i pnpm --global
RUN pnpm i
COPY ./ .
RUN pnpm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
