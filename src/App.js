import React from 'react';
import {createStore} from "redux";
import {Provider, connect} from "react-redux";

// REDUX SECTION
const ADD_NUMBER = "ADD_NUMBER";
const ADD_OPERATOR = "ADD_OPERATOR";
const CLEAR_SCREEN =  "CLEAR_SCREEN";
const CALCULATE = "CALCULATE";


//auxiliares para REGEX
const PREV_DECIMAL_I = /^(\d)*\.(\d)*$/i;
const PREV_DECIMAL_II = /[\+\-\*\/]\d*\./i;
const DOUBLE_SIGN = /\W{1,}[\+\*\\]/;

const addNumber = (numb)=>{
  return {
    type:ADD_NUMBER,
    payload: numb
  };
};
const clearScreen =()=>{
  return {
    type:CLEAR_SCREEN
  };
};
const addOperator = (ope)=>{
  return {
    type:ADD_OPERATOR,
    payload: ope
  };
};
const calculate=()=>{
  return {
    type:CALCULATE
  };
};

const reducer = (state="0",action) =>{
  switch(action.type){
    case ADD_NUMBER:
      if (state === "0" && action.payload === "0"){
        return state;
      }
      if (state === "0"){
        state="";
      }
      return state + action.payload;
    case ADD_OPERATOR:
      console.log("Esto es el state cuando agrego un operador "+ action.payload+ " : " + state);
      if(PREV_DECIMAL_I.test(state) && action.payload==="."){
        //para cuando tengo "22.
        return state;
      }
      if(PREV_DECIMAL_II.test(state) && action.payload==="."){
        //para cuando tengo "...+22."
        return state;
      }
      return state + action.payload;
    case CLEAR_SCREEN:
      return "0";
    case CALCULATE:
      // si tengo dos operadores pegados, utilizar el ultimo, a menos que sea un signo menos
      let steit = "".concat(state);
       //busco operador y +/*
      let result;
      while (steit.match(DOUBLE_SIGN)){
        result = steit.match(DOUBLE_SIGN)[0];
        steit = steit.replace(DOUBLE_SIGN, result.charAt(result.length-1));
      }
      while (steit.match(/\-\-/)){
        result = steit.match(/\-\-/)[0];
        steit = steit.replace(/\-\-/,"+");
      }
      return eval(steit);
    default:
        return state;
  }
}

const store = createStore(reducer);


// REACT SECTION

class NumberButton extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(event){
    this.props.whenClicked(event.target.value);
  }
  render(){
    return(
      <button className="distinto col" onClick={this.handleClick} value={this.props.value} id={this.props.id}>{this.props.value}</button>
    )
  }
};

class OperatorButton extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(event){
    console.log(event);
    console.log(this.props.input)
    if (this.props.value==="C"){
      this.props.whenClicked()
      return 0;
    }else if (this.props.value==="="){
      this.props.whenClicked();
      return 0;
    }

    this.props.whenClicked(event.target.value);
  }
  render(){
    return(
      <button className={this.props.cn} onClick={this.handleClick} value={this.props.value} id={this.props.id}>{this.props.value}</button>
    );
  }
}
class DisplayScreen extends React.Component {
  render(){
    return(
      <p id="display" className={this.props.cn}>{this.props.input}</p>
    )
  }
}


class NumberPad extends React.Component {
  
  render(){
    return(
      <div className="calculator col-3 text-center">
        <div className="row">
          <DisplayScreen input={this.props.input} cn="col"/>
        </div>
        <div className="row">
          <OperatorButton value="+" whenClicked={this.props.getNewOperator} id="add" cn="col"/>
          <OperatorButton value="-" whenClicked={this.props.getNewOperator} id="subtract" cn="col"/>
          <OperatorButton value="/" whenClicked={this.props.getNewOperator} id="divide" cn="col"/>

        </div>
        <div className="row">
          <OperatorButton value="*" whenClicked={this.props.getNewOperator} id="multiply" cn="col"/>
          <OperatorButton value="C" whenClicked={this.props.clearScreenNow} id="clear" cn="col"/>
        </div>


        <div className="row">
          <NumberButton whenClicked={this.props.getNewNumber} value="1" id="one" />
          <NumberButton whenClicked={this.props.getNewNumber} value="2" id="two" />
          <NumberButton whenClicked={this.props.getNewNumber} value="3" id="three" />
        </div>
        <div className="row">
          <NumberButton whenClicked={this.props.getNewNumber} value="4" id="four"/>
          <NumberButton whenClicked={this.props.getNewNumber} value="5" id="five"/>
          <NumberButton whenClicked={this.props.getNewNumber} value="6" id="six"/>
        </div>
        <div className="row">
          <NumberButton whenClicked={this.props.getNewNumber} value="7" id="seven"/>
          <NumberButton whenClicked={this.props.getNewNumber} value="8" id="eight"/>
          <NumberButton whenClicked={this.props.getNewNumber} value="9" id="nine"/>
        </div>
        <div class="row">

          <NumberButton whenClicked={this.props.getNewNumber} value="0" id="zero"/>
          <OperatorButton value="=" whenClicked={this.props.calculateNow} id="equals" cn="bottom-button col" />
          <OperatorButton value="." whenClicked={this.props.getNewOperator} id="decimal" input={this.props.input} cn="bottom-button col"/>
        </div>
        <small> poorly designed by Fabricio</small>
      </div>

    )
  }
}

const mapStateToProps = (state) =>{
  return {input:state}
};
const mapDispatchToProps = (dispatch)=>{
  return {
    getNewNumber: (numb)=>{
      dispatch(addNumber(numb))
    },
    getNewOperator: (ope)=>{
      dispatch(addOperator(ope))
    },
    clearScreenNow: ()=>{
      dispatch(clearScreen())
    },
    calculateNow:()=>{
      dispatch(calculate())
    }
  }
}

const Container =  connect(mapStateToProps, mapDispatchToProps)(NumberPad);

class AppWrapper extends React.Component {
  render(){
    return(
      <Provider store={store}>
        <Container/>
      </Provider>

    )
  }
}

export default AppWrapper;
