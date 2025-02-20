FROM node:lts-alpine
WORKDIR /Whisperer
COPY . .
WORKDIR server/
RUN npm install