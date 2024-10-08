import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";

import * as apiClient from "./../api-client";
import { useAppContext } from "../contexts/AppContexts";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { showToast } = useAppContext();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Registration Success!", type: "SUCCESS" });
      queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create an Account</h2>

      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            autoComplete="false"
            {...register("firstName", { required: "This field is required." })}
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName?.message}</span>
          )}
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            autoComplete="false"
            {...register("lastName", { required: "This field is required." })}
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            type="email"
            className="border rounded w-full py-1 px-2 font-normal"
            autoComplete="false"
            {...register("email", { required: "This field is required." })}
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </label>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          Password
          <input
            type="password"
            className="border rounded w-full py-1 px-2 font-normal"
            autoComplete="false"
            {...register("password", {
              validate: (val) => {
                if (!val) {
                  return "This field is required.";
                } else if (watch("password") != val) {
                  return "Your password do not match.";
                }
              },
            })}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </label>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          Confirm Password
          <input
            type="password"
            className="border rounded w-full py-1 px-2 font-normal"
            autoComplete="false"
            {...register("confirmPassword", {
              required: "This field is required.",
            })}
          />
          {errors.confirmPassword && (
            <span className="text-red-500">
              {errors.confirmPassword.message}
            </span>
          )}
        </label>
      </div>

      <span className="flex items-center justify-between">
        <span className="text-sm">
          Already have an account?{" "}
          <Link className="underline" to="/sign-in">
            Sign-in here
          </Link>
        </span>

        <button
          type="submit"
          className="bg-blue-600 font-bold text-white p-2 hover:bg-blue-500 text-xl"
        >
          Create Account
        </button>
      </span>
    </form>
  );
};

export default Register;
