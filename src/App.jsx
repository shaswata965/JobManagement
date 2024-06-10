import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeLayout from "./Home/HomeLayout";
import JobTable from "./Home/jobTable/JobTable";
import JobCard from "./Home/jobForm/JobCard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<JobTable />} />
          <Route path="/create-jobs" element={<JobCard />} />
          <Route path="/create-jobs/:jid" element={<JobCard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
