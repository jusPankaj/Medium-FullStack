import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Signin from "../pages/Signin";
import { SignupInput } from "@juscode/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  });

  async function sendRequest() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      );
      const jwt = response.data;
      console.log(jwt);

      localStorage.setItem("token", jwt);
      navigate("/blogs");
    } catch (e) {
      //alert the user that the request failed
      alert("Error while signing Up");
    }
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-10">
            <div className="text-2xl font-extrabold ">Create an account</div>
            <div className="text-slate-400">
              {type == "signup"
                ? "Already have an account?"
                : "Don't have an account? "}
              <Link
                className="pl-2 underline"
                to={type == "signup" ? "/signin" : "/signup"}
              >
                {type == "signup" ? "Login" : "Sign up"}
              </Link>
            </div>
          </div>
          <div className="">
            {type == "signup" ? (
              <LabelledInput
                label="Name"
                type="text"
                placeholder="Enter Name"
                onChange={(e) => {
                  setPostInputs((c) => ({
                    ...c,
                    name: e.target.value,
                  }));
                }}
              />
            ) : null}
            <LabelledInput
              label="Email"
              type="text"
              placeholder="Enter Email "
              onChange={(e) => {
                setPostInputs((c) => ({
                  ...c,
                  email: e.target.value,
                }));
              }}
            />
            <LabelledInput
              label="Password"
              type="password"
              placeholder="Enter Password"
              onChange={(e) => {
                setPostInputs((c) => ({
                  ...c,
                  password: e.target.value,
                }));
              }}
            />

            <button
              onClick={sendRequest}
              type="button"
              className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              {type == "signup" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type: string;
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
}: LabelledInputType) {
  return (
    <>
      <label className="block mb-2 text-sm font-medium text-black font-semibold pt-4 ">
        {label}
      </label>
      <input
        type={type || "text"}
        className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        onChange={onChange}
        required
      />
    </>
  );
}

export default Auth;
