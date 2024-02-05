class Cache {
  constructor() {
    this.cache = []
  }
  addCache(data) {
    this.cache.push(data)
  }
  clearCache() {
    this.cache = []
  }
  getData() {
    return this.cache
  }
  size() {
    return this.cache.length
  }
}

const cache = new Cache()
export default cache