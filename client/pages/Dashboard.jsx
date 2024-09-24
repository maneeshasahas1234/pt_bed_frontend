import BedList from "../components/BedList.jsx";
import LatestPatientData from "../components/LatestPatientData.jsx";
import NewPatients from "../components/NewPatients.jsx";


function dashboard() {
  return (
    <div>
        <BedList></BedList>
        <LatestPatientData></LatestPatientData>
        {/*<NewPatients></NewPatients>*/}
    </div>
  );
}

export default dashboard;



