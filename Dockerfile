FROM node:22-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN npm install

ARG PUBLIC_CLIENT_ID
ARG CLIENT_SECRET
ARG PUBLIC_REDIRECT_URI
ARG ADMIN_KEY

COPY . .

RUN npm run build

COPY ./server/package*.json ./server/

RUN cd ./server && npm install

RUN cd ./server && npm run build

EXPOSE 3000

CMD ["node", "./server/dist/index.js"]


