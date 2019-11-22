const fs = require('fs')
module.exports = function static (path, url = '/static'){
  console.log(path, url)
  return async function (ctx, next) {

    if(ctx.url.indexOf(url) === 0) {
      try {
        const filePath = path + ctx.url

        const stats = fs.statSync(filePath);

        if(!stats.isDirectory()) {
          const content = fs.readFileSync(filePath);
          ctx.body = content
        } else {
          ctx.body = '<p style="color: red"> directory 403 !</p>'
        }
  
      } catch (error) {
        ctx.body = '<p style="color: red">not find file 404 !</p>'
      }
    }
    

    await next()
  }
}