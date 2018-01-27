FROM node:carbon

WORKDIR ./

COPY package*.json ./
RUN npm install
RUN npm run build

COPY . .

CMD [ "npm", "start" ]