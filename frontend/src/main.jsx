import { StrictMode , lazy} from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css'
import Home from './homepage.jsx'


const CodeSpace = lazy(()=> import('./codeSpace.jsx')); 

createRoot(document.getElementById('root')).render(
  <StrictMode>
	<BrowserRouter>
		<Routes>
			<Route path='/code' element={<CodeSpace/>} />
			<Route path="/" element={<Home/>} />
		</Routes>
	</BrowserRouter>
  </StrictMode>
)
