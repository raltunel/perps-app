FROM node:25.0

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN npm install -g pnpm

# RUN git clone -b add-prod-mode-script https://github.com/Crocswap/perps-app.git .
# RUN pnpm install

# CMD ["pnpm", "--filter", "frontend", "prod"]

CMD ["sh", "-c", "git clone -b add-prod-mode-script https://github.com/Crocswap/perps-app.git . && pnpm install && pnpm --filter frontend prod"]
