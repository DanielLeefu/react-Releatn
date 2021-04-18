import { updateQueue } from "./Component";

/**
 * 
 * @param {*} dom  真实dom
 * @param {*} eventType 事件类型
 * @param {*} handleEvent 事件处理函数
 */
function CompositeEvent(dom, eventType, handleEvent) {
   // 给dom绑定一个onClick事件回调函数，，handleEvent 就是于handlclick
  //  let store;
  // if(dom.store) {
  //   store = dom.store
  // } else {
  //   dom.store = {}
  //   store = dom.store
  // }
   let store = dom.store || (dom.store = {})
   store[eventType] = handleEvent;  // store.onclick = handleClick
   if (!document[eventType]) { //事件委托 不管给哪个dom元素上绑定事件，最后统一代理到document事件上去
      document[eventType] = dispatchEvent; // document.onclick = dispatchEvent
   } 
}
// 存储创建出来的合成事件
let eventStore = {
  bubbling: false,
  stopBubbling() {
    this.bubbling = true;
    console.log('阻止冒泡')
  }
}

// event 是原生事件
function dispatchEvent(event) {
  const { target, type } = event; // 事件源 button哪个dom元素，类型 type= click
  const eventType = `on${type}`;
  updateQueue.isBatchUpdate = true;
  // 根据原生事件对象创建出一个合成事件对象
  eventStore = createCompositeEvent(event);
  // 事件冒泡
  // while(target) {
    const { store } = target;
    const handleEvent = store && store[eventType];
    // 执行事件处理函数
    handleEvent && handleEvent.call(target, eventStore);
    // if (eventStore.bubbling) 
    // break;
    // target = target.parentNode;
  // }
 
  // 让每一次都用eventStore这个对象，形成单例模式
  for(let key in eventStore) {
    eventStore[key] = null;
  }
  updateQueue.batchUpdate()
}

function createCompositeEvent(event) {
  for (let key in event) {
    eventStore[key] = event[key]
  }
  return eventStore
}





export {
  CompositeEvent
}