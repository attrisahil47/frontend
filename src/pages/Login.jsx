import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import axiosInstance from "../../axiosInstance";
import baseURL from "../../config";
import { useAuth } from "../AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = "166768133566-04ufqrfh2tre1nt5gppu3b9aahpu98vf.apps.googleusercontent.com";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = (values) => {
    toast.dismiss();
    axiosInstance
      .post(`${baseURL}/auth/login`, values)
      .then((response) => {
        toast.success("✅ Login successful!", {
          position: "top-right",
          autoClose: 2000,
          pauseOnHover: false,
        });

        login(response.data.jwtToken, response.data.role);

        setTimeout(() => {
          navigate("/home");
        }, 2000);
      })
      .catch((error) => {
        toast.error(
          `❌ ${error.response?.data?.message || "Login failed!"}`,
          {
            position: "top-right",
            autoClose: 3000,
            pauseOnHover: false,
          }
        );
      });
  };

  const onFinishFailed = (errorInfo) => {
    toast.dismiss();
    toast.error("❌ Please fill in all required fields!", {
      position: "top-right",
      autoClose: 3000,
      pauseOnHover: false,
    });
    console.log("Failed:", errorInfo);
  };

  // GOOGLE LOGIN
  const handleGoogleSuccess = async (authResult) => {
    if (!authResult.code) {
      toast.error("❌ Google Sign-In failed: No code received", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
      return;
    }

    try {
      const res = await axiosInstance.post(
        `${baseURL}/auth/google?code=${authResult.code}`
      );

      if (res.status === 200) {
        const { jwtToken, role } = res.data;
        login(jwtToken, role);

        toast.success("✅ Google Login Successful", {
          position: "top-right",
          autoClose: 2000,
          pauseOnHover: false,
        });

        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (error) {
      toast.error(
        `❌ Google login failed: ${
          error.response?.data?.message || error.message
        }`,
        {
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: false,
        }
      );
    }
  };

  const handleGoogleError = () => {
    toast.error("❌ Google Sign-In failed to start", {
      position: "top-right",
      autoClose: 3000,
      pauseOnHover: false,
    });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    flow: "auth-code",
  });

  return (
    <>
      <Navbar />
      <ToastContainer />

      <section className="auth-hero text-white text-center px-5 py-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-b-2xl shadow-md mt-[var(--navbar-height)]">
        <div className="hero-content">
          <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
          <p className="text-xl">Sign in to continue your journey with us</p>
        </div>
      </section>

      <div className="auth-container max-w-md w-full bg-white shadow-lg p-8 rounded-lg mx-auto mt-10">
        <h1 className="text-4xl text-gray-800 text-center mb-5">Login</h1>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Email"
            name="emailAddress"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-700 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="google-login flex justify-center">
<button
                    onClick={googleLogin}
                    className="flex items-center justify-center gap-2 w-full text-[#000] bg-white border border-gray-300 rounded-md py-2 font-medium hover:bg-gray-100 transition mb-4"
                >
                    <img src="https://developers.google.com/identity/images/g-logo.png" alt="G" className="w-5 h-5" />
                    Continue with Google
                </button>

        </div>

        <div className="toggle-link text-center text-sm mt-4">
          <p>
            Don't have an account?{" "}
            <NavLink to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </NavLink>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

const LoginWithProvider = () => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Login />
    </GoogleOAuthProvider>
  );
};

export default LoginWithProvider;
