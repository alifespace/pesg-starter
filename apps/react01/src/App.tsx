import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import type { Session } from "@supabase/supabase-js";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [apiResponse, setApiResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert("Sign up successful! Please check your email to verify.");
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  const callProtectedApi = async () => {
    setApiResponse("Calling API...");
    const currentSession = (await supabase.auth.getSession()).data.session;
    if (!currentSession) {
      setApiResponse("You must be logged in to call the API.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/me`,
        {
          headers: {
            // 关键：将 JWT Token 添加到 Authorization header
            Authorization: `Bearer ${currentSession.access_token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch from API");
      }

      setApiResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      // 让 error 的类型默认为 unknown
      let errorMessage = "An unexpected error occurred.";

      // 类型守卫：检查 error 是否是 Error 的一个实例
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      // 你还可以检查其他可能性
      // else if (typeof error === 'string') {
      //   errorMessage = error;
      // }

      setApiResponse(`Error: ${errorMessage}`);
    }
  };

  return (
    <div style={{ maxWidth: "420px", margin: "96px auto", padding: "16px" }}>
      <h2>Supabase + Hono + React Auth</h2>
      {!session ? (
        <form onSubmit={handleSignIn}>
          <p>Sign in or Sign up</p>
          <div>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", marginBottom: "8px" }}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", marginBottom: "8px" }}
            />
          </div>
          <div>
            <button type="submit" disabled={loading} onClick={handleSignIn}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              style={{ marginLeft: "8px" }}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <p>Welcome, {session.user.email}!</p>
          <button onClick={handleSignOut} disabled={loading}>
            {loading ? "Signing out..." : "Sign Out"}
          </button>
          <hr style={{ margin: "16px 0" }} />
          <h3>Protected API Test</h3>
          <button onClick={callProtectedApi}>Call /api/me</button>
          <pre
            style={{
              background: "#f0f0f0",
              padding: "8px",
              marginTop: "8px",
              wordBreak: "break-all",
              whiteSpace: "pre-wrap",
            }}
          >
            <code>{apiResponse}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
