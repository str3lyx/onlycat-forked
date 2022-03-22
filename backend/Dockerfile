FROM node:16-alpine
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .

ENV NODE_ENV=production
CMD [ "node", "src/main.js" ]
