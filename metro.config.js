const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
// const defaultConfig = require('metro-config/src/defaults');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

// module.exports = {
//     resolver: {
//       extraNodeModules: {
//         crypto: require.resolve('crypto-browserify')
//       },
//       sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs']
//     }
//   };
  
