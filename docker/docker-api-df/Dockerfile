FROM node:12

WORKDIR /projektAPI

COPY projektAPI/package*.json ./

RUN npm install

COPY ./projektAPI .

EXPOSE 3001

CMD [ "npm", "start" ]

