# Nuxt Starter Kit

I always find myself doing the same things over and over with new Nuxt (and Next) projects. Packages I always use, environment variables for development, etc. This is a good starting point for any Nuxt project that gets a lot of boilerplate setup out of the way.

## What's Been Changed/Added
1. All app code has been moved into a `src` folder (config is `srcDir` in `nuxt.config.js`)
2. Jest has been setup to test store modules as well as components (which comes with nuxt out of the box)
3. Adds redirect middleware for easy redirects if/when you need them
4. Adds Sass support
5. Stubs out analytics plugin
6. Adds `gsap` for animations
7. Adds `dotenv`, and some handy environment variables for dev and deploying to Heroku
8. Adds `app.json` file to support Heroku pipelines and Review Apps
9. Adds a basic API route in `serverMiddleware` to demonstrate interacting with MongoDB
