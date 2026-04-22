import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { categories } from "../../data/mockData";

export function MenuRoot() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col flex-1 w-full">
      {/* Hero */}
      <div className="pt-6 pb-8">
        <p
          style={{
            fontSize: 12, letterSpacing: "0.12em", color: "rgba(255,255,255,0.65)",
            textTransform: "uppercase", marginBottom: 6, fontWeight: 700,
          }}
        >
          Меню кофейни
        </p>
        <h1
          style={{
            fontSize: 36, fontWeight: 900, color: "#ffffff",
            lineHeight: 1.1, letterSpacing: "-0.02em",
          }}
        >
          Что будем<br />заказывать?
        </h1>
      </div>

      {/* Category cards */}
      <div className="flex flex-col" style={{ gap: 10, paddingBottom: 40 }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/${cat.id}`)}
            className="w-full text-left transition-all active:scale-[0.97]"
            style={{
              background: "#ffffff", borderRadius: 20,
              padding: "18px 20px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2
                  style={{
                    fontSize: 20, fontWeight: 800, color: "#0f2880",
                    lineHeight: 1.2, marginBottom: 3, letterSpacing: "-0.01em",
                  }}
                >
                  {cat.name}
                </h2>
                <p style={{ fontSize: 13, color: "rgba(15,40,128,0.5)", fontWeight: 600 }}>
                  {cat.products.length} позиций
                </p>
              </div>
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: 38, height: 38, background: "#1847e8" }}
              >
                <ArrowRight size={16} color="#fff" strokeWidth={2.5} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
