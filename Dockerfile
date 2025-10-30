FROM node:25.0

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

COPY packages ./packages

COPY public ./public
COPY netlify.toml ./

RUN pnpm install

EXPOSE 3002

ENV NODE_ENV=development
ENV PORT=3002

CMD ["pnpm", "--filter", "frontend", "dev"]
