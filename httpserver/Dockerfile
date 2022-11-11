FROM node:10
WORKDIR /httpserver
EXPOSE 8080
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
CMD ["npm", "run", "start"]