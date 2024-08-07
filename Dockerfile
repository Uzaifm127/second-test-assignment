FROM node:20.11.1

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY . .

RUN npm install
RUN npx prisma generate
RUN npx prisma db push

EXPOSE 3000

CMD ["npm", "run", "dev"]