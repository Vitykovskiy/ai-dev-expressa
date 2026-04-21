import { useParams, useNavigate } from "react-router";
import { categories } from "../../data/mockData";

const typeLabels: Record<string, string> = {
  drink: "Напиток",
  food: "Еда",
  extra: "Доп. позиция",
};

export function MenuGroup() {
  const { group } = useParams<{ group: string }>();
  const navigate = useNavigate();
  const category = categories.find((c) => c.id === group);

  if (!category) {
    return (
      <div className="flex items-center justify-center flex-1 py-8">
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Категория не найдена</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 w-full">
      {/* Header */}
      <div className="pt-5 pb-7">
        <p
          style={{
            fontSize: 12, letterSpacing: "0.12em", color: "rgba(255,255,255,0.65)",
            textTransform: "uppercase", marginBottom: 6, fontWeight: 700,
          }}
        >
          {category.products.length} позиций
        </p>
        <h1
          style={{
            fontSize: 36, fontWeight: 900, color: "#ffffff",
            lineHeight: 1.1, letterSpacing: "-0.02em",
          }}
        >
          {category.name}
        </h1>
      </div>

      {/* Product cards */}
      <div className="flex flex-col" style={{ gap: 10, paddingBottom: 40 }}>
        {category.products.map((product) => (
          <button
            key={product.id}
            onClick={() => navigate(`/${group}/item/${product.id}`)}
            className="w-full text-left transition-all active:scale-[0.97]"
            style={{
              background: "#ffffff", borderRadius: 20,
              padding: "18px 20px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3
                  style={{
                    fontSize: 17, fontWeight: 800, color: "#0f2880",
                    lineHeight: 1.2, marginBottom: 3,
                  }}
                >
                  {product.name}
                </h3>
                <p
                  style={{
                    fontSize: 13, color: "rgba(15,40,128,0.5)",
                    fontWeight: 600, marginBottom: 12,
                  }}
                >
                  {typeLabels[product.type]}
                </p>
                <div className="flex items-center flex-wrap" style={{ gap: 6 }}>
                  {product.sizes?.map((s) => (
                    <span
                      key={s.sizeCode}
                      style={{
                        fontSize: 12, fontWeight: 700, color: "#1847e8",
                        background: "rgba(24,71,232,0.1)", borderRadius: 999, padding: "4px 12px",
                      }}
                    >
                      {s.sizeCode} · {s.price} ₽
                    </span>
                  ))}
                  {!product.sizes && product.basePrice && (
                    <span
                      style={{
                        fontSize: 12, fontWeight: 700, color: "#1847e8",
                        background: "rgba(24,71,232,0.1)", borderRadius: 999, padding: "4px 12px",
                      }}
                    >
                      {product.basePrice} ₽
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
