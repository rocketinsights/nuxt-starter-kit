# Nuxt Starter Kit

I always find myself doing the same things over and over with new Nuxt (and Next) projects. Packages I always use, environment variables for development, etc. This is a good starting point for any Nuxt project that gets a lot of boilerplate setup out of the way.

# Dev Environment
1. `cp .env.sample .env`
2. Get keys for the `.env` file from a team member (or setup your own accounts)
3. `yarn`
4. `yarn dev` and you'll have a server running on http://localhost:3000

# Contributing
Nuxt is great because it comes with some conventions built in, and it comes with vuex modules as well. Stores are awesome, and just about all logic _not_ related to a component's internal state should be held in stores. They're much easier to test and they're easier to debug. It also affords the opportunity to keep your javascript functions/business logic separate from the vue-specific elements. That makes the code easier to read, and more portable.


## a note on @nuxtjs/firebase

This project uses Firebase, and relies on [`@nuxtjs/firebase`](https://firebase.nuxtjs.org) package to do it. It abstracts away a bunch of the setup and allows for easy references in components, stores, and plugins. Firebase is intended to be used entirely client side, and we do. It's secured through security rules that can be setup in a json file with the project, or in the Firebase console directly.

## other packages features

Since the items in this "kit" will grow in time, it's best to just to check the package.json file as a starting point to see what the tech stack looks like.
