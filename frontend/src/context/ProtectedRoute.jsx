export default function ProtectedRoute({ children }) {
  const { user, authReady } = useAuth();

  if (!authReady) return null; // ⛔ wait for Redis

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
