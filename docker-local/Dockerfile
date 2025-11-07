FROM node:25.0

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN npm install -g pnpm

# CMD ["pnpm", "--filter", "frontend", "prod"]

CMD ["sh", "-c", "git clone -b prod-mode-script-3 https://github.com/raltunel/perps-app.git . && pnpm install && pnpm --filter frontend prod"]
