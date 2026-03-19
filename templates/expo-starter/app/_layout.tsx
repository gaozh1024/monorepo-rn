import 'react-native-reanimated';
import '../global.css';
import React from 'react';
import { RootApp } from '../src/app/RootApp';

/**
 * Expo 入口文件
 * 只负责导入 react-native-reanimated、global.css 和挂载 RootApp
 */
export default function Layout() {
  return <RootApp />;
}
