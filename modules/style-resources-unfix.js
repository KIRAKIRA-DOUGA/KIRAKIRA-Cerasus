/**
 * NOTE: This ONLY works with webpack enabled.
 * If you wish to use webpack, ensure vite: false is set in your nuxt.config.ts
 *
 * Be sure to install
 * Nuxt Kit: https://v3.nuxtjs.org/guide/going-further/kit#nuxt-kit
 * sass-resources-loader
 * As well as the other dependencies needed for sass, scss, less as defined in
 * https://www.npmjs.com/package/@nuxtjs/style-resources
 *
 * In your nuxt 3 project, place this file in your /modules folder, and include it in your nuxt.config.ts file:
 *  modules: [
 *    '~/modules/style-resources.js',
 *  ]
 */
 import {
  defineNuxtModule,
  extendWebpackConfig,
  resolveAlias,
  resolveModule,
  resolveFiles,
  resolvePath,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {},
  async setup(moduleOptions, nuxt) {
    const {
      styleResources = moduleOptions,
      build: {
        styleResources: legacyStyledResources,
        loaders: { stylus: stylusLoaderOptions },
      },
    } = nuxt.options

    // A bit messy. Check for truthyness and keys and return
    const legacyResources =
      legacyStyledResources && Object.keys(legacyStyledResources).length && legacyStyledResources

    const resources = Object.assign({}, legacyResources || styleResources)
    const hoistUseStatements = resources.hoistUseStatements || false
    delete resources.hoistUseStatements

    const styleResourcesEntries = Object.entries(resources)

    if (!styleResourcesEntries.length) {
      // No resources set
      return
    }
    const basePath = await resolvePath('.')
    const retrieveStyleArrays = (styleResourcesEntries) =>
      styleResourcesEntries.reduce((normalizedObject, [key, value]) => {
        const wrappedValue = Array.isArray(value) ? value : [value]

        normalizedObject[key] = wrappedValue.reduce((acc, path) => {
          let possibleModulePath
          try {
            possibleModulePath = resolveModule(path)
          } catch (e) {}
          // const possibleModulePath = resolver.resolveModule(path)
          if (possibleModulePath) {
            // Path is mapped to module
            return acc.concat(possibleModulePath)
          }
          // Try to resolve alias, if not possible join with srcDir
          try {
            path = resolveAlias(path)
          } catch (error) {}
          // Try to glob (if it's a glob)
          path = resolveFiles(basePath, path) // use internal globbing function

          // Flatten this (glob could produce an array)
          return acc.concat(path)
        }, [])
        return normalizedObject
      }, {})

    const {
      scss = [],
      sass = [],
      less = [],
      stylus = [],
    } = retrieveStyleArrays(styleResourcesEntries)

    if (legacyResources) {
      console.warn(
        'Legacy styleResources detected. Will take over but ignore all other rules. Please move the rules to the top-level styleResources key'
      )
      this.options.build.styleResources = {}
    }

    if (sass.length) {
      const resources = (await Promise.all(sass)).flat(1)
      extendWebpackConfig(extendSass({ resources, hoistUseStatements }))
    }

    if (scss.length) {
      const resources = (await Promise.all(scss)).flat(1)
      extendWebpackConfig(extendScss({ resources, hoistUseStatements }))
    }

    if (stylus.length) {
      const resources = (await Promise.all(stylus)).flat(1)
      // Use stylus-loader for imports as he supports that :+1: ;)
      stylusLoaderOptions.import = stylusLoaderOptions.import
        ? []
            .concat(stylusLoaderOptions.import)
            .concat(resources) /* Looks like you know what you are doing! That's good */
        : resources
    }

    if (less.length) {
      const resources = (await Promise.all(less)).flat(1)
      extendWebpackConfig(extendLess({ resources, hoistUseStatements }))
    }
  },
})

const extendWithSassResourcesLoader = (matchRegex) => (options) => (config) => {
  // Yes, using sass-resources-loader is **intended here**
  // Despite it's name it can be used for less as well!
  const sassResourcesLoader = {
    loader: 'sass-resources-loader',
    options,
  }

  // Gather all loaders that test against scss or sass files
  const matchedLoaders = config.module.rules.filter(({ test = '' }) => {
    return test.toString().match(matchRegex)
  })

  // push sass-resources-loader to each of them
  matchedLoaders.forEach((loader) => {
    loader.oneOf.forEach((rule) => rule.use.push(sassResourcesLoader))
  })
}

const extendSass = extendWithSassResourcesLoader(/sass/)
const extendScss = extendWithSassResourcesLoader(/scss/)
const extendLess = extendWithSassResourcesLoader(/less/)
