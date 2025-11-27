FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY src ./src

ENV PORT=4000
EXPOSE 4000

CMD ["node", "src/server.js"]
