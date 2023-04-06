# этап сборки
FROM node:14-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# этап сборки конечного образа
FROM node:14-alpine

WORKDIR /app

COPY --from=build /app/package*.json ./
RUN npm install --only=production

COPY --from=build /app/dist ./dist

CMD ["npm", "start"]