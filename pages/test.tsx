import React, { useState, useMemo } from 'react';


const C = () => {


  console.log('cccccc')

  return (
    <div>CCCCCCCC</div>
  )
}

const D =  React.memo( function D () {

  console.log('dddddd')

  return (
    <div>DDDDDD</div>
  )
})

const E =  React.memo( function E ({ state1 }: any) {

  console.log('eeeeeee state1', state1)

  return (
    <div>EEEEEEE {state1}</div>
  )
})

class F extends React.PureComponent {
  componentDidUpdate() {
    console.log("PureCp---componentDidUpdate");
  }

  render() {
    return <h3>PureCp: {this.props.state1}</h3>;
  }
}

const G = ({state1}: any) => {

  console.log('ggggg')

  const a = useMemo(() => {
    console.log('ggggg fn')

    return state1 + '-----'
    }, [ state1 ])

  return (
    <div>GGGGGGG {a}</div>
  )
}

const Test = () => {

  const [state, setstate] = useState('');
  const [state1, setstate1] = useState('');


  const childC: React.FC = () => {

    console.log(2222)
    return (
      <div>
        <button onClick={ () => setstate('2222') }>toggle</button>
        <div>222222</div>
      </div>
    )
  }

  const childC1: React.FC = () => {

    console.log(2222)
    return (
      <div>
        <button onClick={ () => setstate('2222') }>toggle</button>
        <div>222222</div>
      </div>
    )
  }

  const Child2: React.FC = React.memo( function Child2 () {

    console.log('child2')
    return (
      <div>
        <div>child2child2child2child2 state1 { state1 }</div>
      </div>
    )
  })

  return (
    <div>
      111111111111
      <button onClick={ () => setstate('1111') }>toggle</button>
      <button onClick={ () => setstate1(Date.now()) }>toggle1</button>
      <button onClick={ () => setstate1('0000000000') }>toggle1</button>
      <hr />
      { childC() }
      <C></C>
      <D></D>
      <E state1={state1}></E>
      <F state1={state1}></F>
      <G state1={state1}></G>
      <hr />
      <Child2></Child2>
    </div>
  )
}

export default Test