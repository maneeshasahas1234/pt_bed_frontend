
import Dashboard from "../pages/Dashboard.jsx";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8888";

function App() {


  return (
    <div>
        <Dashboard></Dashboard>
    </div>

  )
}

export default App
