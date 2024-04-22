FROM node:18.18.1-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci #--production

COPY . ./

RUN npm run build

FROM node:18.18.1-alpine as final

WORKDIR /app

ARG USER=appuser
ARG GROUP=appgroup
ENV PORT=8080
ENV COMPANY_CAM_ACCESS_TOKEN="AVjguITP34NelmkT9DgvAi0yelzyFkfrKlAwNfNLeP4"

RUN addgroup -S $GROUP && adduser -S $USER -G $GROUP

USER $USER
COPY --chown=$USER --from=build /app/node_modules ./node_modules
COPY --chown=$USER --from=build /app/dist ./

CMD [ "node", "express.js" ]
