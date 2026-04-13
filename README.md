# Node MySQL API

A REST API built with Node.js, TypeScript, Express, and MySQL/MariaDB. Features JWT authentication, email verification, and role-based access control.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Database:** MySQL / MariaDB via Sequelize ORM
- **Auth:** JWT (express-jwt) + Refresh Tokens
- **Email:** Nodemailer (Ethereal for dev)
- **Docs:** Swagger UI

## Getting Started

### Prerequisites

- Node.js
- MySQL or MariaDB running locally

### Installation

```bash
git clone <your-repo-url>
cd node-mysql-api
npm install
```

### Configuration

Create a `config.json` file in the root directory (see `config.example.json`):

```json
{
  "database": {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "your_mysql_password",
    "database": "node_mysql_api"
  },
  "secret": "your_jwt_secret",
  "emailFrom": "your_ethereal_email",
  "smtpOptions": {
    "host": "smtp.ethereal.email",
    "port": 587,
    "auth": {
      "user": "your_ethereal_user",
      "pass": "your_ethereal_pass"
    }
  }
}
```

> Get free test SMTP credentials at https://ethereal.email

### Run

```bash
# Development (with auto-reload)
npm run start:dev

# Production
npm start
```

Server runs on `http://localhost:4000`

## API Endpoints

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | /accounts/register | Public | Register new account |
| POST | /accounts/verify-email | Public | Verify email with token |
| POST | /accounts/authenticate | Public | Login |
| POST | /accounts/refresh-token | Public | Refresh JWT token |
| POST | /accounts/revoke-token | User | Revoke refresh token |
| POST | /accounts/forgot-password | Public | Send password reset email |
| POST | /accounts/validate-reset-token | Public | Validate reset token |
| POST | /accounts/reset-password | Public | Reset password |
| GET | /accounts | Admin | Get all accounts |
| GET | /accounts/:id | User | Get account by ID |
| POST | /accounts | Admin | Create account |
| PUT | /accounts/:id | User | Update account |
| DELETE | /accounts/:id | User | Delete account |

## Swagger Docs

Visit `http://localhost:4000/api-docs` for interactive API documentation.

## Roles

- **Admin** — First registered account gets Admin role automatically
- **User** — All subsequent accounts are assigned User role

## Notes

- JWT tokens expire after **15 minutes**
- Refresh tokens expire after **7 days**
- Email verification is required before login