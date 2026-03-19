/**
 * 设置页面 Mock 数据
 */

export const settingsSections = [
  {
    title: '通用',
    items: [
      { key: 'theme', label: '主题模式', type: 'link', value: '跟随系统' },
      { key: 'language', label: '语言', type: 'link', value: '简体中文' },
    ],
  },
  {
    title: '账户',
    items: [
      { key: 'userInfo', label: '用户信息', type: 'link' },
      { key: 'password', label: '修改密码', type: 'link' },
    ],
  },
  {
    title: '关于',
    items: [
      { key: 'version', label: '当前版本', type: 'text', value: '0.1.1' },
      { key: 'about', label: '关于我们', type: 'link' },
      { key: 'privacy', label: '隐私政策', type: 'link' },
    ],
  },
];
