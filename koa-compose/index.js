function compose(middlewares){

  // 最终返回一个函数
  return (ctx) => {

    return dispatch(0)

    function dispatch(i) {
      const fn = middlewares[i]
      if(!fn){
        return Promise.resolve()
      }
  
      return Promise.resolve( fn(ctx, () => dispatch(i + 1)) )
    }
  }
}

module.exports = compose
