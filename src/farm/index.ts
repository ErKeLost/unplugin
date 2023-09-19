import type {
  RollupPlugin,
  UnpluginContextMeta,
  UnpluginFactory,
  UnpluginInstance,
  UnpluginOptions,
} from '../types'
import { toArray } from '../utils'

export function getFarmPlugin<
  UserOptions = Record<string, never>,
  Nested extends boolean = boolean,
>(factory: UnpluginFactory<UserOptions, Nested>) {
  return ((userOptions?: UserOptions) => {
    const meta: UnpluginContextMeta = {
      framework: 'farm',
    }
    const rawPlugins = toArray(factory(userOptions!, meta))

    const plugins = rawPlugins.map(plugin => toFarmPlugin(plugin))
    return plugins.length === 1 ? plugins[0] : plugins
  }) as UnpluginInstance<UserOptions, Nested>['rollup']
}

export function toFarmPlugin(plugin: UnpluginOptions): RollupPlugin {
  // 根据loadInclude 出来的结果，决定在 load 中执行的 id
  if (plugin.transform && plugin.transformInclude) {
    // const _transform = plugin.transform
    // plugin.transform = function (code, id) {
    //   if (plugin.transformInclude && !plugin.transformInclude(id))
    //     return null

    //   return _transform.call(this, code, id)
    // }
    const _transform = plugin.transform
    plugin.transform = {
      filters: { resolvedPaths: [] },
      executor(params) {
        if (plugin.transformInclude && !plugin.transformInclude(id))
          return null

        return _transform.call(this, params.content, params.resolvedPath)
      },
    }
  }

  if (plugin.load && plugin.loadInclude) {
    const _load = plugin.load
    // plugin.load = function (id) {
    //   console.log(id);
    //   if (plugin.loadInclude && !plugin.loadInclude(id))
    //     return null

    //   return _load.call(this, id)
    // }
    plugin.load = {
      filters: {
        resolvedPaths: [],
      },
      executor(id) {
        return _load.call(this, id)
      },
    }
  }
  delete plugin.transformInclude
  delete plugin.loadInclude

  // if (plugin.rollup && containRollupOptions)
  //   Object.assign(plugin, plugin.rollup)

  return plugin
}

/**
 * v1.0.0 beta
 * 1. 增量构建
 * 2. 重构 resolver
 * 3. 接入一些 js 生态 (unplugin)
 * 4. 重构 node 流程 规范化
 * 5. 感觉还可以接一下 fervid 的 vue compiler
 */