import React, { useEffect } from "react";
import { useState } from "react";
import { VALIDATOR_REQUIRE } from "../../../public/validators";
import useForm from "../../shared/hooks/form-hook";
import Input from "../formElement/input";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { FadeLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";

export default function JobForm() {
  const curD = new Date();
  const [app, setApp] = useState();
  const [defDate, setDefDate] = useState();
  const [defTime, setDefTime] = useState();
  const [appDate, setAppDate] = useState(curD.toLocaleDateString("fr-ca"));
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [jobsTime, setJobsTime] = useState();
  const navigate = useNavigate();
  const jobId = useParams().jid;
  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      job: {
        value: "",
        isValid: false,
      },
      tech: {
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
          `${import.meta.env.VITE_SERVER_NAME}jobs/${jobId}`
        );
        responseData.job && processFormData(responseData.job);
      } catch (err) {
        console.log(err);
      }
    };
    if (jobId) {
      fetchData();
    }
    const processFormData = (job) => {
      let curDate = job.appointmentDate.split("T")[0];
      let curTime = job.appointmentDate.split("T")[1].slice(0, 5);
      setDefDate(curDate);
      setApp(job);
      setDefTime(curTime);
      setAppDate(curDate);
      setJobsTime([curTime]);
      setFormData(
        {
          name: {
            value: job.customerName,
            isValid: true,
          },
          job: {
            value: job.jobType,
            isValid: true,
          },
          tech: {
            value: job.technician,
            isValid: true,
          },
        },
        true
      );
    };
  }, [jobId, sendRequest, setFormData]);

  let curHour = curD.getHours();
  if (curHour >= 17) {
    curD.setDate(curD.getDate() + 1);
  }
  const today = curD.toLocaleDateString("fr-ca");

  const handleTime = async (event) => {
    setDefDate(event.target.value);
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_SERVER_NAME}jobs/date/${event.target.value}`
      );
      responseData.jobs
        ? selectTimes(responseData.jobs, event.target.value)
        : selectTimes([], event.target.value);
    } catch (err) {
      console.log(err);
    }
  };

  const selectTimes = (jobsDate, date) => {
    let avaiTime = [];
    curHour = 9;
    for (let i = curHour; i <= 17; i++) {
      let time = i > 9 ? i.toString() : "0" + i.toString();
      avaiTime.push(time + ":00");
    }
    if (jobsDate.length == 0) {
      setJobsTime(avaiTime);
      setAppDate(date);
      return;
    }

    for (const job of jobsDate) {
      const curTime = job.appointmentDate.split("T");
      let blockedValue = curTime[1].slice(0, 5);
      if (avaiTime.includes(blockedValue)) {
        let newAvaiTime = avaiTime.filter((elem) => elem != blockedValue);
        avaiTime = newAvaiTime;
      }
    }
    defTime && avaiTime.push(defTime);
    setJobsTime(avaiTime);
  };

  const submitHandler = async (event) => {
    const dateTime = appDate + "T" + event.target.time.value + ":00Z";
    event.preventDefault();
    if (jobId) {
      try {
        await sendRequest(
          `${import.meta.env.VITE_SERVER_NAME}jobs/${jobId}`,
          "PUT",
          JSON.stringify({
            customerName: formState.inputs.name.value,
            jobType: formState.inputs.job.value,
            status: event.target.status.value,
            appointmentDate: dateTime,
            technician: formState.inputs.tech.value,
          }),
          { "Content-Type": "application/json" }
        );
        navigate("/");
      } catch (err) {
        console.log(err.message);
      }
    } else {
      try {
        await sendRequest(
          `${import.meta.env.VITE_SERVER_NAME}jobs`,
          "POST",
          JSON.stringify({
            customerName: formState.inputs.name.value,
            jobType: formState.inputs.job.value,
            status: event.target.status.value,
            appointmentDate: dateTime,
            technician: formState.inputs.tech.value,
          }),
          { "Content-Type": "application/json" }
        );
        navigate("/");
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  function errorHandler() {
    clearError();
    window.location.reload();
  }

  console.log(formState.inputs);

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
      {error ? (
        <div className="container">
          <div className="flex flex-col justify-center">
            <p>{error.message}</p>
            <button
              onClick={errorHandler}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reset
            </button>
          </div>
        </div>
      ) : (
        !isLoading && (
          <form className="space-y-4" onSubmit={submitHandler}>
            <div className="w-full">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Customer Name:
              </label>
              <Input
                elem="input"
                type="text"
                placeholder="Please Enter Customer Name"
                validator={[VALIDATOR_REQUIRE()]}
                errorText="Please Enter a Valid Customer Name"
                id="name"
                val={formState.inputs.name.value}
                valid={formState.inputs.name.isValid}
                onInput={inputHandler}
                className="w-4/5 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700 mb-2" htmlFor="job">
                Job Type:
              </label>
              <Input
                elem="input"
                type="text"
                placeholder="Please Enter Job Type"
                validator={[VALIDATOR_REQUIRE()]}
                errorText="Please Enter a Valid Job Type"
                val={formState.inputs.job.value}
                valid={formState.inputs.job.isValid}
                id="job"
                onInput={inputHandler}
                className="w-4/5 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700 mb-2" htmlFor="tech">
                Technician Name
              </label>

              <Input
                elem="input"
                type="text"
                placeholder="Please Enter Technician Name"
                validator={[VALIDATOR_REQUIRE()]}
                val={formState.inputs.tech.value}
                valid={formState.inputs.tech.isValid}
                errorText="Please Enter a Valid Technician Name"
                id="tech"
                onInput={inputHandler}
                className="w-4/5 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700 mb-2" htmlFor="status">
                Job Status
              </label>

              <select name="status" required defaultValue={app?.status}>
                <option value="N/A">N/A</option>
                <option value="Completed">Completed</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block text-gray-700 mb-2" htmlFor="dob">
                Appointment Date
              </label>

              <input
                type="date"
                id="app"
                defaultValue={defDate ? defDate : today}
                onChange={(e) => {
                  handleTime(e);
                }}
                min={today}
                required
                className="w-4/5 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {jobsTime && (
              <>
                <p className="mb-2">Appointment Time</p>
                <div className="hstack gap-2 flex-wrap">
                  {jobsTime?.map((val, index) => {
                    return (
                      <React.Fragment key={index + 120}>
                        <input
                          type="radio"
                          className="btn-check"
                          value={val}
                          name="time"
                          id={val + "time"}
                          key={index}
                          required
                          defaultChecked={
                            defTime ? defTime === val && true : false
                          }
                        />
                        <label
                          className="btn btn-outline-danger material-shadow"
                          htmlFor={val + "time"}
                          key={index + 40}
                        >
                          {val}
                        </label>
                      </React.Fragment>
                    );
                  })}
                </div>
              </>
            )}
            <button
              type="submit"
              disabled={!formState.isValid}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        )
      )}
    </>
  );
}
