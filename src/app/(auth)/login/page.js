"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const togglePassword = () => setShowPassword((prev) => !prev);

    // Redirect لو already logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) window.location.href = "/dashboard";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token); // حفظ التوكن
                window.location.href = "/dashboard"; // redirect
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="login-pg">
            <div className="content">
                <div className="row gx-0">
                    {/* Left Side */}
                    <div className="col-lg-6">
                        <div className="logo-side">
                            <Link href="/" className="logo">
                                <Image src="/crm-skybridge/images/sky-logo.png" className="img-contain" alt="Skybridge Logo" width={180} height={60} priority/>
                            </Link>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="col-lg-6">
                        <div className="form-side">
                            <form className="form col-lg-8" onSubmit={handleSubmit}>
                                <div className="title-wrapper">
                                    <h3>Welcome back!</h3>
                                    <div className="text">Please Login to Continue</div>
                                </div>

                                {error && <div className="text-danger mb-2">{error}</div>}

                                <div className="form-group">
                                    <div className="txt mb-2">Email Address</div>
                                    <input type="email" className="form-control" placeholder="Enter your email here" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>

                                <div className="form-group show_hide_password">
                                    <div className="txt mb-2">Password</div>
                                    <div className="position-relative">
                                        <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Enter your password here" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                        <i className={`show_pass far ${showPassword ? "fa-eye" : "fa-eye-slash" }`} onClick={togglePassword}></i>
                                    </div>
                                </div>

                                <div className="form-group mb-3">
                                    <button
                                        type="submit"
                                        className="butn-st2 w-100"
                                        disabled={loading}
                                    >
                                        <span>{loading ? "Signing In..." : "Sign In"}</span>
                                    </button>
                                </div>

                                <div className="text-center">
                                    <span className="text">Don’t you have an account?</span>{" "}
                                    <Link href="/register" className="fw-600">
                                        Sign Up
                                    </Link>
                                </div>

                                <div className="text mt-5">
                                    ©2024 SKYBRIDGE. All rights reserved
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
