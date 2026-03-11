#!/usr/bin/env node

/**
 * Gluestack 颜色配置生成器 CLI 工具
 * 
 * 使用方法:
 * npx @panther-expo/ui generate-theme
 * 
 * 或者:
 * node ./scripts/generate-theme.js
 */

const fs = require('fs');
const path = require('path');

// 颜色调色板生成函数（复制自 palette.ts，避免依赖问题）
function hexToRgbObject(hex) {
  const hexValue = hex.replace('#', '');

  if (hexValue.length === 3) {
    return {
      r: parseInt(hexValue[0] + hexValue[0], 16),
      g: parseInt(hexValue[1] + hexValue[1], 16),
      b: parseInt(hexValue[2] + hexValue[2], 16),
    };
  } else if (hexValue.length === 6) {
    return {
      r: parseInt(hexValue.substring(0, 2), 16),
      g: parseInt(hexValue.substring(2, 4), 16),
      b: parseInt(hexValue.substring(4, 6), 16),
    };
  }
  throw new Error(`Invalid hex color: ${hex}`);
}

function rgbObjectToNativeString(rgb) {
  return `${rgb.r} ${rgb.g} ${rgb.b}`;
}

function adjustBrightness(rgb, factor) {
  const adjust = (value) => {
    const adjusted = Math.round(value + (255 - value) * factor);
    return Math.max(0, Math.min(255, adjusted));
  };
  return {
    r: adjust(rgb.r),
    g: adjust(rgb.g),
    b: adjust(rgb.b),
  };
}

function generateColorPalette(baseColor) {
  const rgb = hexToRgbObject(baseColor);

  return {
    0: rgbObjectToNativeString(adjustBrightness(rgb, 0.95)),
    50: rgbObjectToNativeString(adjustBrightness(rgb, 0.9)),
    100: rgbObjectToNativeString(adjustBrightness(rgb, 0.75)),
    200: rgbObjectToNativeString(adjustBrightness(rgb, 0.5)),
    300: rgbObjectToNativeString(adjustBrightness(rgb, 0.3)),
    400: rgbObjectToNativeString(adjustBrightness(rgb, 0.1)),
    500: rgbObjectToNativeString(rgb),
    600: rgbObjectToNativeString(adjustBrightness(rgb, -0.1)),
    700: rgbObjectToNativeString(adjustBrightness(rgb, -0.25)),
    800: rgbObjectToNativeString(adjustBrightness(rgb, -0.4)),
    900: rgbObjectToNativeString(adjustBrightness(rgb, -0.55)),
    950: rgbObjectToNativeString(adjustBrightness(rgb, -0.7)),
  };
}

// 默认配色方案
const defaultThemes = {
  orange: {
    name: '活力橙',
    primary: '#f38b32',
    secondary: '#4A5568',
    success: '#52C41A',
    error: '#FF4D4F',
    warning: '#FAAD14',
    info: '#1890FF',
  },
  blue: {
    name: '现代蓝',
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#0ea5e9',
  },
  purple: {
    name: '专业紫',
    primary: '#9333ea',
    secondary: '#6366f1',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#06b6d4',
  },
};

// 生成 CSS 变量
function generateCssVariables(name, palette) {
  const lines = [];
  for (const [key, value] of Object.entries(palette)) {
    lines.push(`  --color-${name}-${key}: ${value};`);
  }
  return lines.join('\n');
}

// 生成完整 CSS
function generateFullCss(theme, themeName = 'custom') {
  const lines = [
    '/**',
    ` * ${themeName} 主题配色方案`,
    ' * 由 @panther-expo/ui CLI 自动生成',
    ' */',
    '',
    ':root {',
  ];

  for (const [name, color] of Object.entries(theme)) {
    if (name === 'name') continue;
    const palette = generateColorPalette(color);
    lines.push(generateCssVariables(name, palette));
    lines.push('');
  }

  // 添加额外的语义色
  lines.push('  /* 指示器颜色 */');
  const primaryPalette = generateColorPalette(theme.primary);
  const errorPalette = generateColorPalette(theme.error);
  lines.push(`  --color-indicator-primary: ${primaryPalette[500]};`);
  lines.push(`  --color-indicator-error: ${errorPalette[500]};`);
  lines.push(`  --color-indicator-info: ${generateColorPalette(theme.info)[500]};`);
  lines.push('');

  lines.push('  /* 背景语义色 */');
  lines.push(`  --color-background-error: ${errorPalette[100]};`);
  lines.push(`  --color-background-warning: ${generateColorPalette(theme.warning)[100]};`);
  lines.push(`  --color-background-success: ${generateColorPalette(theme.success)[100]};`);
  lines.push(`  --color-background-info: ${generateColorPalette(theme.info)[100]};`);
  lines.push(`  --color-background-muted: ${generateColorPalette(theme.secondary)[50]};`);

  lines.push('}');
  lines.push('');

  // 暗色模式
  lines.push('/**');
  lines.push(' * 暗色模式');
  lines.push(' */');
  lines.push('.dark {');
  lines.push('  /* 文本色反转 */');
  lines.push('  --color-typography-0: 0 0 0;');
  lines.push('  --color-typography-700: 255 255 255;');
  lines.push('  --color-typography-400: 166 166 166;');
  lines.push('');
  lines.push('  /* 背景色变深 */');
  lines.push('  --color-background-0: 20 20 20;');
  lines.push('  --color-background-50: 31 31 31;');
  lines.push('  --color-background-300: 64 64 64;');
  lines.push('');
  lines.push('  /* 边框色变深 */');
  lines.push('  --color-outline-200: 64 64 64;');
  lines.push('}');

  return lines.join('\n');
}

// 生成 Tailwind 配置
function generateTailwindConfig(theme) {
  const config = {
    content: [
      './app/**/*.{js,jsx,ts,tsx}',
      './node_modules/@panther-expo/ui/dist/**/*.{js,jsx,ts,tsx}',
    ],
    presets: ['nativewind/preset'],
    theme: {
      extend: {
        colors: {
          primary: generateColorPaletteObject('primary'),
          secondary: generateColorPaletteObject('secondary'),
          success: generateColorPaletteObject('success'),
          error: generateColorPaletteObject('error'),
          warning: generateColorPaletteObject('warning'),
          info: generateColorPaletteObject('info'),
          typography: generateColorPaletteObject('typography'),
          background: generateColorPaletteObject('background'),
          outline: generateColorPaletteObject('outline'),
          indicator: {
            primary: "rgb(var(--color-indicator-primary)/<alpha-value>)",
            info: "rgb(var(--color-indicator-info)/<alpha-value>)",
            error: "rgb(var(--color-indicator-error)/<alpha-value>)",
          },
        },
      },
    },
  };

  return `/** @type {import('tailwindcss').Config} */
module.exports = ${JSON.stringify(config, null, 2)};`;
}

function generateColorPaletteObject(name) {
  const obj = {};
  [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].forEach((key) => {
    obj[key] = `rgb(var(--color-${name}-${key})/<alpha-value>)`;
  });
  if (name === 'typography') {
    obj.white = '#FFFFFF';
    obj.gray = '#D4D4D4';
    obj.black = '#181718';
  }
  return obj;
}

// 主函数
function main() {
  console.log('🎨 Gluestack 主题生成器\n');

  // 检查命令行参数
  const args = process.argv.slice(2);
  const preset = args[0] || 'orange';

  let theme;
  let themeName;

  if (defaultThemes[preset]) {
    theme = defaultThemes[preset];
    themeName = theme.name;
    console.log(`✓ 使用预设主题: ${themeName}\n`);
  } else {
    // 尝试解析自定义颜色
    try {
      hexToRgbObject(preset);
      theme = {
        ...defaultThemes.orange,
        primary: preset,
      };
      themeName = `自定义 (${preset})`;
      console.log(`✓ 使用自定义主色: ${preset}\n`);
    } catch (e) {
      console.error('❌ 无效的颜色格式，使用默认主题');
      theme = defaultThemes.orange;
      themeName = theme.name;
    }
  }

  // 生成输出目录
  const outputDir = path.join(process.cwd(), 'theme-generated');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 生成 CSS 文件
  const cssContent = generateFullCss(theme, themeName);
  const cssPath = path.join(outputDir, 'colors.css');
  fs.writeFileSync(cssPath, cssContent);
  console.log(`✅ CSS 变量配置: ${cssPath}`);

  // 生成 Tailwind 配置
  const tailwindContent = generateTailwindConfig(theme);
  const tailwindPath = path.join(outputDir, 'tailwind.config.js');
  fs.writeFileSync(tailwindPath, tailwindContent);
  console.log(`✅ Tailwind 配置: ${tailwindPath}`);

  // 生成使用说明
  const readmeContent = generateReadme(themeName);
  const readmePath = path.join(outputDir, 'README.md');
  fs.writeFileSync(readmePath, readmeContent);
  console.log(`✅ 使用说明: ${readmePath}`);

  console.log('\n📦 文件已生成到 ./theme-generated/ 目录');
  console.log('\n使用步骤:');
  console.log('1. 将 colors.css 中的内容复制到你的 global.css');
  console.log('2. 使用生成的 tailwind.config.js 替换现有配置');
  console.log('3. 运行 npm install 确保依赖安装');
  console.log('4. 重启开发服务器');
}

function generateReadme(themeName) {
  return `# ${themeName} 主题配置

## 文件说明

- \`colors.css\` - CSS 变量配置，复制到 global.css 中使用
- \`tailwind.config.js\` - Tailwind 配置，替换现有配置文件

## 快速开始

### 1. 配置 CSS 变量

将 \`colors.css\` 的内容复制到你的 \`global.css\` 文件：

\`\`\`css
@import "tailwindcss";

:root {
  /* 复制 colors.css 中的内容到这里 */
}
\`\`\`

### 2. 配置 Tailwind

用生成的 \`tailwind.config.js\` 替换你现有的配置文件。

### 3. 使用组件

\`\`\`typescript
import { Button, Input, Card } from '@panther-expo/ui';

function App() {
  return (
    <Card>
      <Text>欢迎使用</Text>
      <Input placeholder="请输入" />
      <Button action="primary">
        <ButtonText>提交</ButtonText>
      </Button>
    </Card>
  );
}
\`\`\`

## 自定义颜色

如需修改颜色，可以：

1. 直接编辑 CSS 变量值
2. 重新运行生成器：
   \`\`\`bash
   npx @panther-expo/ui generate-theme #3b82f6
   \`\`\`

## 暗色模式

默认支持暗色模式，使用 \`.dark\` 类切换：

\`\`\`typescript
<View className="dark">
  {/* 暗色模式下的内容 */}
</View>
\`\`\`
`;
}

// 运行
main();
