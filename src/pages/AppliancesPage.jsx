import { useEffect, useMemo, useState } from 'react'

const APPLIANCES_API = 'https://dummyjson.com/products/category/home-decoration?limit=8'

const applianceCategories = [
  { label: 'كل الأجهزة', value: 'all', icon: '▣', description: 'كل المنتجات المميزة' },
  { label: 'غسالات', value: 'washing-machine', icon: '◫', description: 'نظافة مثالية وراحة أكبر' },
  { label: 'مراوح', value: 'fan', icon: '◌', description: 'هواء بارد وهدوء كامل' },
  { label: 'مكيفات', value: 'air-conditioner', icon: '❖', description: 'برودة لذوقك' },
  { label: 'مواقد', value: 'stove', icon: '◈', description: 'طهي أسرع وأمان أعلى' },
]

const currency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

function AppliancesPage({ cartItems, onAddToCart, onOpenCart, onOpenProduct, onNavigate }) {
  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadProducts() {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(APPLIANCES_API)
        if (!response.ok) throw new Error(`API returned ${response.status}`)

        const data = await response.json()
        const items = Array.isArray(data.products) ? data.products : []

        if (isMounted) setProducts(items)
      } catch {
        if (isMounted) setError('تعذر تحميل المنتجات الآن. حاول مرة أخرى لاحقًا.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return products.filter((product) => {
      const categoryMatch = activeCategory === 'all' || product.category === activeCategory
      const searchMatch =
        !normalizedSearch ||
        product.title.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch)

      return categoryMatch && searchMatch
    })
  }, [activeCategory, products, search])

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div dir="rtl" className="min-h-screen bg-[#f7f4ef] text-slate-900">
      <div className="bg-[linear-gradient(90deg,#18181b_0%,#0f172a_35%,#1f2937_100%)] text-slate-200">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 text-center text-xs sm:justify-between sm:text-sm">
          <p className="font-medium text-orange-200">توصيل مجاني داخل المدن الرئيسية عند الطلب فوق ١٠٠٠ جنيه</p>
          <p className="text-slate-300">أسلوب حياة أذكى في المنزل</p>
        </div>
      </div>

      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-950"
            aria-label="العودة إلى الرئيسية"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-500 text-lg text-white">س</span>
            سوق<span className="-mr-2 text-orange-500">تك</span>
          </button>

          <div className="order-3 flex w-full items-center gap-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 sm:w-auto sm:flex-1 sm:max-w-xl">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="search"
              placeholder="ابحث عن جهاز منزلي..."
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-400"
            />
            <button type="button" className="bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-500">
              بحث
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm font-bold shadow-sm transition hover:border-orange-300 hover:text-orange-600 sm:px-4"
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
            <button type="button" onClick={() => onNavigate('home')} className="shrink-0 transition hover:text-orange-600">الرئيسية</button>
            <button type="button" onClick={() => onNavigate('appliances')} className="shrink-0 text-orange-600">الأجهزة المنزلية</button>
            <button type="button" onClick={() => onNavigate('cart')} className="shrink-0 transition hover:text-orange-600">سلة التسوق</button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <section className="rounded-[28px] p-6 text-white shadow-[0_30px_60px_rgba(15,23,42,0.18)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold text-orange-300">أجهزة منزلية متطورة</p>
              <h1 className="mt-2 text-3xl font-black sm:text-4xl">حلول ذكية لتسهيل كل يوم في منزلك</h1>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              اكتشف المزيد من الأجهزة
            </button>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-orange-600">الأقسام</p>
              <h2 className="text-2xl font-black">اختر ما يناسب منزلك</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {applianceCategories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => setActiveCategory(category.value)}
                className={`rounded-2xl border p-4 text-right transition ${
                  activeCategory === category.value
                    ? 'border-orange-400 bg-orange-50 shadow-lg shadow-orange-100'
                    : 'border-slate-200 bg-white hover:border-orange-300'
                }`}
              >
                <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-slate-900 text-lg text-white">{category.icon}</span>
                <p className="font-black text-slate-900">{category.label}</p>
                <p className="mt-1 text-xs text-slate-500">{category.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-[26px] border border-slate-200 bg-slate-200/70" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-center text-red-700">
              {error}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
              لا توجد منتجات في هذا القسم الآن.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <article key={product.id} className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_25px_50px_rgba(15,23,42,0.08)]">
                  <div className="relative h-60 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-slate-100 p-2">
                    {product.discountPercentage > 0 && (
                      <span className="absolute right-3 top-3 z-10 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                        خصم {Math.round(product.discountPercentage)}%
                      </span>
                    )}

                    <img
                      className="h-full w-full max-h-56 object-contain transition duration-300 ease-out group-hover:scale-110"
                      src={product.thumbnail}
                      alt={product.title}
                      loading="lazy"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-xs font-bold text-orange-600">{product.category}</p>
                    <h3 className="mt-2 min-h-12 text-base font-extrabold leading-6 text-slate-900">{product.title}</h3>
                    <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500">{product.description}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-black text-slate-950">{currency(product.price)}</span>
                      <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700">
                        {product.stock > 0 ? 'متوفر' : 'غير متوفر'}
                      </span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenProduct(product)}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                      >
                        التفاصيل
                      </button>
                      <button
                        type="button"
                        onClick={() => onAddToCart(product)}
                        className="flex-1 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500"
                      >
                        أضف للسلة
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default AppliancesPage
