FROM node:lts-alpine AS run
WORKDIR /app
RUN yarn global add nodemon
CMD ["nodemoen", "--watch", "dist", "dist/main.js"]
