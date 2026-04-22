import { useNavigate } from "react-router";
import { Trash2, Pencil } from "lucide-react";
import { useCartStore } from "../../store/cartStore";

export function Cart() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice)();

  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <div className="pt-6 pb-7">
        <p
          style={{
            fontSize: 12, letterSpacing: "0.12em", color: "rgba(255,255,255,0.65)",
            textTransform: "uppercase", marginBottom: 6, fontWeight: 700,
          }}
        >
          {items.length} позиций
        </p>
        <h1
          style={{
            fontSize: 36, fontWeight: 900, color: "#ffffff",
            lineHeight: 1.1, letterSpacing: "-0.02em",
          }}
        >
          Корзина
        </h1>
      </div>

      {/* Cart content */}
      <div className="flex-1 flex flex-col">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-16">
            <div
              className="flex items-center justify-center rounded-full mb-5"
              style={{ width: 72, height: 72, background: "rgba(255,255,255,0.15)" }}
            >
              <span style={{ fontSize: 32 }}>🛒</span>
            </div>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", textAlign: "center", fontWeight: 700 }}>
              Пока ничего не добавлено
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-5 transition-all active:scale-95"
              style={{
                padding: "12px 28px", borderRadius: 14,
                background: "#ffffff", color: "#1847e8", fontSize: 15, fontWeight: 800,
              }}
            >
              Перейти в меню
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex flex-col" style={{ gap: 8 }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#ffffff", borderRadius: 20,
                    padding: "16px 18px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 style={{ fontSize: 16, color: "#0f2880", fontWeight: 800 }}>
                          {item.productName}
                        </h4>
                        {item.size && (
                          <span
                            style={{
                              fontSize: 11, color: "#1847e8", background: "rgba(24,71,232,0.1)",
                              borderRadius: 20, padding: "2px 8px", fontWeight: 700,
                            }}
                          >
                            {item.size}
                          </span>
                        )}
                      </div>
                      {item.addons.length > 0 && (
                        <p style={{ fontSize: 12, color: "rgba(15,40,128,0.5)", marginBottom: 6, fontWeight: 600 }}>
                          + {item.addons.map((a) => a.name).join(", ")}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1">
                        <span style={{ fontSize: 13, color: "rgba(15,40,128,0.5)", fontWeight: 700 }}>
                          ×{item.quantity}
                        </span>
                        <span style={{ fontSize: 16, fontWeight: 900, color: "#1847e8" }}>
                          {item.lineTotalRub} ₽
                        </span>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => navigate(`/${item.productId.split("-")[0]}`)}
                        className="flex items-center justify-center rounded-full transition-all active:scale-90"
                        style={{ width: 34, height: 34, background: "rgba(24,71,232,0.08)" }}
                      >
                        <Pencil size={13} color="#1847e8" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center justify-center rounded-full transition-all active:scale-90"
                        style={{ width: 34, height: 34, background: "rgba(212,24,61,0.1)" }}
                      >
                        <Trash2 size={13} color="#d4183d" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div
              className="mt-3 flex items-center justify-between px-5 py-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>
                Итого
              </p>
              <p style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>
                {totalPrice} ₽
              </p>
            </div>

            <div style={{ height: 100 }} />
          </>
        )}
      </div>

      {/* Sticky CTA */}
      {items.length > 0 && (
        <div
          className="sticky bottom-0 -mx-4 px-4 py-4"
          style={{ background: "#1847e8", borderTop: "1px solid rgba(255,255,255,0.12)" }}
        >
          <button
            onClick={() => navigate("/order/slot")}
            className="w-full flex items-center justify-center rounded-xl transition-all active:scale-[0.98]"
            style={{ height: 52, background: "#ff5500", color: "#fff", fontWeight: 900, fontSize: 16 }}
          >
            Оформить заказ · {totalPrice} ₽
          </button>
        </div>
      )}
    </div>
  );
}
