FROM node

# Install Letsencrypt
RUN echo "deb http://ftp.debian.org/debian jessie-backports main" | tee /etc/apt/sources.list.d/docker.list
RUN apt-get update
RUN apt-get install -y python-certbot-apache -t jessie-backports

WORKDIR /tradebot/
VOLUME [ "/tradebot/dist/config" ]

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run compile

CMD [ "node" , "./dist/index.js"]