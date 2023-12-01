FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./src/database/schema.prisma ./prisma/ 

RUN npm run build

# RUN echo "host all all * md5" >> /var/lib/postgresql/data/pg_hba.conf


CMD ["npm", "run", "start"]
