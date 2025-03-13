import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import * as ts from 'typescript';

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

function scanGlobalFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isFile() && file.endsWith('.global.ts')) {
      results.push(fullPath);
    }
  });

  return results;
}

function generateComponentName(filePath: string, baseDir: string): string {
  const relativePath = path.relative(baseDir, filePath);
  const parts = relativePath.split(path.sep);

  if (parts[parts.length - 1] === 'index.vue') {
    return 'Me' + parts[parts.length - 2].charAt(0).toUpperCase() + parts[parts.length - 2].slice(1);
  } else {
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
}`;
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
};`;
}

function generateGlobalInstallFile(globalFiles: string[], baseDir: string): string {
  const imports = globalFiles.map((file, index) => {
    const relativePath = './' + path.relative(path.dirname(baseDir), file).replace(/\\/g, '/');
    return `import Global${index} from '${relativePath}'`;
  });

  return `${imports.join('\n')}

export default function installGlobals() {
  const allVars = {
    ${globalFiles.map((_, index) => `...Global${index}()`).join(',\n    ')}
  };

  for (const key of Object.keys(allVars)) {
    const item = allVars[key];
    if (typeof window !== 'undefined') {
      window['_' + key] = item;
    } else if (typeof globalThis !== 'undefined') {
      globalThis['_' + key] = item;
    }
  }
}`;
}



function generateGlobalDeclaration(globalFiles: string[], baseDir: string): string {
  const imports = globalFiles.map((file, index) => {
    const relativePath = './' + path.relative(path.dirname(baseDir), file).replace(/\\/g, '/');
    return `import Global${index} from '${relativePath}'`;
  });

  // 获取全局变量及其类型
  const globalVarTypes = new Map<string, string>();

  globalFiles.forEach(file => {
    const sourceFile = ts.createSourceFile(
      file,
      fs.readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true
    );

    // 解析返回对象的类型
    function extractReturnType(node: ts.Node) {
      if (ts.isReturnStatement(node)) {
        if (node.expression && ts.isObjectLiteralExpression(node.expression)) {
          node.expression.properties.forEach(prop => {
            if (ts.isPropertyAssignment(prop)) {
              const propName = prop.name.getText();
              let typeText: string;

              // 处理不同类型的值
              if (ts.isNumericLiteral(prop.initializer)) {
                typeText = 'number';
              } else if (ts.isStringLiteral(prop.initializer)) {
                typeText = 'string';
              } else if (ts.isIdentifier(prop.initializer)) {
                // 查找变量声明来获取类型
                const varName = prop.initializer.getText();
                typeText = findVariableType(sourceFile, varName);
              } else {
                typeText = 'any';
              }

              globalVarTypes.set(propName, typeText);
            }
          });
        }
      }
    }

    // 查找变量的类型声明
    function findVariableType(sourceFile: ts.SourceFile, varName: string): string {
      let varType = 'any';

      function visit(node: ts.Node) {
        if (ts.isVariableDeclaration(node) &&
          node.name.getText() === varName &&
          node.type) {
          varType = node.type.getText();
          return;
        }
        ts.forEachChild(node, visit);
      }

      ts.forEachChild(sourceFile, visit);
      return varType;
    }

    // 遍历源文件
    ts.forEachChild(sourceFile, node => {
      if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)) {
        ts.forEachChild(node, extractReturnType);
      }
    });
  });

  return `${imports.join('\n')}

declare global {
  ${Array.from(globalVarTypes.entries()).map(([key, type]) => {
    return `const _${key}: ${type};`;
  }).join('\n  ')}
}

export {};`;
}

function generateInstallFile(): string {
  return `import type { App } from 'vue';
import offsModule from '@offs/uni';
import { offsRequestConfig } from '@offs/core';
import offsPart from './gen/offs-ext-components';
import installGlobals from './gen/global.install';

function initOffs(app: App<Element>) {
  // 安装全局变量
  installGlobals();

  // @ts-ignore
  app.use(offsModule);
  app.use(offsPart);
  offsRequestConfig.intercept.before = (url, init) => {
    console.log('before request');
    return { url: 'http://192.168.3.105:9100' + url, init };
  };
}

export default initOffs;`;
}

export default function offsComponentPlugin(options: OffsPluginOptions = {}): Plugin {
  return {
    name: 'vite-plugin-offs-component',

    configureServer() {
      const pluginDir = __dirname;
      const projectRoot = process.cwd();
      const targetDir = path.join(projectRoot, 'src/.offs');
      const genTarget = path.join(targetDir, 'gen');

      // 确保目录存在
      ensureDirectoryExistence(targetDir);
      ensureDirectoryExistence(genTarget);

      // 1. 复制指定文件
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

        // 生成 install.ts（如果不存在）
        const installPath = path.join(targetDir, 'install.ts');
        if (!fs.existsSync(installPath)) {
          fs.writeFileSync(installPath, generateInstallFile());
        }
      }

      // 4. 处理全局变量文件
      const globalFiles = scanGlobalFiles(targetDir);
      if (globalFiles.length > 0) {
        // 生成全局变量安装文件
        const globalInstallContent = generateGlobalInstallFile(globalFiles, path.join(genTarget, 'global.install.ts'));
        fs.writeFileSync(path.join(genTarget, 'global.install.ts'), globalInstallContent);

        // 生成全局变量类型声明文件
        const globalDeclarationContent = generateGlobalDeclaration(globalFiles, path.join(genTarget, 'global.declaration.d.ts'));
        fs.writeFileSync(path.join(genTarget, 'global.declaration.d.ts'), globalDeclarationContent);
      }
    },

    transform(code: string, id: string) {
      if (id.includes('main.ts') || id.includes('main.js')) {
        const injection = `
import installGlobals from '@/.offs/gen/global.install';
installGlobals();
`;
        return {
          code: injection + code,
          map: null
        };
      }
      return null;
    },

    resolveId(id: string) {
      if (id.startsWith('@/.offs/')) {
        const projectRoot = process.cwd();
        return path.resolve(projectRoot, 'src', id.slice(2));
      }
      return null;
    }
  };
}
