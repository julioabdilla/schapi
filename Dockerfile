FROM node:lts-alpine AS run
WORKDIR /app
RUN yarn global add nodemon
CMD ["nodemon", "--watch", "dist", "dist/main.js"]
