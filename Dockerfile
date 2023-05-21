FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /frontend

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm i

COPY . .

RUN pnpm build

RUN pnpm next export 

EXPOSE 3000

CMD ["pnpm", "start"]