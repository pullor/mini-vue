import { mutableHandlers, readonlyHandlers } from './baseHandler'

export const reactive = function (data) {
  return createReactiveObject(data, mutableHandlers)
}

export function readonly(data) {
  return createReactiveObject(data, readonlyHandlers)
}

function createReactiveObject(target, baseHandles) {
  return new Proxy(target, baseHandles)
}
