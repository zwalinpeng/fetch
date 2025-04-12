# Receipt Processor

webservice application built with:

- javascript
- node
- express: restful api framework
- ajv: json object schema matching
- nanoid: id generation
- jest: test framework
- supertest: api test framework

api port: localhost:3000

to run with docker:

1. using docker compose\
`docker compose up app` to build container and start app\
`-d` flag to run in background\
`docker compose run` with `app` or `--rm test` argument to run app or tests only

2. without docker compose\
`docker build -t fetch .` to build container\
`docker run -d -p 3000:3000 fetch` to start application\
`docker run --rm fetch npm test` to run test module

to run with node:

1. install dependencies: `npm install`
2. start application: `npm start`
3. optionally run test module `npm test`
