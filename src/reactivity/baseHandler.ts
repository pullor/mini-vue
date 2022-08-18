import { trigger, track } from './effect'

function createGetter(isReaonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key)
    if (!isReaonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value)
    trigger(target, key)
    return res
  }
}

const set = createSetter()
const get = createGetter()
const readonlyGet = createGetter(true)

export const mutableHandlers = {
  get,
  set,
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    console.warn(`key :"${String(key)}" set 失败，因为 target 是 readonly 类型`, target)

    return true
  },
}
