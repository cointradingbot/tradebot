FROM node:carbon

WORKDIR ./

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "start" ]