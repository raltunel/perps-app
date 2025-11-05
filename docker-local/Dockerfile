FROM node:25.0

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN git clone -b add-prod-mode-script https://github.com/raltunel/perps-app.git .

RUN npm install -g pnpm

RUN pnpm install

EXPOSE 3002

ENV NODE_ENV=development
ENV PORT=3002

CMD ["pnpm", "--filter", "frontend", "prod"]