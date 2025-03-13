import * as fs from 'fs';
import * as path from 'path';

// 定义组件目录路径
const COMPONENTS_DIR = path.resolve(__dirname, './src/components');

// 将字符串转换为 PascalCase，处理连字符
function toPascalCase(str: string): string {
  return str
    .split('-') // 先按连字符分割
    .map(part =>
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join('');
}

// 根据路径生成 PascalCase 名称
function toComponentName(filePath: string): string {
  // 移除 .vue 扩展名并分割路径
  const parts = filePath.replace('.vue', '').split('/');
  const fileName = parts.pop() || ''; // 获取文件名

  // 如果是 index 文件，使用父目录名称
  if (fileName === 'index') {
    // 将每个路径部分转换为 PascalCase
    return 'Me' + parts.map(part => toPascalCase(part)).join('');
  }

  // 非 index 文件，包含所有目录名称和文件名
  return 'Me' + parts.concat(fileName).map(part => toPascalCase(part)).join('');
}

// 扫描组件目录
function scanComponents(dir: string): { name: string; path: string }[] {
  const components: { name: string; path: string }[] = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 如果是目录，则递归扫描
      components.push(...scanComponents(fullPath));
    } else if (stat.isFile() && file.endsWith('.vue')) {
      // 如果是 Vue 文件，则记录组件名和路径
      const relativePath = path.relative(COMPONENTS_DIR, fullPath).replace(/\\/g, '/');
      const name = toComponentName(relativePath);
      components.push({ name, path: `./components/${relativePath}` });
    }
  });

  return components;
}

// 生成 components.d.ts 文件
function generateComponentsDTS(components: { name: string; path: string }[]) {
  const lines = [
    'export {}',
    "declare module '@vue/runtime-core' {",
    '  export interface GlobalComponents {',
  ];

  components.forEach(({ name, path }) => {
    lines.push(`    ${name}: typeof import('${path}')['default']`);
  });

  lines.push('  }');
  lines.push('}');

  const outputPath = path.resolve(COMPONENTS_DIR, '../components.d.ts');
  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
  console.log(`Generated: ${outputPath}`);
}

// 生成 install.ts 文件
function generateInstallTS(components: { name: string; path: string }[]) {
  const lines = [
    "import { App } from 'vue';",
    '',
    '// 自动生成的全局组件注册文件',
  ];

  // 导入组件
  components.forEach(({ name, path }) => {
    lines.push(`import ${name} from '${path}';`);
  });

  lines.push('');
  lines.push('export default {');
  lines.push('  install(app: App) {');

  // 注册组件
  components.forEach(({ name }) => {
    lines.push(`    app.component('${name}', ${name});`);
  });

  lines.push('  },');
  lines.push('};');

  const outputPath = path.resolve(COMPONENTS_DIR, '../install.ts');
  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
  console.log(`Generated: ${outputPath}`);
}

// 主函数
function main() {
  const components = scanComponents(COMPONENTS_DIR);
  generateComponentsDTS(components);
  generateInstallTS(components);
}

main();
