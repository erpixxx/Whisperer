FROM node:lts-alpine
WORKDIR /Whisperer
COPY . .
WORKDIR server/
RUN npm install
EXPOSE 5440
ENTRYPOINT ["npm", "start"]