#!/usr/bin/env bun
import { readdirSync, writeFileSync } from 'fs'
import { join, relative } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface ComponentInfo {
  name: string
  path: string
  importName: string
  componentName: string
}

function scanVueFiles(dir: string, components: ComponentInfo[] = [], baseDir: string = dir) {
  const files = readdirSync(dir, { withFileTypes: true })

  for (const file of files) {
    const fullPath = join(dir, file.name)
    if (file.isDirectory()) {
      scanVueFiles(fullPath, components, baseDir)
    } else if (file.name.endsWith('.vue')) {
      const relativePath = './' + relative(baseDir, fullPath).replace(/\\/g, '/')
      const baseName = file.name.replace('.vue', '')
      const kebabName = baseName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
      const pascalName = baseName
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')

      components.push({
        name: baseName,
        path: relativePath,
        importName: pascalName,
        componentName: `me-${kebabName}`
      })
    }
  }
  return components
}

function generateInstallFile(components: ComponentInfo[]) {
  const imports = components
    .map(comp => `import ${comp.importName} from "${comp.path}"`)
    .join('\n')

  const registrations = components
    .map(comp => `  app.component('${comp.componentName}', ${comp.importName})`)
    .join('\n')

  return `${imports}

export function install_comps(app: any) {
${registrations}
}
`
}

function generateTypesFile(components: ComponentInfo[]) {
  const componentTypes = components
    .map(comp => {
      const globalName = 'Me' + comp.importName
      return `    ${globalName}: typeof import('${comp.path}')['default']`
    })
    .join('\n')

  return `export {}
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
${componentTypes}
  }
}
`
}

// 执行扫描
const srcPath = join(__dirname, 'src')
const components = scanVueFiles(srcPath)

// 生成并写入文件
const installContent = generateInstallFile(components)
const typesContent = generateTypesFile(components)

writeFileSync(join(srcPath, 'install.ts'), installContent)
writeFileSync(join(srcPath, 'components.d.ts'), typesContent)

console.log('Files generated successfully!')