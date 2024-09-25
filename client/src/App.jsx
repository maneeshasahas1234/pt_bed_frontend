
import Dashboard from "../pages/Dashboard.jsx";
import axios from "axios";

axios.defaults.baseURL = "https://backend-dr-bed-allocation-d7b0a9a80dd7.herokuapp.com/";

function App() {


  return (
    <div>
        <Dashboard></Dashboard>
    </div>

  )
}

export default App
