import ReactDOM from './React-dom'

export const updateQueue = {
  isBatchUpdate: false, // 当前是否处于批量更新模式，默认false
  updaters: new Set(),
  batchUpdate() {
    // 批量更新，在react事件里面刚开始的时候将isBatchUpate设置为true,执行完设置为false
    for (let updater of this.updaters) {
      updater.updateComponent()
    }
    this.isBatchUpdate = false;
  }
}

class Updater {
  constructor(classInstance) {
    this.instance = classInstance; // 类组件的实例
    this.pendingState = []; // 等待生效的状态，可能是一个对象，也可能是一个函数
    this.callBacks = [];
  }
  addState(prevState, callback) {
    // 等待更新或者生效的状态
    this.pendingState.push(prevState)
    // 状态更新后的回调
    this.callBacks.push(callback)
    if (updateQueue.isBatchUpdate) {
      // this 是updater的实例
      updateQueue.updaters.add(this) // 如果是批量更新，缓存updater
    } else {
      // 否则就直接更新组件
      this.updateComponent()
    }
  }

  // isBatchUpdate 状态为false 下 直接更新组件
  updateComponent() {
    const { instance, pendingState, callBacks } = this;
    // 如果有等待更新的状态的话，先计算出新状态
    if (pendingState.length > 0) {
      // 计算新状态
      instance.state = this.computedState(); 
      instance.updateStateComponet()
      callBacks.forEach(cb => cb())
    }
  }

  // 计算新state
  computedState() {
    const { instance, pendingState, callBacks } = this;
    let { state } = instance;
    pendingState.forEach((nextState) => {
      // 判断等待更新的状态里面是对象还是函数
      if (typeof nextState === 'function') {
        nextState = nextState.call(instance, state);
      }
      state = {...state, ...nextState}
    })
    pendingState.length = 0;
    callBacks.length = 0;

    return state;
  } 


}



class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    // 每一个组件都有一个，一个组件对应一个updater的实例
    this.updater = new Updater(this)
  }
  // setState(prevState) {
  //   let state = this.state;
  //   this.state = {...state, ...prevState}
  //   // 重新生成虚拟dom
  //   const newVdom = this.render()
  //   // 更新
  //   updateClassComponent(this, newVdom);
  // }

  setState(prevState, callback) {
    // 将state的状态和callback保存起来
    this.updater.addState(prevState, callback);
  }

  updateStateComponet() {
    // 重新生成虚拟dom
    const newVdom = this.render();
    // 更新
    updateClassComponent(this, newVdom);
  }

}

/**
 * 
 * @param {*} instance 实例
 * @param {*} vdom  虚拟dom
 */
function updateClassComponent(instance, vdom) {
  // 取出类组件上次渲染的真实dom
  const oldDom = instance.dom;
  const newDom = ReactDOM.createDom(vdom);
  // 用新的指向老的
  oldDom.parentNode.replaceChild(newDom, oldDom);
  instance.dom = newDom;
}

export default Component