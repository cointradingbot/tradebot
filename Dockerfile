FROM node:9

# Install Letsencrypt
RUN echo "deb http://ftp.debian.org/debian jessie-backports main" | tee /etc/apt/sources.list.d/docker.list
RUN apt-get update
RUN apt-get install -y python-certbot-apache -t jessie-backports

WORKDIR /app/

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

COPY ./static/* ./static/

CMD [ "npm", "run", "node" , "./dist/index.js"]