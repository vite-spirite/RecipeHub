FROM node:20.4.0-slim
RUN apt-get update -y && apt-get install -y openssl build-essential libpq-dev
WORKDIR /app

COPY package*.json /app
RUN npm i

COPY . .
RUN npx prisma generate

RUN npm i -g @nestjs/cli

CMD ["npm", "run", "start:dev:migrate"]

EXPOSE 3000
