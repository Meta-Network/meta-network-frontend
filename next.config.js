const withPlugins = require('next-compose-plugins')
// const withImages = require('next-images')
const { i18n } = require('./next-i18next.config')
// const withReactSvg = require('next-react-svg')
// const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  i18n,
  webpack: (config, options) => {
    return config
  },
}

module.exports = withPlugins([
], nextConfig)