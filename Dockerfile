FROM mohamednehad450/scheduler

WORKDIR /frontend

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm i

COPY . .

RUN pnpm build

RUN pnpm next export 

ENV FRONTEND_DIR="/frontend/out"

# Expose GPIO pins
VOLUME [ "/sys:/sys" ]

WORKDIR /server
EXPOSE 8000

CMD ["pnpm", "start"]