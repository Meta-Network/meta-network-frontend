const withPlugins = require('next-compose-plugins');
const withImages = require('next-images')
// const withReactSvg = require('next-react-svg')
// const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, options) => {
    return config;
  },
};

module.exports = withPlugins([
  [ withImages ]
], nextConfig);