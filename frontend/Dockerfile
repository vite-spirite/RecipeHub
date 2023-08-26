FROM node:16-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package*.json /app
RUN npm i

COPY . /app

ENV NODE_ENV=production
ENV PORT=8080
ENV NUXT_HOST=0.0.0.0

RUN npm run build
CMD ["npm", "run", "start"]