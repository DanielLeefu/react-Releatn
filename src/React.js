
function createElement(type, config, children) {
  if(config) {
    delete config.__self
    delete config.__source
  }
  let props = {...config};
  // 有多个子节点的时候
  if (arguments.length > 3) {
    // children 是一个数组
    children = Array.prototype.slice.call(arguments, 2)
  }

  props.children = children;

  return {
    type,
    props,
  }
}


const React = {
  createElement,
}

export default React;

