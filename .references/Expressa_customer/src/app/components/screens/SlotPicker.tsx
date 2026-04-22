import { useState } from "react";
import { useNavigate } from "react-router";
import { Clock, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import { mockSlots } from "../../data/mockData";
import { useCartStore } from "../../store/cartStore";

export function SlotPicker() {
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clearCart = useCartStore((s) => s.clearCart);

  const handleConfirm = () => {
    if (!selectedSlot) {
      setError("Пожалуйста, выберите временной слот.");
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      clearCart();
      navigate("/orders");
    }, 1400);
  };

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
          Pickup
        </p>
        <h1
          style={{
            fontSize: 36, fontWeight: 900, color: "#ffffff",
            lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 8,
          }}
        >
          Выбор времени
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>
          Выберите удобный слот для выдачи заказа.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col pb-4" style={{ gap: 12 }}>
        {/* Error */}
        {error && (
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{ background: "rgba(212,24,61,0.15)", border: "1px solid rgba(212,24,61,0.3)" }}
          >
            <AlertCircle size={16} color="#ff4466" />
            <p style={{ fontSize: 13, color: "#ff4466", fontWeight: 700 }}>{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <div
              className="rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
              style={{ width: 16, height: 16, borderColor: "#fff", borderTopColor: "transparent" }}
            />
            <p style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>Создаём заказ...</p>
          </div>
        )}

        {/* Slots */}
        <div className="flex flex-col gap-2">
          {mockSlots.map((slot) => {
            const isFull = slot.available === 0;
            const isSelected = selectedSlot === slot.id;

            return (
              <button
                key={slot.id}
                onClick={() => !isFull && setSelectedSlot(slot.id)}
                disabled={isFull}
                className="w-full text-left rounded-2xl transition-all active:scale-[0.98]"
                style={{
                  padding: "16px 18px",
                  background: isSelected ? "#ffffff" : "rgba(255,255,255,0.12)",
                  opacity: isFull ? 0.45 : 1,
                  cursor: isFull ? "not-allowed" : "pointer",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center rounded-full flex-shrink-0"
                      style={{
                        width: 34, height: 34,
                        background: isSelected ? "#1847e8" : "rgba(255,255,255,0.15)",
                      }}
                    >
                      <Clock size={14} color={isSelected ? "#fff" : "rgba(255,255,255,0.8)"} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 15, fontWeight: 800,
                          color: isSelected ? "#0f2880" : isFull ? "rgba(255,255,255,0.4)" : "#fff",
                        }}
                      >
                        {slot.timeFrom}–{slot.timeTo}
                      </p>
                      <p
                        style={{
                          fontSize: 12, fontWeight: 600,
                          color: isSelected ? "rgba(15,40,128,0.5)" : "rgba(255,255,255,0.5)",
                        }}
                      >
                        {slot.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isSelected ? (
                      <CheckCircle2 size={18} color="#1847e8" />
                    ) : (
                      <>
                        <Users size={12} color="rgba(255,255,255,0.4)" />
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>
                          {isFull ? "Занято" : `${slot.available}/${slot.capacity}`}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky confirm */}
      <div
        className="sticky bottom-0 -mx-4 px-4 py-4"
        style={{ background: "#1847e8", borderTop: "1px solid rgba(255,255,255,0.12)" }}
      >
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full flex items-center justify-center rounded-xl transition-all active:scale-[0.98]"
          style={{
            height: 52,
            background: loading ? "rgba(255,85,0,0.5)" : "#ff5500",
            color: "#fff", fontWeight: 900, fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Подтверждаем..." : "Подтвердить заказ"}
        </button>
      </div>
    </div>
  );
}
