# Usa una imagen ligera de Node.js 20
FROM node:20
WORKDIR /usr/src/app

RUN npm install -g next

COPY package.json ./

RUN yarn global add nodemon
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 8083

CMD ["yarn", "dev:hot"]
