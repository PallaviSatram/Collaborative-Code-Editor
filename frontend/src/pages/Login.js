import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import AuthCard from "../components/auth/AuthCard";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";

import { useAuth } from "../context/AuthContext";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {

        event.preventDefault();

        try {

            setLoading(true);

            await login({
                email,
                password,
            });

            toast.success("Login Successful!");

            navigate("/");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Login failed."
            );

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="auth-page">

            <AuthCard title="Login">

                <form onSubmit={handleSubmit}>

                    <AuthInput
                        label="Email"
                        type="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <AuthInput
                        label="Password"
                        type="password"
                        value={password}
                        placeholder="Enter your password"
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <AuthButton
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"}

                    </AuthButton>

                </form>

                <p
                    style={{
                        marginTop: 20,
                        color: "white",
                        textAlign: "center",
                    }}
                >

                    Don't have an account?

                    {" "}

                    <Link to="/register">

                        Register

                    </Link>

                </p>

            </AuthCard>

        </div>

    );

}

export default Login;