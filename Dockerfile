FROM node:10-alpine3.11

# ESTA LINEA SOLO COPIARA LOS ARCHIVOS QUE HAYAN CAMBIANDO Y `npm install` dependa de ellos
COPY ["package*.json", "/usr/src/"]

WORKDIR /usr/src

RUN npm install

COPY [".", "/usr/src/"]

EXPOSE 3000

CMD ["npm", "start"]