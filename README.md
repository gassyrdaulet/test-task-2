# Storage API (Containers & Zones)

## Требования
- Node 18+
- Docker & docker-compose
- pnpm

## Быстрый старт
1. Скопировать .env.example → .env и при необходимости поправить DATABASE_URL
2. Запустить Postgres:
   docker-compose up -d
3. Установить зависимости и сгенерировать Prisma:
   pnpm install
   npx prisma generate
4. Миграция БД:
   npx prisma migrate dev --name init
5. Запустить приложение:
   pnpm run start:dev
6. Swagger UI: http://localhost:4000/docs

## Примеры запросов (cURL)
- В проекте есть файл коллекции запросов для Postman: test-task-2.postman_collection.json

- Список контейнеров:
  curl http://localhost:4000/containers

- Добавить зону:
  curl -X POST http://localhost:4000/zones -H "Content-Type: application/json" -d '{"name":"zona1","capacity":4,"type":"cold"}'

- Создать контейнер и сразу разместить:
  curl -X POST http://localhost:4000/containers -H "Content-Type: application/json" -d '{"number":"121b","type":"100sqm","zoneId":1}'

- Обновить статус:
  curl -X PATCH http://localhost:4000/containers/1 -H "Content-Type: application/json" -d '{"status":"sent"}'

- Назначить контейнер в зону:
  curl -X POST http://localhost:4000/zones/1/assign -H "Content-Type: application/json" -d '{"containerId":1}'
