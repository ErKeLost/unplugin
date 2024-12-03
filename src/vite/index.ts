import type { UnpluginContextMeta, UnpluginFactory, UnpluginInstance, VitePlugin } from '../types'
import { toRollupPlugin } from '../rollup'
import { toArray } from '../utils/general'

export function getVitePlugin<UserOptions = Record<string, never>, Nested extends boolean = boolean>(
  factory: UnpluginFactory<UserOptions, Nested>,
) {
  return ((userOptions?: UserOptions) => {
    const meta: UnpluginContextMeta = {
      framework: 'vite',
    }
    const rawPlugins = toArray(factory(userOptions!, meta))

    const plugins = rawPlugins.map((rawPlugin) => {
      const plugin = toRollupPlugin(rawPlugin, false) as VitePlugin
      if (rawPlugin.vite)
        Object.assign(plugin, rawPlugin.vite)

      return plugin
    })

    return plugins.length === 1 ? plugins[0] : plugins
  }) as UnpluginInstance<UserOptions, Nested>['vite']
}
