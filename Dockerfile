FROM node:9

# Install Letsencrypt
RUN apt-get update && apt-get install -y software-properties-common python-software-properties
RUN add-apt-repository ppa:certbot/certbot
RUN apt-get update && apt-get install -y letsencrypt

WORKDIR ./

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

CMD [ "npm", "run", "node" , "./dist/index.js"]