require('dotenv').config()
const toLower = require('lodash/toLower')
const toBoolean = (val) => toLower(val) === 'true'

const IS_DEV = process.env.NODE_ENV === 'development'
const IS_STAGING = toBoolean(process.env.IS_STAGING)
const USE_DOMAIN = !!process.env.DOMAIN
let BASE_URL

if (IS_DEV) {
  BASE_URL = 'http://localhost:3000'
} else if (USE_DOMAIN) {
  BASE_URL = `https://${process.env.DOMAIN}`
} else if (IS_STAGING) {
  BASE_URL = `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`
}

// we also need these server side so we have to add them here since
// they're determined by the existing env vars
const API_BASE_URL = `${BASE_URL}/api`
process.env.BASE_URL = BASE_URL
process.env.API_BASE_URL = API_BASE_URL

export default {
  srcDir: 'src',

  dev: process.env.NODE_ENV !== 'production',

  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID
  },

  serverMiddleware: [
    '~/serverMiddleware/redirects',
    { path: 'api', handler: '~/serverMiddleware/api' }
  ],

  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#1281BA',
    height: '2px'
  },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/styles/globals.scss',
  ],
  styleResources: {
    scss: ['@/assets/styles/variables.scss'],
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '@/plugins/nuxt-client-init', ssr: false },
    { src: '@/plugins/analytics', ssr: false },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
