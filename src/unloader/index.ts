import type { UnloaderPlugin, UnpluginContextMeta, UnpluginFactory, UnpluginInstance } from '../types'
import { toRollupPlugin } from '../rollup'
import { toArray } from '../utils/general'

export function getUnloaderPlugin<UserOptions = Record<string, never>, Nested extends boolean = boolean>(
  factory: UnpluginFactory<UserOptions, Nested>,
) {
  return ((userOptions?: UserOptions) => {
    const meta: UnpluginContextMeta = {
      framework: 'unloader',
    }
    const rawPlugins = toArray(factory(userOptions!, meta))

    const plugins = rawPlugins.map((rawPlugin) => {
      const plugin = toRollupPlugin(rawPlugin, false) as UnloaderPlugin
      if (rawPlugin.unloader)
        Object.assign(plugin, rawPlugin.unloader)

      return plugin
    })

    return plugins.length === 1 ? plugins[0] : plugins
  }) as UnpluginInstance<UserOptions, Nested>['unloader']
}
