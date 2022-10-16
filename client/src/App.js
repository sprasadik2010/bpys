// import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
var parse = require('html-react-parser');
function App() {
  //const HomeComponent = () => {
    const [data, setData] = React.useState([]);
        const [inputValue, setInputValue] = useState("");
    const txtKey  = React.useRef(); 
    useEffect(() => {
       axios
        .get("/getfiles?filter=" + inputValue)
        .then((res) => {
          setData(res.data)
        })
    },[inputValue])
  const getfile = async(filename) => {
    
    await axios
    .get("/downloadfile?filename=" + filename)
    .then((res) => {
      //window.open(res,'_blank')
    })

  }
    function shoot(val) {alert(val);}  
    function reSearch(val) {alert(val.value);}
    const ipfocus = ()=> {document.getElementById('txtKey').focus()}
    return (<>
    <div className='titlecss'>BPYS DOCFetcher APP</div>
      <input 
          placeholder='Type here to search' 
          className='searchbox' 
          id='txtKey'  
          //onBlur={()=>ipfocus()} 
          autoFocus 
          autoComplete="off" 
          ref={txtKey} 
          onChange={(e)=>setInputValue(e.target.value)}
      ></input>
      <table className='resulttable'>
      <thead>
        <tr>
          <th>#</th>
          <th>File Name</th>
          {/* <th>Action</th> */}
        </tr>
      </thead>
      <tbody>
        {data.map(( filename, index ) => {
          const fnHighlighed = filename.replace(/^.*[\\\/]/, '').replace(inputValue,'<mark>' + inputValue +  "</mark>")
        return (
          <tr  onClick={async ()=> await getfile(filename)}>
            <td>{index + 1}</td>
            <td>{parse(fnHighlighed)}</td>
            {/* <td><button onClick={async ()=> await getfile(filename)}>Get File Now!</button></td> */}
          </tr>
        )
      })}
      </tbody>
    </table></>
    )
}

export default App;
