const Koa = require('./koa');
const app = new Koa();
function delay(t) {
  return new Promise((a,b) => {
    setTimeout(() => {
      console.log(`delay${t}`)
      a()
    }, t)
  })
}

// logger
app.use(async (ctx, next) => {
  console.log(`>>> ${ctx.method} - ${ctx.url}`)
  // ctx.body = 'logger before next\n'
  await next();
  // ctx.body += 'logger after next\n'
  console.log(`<<< ${ctx.method} - ${ctx.url} - ${ctx.body}`)
});

// test
app.use(async (ctx, next) => {
  console.log(`>>> test before next`)
  await delay(1000)
  await next();
  console.log(`>>> test after next`)
});


// route
const Router = require('./koa-router');
var router = new Router();

router.get('/test', async (ctx) => {
  ctx.body += 'test page\n'
});

router.get('/test2', async (ctx) => {
  ctx.body += 'test2 page\n'
}).get('/test3', async (ctx) => {
  ctx.body += 'test3 page\n'
}).get('/test4', [
  async (ctx, next) => {
    ctx.body += 'test4-1 page\n'
    await delay(1000)
    await next()
    ctx.body += 'test4-1-end page\n'
  },
  async (ctx, next) => {
    ctx.body += 'test4-2 page\n'
    await next()
    ctx.body += 'test4-2-end page\n'
  },
  async (ctx, next) => {
    ctx.body += 'test4-3 page\n'
    await delay(1000)
    await next()
    ctx.body += 'test4-3-end page\n'
  }
]);

router.use('/test4', async (ctx, next) => {
  ctx.body += 'test4-mm page\n'
  await delay(1000)
  await next()
  ctx.body += 'test4-mm-end page\n'
})

app.use(router.routes())

// ======== route end =========

// static
const path = require('path')
const staticFiles = require('./koa-static')
console.log(__dirname)
app.use(staticFiles(path.join(__dirname), '/public'))
// ======== static end =========
app.listen(3000, () => {
  console.log('启动服务3000')
})