const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

function CartDrawer({ cartItems, onCloseCart, onUpdateQuantity, onRemoveItem }) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal === 0 ? 0 : subtotal > 250 ? 0 : 25
  const total = subtotal + shipping
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm" onClick={onCloseCart}>
      <aside onClick={(event) => event.stopPropagation()} className="mr-auto flex h-full w-full max-w-md flex-col bg-[#fffaf5] p-5 shadow-2xl ring-1 ring-slate-200/80">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <p className="text-sm text-slate-500">سلة التسوق</p>
            <h3 className="text-2xl font-black text-slate-900">{totalItems} عناصر</h3>
          </div>
          <button type="button" onClick={onCloseCart} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-lg text-slate-700 transition hover:bg-slate-200">
            ×
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-orange-100 text-3xl text-orange-600">🛒</div>
            <div>
              <h4 className="text-xl font-extrabold text-slate-900">السلة فارغة</h4>
              <p className="mt-2 text-sm text-slate-500">أضف بعض المنتجات لبدء التسوق الآن.</p>
            </div>
            <button type="button" onClick={onCloseCart} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-500">
              استمرار التسوق
            </button>
          </div>
        ) : (
          <>
            <div className="mt-5 flex-1 space-y-4 overflow-y-auto pb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <img className="h-20 w-20 rounded-xl object-cover" src={item.thumbnail} alt={item.title} />
                  <div className="flex flex-1 flex-col justify-between gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                        <p className="mt-1 text-xs text-slate-500">{formatPrice(item.price)} لكل قطعة</p>
                      </div>
                      <button type="button" onClick={() => onRemoveItem(item.id)} className="text-xs font-bold text-red-500 transition hover:text-red-600">
                        حذف
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1">
                        <button type="button" onClick={() => onUpdateQuantity(item.id, -1)} className="grid h-7 w-7 place-items-center rounded-full text-lg text-slate-600 transition hover:bg-slate-100">−</button>
                        <span className="min-w-6 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                        <button type="button" onClick={() => onUpdateQuantity(item.id, 1)} className="grid h-7 w-7 place-items-center rounded-full text-lg text-slate-600 transition hover:bg-slate-100">+</button>
                      </div>
                      <span className="text-sm font-extrabold text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>المجموع</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>الشحن</span>
                  <span>{shipping === 0 ? 'مجاني' : formatPrice(shipping)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-base font-black text-slate-900">
                  <span>الإجمالي</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button type="button" className="mt-5 w-full rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600">
                إتمام الطلب
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

export default CartDrawer
