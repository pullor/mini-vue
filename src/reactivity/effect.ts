import { extend } from '../shared'
let activeEffect
let shouldTrack = false

class ReactvieEffect {
  private _fn
  deps = []
  private active = true
  onStop?: () => void
  public scheduler: Function | undefined
  constructor(fn, scheduler) {
    this._fn = fn
    this.scheduler = scheduler
  }
  run() {
    if (!this.active) {
      return this._fn()
    }

    // 应该收集
    shouldTrack = true
    activeEffect = this
    const r = this._fn()
    // 重置
    shouldTrack = false

    return r
  }
  stop() {
    if (this.active) {
      cleanupEffect(this)
      this.onStop && this.onStop()
      this.active = false
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
}

const targetMap = new Map()
export function track(target, key) {
  if (!isTracking()) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  // 看看 dep 之前有没有添加过，添加过的话 那么就不添加了
  if (dep.has(activeEffect)) return

  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  const deps = depsMap.get(key)
  for (const effect of deps) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export function stop(runner) {
  runner.effect.stop()
}

type EffectOptions = {
  scheduler?: Function
  onStop?: Function
}

export function effect(fn, options?: EffectOptions) {
  const _effect = new ReactvieEffect(fn, options?.scheduler)
  _effect.run()
  extend(_effect, options)

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}
