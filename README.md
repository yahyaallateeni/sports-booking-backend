# Sports Booking Backend Foundation

NestJS + Prisma + PostgreSQL foundation for a sports venue booking platform.

## Run
```bash
npm install
docker compose up -d
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```
