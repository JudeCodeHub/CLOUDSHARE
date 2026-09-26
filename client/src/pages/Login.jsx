import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { UserIcon, MailIcon, LockIcon } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useApp } from "../context/AppContext";

const Login = ({ mode = "login" }) => {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const { login, register } = useApp();

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const ok = isRegister
      ? await register(form.name, form.email, form.password)
      : await login(form.email, form.password);
    setIsLoading(false);
    if (ok) navigate("/");
  };

  return (
    <div className="min-h-screen text-zinc-900 flex flex-col md:flex-row">
      {/* left Hero Brand */}
      <div className="md:w-1/2 p-8 md:p-12 lg:p-16 bg-linear-to-br from-orange-50 via-zinc-100 to-red-50 border-b md:border-b-0 md-border-r border-zinc-200 flex flex-col justify-between relative overflow-hidden">
        <div className='absolute inset-0 bg-[url("/pattern.png")]'></div>
        <div className="relative z-10 flex items-center gap-3">
          <img src="/logo.svg" alt="CloudShare Logo" className="max-h-10 " />
          <span className="text-4xl font-medium uppercase text-zinc-900 translate-y-0.75">
            CloudShare
          </span>
        </div>

        <div className="relative z-10 my-12 space-y-6">
          <h1 className="text-5xl font-bold text-zinc-900">
            Secure, Simple & Fast <br />
            <span className="text-green-600"> Cloud Storage</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-600 max-w-wd leading-relaxed -mt-1">
            The easiest way to share and collaborate on your files with secure
            cloud storage.
          </p>
        </div>

        <div className="relative z-10 text-sm text-zinc-500">
          @ 2026 CloudShare. All rights reserved.
        </div>
      </div>

      {/*Right Auth Form */}

      <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          ,
          <div>
            <h3 className="text-2xl font-medium text-zinc-900 ">
              {isRegister ? "Create an account" : "Welcome back"}
            </h3>
            <p className="text-sm text-zinc-500 mt-1">
              {isRegister ? "Sign up to get started" : "Sign in to continue"}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <Input
                label="Name"
                icon={UserIcon}
                placeholder="Erling Haaland"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            )}

            <Input
              label="Email Address"
              type="email"
              icon={MailIcon}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              icon={LockIcon}
              placeholder="•••••••••"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              isLoading={isLoading}
            >
              <span className="font-medium text-base">
                {isRegister ? "Create Account" : "Sign In"}
              </span>
            </Button>
          </form>
          <div className="text-md text-zinc-500 text-center pt-1">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <span
                  className="text-green-600 font-medium cursor-pointer hover:underline"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span
                  className="text-green-600 font-medium cursor-pointer hover:underline"
                  onClick={() => navigate("/register")}
                >
                  Create Account
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
