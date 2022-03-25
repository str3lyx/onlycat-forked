FROM node:16-alpine as build
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM nginx:1.21.6-alpine
# RUN rm -rf /etc/nginx/conf.d/*
COPY ./nginx/onlycat.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80 443
