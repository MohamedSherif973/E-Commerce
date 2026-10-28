const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

function CartPage({ cartItems, onUpdateQuantity, onRemoveItem, onCloseCart }) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal === 0 ? 0 : subtotal > 250 ? 0 : 25
  const total = subtotal + shipping
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen g,px-4 py-8 text-slate-900" dir="rtl">
      <div className="premium-shell premium-shadow mx-auto max-w-5xl  bg-white/80 p-4 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-sm font-bold text-orange-600">سلة التسوق</p>
            <h1 className="mt-1 text-3xl font-black text-slate-900">{totalItems} عناصر</h1>
          </div>

          <button
            type="button"
            onClick={onCloseCart}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            العودة للتسوق
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex  flex-col items-center justify-center gap-5 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-orange-100 text-4xl text-orange-600">🛒</div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">السلة فارغة</h2>
              <p className="mt-2 text-sm text-slate-500">أضف بعض المنتجات لبدء التسوق الآن.</p>
            </div>
            <button
              type="button"
              onClick={onCloseCart}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
            >
              استمرار التسوق
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row">
                  <img src={item.thumbnail} alt={item.title} className="h-28 w-28 rounded-2xl object-cover sm:h-24 sm:w-24" />

                  <div className="flex flex-1 flex-col justify-between gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-black text-slate-900">{item.title}</h3>
                        <p className="mt-1 text-xs text-slate-500">{formatPrice(item.price)} لكل قطعة</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-xs font-bold text-red-500 transition hover:text-red-600"
                      >
                        حذف
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="grid h-8 w-8 place-items-center rounded-full text-lg text-slate-600 transition hover:bg-slate-100"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="grid h-8 w-8 place-items-center rounded-full text-lg text-slate-600 transition hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-lg font-black text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-[28px] border border-slate-200 bg-[#fffaf5] p-5">
              <h2 className="text-xl font-black text-slate-900">ملخص الطلب</h2>

              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>المجموع</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>الشحن</span>
                  <span>{shipping === 0 ? 'مجاني' : formatPrice(shipping)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-black text-slate-900">
                  <span>الإجمالي</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                إتمام الطلب
              </button>

              <div className="mt-6 rounded-2xl bg-white p-4 text-xs leading-6 text-slate-600 ring-1 ring-slate-200">
                <p className="font-bold text-slate-800">سياسة الدفع</p>
                <p className="mt-2">الدفع عند الاستلام أو عبر البطاقات المتاحة، مع دعم تسليم سريع داخل المدن الرئيسية.</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
