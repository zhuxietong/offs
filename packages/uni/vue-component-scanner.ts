import * as fs from 'fs';
import * as path from 'path';

// 定义组件目录路径
const COMPONENTS_DIR = path.resolve(__dirname, './src/components');

// 根据路径生成 PascalCase 名称，并处理重复路径名的情况
function toComponentName(filePath: string): string {
  const parts = filePath.replace('.vue', '').split('/');
  const fileName = parts.pop(); // 获取文件名
  const parentDir = parts.pop(); // 获取上级目录名

  // 如果父目录名和文件名相同，则只使用文件名
  const baseName = parentDir === fileName ? fileName : `${parentDir || ''}-${fileName}`;

  // 转换为 PascalCase 并添加 "Me" 前缀
  return 'Me' + baseName.replace(/(^|[-_])(\w)/g, (_, __, char) => char.toUpperCase());
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
    const importPath = path.replace(/\.vue$/, '');
    lines.push(`    ${name}: typeof import('${importPath}.vue')['default']`);
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
