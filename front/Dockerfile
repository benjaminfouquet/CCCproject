FROM node:14.17.6

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY ./ /app

RUN npm install --silent
RUN npm install react

CMD ["npm","start"]
