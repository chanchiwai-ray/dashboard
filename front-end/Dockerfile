FROM node:16 AS build

LABEL stage=build

WORKDIR /dashboard

COPY . /dashboard

RUN npm -g upgrade

RUN npm install

ENV NODE_ENV=production

RUN npm run build

################ Main ########################

FROM nginx:1.21

COPY --from=build /dashboard/dist/ /usr/share/nginx/html

COPY ./configs/nginx.conf /etc/nginx/conf.d

RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
