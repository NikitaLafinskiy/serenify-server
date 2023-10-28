FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# RUN echo "host all all * md5" >> /var/lib/postgresql/data/pg_hba.conf

COPY ./src/database/schema.prisma ./prisma/ 

CMD ["npm", "run", "start"]
