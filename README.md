# Entrega Final - Proyecto Dockerizado

Este proyecto corresponde a la entrega final del curso **Backend III: Testing y Escalabilidad Backend** de CoderHouse.  
Incluye documentación con Swagger, tests funcionales y la dockerización completa de la aplicación.

---

## 🐳 Imagen en Docker Hub

La imagen del proyecto se encuentra publicada en Docker Hub:

👉 https://hub.docker.com/r/nicoagueroo99/entrega-final-coder

---

## 🚀 Cómo ejecutar el proyecto con Docker

### 1️⃣ Descargar la imagen

```bash
docker pull nicoagueroo99/entrega-final-coder:latest
```

### 2️⃣ Ejecutar el contenedor

```bash
docker run -p 3000:3000 nicoagueroo99/entrega-final-coder
```

### 3️⃣ Acceder a la aplicación

- API: 👉 http://localhost:3000
- Documentación Swagger (módulo Users): 👉 http://localhost:3000/api/docs

---

## 🧪 Tests funcionales

Se desarrollaron tests funcionales completos para todos los endpoints del router:

- `adoption.router.js`

Los tests cubren:

- Casos de éxito
- Casos de error
- Validación de respuestas y códigos de estado HTTP

---

## 📦 Dockerfile

El proyecto cuenta con un Dockerfile que:

- Utiliza Node.js 20 (LTS)
- Instala las dependencias necesarias
- Copia el código fuente del proyecto
- Ejecuta la aplicación en modo producción

---

## 🛠️ Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Docker
- Swagger
- Mocha / Chai

---

## 👤 Autor

Entrega realizada por Nicolás Agüero

---

=== MODO DE USO ===

⚠️ Para poder usar la DB de Mongo, las credenciales se proporcionan por mensaje de la plataforma de entrega de coderhouse. En Mongo, está activa la configuración de "permitir todas las IP (0.0.0.0/0 - includes your current IP address)".

La DB de Mongo ya viene con datos guardados a modo de ejemplos de como se guardan dichos datos.

📦 Para instalar dependecias primero ejecutar:
npm i

⚙️ Para ejecutar el servidor:
- En modo desarrollo
npm run dev

- En modo producción:
npm run start

---------------------

Endpoints a ejecutar:

=====

GET - http://localhost:3000/api/mocks/mockingusers 

Traerá 50 usuarios mockeados con la librería Faker.js, con el formato de MongoDB.

=====

POST - http://localhost:3000/api/mocks/generateData?users={cantidad_de_users}&pets={cantidad_de_pets} 

Se creará y se guardará en MongoDB la cantidad de usuarios asignadas en los "query params". Con un array de pets proporcional al número de "cantidad de pets", para cada usuario.

=====

POST - http://localhost:3000/api/mocks/generatePetsToBeAdopted

Generará mascotas sin "owner", para poder ser adoptadas.

=====

GET - http://localhost:3000/api/loggerTest

Mostrará un mensaje a modo informativo para saber si se ejecutaron los mocks los logs correctamente. Estos logs se mostrarán por la terminal, y si ejecutas el servidor en modo "Producción", veras los logs en un archivo "logs.log".

=====

GET - http://localhost:3000/api/usersDB

Mostrará los users guardados en MongoDB.

=====

GET - http://localhost:3000/api/usersDB/{uid}

Mostrará un usuario específico según su ID. Reemplazar {uid} con el ID del usuario.

=====

POST - http://localhost:3000/api/usersDB/{uid}/documents

Permite subir hasta 2 archivos como documentos del usuario. Reemplazar {uid} con el ID del usuario.
El body debe ser de tipo multipart/form-data con el campo "files" conteniendo los archivos a subir.
Si es una imagen se guardará en /uploads/pets.
Y si es un documento se guardará en /uploads/documents.

=====

GET - http://localhost:3000/api/petsDB

Mostrará los pets guardados en MongoDB.

?adopted=true -> Mostrará mascotas con dueño
?adopted=false -> Mostrará mascotas sin dueño

=====

GET - http://localhost:3000/api/petsDB/{uid}

Mostrará una mascota específica según su ID. Reemplazar {uid} con el ID de la mascota.

=====

POST - http://localhost:3000/api/sessions/register

Registra un nuevo usuario en el sistema. El body debe ser JSON con:
{
  "name": "Nombre del usuario",
  "email": "email@example.com",
  "password": "contraseña"
}

=====

POST - http://localhost:3000/api/sessions/login

Inicia sesión con un usuario existente. El body debe ser JSON con:
{
  "email": "email@example.com",
  "password": "contraseña"
}

Retornará un mensaje de bienvenida, las mascotas del usuario y la información del usuario.

=====

GET - http://localhost:3000/api/adoption

Mostrará todas las adopciones realizadas en el sistema, con el nombre del usuario y las mascotas adoptadas.

=====

POST - http://localhost:3000/api/adoption/{uid}/{pid}

Crea una nueva adopción asociando una mascota a un usuario. Reemplazar {uid} con el ID del usuario y {pid} con el ID de la mascota.
La mascota debe estar disponible (sin dueño) y el usuario no debe tenerla ya adoptada.

=====