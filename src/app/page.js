"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="login-page position-relative znd-10 d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 overflow-hidden rounded-4">
              <div className="row g-0">
                {/* Left Side - Image/Branding */}
                <div className="col-md-6 d-none d-md-block p-5 d-flex flex-column justify-content-center align-items-center position-relative border-end">
                   <div className="position-absolute w-100 h-100 start-0 top-0 opacity-10"></div> 
                   <div className="z-1 text-center">
                    <div className="logo icon-100 mx-auto mb-4">
                      <Image
                        src="/images/sky-logo.png" 
                        alt="Logo"
                        width={100}
                        height={100}
                        className="img-contain"
                      />
                    </div>
                      <h2 className="fw-bold mb-2">Welcome Back!</h2>
                      <p className="lead opacity-50 mt-20 col-lg-10 mx-auto">Manage your business with ease using Sky CRM.</p>
                   </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="col-md-6 bg-white p-5">
                  <div className="text-center mb-5 d-md-none">
                     <Image
                        src="/images/sky-logo.png" 
                        alt="Logo"
                        width={80}
                        height={80}
                      />
                  </div>
                  <h3 className="fw-bold mb-2 text-dark">Sign In</h3>
                  <p className="text-muted mb-4">Enter your credentials to access your account.</p>

                  <form onSubmit={handleLogin}>
                    <div className="form-floating mb-3">
                      <input
                        type="email"
                        className="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        required
                      />
                      <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating mb-4">
                      <input
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        required
                      />
                      <label htmlFor="floatingPassword">Password</label>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="rememberMe" />
                        <label className="form-check-label text-muted ms-2" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                      <a href="#" className="text-decoration-underline">Forgot Password?</a>
                    </div>

                    <button 
                        type="submit" 
                        className="butn-st2 w-100"
                        disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Signing In...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </form>
                  
                  <div className="text-center mt-4">
                    <small className="text-muted">
                        Don't have an account? <a href="#" className="text-decoration-underline">Contact Admin</a>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
