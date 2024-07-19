# pull official base image
FROM  public.ecr.aws/e9h2b8k6/node:20.10-alpine

# create root directory for our project in the container
RUN mkdir /app

# Set the working directory to /app
WORKDIR /app


# copy files to the app directory
ADD . /app/

RUN apk update
RUN apk --no-cache --update add build-base
RUN apk add python3

RUN npm update --legacy-peer-deps
# install dependencies
RUN npm install --legacy-peer-deps
RUN npm install typescript -g

RUN sh ./docker/verify-build.sh

RUN npm run build

EXPOSE 80
EXPOSE 3030
EXPOSE 8125
EXPOSE 27649
EXPOSE 8099

CMD ["sh", "./docker/start-web.sh"]
