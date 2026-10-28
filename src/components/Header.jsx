function Header({ totalItems, search, onSearchChange, onOpenCart }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <a href="#" className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-950" aria-label="سوق تك - الرئيسية">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-500 text-lg text-white">س</span>
          سوق<span className="-mr-2 text-orange-500">تك</span>
        </a>

        <form
          className="order-3 flex w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100 sm:w-auto sm:flex-1 sm:max-w-xl"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="sr-only" htmlFor="product-search">ابحث عن منتج</label>
          <input
            id="product-search"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-400"
            type="search"
            placeholder="ابحث عن جهازك القادم..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <button className="bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-orange-500" type="submit">
            بحث
          </button>
        </form>

        <button
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm font-bold shadow-sm transition hover:border-orange-300 hover:text-orange-600 sm:px-4"
          type="button"
          onClick={onOpenCart}
          aria-label={`سلة التسوق، ${totalItems} منتجات`}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H6" />
            <circle cx="10" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
          <span className="hidden sm:inline">السلة</span>
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-orange-500 px-1 text-xs text-white">{totalItems}</span>
        </button>
      </div>

      <nav className="border-t border-slate-100" aria-label="التنقل الرئيسي">
        <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-4 py-3 text-sm font-semibold text-slate-600">
          <a className="shrink-0 text-orange-600" href="#">الرئيسية</a>
          <a className="shrink-0 transition hover:text-orange-600" href="#categories">الأقسام</a>
          <a className="shrink-0 transition hover:text-orange-600" href="#products">كل المنتجات</a>
          <a className="shrink-0 transition hover:text-orange-600" href="#offers">العروض</a>
          <a className="shrink-0 transition hover:text-orange-600" href="#footer">عن المتجر</a>
        </div>
      </nav>
    </header>
  )
}

export default Header
