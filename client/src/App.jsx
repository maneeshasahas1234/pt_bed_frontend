
import Dashboard from "../pages/Dashboard.jsx";
import axios from "axios";

axios.defaults.baseURL = "https://167.99.8.130:8888/";

function App() {


  return (
    <div>
        <Dashboard></Dashboard>
    </div>

  )
}

export default App
