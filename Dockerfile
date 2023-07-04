FROM node:20-buster

WORKDIR /webapp

RUN curl -fsSL https://deb.nodesource.com/setup_20.x |  bash && apt-get install -y nodejs

COPY . .

RUN npm install

ENTRYPOINT npm run dev
