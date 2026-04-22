import { useNavigate, useLocation, Outlet } from "react-router";
import { ArrowLeft, History, ShoppingCart } from "lucide-react";
import { useCartStore } from "../store/cartStore";

const rootRoutes = ["/", "/auth"];

export function Shell() {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const isRoot = rootRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col flex-1 min-h-[100dvh] w-full"
      style={{ background: "#1847e8", fontFamily: "'Nunito', 'Inter', sans-serif", color: "#ffffff" }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4"
        style={{ height: 56, background: "#1847e8", flexShrink: 0 }}
      >
        {/* Left */}
        <div style={{ width: 40 }}>
          {!isRoot && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center rounded-full transition-all active:scale-95"
              style={{ width: 36, height: 36, background: "rgba(255,255,255,0.18)" }}
            >
              <ArrowLeft size={18} color="#fff" strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Center */}
        <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.01em", color: "#fff" }}>
          Ex-pressa ☕
        </span>

        {/* Right */}
        <div className="flex items-center gap-1" style={{ width: 80, justifyContent: "flex-end" }}>
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center justify-center rounded-full transition-all active:scale-95"
            style={{ width: 36, height: 36, background: "rgba(255,255,255,0.18)" }}
          >
            <History size={17} color="#fff" strokeWidth={2.5} />
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="relative flex items-center justify-center rounded-full transition-all active:scale-95"
            style={{ width: 36, height: 36, background: "rgba(255,255,255,0.18)" }}
          >
            <ShoppingCart size={17} color="#fff" strokeWidth={2.5} />
            {cartCount > 0 && (
              <span
                className="absolute flex items-center justify-center rounded-full"
                style={{
                  top: -2, right: -2, minWidth: 17, height: 17,
                  background: "#ff5500", color: "#fff", fontSize: 10, fontWeight: 900, padding: "0 4px",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Content container ── */}
      <div className="flex-1 flex flex-col w-full px-4 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
