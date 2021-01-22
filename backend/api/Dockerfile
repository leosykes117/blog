FROM node:15.5.1-buster-slim

RUN apt-get update \
    && apt-get install -y libaio1 unzip

#ADD ORACLE INSTANT CLIENT
RUN mkdir -p opt/oracle
ADD ./oracle/ .

RUN unzip instantclient-basic-linux.x64-12.1.0.2.0.zip -d /opt/oracle \
    && unzip instantclient-sdk-linux.x64-12.1.0.2.0.zip -d /opt/oracle \
    && mv /opt/oracle/instantclient_12_1 /opt/oracle/instantclient \
    && ln -s /opt/oracle/instantclient/libclntsh.so.12.1 /opt/oracle/instantclient/libclntsh.so \
    && ln -s /opt/oracle/instantclient/libocci.so.12.1 /opt/oracle/instantclient/libocci.so

ENV LD_LIBRARY_PATH="/opt/oracle/instantclient"
ENV OCI_HOME="/opt/oracle/instantclient"
ENV OCI_LIB_DIR="/opt/oracle/instantclient"
ENV OCI_INCLUDE_DIR="/opt/oracle/instantclient/sdk/include"
ENV OCI_VERSION=12

RUN echo '/opt/oracle/instantclient/' | tee -a /etc/ld.so.conf.d/oracle_instant_client.conf \
    && ldconfig

# ESTA LINEA SOLO COPIARA LOS ARCHIVOS QUE HAYAN CAMBIANDO Y `npm install` dependa de ellos
COPY ["package*.json", "/usr/src/"]

WORKDIR /usr/src

RUN npm install

COPY [".", "/usr/src/"]

EXPOSE 3000

CMD ["npm", "start"]