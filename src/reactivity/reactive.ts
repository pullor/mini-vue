import { mutableHandlers, readonlyHandlers } from './baseHandler'

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

export const reactive = function (data) {
  return createReactiveObject(data, mutableHandlers)
}

export function readonly(data) {
  return createReactiveObject(data, readonlyHandlers)
}

function createReactiveObject(target, baseHandles) {
  return new Proxy(target, baseHandles)
}
