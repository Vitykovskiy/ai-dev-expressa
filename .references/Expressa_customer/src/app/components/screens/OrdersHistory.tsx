import { useState } from "react";
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { mockOrders, statusLabels } from "../../data/mockData";

const statusColors: Record<string, { bg: string; text: string }> = {
  pending:   { bg: "#fff7e0", text: "#cc8800" },
  preparing: { bg: "#e0eaff", text: "#1847e8" },
  ready:     { bg: "#e0fff0", text: "#00a854" },
  completed: { bg: "rgba(255,255,255,0.12)", text: "rgba(255,255,255,0.6)" },
  cancelled: { bg: "rgba(212,24,61,0.15)", text: "#ff4466" },
};

export function OrdersHistory() {
  const [orders] = useState(mockOrders);
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const toggleOrder = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <div className="pt-6 pb-7">
        <div className="flex items-start justify-between">
          <div>
            <p
              style={{
                fontSize: 12, letterSpacing: "0.12em", color: "rgba(255,255,255,0.65)",
                textTransform: "uppercase", marginBottom: 6, fontWeight: 700,
              }}
            >
              {orders.length} заказов
            </p>
            <h1
              style={{
                fontSize: 36, fontWeight: 900, color: "#ffffff",
                lineHeight: 1.1, letterSpacing: "-0.02em",
              }}
            >
              История
            </h1>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center rounded-full transition-all active:scale-90 mt-1"
            style={{ width: 40, height: 40, background: "rgba(255,255,255,0.15)" }}
          >
            <RefreshCw
              size={16} color="rgba(255,255,255,0.9)" strokeWidth={2.5}
              className={refreshing ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>

      {/* Orders */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-16">
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", textAlign: "center", fontWeight: 700 }}>
            История заказов пуста
          </p>
        </div>
      ) : (
        <div className="flex flex-col flex-1 pb-6" style={{ gap: 10 }}>
          {orders.map((order) => {
            const isOpen = openIds.includes(order.id);
            const statusStyle = statusColors[order.status] ?? statusColors.completed;
            const isOnBlue = order.status === "completed" || order.status === "cancelled";

            return (
              <div
                key={order.id}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: isOnBlue ? "rgba(255,255,255,0.12)" : "#ffffff",
                  boxShadow: isOnBlue ? "none" : "0 4px 16px rgba(0,0,0,0.12)",
                }}
              >
                {/* Accordion header */}
                <button
                  onClick={() => toggleOrder(order.id)}
                  className="w-full text-left transition-all"
                  style={{ padding: "16px 18px" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p style={{ fontSize: 15, fontWeight: 800, color: isOnBlue ? "#fff" : "#0f2880" }}>
                        Заказ #{order.id}
                      </p>
                      <span
                        style={{
                          fontSize: 11, background: statusStyle.bg, color: statusStyle.text,
                          borderRadius: 20, padding: "3px 10px", fontWeight: 800,
                        }}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 16, fontWeight: 900, color: isOnBlue ? "#fff" : "#1847e8" }}>
                        {order.totalRub} ₽
                      </span>
                      {isOpen ? (
                        <ChevronUp size={16} color={isOnBlue ? "rgba(255,255,255,0.6)" : "rgba(15,40,128,0.4)"} />
                      ) : (
                        <ChevronDown size={16} color={isOnBlue ? "rgba(255,255,255,0.6)" : "rgba(15,40,128,0.4)"} />
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: isOnBlue ? "rgba(255,255,255,0.5)" : "rgba(15,40,128,0.45)", fontWeight: 600 }}>
                    {order.createdAt} · {order.items.length} поз.
                  </p>
                </button>

                {/* Accordion body */}
                {isOpen && (
                  <div
                    style={{
                      borderTop: isOnBlue ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(15,40,128,0.08)",
                      padding: "14px 18px",
                      background: isOnBlue ? "rgba(0,0,0,0.1)" : "rgba(24,71,232,0.04)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11, color: isOnBlue ? "rgba(255,255,255,0.45)" : "rgba(15,40,128,0.45)",
                        marginBottom: 10, fontWeight: 700, letterSpacing: "0.04em",
                      }}
                    >
                      Слот: {order.slotDate} {order.slotTimeFrom}–{order.slotTimeTo}
                    </p>
                    <div className="flex flex-col gap-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            borderBottom:
                              idx < order.items.length - 1
                                ? `1px solid ${isOnBlue ? "rgba(255,255,255,0.08)" : "rgba(15,40,128,0.07)"}`
                                : "none",
                            paddingBottom: idx < order.items.length - 1 ? 8 : 0,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p style={{ fontSize: 13, color: isOnBlue ? "rgba(255,255,255,0.85)" : "#0f2880", fontWeight: 700 }}>
                                {item.productName}
                                {item.size ? ` (${item.size})` : ""}
                              </p>
                              <p style={{ fontSize: 12, color: isOnBlue ? "rgba(255,255,255,0.4)" : "rgba(15,40,128,0.4)", fontWeight: 600 }}>
                                ×{item.quantity}
                              </p>
                            </div>
                            <p style={{ fontSize: 13, color: isOnBlue ? "#fff" : "#1847e8", fontWeight: 800 }}>
                              {item.lineTotalRub} ₽
                            </p>
                          </div>
                          {item.addons.map((addon, ai) => (
                            <p
                              key={ai}
                              style={{
                                fontSize: 11,
                                color: isOnBlue ? "rgba(255,255,255,0.35)" : "rgba(15,40,128,0.4)",
                                marginTop: 2, fontWeight: 600,
                              }}
                            >
                              + {addon.name} ×{addon.quantity}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
