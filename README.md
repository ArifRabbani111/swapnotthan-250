# Swapnotthan

Professional, minimal web application for publishing and managing events, teams, wings, donations and contact messages. Provides a public-facing static site and a JSON API with an admin panel for management.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [API Endpoints (summary)](#api-endpoints-summary)
- [Key Files & Structure](#key-files--structure)
- [Development Notes](#development-notes)
- [Contributing](#contributing)


---

## Project Overview

`Swapnotthan` is a small, maintainable Express application backed by MySQL. It serves static frontend pages (public site and admin UI) from the `public/` directory and exposes a RESTful JSON API under `/api` for managing events, users, donations, wings, team members and contact messages.

The project is organized to keep business logic in `src/controllers` and database access in `src/models`, using a connection pool configured in `src/config/db.js`.

## Tech Stack

- Node.js (Express)
- MySQL (mysql2)
- JWT-based auth utilities (`jsonwebtoken`) and password hashing (`bcrypt`)
- dotenv for configuration
- Static frontend served from the `public/` folder

## Features

- Public site with pages: Home, Events, About, Wings, Team, Contact
- Admin panel (static HTML pages) for managing events, donations, team and messages
- CRUD operations for Events
- Donation recording and listing
- Wings and Team management
- Contact form messages persisted to the database

## Prerequisites

- Node.js 18+ recommended
- MySQL server (or compatible)
- `npm` available

## Quick Start

1. Clone the repository and change into the project folder.

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file at project root (see example below) and populate the database credentials and secrets.

4. Create the database and import the schema. A `database.sql` file is included at the project root which contains table definitions:

```bash
# example — adjust DB name/credentials as needed
mysql -u root -p < database.sql
```

5. Start the server (development mode with auto-reload):

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

By default the app listens on the port defined in `PORT` or `3000`.

## Environment Variables

Create a `.env` file containing values similar to the example below (do not commit secrets):

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=swapnotthan
JWT_SECRET=your_jwt_secret
```

The application reads these variables from `process.env` using `dotenv`.

## Database

Connection pooling is handled by `src/config/db.js`. The project expects a relational schema (see `database.sql`). Ensure your database is created and the SQL schema imported before starting the app.

## API Endpoints (summary)

Base API path: `/api`

- `/api/test` — Health/test endpoint
- `/api/events` — Events collection (GET all, POST create)
- `/api/events/:id` — Single event (GET, PUT, DELETE)
- `/api/users` — User-related actions (registration/login handled via `auth` routes)
- `/api/donations` — Create/list donations
- `/api/wings` — Wings management
- `/api/team` — Team members management
- `/api/contact` — Contact form submission and retrieval
- `/api/admin` — Admin-specific routes

Note: The exact supported HTTP methods and request/response payloads are implemented in `src/controllers/*` and exposed through `src/routes/*.js`. Refer to those files for request body shapes and authorization requirements.

## Key Files & Structure

- `app.js` — Application entrypoint, static routes and API mounting
- `package.json` — Dependencies and scripts
- `database.sql` — SQL schema for initial DB setup
- `public/` — Static frontend (site + admin UI)
- `src/routes/` — Express route definitions (API endpoints)
- `src/controllers/` — Request handling and business logic
- `src/models/` — Database access and SQL statements
- `src/config/db.js` — MySQL connection pool
- `src/middleware/` — Middleware (auth, error handling)

## Development Notes

- The project uses Express v5 (pre-release) APIs — middleware and routing are compatible with the current codebase as implemented.
- Passwords and authentication use `bcrypt` and `jsonwebtoken`. Ensure `JWT_SECRET` is set to a secure random value for production.
- Static admin pages under `public/admin/` likely use the API for dynamic content — check the `public/admin/js` files to see how they call the API.

## Contributing

- Fork the repository, create a feature branch, and open a pull request with a clear description of your changes.
- Run `npm install` and test your changes locally against a development database.


