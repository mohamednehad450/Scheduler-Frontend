FROM node:18

WORKDIR /frontend

COPY package.json ./

# Yarn doesn't seem to work when building to arm64
RUN npm install

COPY . .


# Replace with the backend service name and port
ENV BACKEND_URL="backend" BACKEND_PORT="8000"

RUN npm run build

EXPOSE 3000

CMD ["yarn", "start"]