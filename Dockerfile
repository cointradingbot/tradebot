FROM node:carbon

WORKDIR ./

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

CMD [ "npm", "run", "node" , "./dist/index.js"]