import { useNavigate } from "react-router-dom";

export default function TableHeader() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between p-4 item-center">
      <div>
        <h1 className="font-bold text-2xl">Job Management Table</h1>
      </div>
      <div>
        <button
          onClick={() => {
            navigate("/create-jobs");
          }}
          className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition duration-200"
        >
          Add Job
        </button>
      </div>
    </div>
  );
}
