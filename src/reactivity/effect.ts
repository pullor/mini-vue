import { extend } from '../shared'

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
    activeEffect = this
    return this._fn()
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
  if (!activeEffect) return

  dep.add(activeEffect)
  activeEffect.deps.push(dep)
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

let activeEffect
export function effect(fn, options?: EffectOptions) {
  const _effect = new ReactvieEffect(fn, options?.scheduler)
  _effect.run()
  extend(_effect, options)

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}
