import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandler'
import { isObject } from '../shared/index'

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

export function isProxy(value) {
  return isReactive(value) || isReadonly(value)
}

export const reactive = function (data) {
  return createReactiveObject(data, mutableHandlers)
}

export function readonly(data) {
  return createReactiveObject(data, readonlyHandlers)
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers)
}

function createReactiveObject(target, baseHandles) {
  if (!isObject(target)) {
    console.warn(`target ${target} 必须是一个对象`)
    return target
  }
  return new Proxy(target, baseHandles)
}
