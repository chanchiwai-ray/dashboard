#FROM node:16 as build

#LABEL stage=build

#WORKDIR /dashboard

#COPY . /dashboard

#RUN npm -g upgrade

#RUN npm install

#ENV NODE_ENV=production

#RUN npm run build

################ Main ########################

FROM nginx:1.21

#COPY --from build /dashboard/dist/ /usr/share/nginx/html
COPY ./dist/ /usr/share/nginx/html

COPY ./configs/nginx.conf /etc/nginx/conf.d

RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
