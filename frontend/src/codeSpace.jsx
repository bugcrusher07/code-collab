import {basicSetup} from "codemirror"
import {EditorView} from "@codemirror/view"
import {useRef, useState, useEffect} from 'react'
import './codeSpace.css'
export default function CodeSpace(){

const codeSpaceRef = useRef(null);

useEffect(()=>{
const view = new EditorView({
  doc: "",
  parent: codeSpaceRef.current,
  extensions: [basicSetup]
})
	return ()=>{ view.destroy(); }

},[codeSpaceRef])

	return(
		<div ref={codeSpaceRef} id='codespace'></div>
	)

}
