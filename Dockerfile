#FROM node:10.16-slim AS builder
#ENV NPM_CONFIG_LOGLEVEL=warn NG_CLI_ANALYTICS=false
##  add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH
## Install angular cli
#RUN npm install -g @angular/cli@8.0.2
#RUN apt-get update && apt-get install git -y
#ADD package.json /tmp/package.json
#RUN cd /tmp && npm install
#RUN mkdir -p /app && cp -a /tmp/node_modules /app/
## set working directory
#WORKDIR /app
## Copy code from current directory
#COPY . /app
#RUN ng build --prod
FROM nginx
#COPY --from=builder app/dist /usr/share/nginx/html
COPY ./dist /usr/share/nginx/html
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.bak
# Copy deafult.conf file
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]