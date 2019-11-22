const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')
const compose = require('../koa-compose')

class Koa {

  constructor(){
    this.middlewares = []
  }
  use(cb){
    this.middlewares.push(cb)
    return this
  }

  listen(port, ...arg) {
    const server = http.createServer(async (req, res) => {

      const ctx = this.createContent(req, res)

      const finalFn = compose(this.middlewares)
      // console.log(this.middlewares)
      await finalFn(ctx)
      res.end(ctx.body)
    })
    server.listen(port, ...arg)
    return this
  }

  // 构建上下文
  createContent(req, res) {
    const ctx = Object.create(context)

    ctx.request = Object.create(request)
    ctx.response = Object.create(response)

    ctx.req = ctx.request.req = req
    ctx.res = ctx.response.res = res

    return ctx
  }
}

module.exports = Koa