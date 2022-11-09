# Source - https://medium.com/@vinhle95/deploy-a-containerised-node-js-application-to-cloud-run-80d2da6b7040

# Build dependencies
FROM node:alpine as dependencies
WORKDIR /app
COPY package.json .
COPY prisma ./prisma/
COPY .env ./
COPY tsconfig.json ./
COPY . . 
CMD rm -rf node_modules
RUN yarn install
RUN npx prisma generate
# Build production image
FROM dependencies as builder
RUN npm run build
EXPOSE 3000
CMD npm run start