# Environment Variables Setup

## Variables Reference

| Variable         | Purpose              | Example                         | Required |
| ---------------- | -------------------- | ------------------------------- | -------- |
| `DB_HOST`        | MySQL hostname       | `localhost`                     | ✅       |
| `DB_PORT`        | MySQL port           | `3306`                          | ✅       |
| `DB_USER`        | Database user        | `root`                          | ✅       |
| `DB_PASSWORD`    | Database password    | `your_password`                 | ✅       |
| `DB_NAME`        | Database name        | `bus_booking`                   | ✅       |
| `DB_SSL`         | Enable SSL           | `false` (local) / `true` (prod) | ❌       |
| `DB_SSL_CA_PATH` | SSL certificate path | `/path/to/ca.crt`               | ❌       |
| `PORT`           | Backend port         | `5000`                          | ❌       |
| `VITE_API_URL`   | API endpoint         | `http://localhost:5000`         | ❌       |

## Quick Setup

### 1. Create `.env` file

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bus_booking
DB_SSL=false

PORT=5000
VITE_API_URL=http://localhost:5000
```

### 2. Set up Database

**Local MySQL:**

```bash
mysql -u root -p
CREATE DATABASE bus_booking;
```

**Docker:**

```bash
docker run -d --name bus-mysql \
  -e MYSQL_ROOT_PASSWORD=your_password \
  -e MYSQL_DATABASE=bus_booking \
  -p 3306:3306 \
  mysql:8.0
```

### 3. Install & Run

```bash
npm install
npm run server    # Terminal 1
npm run dev       # Terminal 2
```

## Production Setup

- Use managed database (AWS RDS, Azure Database, PlanetScale)
- Enable SSL: `DB_SSL=true`
- Set `DB_SSL_CA_PATH` to certificate file
- Use strong passwords
- Update `VITE_API_URL` to production endpoint
- Run `npm run build` after env changes

## Troubleshooting

| Issue              | Solution                                            |
| ------------------ | --------------------------------------------------- |
| Connection refused | Verify MySQL running, check `DB_HOST` and `DB_PORT` |
| Auth failed        | Verify `DB_USER` and `DB_PASSWORD`                  |
| SSL errors         | Ensure `DB_SSL=true` and valid certificate path     |
| API not connecting | Verify backend running, check `VITE_API_URL`        |

## Notes

- Never commit `.env` to version control (already in `.gitignore`)
- Use connection pooling (max 10 connections)
- Frontend env vars must be prefixed with `VITE_`
