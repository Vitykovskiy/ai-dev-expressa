import { useState } from "react";
import { useNavigate } from "react-router";
import { Send, CheckCircle, XCircle, Loader } from "lucide-react";

type AuthStatus = "unauthorized" | "loading" | "error" | "authorized";

export function Auth() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<AuthStatus>("unauthorized");

  const titleMap: Record<AuthStatus, string> = {
    unauthorized: "Нужен вход",
    loading: "Авторизация...",
    error: "Ошибка входа",
    authorized: "Добро пожаловать!",
  };

  const detailMap: Record<AuthStatus, string> = {
    unauthorized: "Войдите через Telegram для доступа к заказам и истории.",
    loading: "Проверяем аккаунт Telegram — секунду!",
    error: "Не удалось подтвердить Telegram аккаунт. Попробуйте ещё раз.",
    authorized: "Авторизация прошла успешно. Можете приступить к заказу.",
  };

  const handleAction = () => {
    if (status === "authorized") {
      navigate("/");
      return;
    }
    setStatus("loading");
    setTimeout(() => {
      setStatus("authorized");
    }, 1500);
  };

  const iconMap: Record<AuthStatus, React.ReactNode> = {
    unauthorized: <Send size={30} color="#1847e8" strokeWidth={2.5} />,
    loading: <Loader size={30} color="#1847e8" strokeWidth={2.5} className="animate-spin" />,
    error: <XCircle size={30} color="#d4183d" strokeWidth={2.5} />,
    authorized: <CheckCircle size={30} color="#00a854" strokeWidth={2.5} />,
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <div className="relative flex flex-col items-center w-full" style={{ gap: 24 }}>
        {/* Icon */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 80, height: 80, background: "#ffffff",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}
        >
          {iconMap[status]}
        </div>

        {/* Text */}
        <div className="text-center flex flex-col" style={{ gap: 8 }}>
          <h1
            style={{
              fontSize: 32, fontWeight: 900, color: "#fff",
              lineHeight: 1.1, letterSpacing: "-0.02em",
            }}
          >
            {titleMap[status]}
          </h1>
          <p
            style={{
              fontSize: 15, color: "rgba(255,255,255,0.7)",
              lineHeight: 1.6, fontWeight: 600,
            }}
          >
            {detailMap[status]}
          </p>
        </div>

        {/* Info card */}
        {status === "unauthorized" && (
          <div
            className="w-full rounded-2xl px-5 py-4"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, fontWeight: 600 }}>
              Функционал заказа доступен только после авторизации через Telegram.
            </p>
          </div>
        )}

        {/* Button */}
        {status !== "loading" && (
          <button
            onClick={handleAction}
            className="w-full flex items-center justify-center rounded-xl transition-all active:scale-[0.98]"
            style={{
              height: 52,
              background: status === "authorized" ? "#ff5500" : "#ffffff",
              color: status === "authorized" ? "#fff" : "#1847e8",
              fontWeight: 900, fontSize: 16, marginTop: 4,
            }}
          >
            {status === "authorized"
              ? "Продолжить"
              : status === "error"
              ? "Попробовать снова"
              : "Войти через Telegram"}
          </button>
        )}
      </div>
    </div>
  );
}
