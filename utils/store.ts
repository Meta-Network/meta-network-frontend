import store from 'store'

export function StoreGet(key: string) {
  return store.get(key)
}

export function StoreSet(key: string, val: string) {
  store.set(key, val)
}

export function StoreRemove(key: string) {
  store.remove(key)
}

export function StoreClearAll() {
  store.clearAll()
}

export function StoreClear() {
  const whitelist = ['']
  store.each((value, key: string) => !whitelist.includes(key) && store.remove(key))
}