const compose = require('../koa-compose')
class Router {

  constructor(){
    this.routeMap = []
  }

  register(path, methods, middlewares) {
    if(!Array.isArray(middlewares)) {
      middlewares = [middlewares]
    }
    let route = {path, methods, middlewares}
    this.routeMap.push(route);
    return this
  }

  get(path, middlewares) {
    return this.register(path, 'get', middlewares)
  }

  post(path, middlewares) {
    return  this.register(path, 'get', middlewares)
  }

  put(path, middlewares) {
    return this.register(path, 'get', middlewares)
  }

  del(path, middlewares) {
    return this.register(path, 'get', middlewares)
  }

  routes(){
    return async (ctx, next) => {
      const {method, url} = ctx
      
      const route = this.routeMap.filter(o => o.path == url && o.methods == method)

      if(route.length){
        const fn = compose(route[0].middlewares)
        await fn(ctx)
      }
      await next()
    }
  }

  use(path, middleware) {
    
    if(!Array.isArray(path)) {
      path = [path]
    }

    this.routeMap.forEach(o =>{
      if(path.includes(o.path)){
        o.middlewares.push(middleware)
      }
    })

  }
}

module.exports = Router