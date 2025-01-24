FROM node:18-alpine AS base

RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app
COPY . .

RUN pnpm install --unsafe-perm
RUN pnpm prisma generate

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build
RUN pnpm prune --prod

FROM base AS deploy

WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules

COPY . .

COPY src/user/user.graphql /app/dist/user
COPY src/post/post.graphql /app/dist/post


RUN rm -rf src


CMD [ "node", "dist/main.js" ]
