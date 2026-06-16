import { useState, useEffect } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import {
  ShoppingCart,
  Search,
  Home,
  Tag,
  Bell,
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  Zap,
  MapPin,
  ChevronRight,
  Star,
  AlertTriangle,
  Banknote,
  Smartphone,
  CreditCard,
  Wallet,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Package,
  Clock,
  CircleCheck,
} from "lucide-react";

/* MARKER-MAKE-KIT-INVOKED */

type Screen = "home" | "flashsale" | "detail" | "cart" | "checkout" | "ordersuccess" | "outofstock";

interface FoodItem {
  id: number;
  name: string;
  originalPrice: number;
  salePrice: number;
  sold: number;
  total: number;
  image: string;
  description: string;
  rating: number;
}

const FOOD_ITEMS: FoodItem[] = [
  {
    id: 1,
    name: "Pizza Hải Sản",
    originalPrice: 120000,
    salePrice: 59000,
    sold: 120,
    total: 150,
    image:
      "https://images.unsplash.com/photo-1694450060144-0354599b765e?w=600&h=400&fit=crop&auto=format",
    description:
      "Pizza hải sản tươi ngon với tôm, mực, cua và sốt cà chua đặc biệt. Phủ phô mai mozzarella thượng hạng.",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Gà Rán Giòn",
    originalPrice: 85000,
    salePrice: 39000,
    sold: 80,
    total: 100,
    image:
      "https://images.unsplash.com/photo-1586793783658-261cddf883ef?w=600&h=400&fit=crop&auto=format",
    description:
      "Gà rán giòn tan với công thức gia vị bí truyền, lớp vỏ vàng giòn, thịt mềm ngọt bên trong.",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Bò Né Phô Mai",
    originalPrice: 95000,
    salePrice: 49000,
    sold: 100,
    total: 100,
    image:
      "https://images.unsplash.com/photo-1622790367025-f1bd8a6bb972?w=600&h=400&fit=crop&auto=format",
    description:
      "Bò né sốt phô mai béo ngậy, kết hợp với trứng ốp la và bánh mì nướng giòn.",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Burger Double Beef",
    originalPrice: 110000,
    salePrice: 55000,
    sold: 200,
    total: 200,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&auto=format",
    description:
      "Burger bò Mỹ đôi lớp, phô mai cheddar chảy, rau xà lách tươi và sốt đặc biệt của nhà hàng.",
    rating: 4.6,
  },
];

interface CartItem {
  food: FoodItem;
  qty: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
}

function formatPriceShort(price: number) {
  return (price / 1000).toFixed(0) + "k";
}

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function CountdownBlock({ time }: { time: string }) {
  const parts = time.split(":");
  return (
    <div className="flex items-center gap-1">
      {parts.map((unit, i) => (
        <span key={i} className="flex items-center gap-1">
          <span
            className="bg-white text-[#ff3d00] rounded-md px-2 py-0.5 min-w-[36px] text-center inline-block"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}
          >
            {unit}
          </span>
          {i < 2 && <span className="text-white font-black">:</span>}
        </span>
      ))}
    </div>
  );
}

function StockBar({ sold, total }: { sold: number; total: number }) {
  const pct = Math.min((sold / total) * 100, 100);
  return (
    <div className="w-full bg-orange-100 rounded-full h-2">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── Screen 1: Home ────────────────────────────────────────────────────────────
function HomeScreen({
  onFlashSale,
  cartCount,
  onCart,
  countdown,
}: {
  onFlashSale: () => void;
  onCart: () => void;
  cartCount: number;
  countdown: string;
}) {
  return (
    <div className="flex flex-col h-full bg-[#f8f4f0] overflow-y-auto">
      <div className="bg-[#ff3d00] px-4 pt-12 pb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1 text-orange-100 text-xs mb-0.5">
              <MapPin size={12} />
              <span>Giao đến</span>
            </div>
            <div
              className="text-white flex items-center gap-1"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}
            >
              123 Nguyễn Huệ, Q.1
              <ChevronRight size={14} />
            </div>
          </div>
          <button onClick={onCart} className="relative bg-white/20 rounded-full p-2">
            <ShoppingCart size={22} className="text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-[10px] font-black text-[#1a1008] rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
        <div className="bg-white rounded-2xl flex items-center gap-2 px-4 py-3 shadow-sm">
          <Search size={18} className="text-[#8a7060]" />
          <input
            className="flex-1 bg-transparent text-[#1a1008] placeholder:text-[#8a7060] outline-none text-sm"
            placeholder="Tìm món ăn, nhà hàng..."
          />
        </div>
      </div>

      <div className="px-4 mt-4">
        <div
          className="rounded-2xl overflow-hidden shadow-lg cursor-pointer active:scale-[0.98] transition-transform"
          onClick={onFlashSale}
          style={{ background: "linear-gradient(135deg, #1a1008 0%, #3d1200 100%)" }}
        >
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={18} className="text-yellow-400 fill-yellow-400" />
                  <span
                    className="text-yellow-400"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "20px", letterSpacing: "-0.5px" }}
                  >
                    FLASH SALE
                  </span>
                </div>
                <p className="text-orange-200 text-xs mb-3">Ưu đãi sốc – số lượng có hạn!</p>
                <div className="flex items-center gap-2">
                  <span className="text-white text-xs opacity-70">Kết thúc sau:</span>
                  <CountdownBlock time={countdown} />
                </div>
              </div>
              <div className="text-right">
                <div className="text-yellow-400" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "28px" }}>-50%</div>
                <div className="text-orange-200 text-xs">Giảm giá</div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {FOOD_ITEMS.slice(0, 3).map((item) => (
                <div key={item.id} className="flex-1 bg-white/10 rounded-xl overflow-hidden">
                  <ImageWithFallback src={item.image} alt={item.name} className="w-full h-16 object-cover" />
                  <div className="p-1.5">
                    <div className="text-yellow-400 text-xs" style={{ fontWeight: 700 }}>{formatPriceShort(item.salePrice)}</div>
                    <div className="text-white/50 text-[10px] line-through">{formatPriceShort(item.originalPrice)}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={onFlashSale} className="mt-3 w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-[#1a1008] rounded-xl py-2.5 text-sm" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}>
              Xem tất cả ưu đãi →
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 mt-5">
        <h2 className="text-[#1a1008] mb-3" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}>Danh mục</h2>
        <div className="grid grid-cols-4 gap-3">
          {[{ icon: "🍕", label: "Pizza" }, { icon: "🍗", label: "Gà Rán" }, { icon: "🍔", label: "Burger" }, { icon: "🍜", label: "Mì" }, { icon: "🌮", label: "Tacos" }, { icon: "🍱", label: "Cơm" }, { icon: "🥗", label: "Salad" }, { icon: "🧋", label: "Trà Sữa" }].map((cat) => (
            <button key={cat.label} className="bg-white rounded-2xl p-3 flex flex-col items-center gap-1.5 shadow-sm active:scale-95 transition-transform">
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[10px] text-[#1a1008] font-semibold">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-5 mb-28">
        <h2 className="text-[#1a1008] mb-3" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}>Phổ biến hôm nay</h2>
        <div className="flex flex-col gap-3">
          {FOOD_ITEMS.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl flex gap-3 p-3 shadow-sm">
              <ImageWithFallback src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="text-[#1a1008] text-sm mb-0.5" style={{ fontWeight: 700 }}>{item.name}</div>
                <div className="flex items-center gap-1 mb-1.5">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-[#8a7060]">{item.rating}</span>
                  <span className="text-xs text-[#8a7060]">• {item.sold} đã bán</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ff3d00]" style={{ fontWeight: 800, fontSize: "16px" }}>{formatPriceShort(item.salePrice)}</span>
                  <span className="text-[#8a7060] text-xs line-through">{formatPriceShort(item.originalPrice)}</span>
                  <span className="ml-auto bg-red-50 text-[#ff3d00] text-[10px] font-bold px-2 py-0.5 rounded-full">SALE</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Screen 2: Flash Sale List ─────────────────────────────────────────────────
function FlashSaleScreen({
  onBack,
  onDetail,
  onOutOfStock,
  onCart,
  cartCount,
  countdown,
}: {
  onBack: () => void;
  onDetail: (item: FoodItem) => void;
  onOutOfStock: (item: FoodItem) => void;
  onCart: () => void;
  cartCount: number;
  countdown: string;
}) {
  return (
    <div className="flex flex-col h-full bg-[#f8f4f0]">
      <div
        className="px-4 pt-12 pb-4 shrink-0"
        style={{ background: "linear-gradient(135deg, #ff3d00 0%, #ff8c00 100%)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="bg-white/20 rounded-full p-2">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-yellow-300 fill-yellow-300" />
            <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "20px", letterSpacing: "-0.5px" }}>
              FLASH SALE
            </span>
          </div>
          <button onClick={onCart} className="relative bg-white/20 rounded-full p-2">
            <ShoppingCart size={20} className="text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-[10px] font-black text-[#1a1008] rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
        <div className="bg-white/20 rounded-2xl p-3 flex items-center justify-between">
          <span className="text-white text-sm opacity-90">Kết thúc sau:</span>
          <CountdownBlock time={countdown} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-28">
        {FOOD_ITEMS.map((item) => {
          const remaining = item.total - item.sold;
          const isOutOfStock = remaining <= 0;
          const discountPct = Math.round((1 - item.salePrice / item.originalPrice) * 100);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer active:scale-[0.99] transition-transform"
              onClick={() => isOutOfStock ? onOutOfStock(item) : onDetail(item)}
            >
              <div className="flex gap-3 p-3">
                <div className="relative shrink-0">
                  <ImageWithFallback src={item.image} alt={item.name} className={`w-24 h-24 rounded-xl object-cover ${isOutOfStock ? "grayscale" : ""}`} />
                  <div className={`absolute top-1 left-1 text-white text-[10px] font-black px-1.5 py-0.5 rounded-lg ${isOutOfStock ? "bg-gray-400" : "bg-[#ff3d00]"}`}>
                    {isOutOfStock ? "HẾT" : `-${discountPct}%`}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`mb-1 text-sm ${isOutOfStock ? "text-[#8a7060]" : "text-[#1a1008]"}`} style={{ fontWeight: 700 }}>
                    {item.name}
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    {isOutOfStock ? (
                      <span className="text-[#8a7060] text-sm line-through">{formatPriceShort(item.salePrice)}</span>
                    ) : (
                      <>
                        <span className="text-[#ff3d00]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "20px" }}>
                          {formatPriceShort(item.salePrice)}
                        </span>
                        <span className="text-[#8a7060] text-sm line-through">{formatPriceShort(item.originalPrice)}</span>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-[#8a7060] mb-1.5">
                    Đã bán {item.sold} • {isOutOfStock ? <span className="text-red-500 font-semibold">Đã hết hàng</span> : `Còn ${remaining} suất`}
                  </div>
                  <StockBar sold={item.sold} total={item.total} />
                </div>
              </div>

              <div className={`border-t border-[#f0ebe6] px-3 py-2.5 flex items-center justify-between`}>
                {isOutOfStock ? (
                  <>
                    <span className="text-xs text-[#8a7060]">Sản phẩm đã hết — Nhấn để xem chi tiết</span>
                    <span className="text-xs text-[#8a7060] bg-gray-100 rounded-lg px-3 py-1 font-semibold">Hết hàng</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs text-green-600 font-semibold">✓ Còn hàng</span>
                    <button
                      className="bg-[#ff3d00] text-white text-sm rounded-xl px-4 py-1.5 active:scale-95 transition-transform"
                      style={{ fontWeight: 700 }}
                      onClick={(e) => { e.stopPropagation(); onDetail(item); }}
                    >
                      Mua ngay
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Screen 3: Item Detail ─────────────────────────────────────────────────────
function DetailScreen({
  item,
  onBack,
  onAddToCart,
  onBuyNow,
  onViewCart,
  toastMessage,
  countdown,
}: {
  item: FoodItem;
  onBack: () => void;
  onAddToCart: (item: FoodItem) => void;
  onBuyNow: (item: FoodItem) => void;
  onViewCart: () => void;
  toastMessage: string | null;
  countdown: string;
}) {
  const remaining = item.total - item.sold;
  const discountPct = Math.round((1 - item.salePrice / item.originalPrice) * 100);

  return (
    <div className="flex flex-col h-full bg-[#f8f4f0]">
      <div className="relative shrink-0">
        <ImageWithFallback src={item.image} alt={item.name} className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <button onClick={onBack} className="absolute top-12 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow">
          <ArrowLeft size={20} className="text-[#1a1008]" />
        </button>
        <div className="absolute top-12 right-4 bg-[#ff3d00] text-white text-sm font-black px-3 py-1 rounded-full">
          -{discountPct}%
        </div>
      </div>

      <div className="flex-1 overflow-y-auto -mt-4">
        <div className="bg-[#f8f4f0] rounded-t-3xl px-5 pt-5 pb-32">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-orange-100 rounded-full px-3 py-1">
              <Zap size={12} className="text-[#ff3d00] fill-[#ff3d00]" />
              <span className="text-[#ff3d00] text-xs font-bold">FLASH SALE</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-[#8a7060] font-semibold">{item.rating}</span>
            </div>
          </div>

          <h1 className="text-[#1a1008] mb-2" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "22px" }}>
            {item.name}
          </h1>
          <p className="text-[#8a7060] text-sm leading-relaxed mb-4">{item.description}</p>

          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-[#ff3d00]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "32px" }}>
                {formatPriceShort(item.salePrice)}
              </span>
              <span className="text-[#8a7060] text-lg line-through">{formatPriceShort(item.originalPrice)}</span>
            </div>
            <div className="text-[#8a7060] text-xs">
              Tiết kiệm <span className="text-[#ff3d00] font-bold">{formatPriceShort(item.originalPrice - item.salePrice)}</span> với Flash Sale
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#1a1008] text-sm font-semibold">Số lượng còn lại</span>
              <span className="text-[#ff3d00]" style={{ fontWeight: 800 }}>Còn {remaining} suất</span>
            </div>
            <StockBar sold={item.sold} total={item.total} />
            <div className="flex justify-between text-xs text-[#8a7060] mt-1">
              <span>Đã bán: {item.sold}</span>
              <span>Tổng: {item.total}</span>
            </div>
          </div>

          <div className="rounded-2xl p-4 mb-4 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #1a1008 0%, #3d1200 100%)" }}>
            <div>
              <div className="text-orange-200 text-xs mb-1">Kết thúc sau:</div>
              <CountdownBlock time={countdown} />
            </div>
            <Zap size={28} className="text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20">
        {toastMessage && (
          <div className="px-4 pb-2">
            <div className="rounded-2xl bg-[#1a1a1a]/95 px-4 py-3 text-sm text-white shadow-xl ring-1 ring-white/10">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="shrink-0 text-white" />
                <span className="flex-1 min-w-0">{toastMessage}</span>
                <button
                  onClick={onViewCart}
                  className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1a1008] transition hover:bg-gray-100"
                >
                  Xem giỏ hàng
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white border-t border-[#f0ebe6] px-4 py-4 flex gap-3">
          <button onClick={() => onAddToCart(item)} className="flex-1 border-2 border-[#ff3d00] text-[#ff3d00] rounded-2xl py-3.5 text-sm active:scale-95 transition-transform" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
            Thêm vào giỏ
          </button>
          <button onClick={() => onBuyNow(item)} className="flex-1 bg-[#ff3d00] text-white rounded-2xl py-3.5 text-sm active:scale-95 transition-transform shadow-lg" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
            Mua ngay 🔥
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 4: Cart ────────────────────────────────────────────────────────────
function CartScreen({
  cart,
  onBack,
  onUpdateQty,
  onRemove,
  onCheckout,
}: {
  cart: CartItem[];
  onBack: () => void;
  onUpdateQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}) {
  const subtotal = cart.reduce((sum, ci) => sum + ci.food.salePrice * ci.qty, 0);

  return (
    <div className="flex flex-col h-full bg-[#f8f4f0]">
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-full bg-[#f8f4f0]">
            <ArrowLeft size={20} className="text-[#1a1008]" />
          </button>
          <h1 className="text-[#1a1008]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "20px" }}>
            Giỏ hàng
          </h1>
          {cart.length > 0 && (
            <span className="ml-auto bg-[#ff3d00] text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {cart.reduce((s, c) => s + c.qty, 0)} món
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-40">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-[#8a7060]">
            <ShoppingCart size={56} className="opacity-30" />
            <p className="font-semibold">Giỏ hàng trống</p>
            <button onClick={onBack} className="bg-[#ff3d00] text-white rounded-2xl px-6 py-3 text-sm font-bold">
              Khám phá Flash Sale
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Flash Sale notice */}
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-2.5">
              <Zap size={16} className="text-[#ff3d00] fill-[#ff3d00] shrink-0" />
              <span className="text-sm text-[#ff3d00] font-semibold">Giá Flash Sale đã được áp dụng!</span>
            </div>

            {/* Items */}
            {cart.map((ci) => (
              <div key={ci.food.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex gap-3">
                  <ImageWithFallback src={ci.food.image} alt={ci.food.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-[#1a1008] text-sm leading-tight" style={{ fontWeight: 700 }}>{ci.food.name}</div>
                      <button onClick={() => onRemove(ci.food.id)} className="text-gray-300 hover:text-red-400 transition-colors shrink-0 p-0.5">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 mb-2">
                      <Zap size={10} className="text-orange-400 fill-orange-400" />
                      <span className="text-xs text-orange-400 font-semibold">Flash Sale</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[#ff3d00]" style={{ fontWeight: 800, fontSize: "17px" }}>{formatPriceShort(ci.food.salePrice)}</span>
                        <span className="text-[#8a7060] text-xs line-through ml-1">{formatPriceShort(ci.food.originalPrice)}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-[#f8f4f0] rounded-xl p-1">
                        <button onClick={() => ci.qty > 1 ? onUpdateQty(ci.food.id, ci.qty - 1) : onRemove(ci.food.id)} className="bg-white rounded-lg p-1 shadow-sm active:scale-90">
                          <Minus size={14} className="text-[#1a1008]" />
                        </button>
                        <span className="text-[#1a1008] min-w-[22px] text-center text-sm" style={{ fontWeight: 700 }}>{ci.qty}</span>
                        <button onClick={() => onUpdateQty(ci.food.id, ci.qty + 1)} className="bg-[#ff3d00] rounded-lg p-1 shadow-sm active:scale-90">
                          <Plus size={14} className="text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Address */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-[#ff3d00]" />
                <span className="text-[#1a1008] text-sm font-semibold">Địa chỉ giao hàng</span>
              </div>
              <p className="text-[#8a7060] text-sm">123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM</p>
              <button className="text-[#ff3d00] text-xs font-semibold mt-1">Thay đổi →</button>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#8a7060]">Tạm tính ({cart.reduce((s, c) => s + c.qty, 0)} món)</span>
                <span className="text-[#1a1008] font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#8a7060]">Phí giao hàng</span>
                <span className="text-green-500 font-semibold">Miễn phí</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-[#8a7060]">Giảm giá Flash Sale</span>
                <span className="text-[#ff3d00] font-semibold">
                  -{formatPrice(cart.reduce((s, c) => s + (c.food.originalPrice - c.food.salePrice) * c.qty, 0))}
                </span>
              </div>
              <div className="border-t border-[#f0ebe6] pt-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-[#1a1008]" style={{ fontWeight: 700 }}>Tổng cộng</span>
                  <span className="text-[#ff3d00]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "22px" }}>
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#f0ebe6] px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#8a7060] text-sm">Tổng thanh toán</span>
            <span className="text-[#ff3d00]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "20px" }}>
              {formatPrice(subtotal)}
            </span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full bg-[#ff3d00] text-white rounded-2xl py-4 active:scale-95 transition-transform shadow-lg flex items-center justify-center gap-2"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "16px" }}
          >
            <CreditCard size={18} />
            Tiến hành thanh toán
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Screen 5: Checkout ────────────────────────────────────────────────────────
const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "cash",
    name: "Tiền mặt",
    subtitle: "Thanh toán khi nhận hàng (COD)",
    icon: <Banknote size={22} />,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    id: "banking",
    name: "Chuyển khoản ngân hàng",
    subtitle: "Vietcombank, BIDV, Techcombank...",
    icon: <CreditCard size={22} />,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: "momo",
    name: "Ví MoMo",
    subtitle: "Thanh toán qua ví điện tử MoMo",
    icon: <Smartphone size={22} />,
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    id: "zalopay",
    name: "ZaloPay",
    subtitle: "Thanh toán qua ZaloPay",
    icon: <Wallet size={22} />,
    color: "text-blue-500",
    bg: "bg-sky-50",
  },
  {
    id: "vnpay",
    name: "VNPay QR",
    subtitle: "Quét mã QR thanh toán VNPay",
    icon: <Smartphone size={22} />,
    color: "text-red-600",
    bg: "bg-red-50",
  },
];

function CheckoutScreen({
  cart,
  onBack,
  onOrderSuccess,
}: {
  cart: CartItem[];
  onBack: () => void;
  onOrderSuccess: () => void;
}) {
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [note, setNote] = useState("");
  const [processing, setProcessing] = useState(false);

  const subtotal = cart.reduce((sum, ci) => sum + ci.food.salePrice * ci.qty, 0);
  const savings = cart.reduce((s, c) => s + (c.food.originalPrice - c.food.salePrice) * c.qty, 0);

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === selectedPayment)!;

  function handleConfirm() {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onOrderSuccess();
    }, 1800);
  }

  return (
    <div className="flex flex-col h-full bg-[#f8f4f0]">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-full bg-[#f8f4f0]">
            <ArrowLeft size={20} className="text-[#1a1008]" />
          </button>
          <h1 className="text-[#1a1008]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "20px" }}>
            Thanh toán
          </h1>
        </div>
        {/* Steps */}
        <div className="flex items-center gap-2 mt-3">
          {["Giỏ hàng", "Thanh toán", "Hoàn tất"].map((step, i) => (
            <div key={step} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? "bg-[#ff3d00] text-white" : i === 1 ? "bg-[#ff3d00] text-white" : "bg-gray-200 text-gray-400"}`}>
                {i < 1 ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={`text-xs font-semibold ${i <= 1 ? "text-[#ff3d00]" : "text-gray-400"}`}>{step}</span>
              {i < 2 && <div className={`flex-1 h-0.5 rounded-full ${i < 1 ? "bg-[#ff3d00]" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-36">
        {/* Delivery address */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
              <MapPin size={16} className="text-[#ff3d00]" />
            </div>
            <span className="text-[#1a1008] font-semibold">Địa chỉ giao hàng</span>
          </div>
          <div className="bg-[#f8f4f0] rounded-xl p-3">
            <div className="text-[#1a1008] text-sm font-semibold mb-0.5">Nguyễn Văn An</div>
            <div className="text-[#8a7060] text-sm">0901 234 567</div>
            <div className="text-[#8a7060] text-sm mt-1">123 Nguyễn Huệ, P. Bến Nghé, Q.1, TP.HCM</div>
          </div>
          <button className="text-[#ff3d00] text-xs font-semibold mt-2 flex items-center gap-1">
            Thay đổi địa chỉ <ChevronRight size={12} />
          </button>
        </div>

        {/* Estimated time */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
                <Clock size={16} className="text-green-600" />
              </div>
              <div>
                <div className="text-[#1a1008] text-sm font-semibold">Thời gian giao hàng</div>
                <div className="text-[#8a7060] text-xs">Dự kiến 25-35 phút</div>
              </div>
            </div>
            <span className="text-green-600 text-sm font-bold bg-green-50 px-3 py-1 rounded-xl">Nhanh</span>
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4"
            onClick={() => setShowOrderDetail(!showOrderDetail)}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center">
                <Package size={16} className="text-[#ff3d00]" />
              </div>
              <span className="text-[#1a1008] font-semibold">
                Đơn hàng ({cart.reduce((s, c) => s + c.qty, 0)} món)
              </span>
            </div>
            {showOrderDetail ? <ChevronUp size={18} className="text-[#8a7060]" /> : <ChevronDown size={18} className="text-[#8a7060]" />}
          </button>

          {showOrderDetail && (
            <div className="border-t border-[#f0ebe6] px-4 pb-4 pt-3 space-y-3">
              {cart.map((ci) => (
                <div key={ci.food.id} className="flex items-center gap-3">
                  <ImageWithFallback src={ci.food.image} alt={ci.food.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[#1a1008] text-sm font-semibold truncate">{ci.food.name}</div>
                    <div className="flex items-center gap-1">
                      <Zap size={10} className="text-orange-400 fill-orange-400" />
                      <span className="text-orange-400 text-xs font-semibold">Flash Sale</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[#ff3d00] text-sm font-bold">{formatPriceShort(ci.food.salePrice)}</div>
                    <div className="text-[#8a7060] text-xs">x{ci.qty}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-[#f0ebe6] px-4 py-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#8a7060]">Tạm tính</span>
              <span className="text-[#1a1008] font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8a7060]">Phí giao hàng</span>
              <span className="text-green-500 font-semibold">Miễn phí</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8a7060]">Tiết kiệm được</span>
              <span className="text-[#ff3d00] font-semibold">-{formatPrice(savings)}</span>
            </div>
            <div className="border-t border-[#f0ebe6] pt-2 flex justify-between items-baseline">
              <span className="text-[#1a1008] font-bold">Tổng cộng</span>
              <span className="text-[#ff3d00]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "20px" }}>{formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center">
              <CreditCard size={16} className="text-purple-600" />
            </div>
            <span className="text-[#1a1008] font-semibold">Phương thức thanh toán</span>
          </div>

          <div className="space-y-2">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = selectedPayment === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all active:scale-[0.98] ${
                    isSelected
                      ? "border-[#ff3d00] bg-red-50"
                      : "border-transparent bg-[#f8f4f0] hover:border-orange-200"
                  }`}
                >
                  <div className={`w-10 h-10 ${method.bg} rounded-xl flex items-center justify-center shrink-0 ${method.color}`}>
                    {method.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`text-sm font-bold ${isSelected ? "text-[#ff3d00]" : "text-[#1a1008]"}`}>
                      {method.name}
                    </div>
                    <div className="text-[#8a7060] text-xs">{method.subtitle}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? "border-[#ff3d00]" : "border-gray-300"}`}>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-[#ff3d00]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Banking detail */}
          {selectedPayment === "banking" && (
            <div className="mt-3 bg-blue-50 rounded-xl p-3 border border-blue-100">
              <div className="text-blue-700 text-xs font-bold mb-1">Thông tin chuyển khoản:</div>
              <div className="text-blue-600 text-xs space-y-0.5">
                <div>Ngân hàng: <span className="font-semibold">Vietcombank</span></div>
                <div>Số tài khoản: <span className="font-semibold">1234 5678 9012</span></div>
                <div>Chủ TK: <span className="font-semibold">CÔNG TY FOODNOW</span></div>
                <div>Nội dung: <span className="font-semibold">FN-{Math.floor(Math.random() * 900000) + 100000}</span></div>
              </div>
            </div>
          )}

          {/* QR placeholder for digital wallets */}
          {(selectedPayment === "momo" || selectedPayment === "zalopay" || selectedPayment === "vnpay") && (
            <div className="mt-3 bg-gray-50 rounded-xl p-4 flex flex-col items-center border border-gray-100">
              <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center mb-2">
                <div className="grid grid-cols-5 gap-0.5">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-sm ${Math.random() > 0.5 ? "bg-gray-800" : "bg-white"}`} />
                  ))}
                </div>
              </div>
              <div className="text-[#8a7060] text-xs text-center">
                Mở app {selectedPayment === "momo" ? "MoMo" : selectedPayment === "zalopay" ? "ZaloPay" : "VNPay"} và quét mã QR
              </div>
            </div>
          )}
        </div>

        {/* Note */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center">
              <span className="text-base">📝</span>
            </div>
            <span className="text-[#1a1008] font-semibold">Ghi chú đơn hàng</span>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="VD: Không hành, ít cay, giao trước 12h..."
            className="w-full bg-[#f8f4f0] rounded-xl px-3 py-2.5 text-sm text-[#1a1008] placeholder:text-[#8a7060] outline-none resize-none"
            rows={2}
          />
        </div>
      </div>

      {/* Bottom confirm */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#f0ebe6] px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[#8a7060] text-xs">Thanh toán qua</div>
            <div className={`text-sm font-bold ${selectedMethod.color}`}>{selectedMethod.name}</div>
          </div>
          <div className="text-right">
            <div className="text-[#8a7060] text-xs">Tổng tiền</div>
            <div className="text-[#ff3d00]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "20px" }}>
              {formatPrice(subtotal)}
            </div>
          </div>
        </div>
        <button
          onClick={handleConfirm}
          disabled={processing}
          className="w-full bg-[#ff3d00] text-white rounded-2xl py-4 active:scale-95 transition-all shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "16px" }}
        >
          {processing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <CheckCircle2 size={18} />
              Xác nhận đặt hàng
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Screen 6: Order Success ───────────────────────────────────────────────────
function OrderSuccessScreen({
  cart,
  paymentMethod,
  onBackHome,
}: {
  cart: CartItem[];
  paymentMethod: string;
  onBackHome: () => void;
}) {
  const subtotal = cart.reduce((sum, ci) => sum + ci.food.salePrice * ci.qty, 0);
  const orderId = `FN-${Math.floor(Math.random() * 900000) + 100000}`;
  const method = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

  return (
    <div className="flex flex-col h-full bg-[#f8f4f0] overflow-y-auto">
      {/* Success hero */}
      <div
        className="px-4 pt-14 pb-8 flex flex-col items-center"
        style={{ background: "linear-gradient(160deg, #ff3d00 0%, #ff8c00 100%)" }}
      >
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
          <CircleCheck size={44} className="text-[#ff3d00]" strokeWidth={2} />
        </div>
        <h1 className="text-white text-center mb-1" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "22px" }}>
          Đặt hàng thành công!
        </h1>
        <p className="text-orange-100 text-sm text-center">
          Đơn hàng của bạn đang được chuẩn bị
        </p>
        <div className="mt-3 bg-white/20 rounded-2xl px-4 py-2">
          <span className="text-white text-sm font-bold">{orderId}</span>
        </div>
      </div>

      {/* Order info */}
      <div className="px-4 -mt-4 pb-28 space-y-3">
        {/* Timeline */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-[#1a1008] font-semibold mb-3">Trạng thái đơn hàng</div>
          <div className="space-y-3">
            {[
              { icon: <CheckCircle2 size={18} className="text-green-500" />, label: "Đặt hàng thành công", time: "Vừa xong", done: true },
              { icon: <Package size={18} className="text-[#ff3d00]" />, label: "Đang chuẩn bị món", time: "~10 phút", done: true },
              { icon: <Zap size={18} className="text-gray-300" />, label: "Đang giao hàng", time: "~25 phút", done: false },
              { icon: <MapPin size={18} className="text-gray-300" />, label: "Đã giao hàng", time: "Dự kiến 30 phút", done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-green-50" : "bg-gray-50"}`}>
                  {step.icon}
                </div>
                <div className="flex-1 pb-3 border-b border-[#f0ebe6] last:border-0">
                  <div className={`text-sm font-semibold ${step.done ? "text-[#1a1008]" : "text-[#8a7060]"}`}>{step.label}</div>
                  <div className="text-xs text-[#8a7060]">{step.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-[#1a1008] font-semibold mb-3">Thông tin thanh toán</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#8a7060]">Phương thức</span>
              <span className={`font-semibold ${method?.color}`}>{method?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8a7060]">Tổng đơn hàng</span>
              <span className="text-[#1a1008] font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8a7060]">Phí ship</span>
              <span className="text-green-500 font-semibold">Miễn phí</span>
            </div>
            <div className="border-t border-[#f0ebe6] pt-2 flex justify-between">
              <span className="text-[#1a1008] font-bold">Tổng thanh toán</span>
              <span className="text-[#ff3d00]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "18px" }}>
                {formatPrice(subtotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Items in order */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-[#1a1008] font-semibold mb-3">
            Món đã đặt ({cart.reduce((s, c) => s + c.qty, 0)} món)
          </div>
          {cart.map((ci) => (
            <div key={ci.food.id} className="flex items-center gap-3 py-2 border-b border-[#f0ebe6] last:border-0">
              <ImageWithFallback src={ci.food.image} alt={ci.food.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
              <div className="flex-1">
                <div className="text-[#1a1008] text-sm font-semibold">{ci.food.name}</div>
                <div className="text-[#8a7060] text-xs">x{ci.qty}</div>
              </div>
              <div className="text-[#ff3d00] text-sm font-bold">{formatPrice(ci.food.salePrice * ci.qty)}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onBackHome}
          className="w-full bg-[#ff3d00] text-white rounded-2xl py-4 active:scale-95 transition-transform shadow-lg"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "16px" }}
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
}

// ─── Screen 7: Out of Stock ────────────────────────────────────────────────────
function OutOfStockScreen({
  item,
  onBack,
  onViewOthers,
}: {
  item: FoodItem | null;
  onBack: () => void;
  onViewOthers: () => void;
}) {
  const availableItems = FOOD_ITEMS.filter((f) => f.total - f.sold > 0 && f.id !== item?.id);

  return (
    <div className="flex flex-col h-full bg-[#f8f4f0]">
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-full bg-[#f8f4f0]">
            <ArrowLeft size={20} className="text-[#1a1008]" />
          </button>
          <h1 className="text-[#1a1008]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "20px" }}>
            Thông báo
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 pb-10">
        {/* The sold-out item */}
        {item && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-5">
            <div className="relative">
              <ImageWithFallback src={item.image} alt={item.name} className="w-full h-36 object-cover grayscale" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-[#ff3d00]" />
                  <span className="text-[#ff3d00] font-black text-sm">ĐÃ HẾT HÀNG</span>
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-gray-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg">
                HẾT
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[#1a1008] font-bold mb-1">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[#8a7060] text-sm line-through">{formatPriceShort(item.salePrice)}</span>
                    <span className="text-[#8a7060] text-xs">Flash Sale</span>
                  </div>
                </div>
                <span className="bg-gray-100 text-[#8a7060] text-xs font-bold px-3 py-1 rounded-full">Hết hàng</span>
              </div>
              <div className="mt-3">
                <StockBar sold={item.total} total={item.total} />
                <div className="text-xs text-[#8a7060] mt-1">Đã bán hết {item.total}/{item.total} suất</div>
              </div>
            </div>
          </div>
        )}

        {/* Warning notice */}
        <div
          className="rounded-2xl p-5 mb-5 flex flex-col items-center text-center"
          style={{ background: "linear-gradient(135deg, #fff5f5 0%, #fff0e6 100%)", border: "1.5px solid #fecaca" }}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow mb-3">
            <AlertTriangle size={32} className="text-[#ff3d00]" strokeWidth={2.5} />
          </div>
          <h2 className="text-[#1a1008] mb-2" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "17px" }}>
            SẢN PHẨM ĐÃ HẾT HÀNG
          </h2>
          <p className="text-[#8a7060] text-sm leading-relaxed">
            Rất tiếc, Flash Sale đã kết thúc hoặc số lượng đã bán hết.
            <br />Hãy nhanh tay hơn vào lần sau! 🏃
          </p>
        </div>

        {/* Available items */}
        {availableItems.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-[#ff3d00] fill-[#ff3d00]" />
              <p className="text-[#1a1008] font-semibold text-sm">Còn hàng – Mua ngay:</p>
            </div>
            {availableItems.map((avItem) => (
              <div
                key={avItem.id}
                className="flex items-center gap-3 py-2.5 border-b border-[#f0ebe6] last:border-0 cursor-pointer active:bg-[#f8f4f0] rounded-xl px-1 -mx-1"
                onClick={onViewOthers}
              >
                <ImageWithFallback src={avItem.image} alt={avItem.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                <div className="flex-1">
                  <div className="text-[#1a1008] text-sm font-semibold">{avItem.name}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[#ff3d00] text-sm font-bold">{formatPriceShort(avItem.salePrice)}</span>
                    <span className="text-[#8a7060] text-xs line-through">{formatPriceShort(avItem.originalPrice)}</span>
                  </div>
                  <div className="text-xs text-[#8a7060]">Còn {avItem.total - avItem.sold} suất</div>
                </div>
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-semibold shrink-0">
                  Còn hàng
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onBack} className="flex-1 border-2 border-[#ff3d00] text-[#ff3d00] rounded-2xl py-3.5 text-sm active:scale-95 transition-transform" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
            Quay lại
          </button>
          <button onClick={onViewOthers} className="flex-1 bg-[#ff3d00] text-white rounded-2xl py-3.5 text-sm active:scale-95 transition-transform shadow-lg" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
            Xem sản phẩm khác
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Bottom Nav ────────────────────────────────────────────────────────────────
function BottomNav({
  active,
  onHome,
  onFlashSale,
  onCart,
  cartCount,
  cartBump,
}: {
  active: Screen;
  onHome: () => void;
  onFlashSale: () => void;
  onCart: () => void;
  cartCount: number;
  cartBump: boolean;
}) {
  const tabs = [
    { id: "home" as Screen, icon: <Home size={22} />, label: "Trang chủ", action: onHome },
    { id: "flashsale" as Screen, icon: <Zap size={22} />, label: "Flash Sale", action: onFlashSale },
    { id: "bell" as Screen, icon: <Bell size={22} />, label: "Thông báo", action: onHome },
    { id: "tag" as Screen, icon: <Tag size={22} />, label: "Ưu đãi", action: onHome },
    {
      id: "cart" as Screen,
      icon: (
        <div className={`relative ${cartBump ? "animate-[bounce_0.28s_linear]" : ""}`}>
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#ff3d00] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
              {cartCount}
            </span>
          )}
        </div>
      ),
      label: "Giỏ hàng",
      action: onCart,
    },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#f0ebe6] px-2 pb-6 pt-2 flex items-center justify-around">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={tab.action}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${active === tab.id ? "text-[#ff3d00]" : "text-[#8a7060]"}`}
        >
          {tab.icon}
          <span className="text-[10px] font-semibold">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [outOfStockItem, setOutOfStockItem] = useState<FoodItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const countdown = useCountdown(5720);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cartBump, setCartBump] = useState(false);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 1800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  function addToCart(item: FoodItem) {
    setCart((prev) => {
      const existing = prev.find((c) => c.food.id === item.id);
      if (existing) return prev.map((c) => c.food.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { food: item, qty: 1 }];
    });
  }

  function handleAddToCart(item: FoodItem) {
    addToCart(item);
    setToastMessage(`Đã thêm ${item.name} vào giỏ hàng`);
    setCartBump(true);
    setTimeout(() => setCartBump(false), 280);
  }

  function updateQty(id: number, qty: number) {
    setCart((prev) => prev.map((c) => (c.food.id === id ? { ...c, qty } : c)));
  }

  function removeItem(id: number) {
    setCart((prev) => prev.filter((c) => c.food.id !== id));
  }

  function handleBuyNow(item: FoodItem) {
    addToCart(item);
    setScreen("cart");
  }

  function handleOutOfStock(item: FoodItem) {
    setOutOfStockItem(item);
    setScreen("outofstock");
  }

  function handleOrderSuccess() {
    setCart([]);
    setScreen("ordersuccess");
  }

  // Hide bottom nav on the Cart screen so the checkout button remains visible
  const showNav = screen === "home" || screen === "flashsale";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: "#d1d5db" }}>
      {/* Phone frame */}
      <div
        className="relative bg-[#f8f4f0] overflow-hidden"
        style={{
          width: "390px",
          height: "844px",
          borderRadius: "44px",
          boxShadow: "0 0 0 12px #1a1008, 0 30px 80px rgba(0,0,0,0.5)",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#1a1008] z-50" style={{ width: "120px", height: "30px", borderRadius: "0 0 20px 20px" }} />

        {/* Screen content */}
        <div className="absolute inset-0 overflow-hidden">
          {screen === "home" && (
            <HomeScreen onFlashSale={() => setScreen("flashsale")} onCart={() => setScreen("cart")} cartCount={cartCount} countdown={countdown} />
          )}
          {screen === "flashsale" && (
            <FlashSaleScreen
              onBack={() => setScreen("home")}
              onDetail={(item) => { setSelectedItem(item); setScreen("detail"); }}
              onOutOfStock={handleOutOfStock}
              onCart={() => setScreen("cart")}
              cartCount={cartCount}
              countdown={countdown}
            />
          )}
          {screen === "detail" && selectedItem && (
            <DetailScreen
              item={selectedItem}
              onBack={() => setScreen("flashsale")}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onViewCart={() => setScreen("cart")}
              toastMessage={toastMessage}
              countdown={countdown}
            />
          )}
          {screen === "cart" && (
            <CartScreen
              cart={cart}
              onBack={() => setScreen("home")}
              onUpdateQty={updateQty}
              onRemove={removeItem}
              onCheckout={() => setScreen("checkout")}
            />
          )}
          {screen === "checkout" && (
            <CheckoutScreen
              cart={cart}
              onBack={() => setScreen("cart")}
              onOrderSuccess={handleOrderSuccess}
            />
          )}
          {screen === "ordersuccess" && (
            <OrderSuccessScreen
              cart={cart.length === 0 ? [{ food: FOOD_ITEMS[0], qty: 1 }] : cart}
              paymentMethod={selectedPayment}
              onBackHome={() => { setScreen("home"); }}
            />
          )}
          {screen === "outofstock" && (
            <OutOfStockScreen
              item={outOfStockItem}
              onBack={() => setScreen("flashsale")}
              onViewOthers={() => setScreen("flashsale")}
            />
          )}
        </div>

        {showNav && (
          <BottomNav
            active={screen}
            onHome={() => setScreen("home")}
            onFlashSale={() => setScreen("flashsale")}
            onCart={() => setScreen("cart")}
            cartCount={cartCount}
            cartBump={cartBump}
          />
        )}
      </div>

      {/* Screen nav pills */}
      <div className="mt-6 flex gap-2 flex-wrap justify-center max-w-lg">
        {(
          [
            { id: "home", label: "① Home" },
            { id: "flashsale", label: "② Flash Sale" },
            { id: "detail", label: "③ Chi tiết" },
            { id: "cart", label: "④ Giỏ hàng" },
            { id: "checkout", label: "⑤ Thanh toán" },
            { id: "ordersuccess", label: "⑥ Đặt thành công" },
            { id: "outofstock", label: "⑦ Hết hàng" },
          ] as { id: Screen; label: string }[]
        ).map((s) => (
          <button
            key={s.id}
            onClick={() => {
              if (s.id === "detail" && !selectedItem) setSelectedItem(FOOD_ITEMS[0]);
              if (s.id === "outofstock") setOutOfStockItem(FOOD_ITEMS[2]);
              setScreen(s.id);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${screen === s.id ? "bg-[#ff3d00] text-white shadow-lg scale-105" : "bg-white text-[#1a1008] shadow"}`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
