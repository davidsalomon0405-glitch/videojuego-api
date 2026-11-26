

# API REST - Videojuego por Turnos

API REST desarrollada con Node.js, Express y TypeScript para gestionar un videojuego de combate por turnos entre jugadores.

## Tecnologías utilizadas

- Node.js
- Express
- TypeScript
- JSON Web Token (JWT)
- Bcrypt
- CORS
- Almacenamiento mediante archivos JSON

## Características

### Usuarios
- Registro de usuarios.
- Inicio de sesión.
- Autenticación mediante JWT.
- Consulta y actualización del perfil.
- Registro de victorias y derrotas.

### Personajes
- Creación de personajes.
- Consulta de personajes.
- Actualización de nombres.
- Eliminación de personajes.
- Clases disponibles: guerrero, mago y arquero.
- Estadísticas iniciales según la clase seleccionada.

### Partidas
- Creación de partidas.
- Consulta de partidas disponibles.
- Unión de jugadores a partidas.
- Consulta de partidas propias.
- Cancelación de partidas pendientes.
- Estados: pendiente, en curso, finalizada y cancelada.

### Sistema de combate
- Ataque.
- Defensa.
- Habilidad especial.
- Curación.
- Sistema de turnos.
- Cálculo automático del daño.
- Determinación automática del ganador.
- Actualización de victorias y derrotas.

## Instalación

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Ingresar a la carpeta:

```bash
cd videojuego-api
```

Instalar dependencias:

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto:

```env
JWT_SECRET=tu_clave_secreta
```

Iniciar el servidor:

```bash
npm run dev
```

El servidor estará disponible en:

```text
http://localhost:3000
```

## Endpoints principales

Todas las rutas de personajes y partidas requieren autenticación mediante JWT. Las rutas de perfil también requieren autenticación.

### Usuarios

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/users/register` | Registrar usuario |
| POST | `/api/users/login` | Iniciar sesión |
| GET | `/api/users/profile` | Consultar perfil |
| PUT | `/api/users/profile` | Actualizar perfil |

### Personajes

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/characters` | Crear personaje |
| GET | `/api/characters` | Listar personajes |
| GET | `/api/characters/:id` | Consultar personaje |
| PUT | `/api/characters/:id` | Actualizar personaje |
| DELETE | `/api/characters/:id` | Eliminar personaje |

### Partidas

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/matches` | Crear partida |
| GET | `/api/matches/available` | Listar partidas disponibles |
| GET | `/api/matches` | Consultar partidas propias |
| GET | `/api/matches/:id` | Consultar partida |
| POST | `/api/matches/:id/join` | Unirse a una partida |
| POST | `/api/matches/:id/action` | Ejecutar acción de combate |
| POST | `/api/matches/:id/cancel` | Cancelar partida |

## Ejemplo de creación de personaje

**POST** `/api/characters`

```json
{
  "name": "Guerrero Alfa",
  "class": "warrior"
}
```

Clases disponibles:

- `warrior`
- `mage`
- `archer`

## Ejemplo de acción de combate

**POST** `/api/matches/1/action`

```json
{
  "action": "attack"
}
```

Acciones disponibles:

- `attack`
- `defend`
- `special`
- `heal`

## Almacenamiento de datos

La aplicación utiliza archivos JSON para almacenar la información, sin necesidad de configurar una base de datos externa.

Los archivos se encuentran en:

```text
src/data/
├── users.json
├── characters.json
└── matches.json
```



