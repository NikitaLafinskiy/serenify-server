FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./src/database/schema.prisma ./prisma/ 

RUN npx prisma generate

RUN npm run build

CMD ["npm", "run", "start:prod"]
