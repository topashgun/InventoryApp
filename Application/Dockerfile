FROM node:latest

RUN mkdir /app

WORKDIR /app

COPY package.json /app

RUN npm install

RUN npm install express
RUN npm install cors
RUN npm install mysql
RUN npm install path

COPY . /app

EXPOSE 4000

CMD ["npm","start"]