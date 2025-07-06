FROM node:18

WORKDIR /app

# Copy package.json dan package-lock.json dari backend
COPY backend/package*.json ./
RUN npm install

# Copy seluruh source code backend ke /app
COPY backend/. .

# Copy folder frontend (views) ke /app/frontend
COPY frontend /app/frontend

EXPOSE 3000

CMD ["node", "index.js"]
