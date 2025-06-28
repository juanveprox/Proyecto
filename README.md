# Proyecto

## Descripción

Este proyecto está compuesto por dos partes principales: el frontend y el backend.

## Instalación

### Frontend

1. Navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación:
   ```bash
    npm run dev
   ```

### Backend

1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor:

   ```bash
   node .\app.js

   ```

## Base de datos

Guía paso a paso para importar el archivo (proyecto.sql) en un base de datos MySQL
Desde archivo SQL o línea de comandos.
Se tiene que crear un base de datos llamada(proyecto)
Cualquier cosa en el archivo (.env) que esta en la carpeta backend, se configura la conexion

### 1. Desde Línea de Comandos

```bash
mysql -u [usuario] -p[contraseña] [base_datos] < archivo_backup.sql
```

### 2. Desde MySQL Workbench

#### 1. Conectarse al servidor

#### 2. Menú Server > Data Import

#### 3. Seleccionar:

       - Import Type: Self-Contained File

        - Default Schema: Seleccionar BD

        - Start Import

### 3. phpMyAdmin

- Iniciar sesión en phpMyAdmin

- Seleccionar base de datos

- Pestaña "Importar"

- Seleccionar archivo y formato SQL

## Requisitos

- Node.js y npm instalados en tu sistema.
- Configura las variables de entorno según sea necesario para cada parte del proyecto.

## Nota

En la base de datos esta cargado un usuario admin
Usuario:admin
Contraseña: admin123
