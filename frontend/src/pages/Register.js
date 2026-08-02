import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import AuthCard from "../components/auth/AuthCard";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";

import { useAuth } from "../context/AuthContext";

function Register() {

    const navigate = useNavigate();

    const { register } = useAuth();

    const [username, setUsername] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {

        event.preventDefault();

        if (password !== confirmPassword) {

            toast.error("Passwords do not match.");

            return;

        }

        try {

            setLoading(true);

            await register({
                username,
                email,
                password,
            });

            toast.success("Registration Successful!");

            navigate("/login");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Registration failed."
            );

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="auth-page">

            <AuthCard title="Create Account">

                <form onSubmit={handleSubmit}>

                    <AuthInput
                        label="Username"
                        value={username}
                        placeholder="Choose a username"
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                    />

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
                        placeholder="Create a password"
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <AuthInput
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        placeholder="Confirm password"
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                    />

                    <AuthButton
                        type="submit"
                        disabled={loading}
                    >

                        {
                            loading
                                ? "Creating Account..."
                                : "Register"
                        }

                    </AuthButton>

                </form>

                <p
                    style={{
                        marginTop: 20,
                        color: "white",
                        textAlign: "center",
                    }}
                >

                    Already have an account?

                    {" "}

                    <Link to="/login">

                        Login

                    </Link>

                </p>

            </AuthCard>

        </div>

    );

}

export default Register;