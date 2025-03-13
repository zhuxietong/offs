import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import { Project } from 'ts-morph';

interface OffsPluginOptions {
  copyFiles?: string[];
}

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) return;
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function copyDirectory(source: string, target: string) {
  if (!fs.existsSync(source)) return;

  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  files.forEach((file) => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      if (!fs.existsSync(targetPath)) {
        fs.copyFileSync(sourcePath, targetPath);
      }
    }
  });
}

function scanVueFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.lstatSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...scanVueFiles(fullPath));
    } else if (file.endsWith('.vue')) {
      results.push(fullPath);
    }
  });

  return results;
}

function generateComponentName(filePath: string, baseDir: string): string {
  const relativePath = path.relative(baseDir, filePath);
  const parts = relativePath.split(path.sep);

  if (parts[parts.length - 1] === 'index.vue') {
    // 使用父文件夹名称
    return 'Me' + parts[parts.length - 2].charAt(0).toUpperCase() + parts[parts.length - 2].slice(1);
  } else {
    // 使用文件名
    const fileName = parts[parts.length - 1].replace('.vue', '');
    return 'Me' + fileName.charAt(0).toUpperCase() + fileName.slice(1);
  }
}

function generateComponentsDeclaration(vueFiles: string[], baseDir: string): string {
  const imports = vueFiles.map((file) => {
    const componentName = generateComponentName(file, baseDir);
    const relativePath = './' + path.relative(baseDir, file).replace(/\\/g, '/');
    return `  ${componentName}: typeof import('${relativePath}')['default']`;
  });

  return `export {};

declare module '@vue/runtime-core' {
export interface GlobalComponents {
${imports.join(',\n')}
}
}
`;
}

function generateOffsExtComponents(vueFiles: string[], baseDir: string): string {
  const imports = vueFiles.map((file) => {
    const componentName = generateComponentName(file, baseDir);
    const relativePath = './' + path.relative(baseDir, file).replace(/\\/g, '/');
    return `import ${componentName} from '${relativePath}';`;
  });

  const registrations = vueFiles.map((file) => {
    const componentName = generateComponentName(file, baseDir);
    return `    app.component('${componentName}', ${componentName});`;
  });

  return `// 自动生成的全局组件注册文件
${imports.join('\n')}

export default {
install(app: any) {
${registrations.join('\n')}
},
};
`;
}

function generateInstallFile(): string {
  return `import type { App } from 'vue';
import offsModule from '@offs/uni';
import { offsRequestConfig } from '@offs/core';
import offsPart from './gen/offs-ext-components';
import globalInstall from './gen/global.install';

function initOffs(app: App<Element>) {
  // @ts-ignore
  app.use(offsModule);
  app.use(offsPart);
  globalInstall(); // 注入全局变量
  offsRequestConfig.intercept.before = (url, init) => {
    console.log('before request');
    return { url: 'http://192.168.3.105:9100' + url, init };
  };
}

export default initOffs;
`;
}

export default function offsComponentPlugin(options: OffsPluginOptions = {}): Plugin {
  const projectRoot = process.cwd();

  function processGlobalTsFiles() {
    const targetDir = path.join(projectRoot, 'src/.offs');
    const genDir = path.join(targetDir, 'gen');

    // 确保 gen 目录存在
    if (!fs.existsSync(genDir)) {
      fs.mkdirSync(genDir, { recursive: true });
    }

    // 递归查找 src/.offs 下的所有 .global.ts 文件
    function findAllGlobalTsFiles(dir: string): string[] {
      const results: string[] = [];
      if (!fs.existsSync(dir)) return results;

      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.lstatSync(fullPath);
        if (stat.isDirectory()) {
          results.push(...findAllGlobalTsFiles(fullPath));
        } else if (file.endsWith('.global.ts')) {
          results.push(fullPath);
        }
      }
      return results;
    }

    const globalFiles = findAllGlobalTsFiles(targetDir);

    if (globalFiles.length === 0) {
      // 如果没有找到 .global.ts 文件，删除旧的全局文件，防止数据过期
      const globalInstallPath = path.join(genDir, 'global.install.ts');
      if (fs.existsSync(globalInstallPath)) {
        fs.unlinkSync(globalInstallPath);
      }
      // 同样删除 global.declaration.d.ts
      const declarationPath = path.join(genDir, 'global.declaration.d.ts');
      if (fs.existsSync(declarationPath)) {
        fs.unlinkSync(declarationPath);
      }

      return;
    }

    // 生成 import 语句
    const importLines = globalFiles.map((file) => {
      const relativePath = path.relative(genDir, file).replace(/\\/g, '/');
      const baseName = path.basename(file, '.global.ts');
      return `import ${baseName} from '${relativePath.startsWith('.') ? '' : './'}${relativePath}';`;
    });

    const functionCallLines = globalFiles.map(file => `${path.basename(file, '.global.ts')}()`);
    const spreadCalls = functionCallLines.map(name => `...${name}`).join(', ');

    // 生成 global.install.ts 内容
    const installContent = `
${importLines.join('\n')}

const allVars = { ${spreadCalls} };

export default function() {
  for (const key of Object.keys(allVars)) {
    // @ts-ignore
    const item = allVars[key];
    if (typeof window !== 'undefined') {
      (window as any)['_' + key] = item;
    } else if (typeof globalThis !== 'undefined') {
      (globalThis as any)['_' + key] = item;
    }
  }
}
`;

    // 写入 gen/global.install.ts
    const globalInstallPath = path.join(genDir, 'global.install.ts');
    fs.writeFileSync(globalInstallPath, installContent);

    // 生成 global.declaration.d.ts
    generateGlobalDeclaration(globalFiles, genDir);
  }

  function generateGlobalDeclaration(globalFiles: string[], genDir: string) {
    const project = new Project({
      compilerOptions: {
        target: 3, // ES5
        module: 1, // CommonJS
        allowJs: false,
        declaration: true,
        emitDeclarationOnly: true,
        esModuleInterop: true,
        skipLibCheck: true,
      },
      tsConfigFilePath: path.join(projectRoot, 'tsconfig.json'),
    });

    const allVars: { [key: string]: string } = {};

    globalFiles.forEach(filePath => {
      const sourceFile = project.addSourceFileAtPath(filePath);
      const defaultExportSymbol = sourceFile.getDefaultExportSymbol();
      if (!defaultExportSymbol) return;

      const defaultExportType = defaultExportSymbol.getTypeAtLocation(sourceFile);
      const callSignatures = defaultExportType.getCallSignatures();
      const returnType = callSignatures[0]?.getReturnType();

      if (returnType) {
        const properties = returnType.getProperties();
        properties.forEach(prop => {
          const propName = prop.getName();
          const propType = prop.getValueDeclaration()?.getType().getText(undefined, 0) || 'any';
          allVars[propName] = propType;
        });
      }
    });

    // 生成 global.declaration.d.ts 内容
    const declarationLines = Object.entries(allVars).map(([key, type]) => {
      return `  var _${key}: ${type};`;
    });

    const declarationContent = `declare global {
${declarationLines.join('\n')}
}

export {};
`;

    // 写入 gen/global.declaration.d.ts
    const declarationPath = path.join(genDir, 'global.declaration.d.ts');
    fs.writeFileSync(declarationPath, declarationContent);
  }

  return {
    name: 'vite-plugin-offs-component',

    configureServer() {
      const pluginDir = __dirname;
      const targetDir = path.join(projectRoot, 'src/.offs');

      // 确保目标目录存在
      ensureDirectoryExistence(path.join(targetDir, 'dummy.txt'));

      // 1. 复制指定的文件
      if (options.copyFiles) {
        options.copyFiles.forEach((file) => {
          const sourcePath = path.join(pluginDir, 'copy', file);
          const targetPath = path.join(targetDir, file);

          if (fs.existsSync(sourcePath) && !fs.existsSync(targetPath)) {
            ensureDirectoryExistence(targetPath);
            fs.copyFileSync(sourcePath, targetPath);
          }
        });
      }

      // 2. 复制 override 文件夹
      const overrideSource = path.join(pluginDir, 'override');
      const overrideTarget = path.join(targetDir, 'override');
      if (fs.existsSync(overrideSource)) {
        copyDirectory(overrideSource, overrideTarget);
      }

      // 3. 处理 gen 目录
      const genSource = path.join(pluginDir, 'gen');
      const genTarget = path.join(targetDir, 'gen');
      if (fs.existsSync(genSource)) {
        // 复制 gen 目录结构
        copyDirectory(genSource, genTarget);

        // 扫描 Vue 文件并生成相关文件
        const vueFiles = scanVueFiles(genTarget);

        // 生成 components.d.ts
        const dtsContent = generateComponentsDeclaration(vueFiles, genTarget);
        fs.writeFileSync(path.join(genTarget, 'components.d.ts'), dtsContent);

        // 生成 offs-ext-components.ts
        const componentContent = generateOffsExtComponents(vueFiles, genTarget);
        fs.writeFileSync(path.join(genTarget, 'offs-ext-components.ts'), componentContent);

        // 生成 install.ts（包含全局变量），但仅当文件不存在时
        const installPath = path.join(targetDir, 'install.ts');
        if (!fs.existsSync(installPath)) {
          fs.writeFileSync(installPath, generateInstallFile());
        }
      }

      // 处理 .global.ts 文件
      processGlobalTsFiles();
    },

    buildStart() {
      // 在构建时处理 .global.ts 文件
      processGlobalTsFiles();
    },
  };
}
