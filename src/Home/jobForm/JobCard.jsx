import JobForm from "./JobForm";
import JobHeader from "./JobHeader";

export default function JobCard() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-gray-200 p-6 rounded-lg shadow-md w-full w-2/4">
        <JobHeader />
        <JobForm />
      </div>
    </div>
  );
}
