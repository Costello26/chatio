# Getting Started with Chatio App
Before the first project start, set following environment variables in `.env` file at projext root directory:
- PORT = e.g `8080`
- DATABASE_URL = `postgresql://<user>:<password>@localhost:5432/chatio?schema=public`
- NODE_ENV = production or development
- DOMAIN = app production domain

# Project launching
- Run `npm run compile` for initialize schemas and compile code
- Launch the app `npm start`

# Commands
### `npm start`
Runs the app in the production mode.\
Use [http://localhost:8080](http://localhost:8080) to check it in your API Client.

### `npm run compile`
Compiles project and deploys database schemas

### `npm run dev`
Runs the app in the development mode and recompiles project and database schemas when you make a changes

### `npm run dev:migrate`
Run it for make manual migrations to db
