
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-sm border border-border/50 max-w-md w-full text-center">
        <h1 className="text-4xl font-medium mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Страница не найдена</p>
        <Link to="/" className="text-primary hover:text-primary/80 underline transition-colors">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
