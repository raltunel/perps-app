FROM node:25.0

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ARG CACHEBUST=1

RUN git clone -b prod-mode-script-3 https://github.com/raltunel/perps-app.git .

RUN npm install -g pnpm

RUN pnpm install

CMD ["pnpm", "--filter", "frontend", "prod"]