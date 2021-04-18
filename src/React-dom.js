import { CompositeEvent } from './CompositeEvent'

// 传入一个虚拟dom对象.和一个容器进行渲染
function render(vdom, container) {
  // 将虚拟dom转为真实dom，进行渲染
  const dom = createDom(vdom)
  container.appendChild(dom)
}

// 将虚拟dom转为真实dom
function createDom(vdom) {
  // 如果是数字或者字符串，直接返回一个真实到文本节点
  if(typeof vdom === 'string' || typeof vdom === 'number') {
    return document.createTextNode(vdom)
  }

  const { type, props } = vdom;

  // 创建真实dom
  let dom;

  if (typeof type === 'function') {
    if (type.isReactComponent) {
      return createDomClassComponent(vdom)
    } else {
      return createDomFunctionComponent(vdom)
    }
  } else {
    dom = document.createElement(type);
  }

  // 把虚拟dom属性更新到真实dom上，
  updateProps(dom, props)
  // 把虚拟dom的儿子也变成真实dom挂在到自己的dom上。
  if (typeof props.children === 'string' || typeof props.children === 'number') {
    dom.textContent = props.children
  } else if (typeof props.children === 'object' && props.children.type) {
    // 只是有一个子元素，并且儿子是虚拟dom，把儿子变成真实dom插入到dom上
    render(props.children, dom)
  } else if (Array.isArray(props.children)) {
    // 如果children是一个数组的时候
    updateArryChild(props.children, dom)
  } else {
    document.textContent =  props.children ? props.children.toString() : ""
  }

   // 把真实dom作为一个dom属性放到虚拟dom上，为以后更新准备
  //  vdom.dom = dom;

  return dom;

}

// 将虚拟dom的props属性挂在真实dom 上
/**
 * 
 * @param {*} dom 真实dom
 * @param {*} props  虚拟dom的属性
 */
function updateProps(dom, props) {
  for (let key in props) {
    if (key === 'children') continue;
    if (key === 'style') {
      let styleObj = props.style;
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr]
      }
    } else if (key.startsWith('on')) {
      // 处理事件
      dom[key.toLocaleLowerCase()] = props[key];
      // 合成事件
      CompositeEvent(dom, key.toLocaleLowerCase(), props[key])
      console.log(CompositeEvent(dom, key.toLocaleLowerCase(), props[key]))
    } else {
      dom[key] = props[key]
    }
  }
}

/**
 * 
 * @param {*} childVdom 虚拟节点的儿子 child是一个数组的时候
 * @param {*} parantdom 父节点
 */
function updateArryChild(childVdom, parantdom) {
  for (let i = 0; i < childVdom.length; i++) {
    let childVdoms = childVdom[i]
    // 将虚拟节点挂在父节点上
    render(childVdoms, parantdom)
  }
}

/**
 * 
 * @param {*} vdom 将类组件虚拟dom转为真实dom
 */
function createDomClassComponent(vdom) {
   // 解构类的定义和类的属性对象
  const { type, props } = vdom;
  // 创建类的实例
  const classInstance  = new type(props)
  // 调用实例的render方法返回要渲染的虚拟dom
  const renderVdom = classInstance.render()
  // 根据虚拟dom对象创建真实的dom对象
  const dom = createDom(renderVdom)
  // 为了类组件更新，把真实dom挂在实例上
  classInstance.dom = dom;
  return dom
}

/**
 * 
 * @param {*} vdom 将函数组件虚拟dom转为真实dom
 */
function createDomFunctionComponent(vdom) {
  const {type: functionType, props} = vdom;
  // 函数组件本质上是一个函数，执行拿到虚拟dom
  const renderDom = functionType(props)
  // 将其转换为真实dom
  return createDom(renderDom)
}



const ReactDOM = {
  render,
  createDom,
}

export default ReactDOM;