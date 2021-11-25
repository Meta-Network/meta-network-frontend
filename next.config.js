const { i18n } = require('./next-i18next.config')
const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
const { withSentryConfig } = require('@sentry/nextjs')


// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// TODO：CDN
const cdnPath = {
  'test': 'meta-network-test',
  'prod': 'meta-network-prod'
}
const isProd = false

// Your existing module.exports
const moduleExports = withPlugins([
    [withBundleAnalyzer]
  ],
  {
    // Use the CDN in production and localhost for development.
    assetPrefix: isProd ? `https://cdn.frontenduse.top/${cdnPath['test']}` : '',
    reactStrictMode: true,
    i18n,
    sentry: {
      disableServerWebpackPlugin: true,
      disableClientWebpackPlugin: true,
    },
    webpack: (config, options) => {
      if (!options.isServer) {
        config.optimization.splitChunks.cacheGroups['tool'] = {
          chunks: 'all',
          name: 'chunk-tool',
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](@sentry|axios)[\\/]/,
        }
        // console.log('config.optimization', config.optimization.splitChunks.cacheGroups)
      }

      return config
    },
  }
)

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
}

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins

module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions)