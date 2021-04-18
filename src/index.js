// import React, {Component} from 'react';
// import ReactDOM from 'react-dom';

// import React from './React'
// import { Component } from 'react';
import ReactDOM from './React-dom';
import Component, {updateQueue} from './Component'

const Counter = () => {
  return(
    <div style={{ color: 'blue' }}>
      函数组件
    </div>
  )
}

class ClassCounter extends Component {
  constructor(props) {
    super(props)
    this.state = { number: 0 }
  }
  render() {

    const handleClick = (event, eventStore) => {
      // console.log(event, eventStore)
      // debugger
      // updateQueue.isBatchUpdate = true;
      // console.log(updateQueue)
      this.setState({number: this.state.number + 1})
      console.log(this.state.number) // 0
      this.setState({number: this.state.number + 1})
      console.log(this.state.number) // 0
      this.setState({number: this.state.number + 1})
      console.log(this.state.number) // 0
      // console.log(updateQueue.updaters, '--->updaters')
      // updateQueue.batchUpdate();

      // setTimeout(() => {

      //   console.log(this.state.number, '---?') // 1
      //   this.setState({number: this.state.number + 1})
      //   console.log(this.state.number) //2
      //   this.setState({number: this.state.number + 1})
      //   console.log(this.state.number) // 3
      //   this.setState({number: this.state.number + 1})
      //   console.log(this.state.number) //4
      // } ,0)
      // queueMicrotask(() => {
      //   console.log(this.state.number, '---????') // 1
      //   this.setState({number: this.state.number + 1})
      //   console.log(this.state.number) //2
      //   this.setState({number: this.state.number + 1})
      //   console.log(this.state.number) // 3
      //   this.setState({number: this.state.number + 1})
      //   console.log(this.state.number) //4
      // })
    }
    
    // const handleClick = () => {
    //   updateQueue.isBatchUpdate = true;
    //   this.setState((lastState) => ({number: lastState.number + 1}), () =>{
    //     console.log('callback', this.state.number)
    //   })
    //   console.log(this.state.number) // 0
    //   this.setState((lastState) => ({number: lastState.number + 1}))
    //   console.log(this.state.number) // 0
    //   this.setState((lastState) => ({number: lastState.number + 1}))
    //   console.log(this.state.number) // 0
    //   updateQueue.isBatchUpdate = false;
    //   setTimeout(() => {
    //     console.log(this.state.number) // 3
    //     this.setState((lastState) => ({number: lastState.number + 1}))
    //   console.log(this.state.number) // 4
    //   this.setState((lastState) => ({number: lastState.number + 1}))
    //   console.log(this.state.number) // 5
    //   this.setState((lastState) => ({number: lastState.number + 1}))
    //   console.log(this.state.number) // 6
    //   },0)
    // }

    return (
      <div onClick={handleClick}>
        <span>类组件</span>
        {this.state.number}
      </div>
    )
  }
}

let element = (<div className="test" style={{ color: 'red' }}>
  <div>ccc</div>
  <span>
    xxx
  </span>
  <Counter />
  <ClassCounter />
</div>)

// let element2 = React.createElement("div", {
//   className: "test"
// }, "zzzz", React.createElement("span", null, "dddd"))
// console.log(element, 'element')

ReactDOM.render(
  element,
  document.getElementById('root')
);

