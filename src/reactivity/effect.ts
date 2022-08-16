class ReactvieEffect {
  private _fn
  public scheduler: Function | undefined
  constructor(fn, scheduler) {
    this._fn = fn
    this.scheduler = scheduler
  }
  run() {
    activeEffect = this
    return this._fn()
  }
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

  dep.add(activeEffect)
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

type EffectOptions = {
  scheduler?: Function
}

let activeEffect
export function effect(fn, options?: EffectOptions) {
  const _effect = new ReactvieEffect(fn, options?.scheduler)
  _effect.run()

  const runner = _effect.run.bind(_effect)

  return runner
}
