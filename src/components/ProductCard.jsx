const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

const FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#fff7ed"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#g)"/>
  <rect x="160" y="170" width="480" height="460" rx="60" fill="#ffffff" opacity="0.8"/>
  <rect x="230" y="250" width="340" height="120" rx="22" fill="#fed7aa"/>
  <rect x="260" y="410" width="280" height="30" rx="15" fill="#fdba74"/>
  <rect x="260" y="470" width="230" height="30" rx="15" fill="#fdba74" opacity="0.8"/>
  <text x="400" y="620" font-size="52" text-anchor="middle" fill="#c2410c" font-family="Arial, sans-serif" font-weight="700">Product</text>
</svg>
`)}`

function ProductCard({ product, categoryLabel, onAddToCart }) {
  return (
    <article key={product.id} className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-slate-200/80 bg-white/80 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_24px_50px_rgba(15,23,42,0.08)]">
      <div className="relative grid h-56 place-items-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-slate-100 p-2">
        {product.discountPercentage > 0 && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
            خصم {Math.round(product.discountPercentage)}%
          </span>
        )}
        <img
          className="h-full w-full max-h-52 object-contain transition duration-300 ease-out group-hover:scale-110"
          src={product.thumbnail || FALLBACK_IMAGE}
          alt={product.title}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMAGE
            event.currentTarget.style.objectFit = 'contain'
          }}
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm">
          ★ {Number(product.rating).toFixed(1)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold text-orange-600">{categoryLabel}</p>
        <h3 className="mt-2 min-h-12 font-bold leading-6 text-slate-800">{product.title}</h3>
        <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500">{product.description}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-lg font-extrabold text-slate-950">{formatPrice(product.price)}</span>
          <span className="text-xs text-slate-400">{product.stock > 0 ? 'متوفر' : 'غير متوفر'}</span>
        </div>
        <button
          className="mt-auto w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
          type="button"
          disabled={product.stock <= 0}
          onClick={() => onAddToCart(product)}
        >
          {product.stock > 0 ? 'أضف إلى السلة' : 'غير متوفر حاليًا'}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
