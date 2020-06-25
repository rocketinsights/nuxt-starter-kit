# Nuxt Starter Kit

I always find myself doing the same things over and over with new Nuxt (and Next) projects. Packages I always use, environment variables for development, etc. This is a good starting point for any Nuxt project that gets a lot of boilerplate setup out of the way.

## What's Been Changed/Added
1. All app code has been moved into a `src` folder (config is `srcDir` in `nuxt.config.js`)
2. Jest has been setup to test store modules as well as components (which comes with nuxt out of the box)
3. Adds [redirect serverMiddleware](https://github.com/rocketinsights/nuxt-starter-kit/blob/master/src/serverMiddleware/redirects.js) for easy redirects if/when you need them
4. Adds Sass support
5. Stubs out analytics plugin
6. Adds `gsap` for animations
7. Adds `dotenv`, and some handy environment variables for dev and deploying to Heroku
8. Adds `app.json` file to support Heroku pipelines and Review Apps
9. Adds a basic API route in `serverMiddleware` to demonstrate interacting with MongoDB

## Notes on Mongo Usage
1. Make sure to fill in the keys in the .env file for your Mongo database. The `MONGO_DB_PATH` is for anything after the `@` in your typical Mongo URI.
2. The `serverMiddleware/database/index.js` file serves to maintain a connection to the database.
2. You can make a `POST` request to `/api/users/create` with a body of `{ "name": "Keanu Reeves" }` to create a user.
3. You can make a `GET` request to `/api/users/list` to get a list of user documents from the database.
