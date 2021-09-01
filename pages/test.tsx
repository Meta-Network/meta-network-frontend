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

const C1: React.FC = React.memo( function C1 ({ state1 }) {
  const [state, setstate] = useState('');

  console.log('c1')
  return (
    <div>
      <div>C1 state { state }</div>
      <div>C1 state1 { state1 }</div>
      <button onClick={ () => setstate(Date.now()) }>C1</button>
    </div>
  )
})


const C2: React.FC = React.memo( function C2 ({ fn }) {
  const [state, setstate] = useState('');

  console.log('c2')
  return (
    <div>
      <div>C2 state { state }</div>
      <button onClick={ () => setstate(Date.now()) }>C2</button>
    </div>
  )
})

const C3: React.FC = React.memo( function C3 ({ v }) {
  const [state, setstate] = useState('');

  console.log('c3', v)
  return (
    <div>
      <div>C3 state { state }</div>
      <button onClick={ () => setstate(Date.now()) }>C3</button>
    </div>
  )
})

const c4Test = () => {
  console.log('c4Test')
}

const C4: React.FC = React.memo( function C4 ({}) {
  const [state, setstate] = useState('');

  console.log('c4')
  return (
    <div>
      <div>C4 state { state }</div>
      <button onClick={ () => setstate(Date.now()) }>C4</button>
      <button onClick={ () => c4Test() }>C4 fn</button>
    </div>
  )
})

const C5: React.FC = () => {
  console.log('C5')
  const [state, setstate] = useState('');

  return (
    <div>
      <button onClick={ () => setstate(String(Date.now())) }>toggle</button>
      <div>C5</div>
    </div>
  )
}


const C7: React.FC = React.memo( function C7 ({ string, obj }) {
  console.log('C7')
  return (
    <div>
      <div>C7 string { string }</div>
      <div>C7 obj { JSON.stringify(obj) }</div>
    </div>
  )
})

const Test = () => {

  console.log('Test Parent')

  const [state, setstate] = useState('');
  const [state1, setstate1] = useState('');

  const [stateString, setstateString] = useState('');
  const [stateObject, setstateObject] = useState({ a: 1 });


  const childC: React.FC = () => {
    console.log('childC')
    return (
      <div>
        <button onClick={ () => setstate('childC') }>toggle</button>
        <button onClick={ () => setstate(String(Date.now())) }>toggle</button>
        <div>childC</div>
      </div>
    )
  }

  const childC1: React.FC = () => {

    console.log(childC1)
    return (
      <div>
        <button onClick={ () => setstate('childC1') }>toggle</button>
        <div>childC1</div>
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

  const C6: React.FC = () => {
    console.log('C6')
    const [state, setstateC6] = useState('');

    return (
      <div>
        <button onClick={ () => setstateC6(String(Date.now())) }>toggle</button>
        <div>C6</div>
      </div>
    )
  }

  const c2Test = () => {
    console.log('c2Test')
  }

  const c3V = '123 v3'

  return (
    <div>
      Parent
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
      <C1 state1={state1}></C1>
      <C2 fn={c2Test}></C2>
      <C3 v={c3V}></C3>
      <C4></C4>
      <C5></C5>
      <C6></C6>
      <hr />
      <div>
        <C7 string={stateString} obj={stateObject}></C7>
        <button onClick={ () => setstateString(String(Date.now())) }>toggle</button>
        <button onClick={ () => setstateObject({ a: Date.now() }) }>toggle</button>

      </div>
    </div>
  )
}

export default Test