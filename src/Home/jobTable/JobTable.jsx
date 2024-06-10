import { FaEdit, FaEye } from "react-icons/fa";
import TableHeader from "./tableHeader";
import { IoTrashBinSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { VALIDATOR_REQUIRE } from "../../../public/validators";
import Input from "../formElement/input";
import { useHttpClient } from "../../shared/hooks/http-hook";
import useForm from "../../shared/hooks/form-hook";
import { FadeLoader } from "react-spinners";

export default function JobTable() {
  const [modal, setModal] = useState(false);
  const [delModal, setDelModal] = useState(false);
  const [jobs, setJobs] = useState();
  const [curJob, setCurJob] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const navigate = useNavigate();

  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_SERVER_NAME}jobs`
        );
        responseData?.jobs && setJobs(responseData.jobs);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [sendRequest]);

  const toggle = () => {
    setModal(!modal);
  };
  const delToggle = () => {
    setDelModal(!delModal);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${import.meta.env.VITE_SERVER_NAME}jobs/${curJob.id}`,
        "DELETE",
        null
      );
      setDelModal(false);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {isLoading && (
        <FadeLoader
          cssOverride={{
            height: "100%",
            position: "absolute",
            top: "40%",
            left: "50%",
            zIndex: "2000",
          }}
          color="#f43e18"
        />
      )}
      {!isLoading &&
        (jobs?.length > 0 ? (
          <>
            <TableHeader />
            <div className="overflow-x-auto mt-5">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-200 border-b text-gray-600 font-bold text-center">
                      Customer Name
                    </th>

                    <th className="py-2 px-4 bg-gray-200 border-b text-gray-600 font-bold text-center">
                      Job Type
                    </th>
                    <th className="py-2 px-4 bg-gray-200 border-b text-gray-600 font-bold text-center">
                      Date
                    </th>
                    <th className="py-2 px-4 bg-gray-200 border-b text-gray-600 font-bold text-center">
                      Status
                    </th>
                    <th className="py-2 px-4 bg-gray-200 border-b text-gray-600 font-bold text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((elem) => {
                    return (
                      <tr className="even:bg-gray-200" key={elem.id}>
                        <td className="py-4 px-4 border-b text-center">
                          {elem.customerName}
                        </td>
                        <td className="py-4 px-4 border-b text-center">
                          {elem.jobType}
                        </td>
                        <td className="py-4 px-4 border-b text-center">
                          {elem.appointmentDate.slice(0, 10)}
                        </td>
                        <td className="py-4 px-4 border-b text-center">
                          <span
                            className={`rounded-full ${
                              elem.status == "Scheduled"
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }  p-2 text-white`}
                          >
                            {elem.status}
                          </span>
                        </td>
                        <td className="border-b h-16 flex justify-around items-center">
                          <Link to={`/create-jobs/${elem.id}`}>
                            <FaEdit
                              className="text-2xl hover:text-green-400"
                              style={{
                                cursor: "pointer",
                              }}
                            />
                          </Link>
                          <FaEye
                            className="text-2xl hover:text-blue-400"
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setCurJob(elem);
                              toggle();
                            }}
                          />
                          <IoTrashBinSharp
                            className="text-2xl hover:text-red-400"
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setCurJob(elem);
                              delToggle();
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {curJob && (
                <Modal isOpen={modal} toggle={toggle} size="lg">
                  <ModalHeader toggle={toggle}>Job Details</ModalHeader>
                  <ModalBody>
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 bg-gray-200 border-b text-gray-600 font-bold text-center">
                            Title
                          </th>
                          <th className="py-2 px-4 bg-gray-200 border-b text-gray-600 font-bold text-center">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="even:bg-gray-200">
                          <td className="py-4 px-4 border-b text-center">
                            Customer Name
                          </td>
                          <td className="py-4 px-4 border-b text-center">
                            {curJob.customerName}
                          </td>
                        </tr>
                        <tr className="even:bg-gray-200">
                          <td className="py-4 px-4 border-b text-center">
                            Job Type
                          </td>
                          <td className="py-4 px-4 border-b text-center">
                            {curJob.jobType}
                          </td>
                        </tr>
                        <tr className="even:bg-gray-200">
                          <td className="py-4 px-4 border-b text-center">
                            Status
                          </td>
                          <td className="py-4 px-4 border-b text-center">
                            {curJob.status}
                          </td>
                        </tr>
                        <tr className="even:bg-gray-200">
                          <td className="py-4 px-4 border-b text-center">
                            Technician Name
                          </td>
                          <td className="py-4 px-4 border-b text-center">
                            {curJob.technician}
                          </td>
                        </tr>
                        <tr className="even:bg-gray-200">
                          <td className="py-4 px-4 border-b text-center">
                            Appointment Date
                          </td>
                          <td className="py-4 px-4 border-b text-center">
                            {curJob.appointmentDate.slice(0, 10)}
                          </td>
                        </tr>
                        <tr className="even:bg-gray-200">
                          <td className="py-4 px-4 border-b text-center">
                            Appointment Time
                          </td>
                          <td className="py-4 px-4 border-b text-center">
                            {curJob.appointmentDate.slice(11, 19)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </ModalBody>
                  <ModalFooter>
                    <button
                      className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200"
                      onClick={toggle}
                    >
                      Cancel
                    </button>
                  </ModalFooter>
                </Modal>
              )}
              {curJob && (
                <Modal isOpen={delModal} toggle={delToggle}>
                  <ModalHeader toggle={delToggle}>Delete Job</ModalHeader>
                  <ModalBody>
                    <form className="space-y-4" onSubmit={submitHandler}>
                      <div className="w-full">
                        <label
                          className="block text-gray-700 mb-2"
                          htmlFor="name"
                        >
                          Confirm your action by typing
                          <span className="font-bold text-xl italic">
                            {" "}
                            {curJob.customerName}
                          </span>
                        </label>
                        <Input
                          elem="input"
                          type="text"
                          placeholder="Please Enter Customer Name"
                          validator={[VALIDATOR_REQUIRE()]}
                          errorText="Please Enter a Valid Customer Name"
                          id="name"
                          onInput={inputHandler}
                          className="w-4/5 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={
                          !(formState.inputs.name.value === curJob.customerName)
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </form>
                  </ModalBody>
                  <ModalFooter>
                    <button
                      className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200"
                      onClick={delToggle}
                    >
                      Cancel
                    </button>
                  </ModalFooter>
                </Modal>
              )}
            </div>
          </>
        ) : (
          <>
            <TableHeader />
            <div className="overflow-x-auto mt-5">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-200 border-b text-gray-600 font-bold text-center">
                      Customer Name
                    </th>

                    <th className="py-2 px-4 bg-gray-200 border-b text-gray-600 font-bold text-center">
                      Job Type
                    </th>
                    <th className="py-2 px-4 bg-gray-200 border-b text-gray-600 font-bold text-center">
                      Date
                    </th>
                    <th className="py-2 px-4 bg-gray-200 border-b text-gray-600 font-bold text-center">
                      Status
                    </th>
                    <th className="py-2 px-4 bg-gray-200 border-b text-gray-600 font-bold text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="even:bg-gray-200">
                    <td>No Jobs Found</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ))}
    </>
  );
}
