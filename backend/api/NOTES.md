### Dockerfile
* La estructura del Dockerfile nos permite hacer un build de la imagen de nodejs más rapido para que solo ejecute los comandos necesarios cuando detecte un cambio en los archivos del repositorio de los que depende cada comando

### Server
* Se utiliza el paquete de nodemon para crear un daemon de nodejs y se reinicie cada que detecte un cambio en los archivos del servidor.

* Se agrega un un volumen al contenedor para mandar los cambios desde el local al contenedor y nodemon se reinicie cuando detecte los cambios
