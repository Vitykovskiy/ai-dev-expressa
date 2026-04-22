import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { categories } from "../../data/mockData";
import { useCartStore } from "../../store/cartStore";

export function ProductDetail() {
  const { group, item } = useParams<{ group: string; item: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("editId");

  const addItem = useCartStore((s) => s.addItem);
  const updateItem = useCartStore((s) => s.updateItem);
  const cartItems = useCartStore((s) => s.items);

  const category = categories.find((c) => c.id === group);
  const product = category?.products.find((p) => p.id === item);

  const [selectedSize, setSelectedSize] = useState<string | null>(
    product?.sizes?.[0]?.sizeCode ?? null
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (editId) {
      const existing = cartItems.find((i) => i.id === editId);
      if (existing) {
        setSelectedSize(existing.size ?? null);
        setSelectedAddons(existing.addons.map((a) => a.id));
        setQuantity(existing.quantity);
      }
    }
  }, [editId]);

  if (!product) {
    return (
      <div className="flex items-center justify-center flex-1 py-8">
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Товар не найден</p>
      </div>
    );
  }

  const basePrice = product.sizes
    ? product.sizes.find((s) => s.sizeCode === selectedSize)?.price ?? product.basePrice
    : product.basePrice;

  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const addon = product.addons?.find((a) => a.id === id);
    return sum + (addon?.priceRub ?? 0);
  }, 0);

  const totalPrice = (basePrice + addonsTotal) * quantity;

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleSubmit = () => {
    const addons = selectedAddons.map((id) => {
      const addon = product.addons!.find((a) => a.id === id)!;
      return { id: addon.id, name: addon.name, priceRub: addon.priceRub };
    });

    const cartItem = {
      productId: product.id,
      productName: product.name,
      type: product.type,
      size: selectedSize ?? undefined,
      sizePrice: basePrice,
      addons,
      quantity,
      lineTotalRub: totalPrice,
    };

    if (editId) {
      updateItem(editId, cartItem);
    } else {
      addItem(cartItem);
    }

    navigate("/cart");
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Product hero */}
      <div
        style={{
          background: "rgba(255,255,255,0.12)",
          borderRadius: "0 0 24px 24px",
          padding: "28px 20px 24px",
        }}
      >
        <p
          style={{
            fontSize: 12, letterSpacing: "0.12em", color: "rgba(255,255,255,0.6)",
            textTransform: "uppercase", marginBottom: 8, fontWeight: 700,
          }}
        >
          {category?.name}
        </p>
        <h1
          style={{
            fontSize: 30, fontWeight: 900, color: "#fff",
            lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 12,
          }}
        >
          {product.name}
        </h1>
        <span style={{ fontSize: 26, fontWeight: 900, color: "#ffffff" }}>
          {totalPrice} ₽
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col pt-5 pb-4" style={{ gap: 20 }}>
        {/* Description */}
        {product.description && (
          <p
            style={{
              fontSize: 14, color: "rgba(255,255,255,0.7)",
              lineHeight: 1.6, fontWeight: 600,
            }}
          >
            {product.description}
          </p>
        )}

        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <p
              style={{
                fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)", marginBottom: 10, fontWeight: 800,
              }}
            >
              Размер
            </p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s.sizeCode}
                  onClick={() => setSelectedSize(s.sizeCode)}
                  className="transition-all active:scale-95"
                  style={{
                    padding: "10px 18px", borderRadius: 14,
                    background: selectedSize === s.sizeCode ? "#ffffff" : "rgba(255,255,255,0.12)",
                    color: selectedSize === s.sizeCode ? "#1847e8" : "rgba(255,255,255,0.85)",
                    fontSize: 14, fontWeight: 800, border: "none",
                  }}
                >
                  {s.sizeCode} · {s.price} ₽
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Addons */}
        {product.addons && product.addons.length > 0 && (
          <div>
            <p
              style={{
                fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)", marginBottom: 10, fontWeight: 800,
              }}
            >
              Добавки
            </p>
            <div className="flex flex-wrap gap-2">
              {product.addons.map((addon) => (
                <button
                  key={addon.id}
                  onClick={() => handleToggleAddon(addon.id)}
                  className="transition-all active:scale-95"
                  style={{
                    padding: "10px 16px", borderRadius: 14,
                    background: selectedAddons.includes(addon.id) ? "#ffffff" : "rgba(255,255,255,0.12)",
                    color: selectedAddons.includes(addon.id) ? "#1847e8" : "rgba(255,255,255,0.85)",
                    fontSize: 14, fontWeight: 800, border: "none",
                  }}
                >
                  {addon.name} · {addon.priceRub} ₽
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom action bar — uses negative margin to break out of parent padding */}
      <div
        className="sticky bottom-0 -mx-4 px-4 py-4 flex items-center gap-3"
        style={{
          background: "#1847e8",
          borderTop: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        {/* Quantity */}
        <div
          className="flex items-center rounded-xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex items-center justify-center transition-all active:scale-90"
            style={{ width: 42, height: 48, color: "#fff" }}
          >
            <Minus size={16} strokeWidth={3} />
          </button>
          <span
            className="flex items-center justify-center"
            style={{
              width: 36, height: 48, color: "#fff", fontSize: 17, fontWeight: 900,
              borderLeft: "1px solid rgba(255,255,255,0.15)",
              borderRight: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="flex items-center justify-center transition-all active:scale-90"
            style={{ width: 42, height: 48, color: "#fff" }}
          >
            <Plus size={16} strokeWidth={3} />
          </button>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleSubmit}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl transition-all active:scale-[0.98]"
          style={{ height: 48, background: "#ff5500", color: "#fff", fontWeight: 900, fontSize: 15 }}
        >
          <ShoppingCart size={17} strokeWidth={2.5} />
          {editId ? "Изменить" : "Добавить"} · {totalPrice} ₽
        </button>
      </div>
    </div>
  );
}
