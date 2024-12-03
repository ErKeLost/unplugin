import type { CompilationContext } from '@farmfe/core'
import type { UnpluginBuildContext, UnpluginContext } from '../types'
import { Buffer } from 'buffer'
import { extname } from 'path'
import { parse } from '../utils/context'

export function createFarmContext(
  context: CompilationContext,
  currentResolveId?: string,
): UnpluginBuildContext {
  return {
    parse,

    addWatchFile(id: string) {
      context.addWatchFile(currentResolveId || id, id)
    },
    emitFile(emittedFile) {
      const outFileName = emittedFile.fileName || emittedFile.name
      if (emittedFile.source && outFileName) {
        context.emitFile({
          resolvedPath: outFileName,
          name: outFileName,
          content: [...Buffer.from(emittedFile.source)],
          resourceType: extname(outFileName),
        })
      }
    },
    getWatchFiles() {
      return context.getWatchFiles()
    },
    getNativeBuildContext() {
      return { framework: 'farm', context }
    },
  }
}

export function unpluginContext(context: CompilationContext): UnpluginContext {
  return {
    error: (error: any) =>
      context!.error(
        typeof error === 'string' ? new Error(error) : error,
      ),
    warn: (error: any) =>
      context!.warn(typeof error === 'string' ? new Error(error) : error),
  }
}
