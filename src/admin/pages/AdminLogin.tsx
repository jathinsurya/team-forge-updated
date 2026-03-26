import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ADMIN_CREDENTIALS = { username: "admin", password: "admin123" };

const AdminLogin = () => {
  const { setAdminLoggedIn } = useAdmin();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!username || !password) { setError("All fields are required."); return; }
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        setAdminLoggedIn(true);
        toast.success("Welcome back, Administrator");
        navigate("/admin/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-border mb-5">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Admin Portal</h1>
          <p className="text-sm text-muted-foreground mt-1.5">TeamForge Platform Administration</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-7 shadow-card space-y-5">
          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              value={username}
              onChange={e => { setUsername(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="admin"
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {error}
            </div>
          )}

          <Button className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Authenticating…
              </span>
            ) : "Sign In"}
          </Button>

          <div className="pt-2 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Demo: <span className="font-mono text-foreground">admin / admin123</span>
            </p>
          </div>
        </div>

        <p className="text-center mt-5 text-xs text-muted-foreground">
          Not an admin?{" "}
          <button onClick={() => navigate("/")} className="text-foreground hover:underline underline-offset-2">
            Return to main app
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
