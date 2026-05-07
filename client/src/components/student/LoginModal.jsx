import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { X } from "lucide-react";

export default function LoginModal() {
  const { login, register, setShowLogin } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = isLogin
      ? await login(form.email, form.password)
      : await register(form.name, form.email, form.password);
    setLoading(false);
    if (result.success) toast.success(isLogin ? "Logged in!" : "Registered!");
    else toast.error(result.message || "Something went wrong");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X size={20} /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p className="text-gray-500 text-sm mb-6">{isLogin ? "Sign in to continue" : "Register to get started"}</p>
        <form onSubmit={handle} className="flex flex-col gap-4">
          {!isLogin && (
            <input required className="border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          )}
          <input required type="email" className="border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input required type="password" className="border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <button type="submit" disabled={loading} className="bg-cyan-600 text-white py-2.5 rounded-lg font-semibold hover:bg-cyan-700 transition-colors disabled:opacity-60">
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Register"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button className="text-cyan-600 font-medium hover:underline" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
