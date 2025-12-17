import {BrowserRouter as Router, Routes, Route} from "react-router"
import Messagerie from "./Messagerie"
import Accueil from "./Accueil"

function App() {


  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/messagerie" element={<Messagerie />} />
      </Routes>
     </Router>
    </>
  )
}

export default App
