// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'
import packageJson from './package.json'

const sw = process.env.SW === 'true'

export default defineNuxtConfig({
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      meta: [
        { property: 'Imagetoolbar', content: 'no' },
        { name: 'naver-site-verification', content: '158291e2c0440b1ab952cba20d55d36e61766b00' },
      ],
    },
  },
  extends: [
    '@nuxt/ui-pro',
  ],
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/supabase',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/devtools',
    '@nuxtjs/device',
    '@nuxtjs/robots',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/i18n',
    'nuxt-icon',
    'nuxt-time',
    'nuxt-simple-sitemap',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  css: [
    '~/assets/scss/style.scss',
  ],
  colorMode: {
    preference: 'dark',
    fallback: 'light',
  },
  ui: {
    prefix: 'DG',
    icons: ['tabler'],
  },
  eslint: {
    config: {
      stylistic: true,
    },
    checker: true,
  },
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: [
        '/',
        '/document',
        '/document/policy',
        '/document/service-policy',
        '/document/board',
      ],
    },
    clientOptions: {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    },
  },
  imports: {
    dirs: [
      'composables/**',
      'stores/**',
    ],
  },
  pinia: {
    storesDirs: [
      './stores/**',
    ],
  },
  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
        sepia: 'dracula-soft',
      },
    },
  },
  vite: {
    build: {
      sourcemap: true,
      cssMinify: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
  },
  pwa: {
    scope: '/',
    base: '/',
    strategies: sw ? 'injectManifest' : 'generateSW',
    srcDir: sw ? 'service-worker' : undefined,
    filename: sw ? 'sw.ts' : undefined,
    injectRegister: 'auto',
    registerType: 'autoUpdate',
    workbox: {
      sourcemap: true,
      navigateFallback: undefined,
      globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}', '/'],
      runtimeCaching: [{
        urlPattern: '/',
        handler: 'NetworkFirst',
      }],
    },
    injectManifest: {
      globDirectory: './.nuxt/dev-sw-dist',
      globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}'],
      globIgnores: ['**/node_modules/**/*', 'sw.js', 'workbox-*.js'],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
  i18n: {
    langDir: './locales',
    locales: [
      { code: 'ko', file: 'ko.ts' },
      { code: 'en', file: 'en.ts' },
    ],
    defaultLocale: 'ko',
    strategy: 'no_prefix',
  },
  stylelint: {
    lintOnStart: true,
  },
  vueuse: {
    ssrHandlers: false,
  },
  typescript: {
    shim: false,
  },
  robots: {
    rules: [
      { UserAgent: '*', Allow: '/' },
    ],
  },
  sourcemap: {
    server: true,
    client: true,
  },
  site: {
    url: 'https://www.dooramg.com',
  },
  runtimeConfig: {
    public: {
      appVersion: JSON.stringify(packageJson.version),
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL ?? process.env.NUXT_ENV_VERCEL_URL ?? 'http://localhost:4040',
      opiKey: process.env.OPINET_KEY,
      skOpenApiKey: process.env.SK_OPEN_API_KEY,
      naverClientId: process.env.NAVER_CLIENT_ID,
    },
  },
  compatibilityDate: '2024-07-06',
})
