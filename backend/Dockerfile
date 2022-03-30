FROM node:16-alpine
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
RUN npm install pm2 -g
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

# CMD ["node", "src/main.js"]
CMD [ "pm2-runtime", "src/main.js", "-i", "4", "--name", "onlycat-backend"]