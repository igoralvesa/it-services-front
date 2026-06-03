FROM node:22-alpine

WORKDIR /app

ARG VITE_API_URL=http://localhost:3001/api
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install

COPY index.html ./
COPY vite.config.js ./
COPY src ./src

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--port", "5173"]
