import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

interface PluginOptions {
  prefix?: string;
  outDir?: string;
  platform?: 'h5' | 'mp' | 'app';
}

function generateTypeDefinition(obj: any, indent = 2): string {
  if (typeof obj !== 'object' || obj === null) {
    return 'string';
  }

  const spaces = ' '.repeat(indent);
  const entries = Object.entries(obj);
  const types = entries.map(([key, value]) => {
    const valueType = generateTypeDefinition(value, indent + 2);
    return `${spaces}${key}: ${valueType};`;
  });

  return `{\n${types.join('\n')}\n${' '.repeat(indent - 2)}}`;
}

export default function offsStylePlugin(options: PluginOptions = {}): Plugin {
  const prefix = options.prefix || 'offs';
  const platform = options.platform || 'h5';
  let categorizedVars: Record<string, Record<string, string>> = {};

  async function generateFiles(srcDir: string, offsDir: string) {
    // 读取SCSS文件
    const scssFiles = ['uni.scss', 'style.scss']
      .map(file => path.join(srcDir, file))
      .filter(file => fs.existsSync(file));

    const variables: Record<string, string> = {};

    // 解析SCSS文件中的变量
    scssFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      const varRegex = /--offs-([a-zA-Z0-9-_]+):\s*([^;]+);/g;
      let match;

      while ((match = varRegex.exec(content)) !== null) {
        const [, name, value] = match;
        variables[name] = value.trim();
      }
    });

    // 构建分类对象
    categorizedVars = {};
    Object.entries(variables).forEach(([key, value]) => {
      const parts = key.split('-');
      const category = parts[0];
      const name = parts.slice(1).join('_');

      if (!categorizedVars[category]) {
        categorizedVars[category] = {};
      }

      let processedValue = value;
      if (value.startsWith("'") && value.endsWith("'")) {
        processedValue = value.slice(1, -1);
      }

      categorizedVars[category][name] = processedValue;
    });

    // 生成类型声明文件
    const typeDefinition = generateTypeDefinition(categorizedVars);
    const dtsContent = `// This file is auto-generated by vite-plugin-offs-style
declare const ${prefix}Style: ${typeDefinition};

declare global {
const _${prefix}Style: typeof ${prefix}Style;
}

export default ${prefix}Style;`;

    // 根据平台生成不同的实现文件
    let styleContent: string;
    if (platform === 'mp') {
      // 小程序环境
      styleContent = `// @ts-nocheck
// This file is auto-generated by vite-plugin-offs-style
const ${prefix}Style = ${JSON.stringify(categorizedVars, null, 2)} as const;

// 适配小程序环境
if (typeof globalThis !== 'undefined') {
globalThis._${prefix}Style = ${prefix}Style;
} else if (typeof global !== 'undefined') {
global._${prefix}Style = ${prefix}Style;
} else {
const _global = (function() { return this; })();
_global._${prefix}Style = ${prefix}Style;
}

export default ${prefix}Style;`;
    } else {
      // H5/App环境
      styleContent = `// @ts-nocheck
// This file is auto-generated by vite-plugin-offs-style
const ${prefix}Style = ${JSON.stringify(categorizedVars, null, 2)} as const;

if (typeof window !== 'undefined') {
window._${prefix}Style = ${prefix}Style;
} else if (typeof globalThis !== 'undefined') {
globalThis._${prefix}Style = ${prefix}Style;
}

export default ${prefix}Style;`;
    }

    // 创建 gen 目录
    const genDir = path.join(offsDir, 'gen');
    await fs.promises.mkdir(genDir, { recursive: true });

    // 写入文件到 gen 目录
    await Promise.all([
      fs.promises.writeFile(path.join(genDir, `${prefix}-style.ts`), styleContent),
      fs.promises.writeFile(path.join(genDir, `${prefix}-style.global.d.ts`), dtsContent)  // 修改文件名
    ]);

    // 生成 index.ts 文件
    const indexContent = `export { default } from './${prefix}-style';`;
    await fs.promises.writeFile(path.join(offsDir,'gen', 'index.ts'), indexContent);

    console.log(`[vite-plugin-offs-style] Generated files in ${genDir}`);
  }

  return {
    name: 'vite-plugin-offs-style',
    async configResolved() {
      const srcDir = path.resolve(process.cwd(), 'src');
      const baseDir = options.outDir
        ? path.resolve(process.cwd(), options.outDir)
        : process.cwd();
      const offsDir = path.join(baseDir, '.offs');

      // 确保输出目录存在
      await fs.promises.mkdir(baseDir, { recursive: true });
      await fs.promises.mkdir(offsDir, { recursive: true });

      // 初始生成文件
      await generateFiles(srcDir, offsDir);
    },
    configureServer(server) {
      server.watcher.add('src/**/*.scss');

      server.watcher.on('change', async (file) => {
        if (file.endsWith('.scss')) {
          const srcDir = path.resolve(process.cwd(), 'src');
          const baseDir = options.outDir
            ? path.resolve(process.cwd(), options.outDir)
            : process.cwd();
          const offsDir = path.join(baseDir, '.offs');

          await generateFiles(srcDir, offsDir);
          server.ws.send({
            type: 'full-reload',
            path: '*'
          });
        }
      });
    },
    transform(code, id) {
      if (id.endsWith('main.ts')) {
        const importPath = path.relative(
          path.dirname(id),
          path.join(options.outDir || '', '.offs','gen')
        ).replace(/\\/g, '/')

        return {
          code: `import ${prefix}Style from '${importPath.startsWith('.') ? importPath : './' + importPath}';\n` +
            code,
          map: null
        };
      }
      return null;
    }
  };
}