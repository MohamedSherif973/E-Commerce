const currency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

function ProductDetailPage({ product, cartItems, onAddToCart, onBack, onOpenCart, onNavigate }) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div dir="rtl" className="min-h-screen bg-[#f7f4ef] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-950"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-500 text-lg text-white">س</span>
            سوق<span className="-mr-2 text-orange-500">تك</span>
          </button>

          <nav className="flex items-center gap-5 text-sm font-semibold text-slate-600">
            <button type="button" onClick={() => onNavigate('home')} className="transition hover:text-orange-600">الرئيسية</button>
            <button type="button" onClick={() => onNavigate('appliances')} className="transition hover:text-orange-600">الأجهزة المنزلية</button>
            <button type="button" onClick={onOpenCart} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:border-orange-300 hover:text-orange-600">
              <span>السلة</span>
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-orange-500 px-1 text-xs text-white">{totalItems}</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
        >
          ← العودة للمنتجات
        </button>

        <div className="grid gap-8 rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_25px_60px_rgba(15,23,42,0.08)] sm:p-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="overflow-hidden rounded-[28px] border border-slate-200  from-orange-50 via-white to-slate-100 p-6">
            <img src={product.thumbnail} alt={product.title} className="h-full  w-full object-contain" />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">{product.category}</span>
              <span className="text-sm text-slate-500">التقييم ★ {Number(product.rating ?? 0).toFixed(1)}</span>
            </div>

            <h1 className="mt-4 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">{product.title}</h1>
            <p className="mt-4 text-base leading-8 text-slate-600">{product.description}</p>

            <div className="mt-6 flex items-end gap-3">
              <span className="text-3xl font-black text-slate-950">{currency(product.price)}</span>
              {product.discountPercentage > 0 && (
                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-600">
                  خصم {Math.round(product.discountPercentage)}%
                </span>
              )}
            </div>

            <div className="mt-6 space-y-3  bg-slate-50 p-4 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>الحالة</span>
                <span className="font-bold text-emerald-600">{product.stock > 0 ? 'متوفر الآن' : 'غير متوفر'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>التوصيل</span>
                <span className="font-bold">خلال ٢-٤ أيام</span>
              </div>
              <div className="flex items-center justify-between">
                <span>الدفع</span>
                <span className="font-bold">دفع عند الاستلام</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className="flex-1 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-500"
              >
                أضف إلى السلة
              </button>
              <button
                type="button"
                onClick={onOpenCart}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
              >
                عرض السلة
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductDetailPage
