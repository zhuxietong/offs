
import project from '../project.global.ts';

const allVars = { ...project() };

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
