const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// 支持 yalc 链接的模块
const yalcPackages = ['@panther-expo/core', '@panther-expo/theme', '@panther-expo/ui'];

// 配置模块解析
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  ...yalcPackages.reduce((acc, pkg) => {
    acc[pkg] = path.resolve(__dirname, `node_modules/${pkg}`);
    return acc;
  }, {}),
};

// 确保 yalc 包被正确解析
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '.yalc'),
];

// 添加对 cjs/mjs 的支持（Expo SDK 54 推荐）
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'cjs', 'mjs', 'json'];

module.exports = config;
