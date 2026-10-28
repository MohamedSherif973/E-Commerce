import { useEffect, useMemo, useState } from 'react'
import CartDrawer from './components/CartDrawer.jsx'

const API_URL =
  'https://dummyjson.com/products?limit=0&select=id,title,description,category,price,discountPercentage,rating,thumbnail,stock'

const categories = [
  { label: 'الكل', value: 'الكل', number: '01', description: 'كل اختياراتنا' },
  { label: 'هواتف', value: 'smartphones', number: '02', description: 'أجهزة ذكية ليومك' },
  { label: 'لابتوبات', value: 'laptops', number: '03', description: 'للعمل والترفيه' },
  { label: 'أجهزة لوحية', value: 'tablets', number: '04', description: 'خفيفة وعملية' },
  { label: 'إكسسوارات', value: 'mobile-accessories', number: '05', description: 'تفاصيل تكمل تجربتك' },
]

const categoryLabels = Object.fromEntries(
  categories.filter((category) => category.value !== 'الكل').map((category) => [category.value, category.label]),
)

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

function Home({ cartItems, onAddToCart, onRemoveFromCart, onUpdateQuantity, onOpenCart }) {
  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState('الكل')
  const [search, setSearch] = useState('')
  const [showCart, setShowCart] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let didTimeout = false
    let isUnmounted = false
    const timeoutId = setTimeout(() => {
      didTimeout = true
      controller.abort()
    }, 15000)

    async function loadProducts() {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(API_URL, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Product API returned ${response.status}`)
        }

        const data = await response.json()
        if (!Array.isArray(data.products)) {
          throw new Error('Product API returned an unexpected response')
        }

        const electronics = data.products.filter((product) => categoryLabels[product.category])
        setProducts(electronics)
      } catch (loadError) {
        if (loadError.name === 'AbortError' && didTimeout) {
          setError('استغرق تحميل المنتجات وقتًا طويلًا. حاول مرة أخرى.')
        } else if (loadError.name !== 'AbortError') {
          setError('تعذر تحميل المنتجات الآن. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.')
        }
      } finally {
        if (!isUnmounted) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isUnmounted = true
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [retryCount])

  const normalizedSearch = search.trim().toLocaleLowerCase()
  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory = activeCategory === 'الكل' || product.category === activeCategory
        const matchesSearch =
          !normalizedSearch ||
          product.title.toLocaleLowerCase().includes(normalizedSearch) ||
          product.description.toLocaleLowerCase().includes(normalizedSearch)

        return matchesCategory && matchesSearch
      }),
    [activeCategory, normalizedSearch, products],
  )

  const featuredProduct = products.find((product) => product.discountPercentage > 10) ?? products[0]
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleOpenCart = () => {
    if (onOpenCart) {
      onOpenCart()
      return
    }

    setShowCart(true)
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f8f7f4] text-slate-900">
      <div className="bg-slate-950 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-xs sm:justify-between sm:text-sm">
          <p>توصيل مجاني للطلبات فوق ٢٠٠٠ جنيه</p>
          <p className="text-slate-400">تسوق أذكى. اختيارات أفضل.</p>
        </div>
      </div>

      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur">
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
              onChange={(event) => setSearch(event.target.value)}
            />
            <button className="bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-orange-500" type="submit">
              بحث
            </button>
          </form>

          <button
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold transition hover:border-orange-300 hover:text-orange-600 sm:px-4"
            type="button"
            onClick={handleOpenCart}
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

      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16" aria-labelledby="hero-title">
          <div className="py-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm font-bold text-orange-700">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              عالم التقنية بين إيديك
            </span>
            <h1 id="hero-title" className="mt-6 max-w-2xl text-4xl font-black leading-[1.3] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              اختار جهازك الجديد،
              <span className="block text-orange-500">وخلي الباقي علينا.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              اكتشف أحدث الأجهزة والإكسسوارات من كتالوج متجدد، بتفاصيل واضحة وتجربة تسوق أسهل.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="rounded-xl bg-orange-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600" href="#products">
                اكتشف المنتجات
              </a>
              <a className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50" href="#categories">
                تصفح الأقسام
              </a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-slate-600">
              <span className="flex items-center gap-2"><span className="text-orange-500">✓</span> كتالوج متجدد</span>
              <span className="flex items-center gap-2"><span className="text-orange-500">✓</span> تفاصيل وأسعار واضحة</span>
              <span className="flex items-center gap-2"><span className="text-orange-500">✓</span> تسوق بكل سهولة</span>
            </div>
          </div>

          <div className="relative overflow-hidden bg-slate-950 p-6 sm:p-9">
            <div className="absolute -left-12 -top-20 h-64 w-64 rounded-full bg-orange-500/25 blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200">اختيارات تستاهل</span>
                <span className="text-xs text-slate-400">تجدد باستمرار</span>
              </div>
              <div className="grid flex-1 items-center gap-3 sm:grid-cols-[1fr_1.2fr]">
                <div className="relative z-10 py-6 text-white">
                  <p className="text-sm font-bold text-orange-300">تقنية أسهل، كل يوم</p>
                  <h2 className="mt-3 text-3xl font-extrabold leading-snug sm:text-4xl">كل اللي تحتاجه. في مكان واحد.</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">من أحدث الهواتف إلى إكسسواراتك اليومية.</p>
                  <a className="mt-5 inline-flex items-center gap-2 font-bold text-orange-300 transition hover:text-white" href="#products">
                    تسوق الآن <span aria-hidden="true">←</span>
                  </a>
                </div>
                {featuredProduct ? (
                  <div className="relative mx-auto grid h-52 w-full max-w-xs place-items-center rounded-3xl bg-white/10 p-5 sm:h-64">
                    <div className="absolute inset-4 rounded-2xl border border-white/10  from-white/15 to-transparent" />
                    <img
                      className="relative h-full w-full object-contain drop-shadow-2xl"
                      src={featuredProduct.thumbnail}
                      alt={featuredProduct.title}
                      onError={(event) => { event.currentTarget.style.display = 'none' }}
                    />
                    <span className="absolute bottom-3 left-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                      {formatPrice(featuredProduct.price)}
                    </span>
                  </div>
                ) : (
                  <div className="mx-auto grid h-52 w-full max-w-xs place-items-center rounded-3xl border border-white/10 bg-white/5 text-6xl text-orange-400 sm:h-64" aria-hidden="true">
                    ✦
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                منتجات من كتالوجنا الإلكتروني
              </div>
            </div>
          </div>
        </section>

        <section id="categories" className="border-y border-slate-200 bg-white py-10 sm:py-14" aria-labelledby="categories-title">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-orange-600">اختار اللي يناسبك</p>
                <h2 id="categories-title" className="mt-1 text-2xl font-extrabold sm:text-3xl">تسوق حسب القسم</h2>
              </div>
              <a className="text-sm font-bold text-slate-500 transition hover:text-orange-600" href="#products">عرض كل المنتجات ←</a>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
              {categories.slice(1).map((category) => (
                <button
                  key={category.value}
                  className={`group rounded-2xl border p-4 text-right transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg hover:shadow-slate-200/60 sm:p-5 ${activeCategory === category.value ? 'border-orange-400 bg-orange-50' : 'border-slate-200 bg-[#faf9f7]'}`}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category.value)
                    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-white text-xs font-black text-orange-600 shadow-sm transition group-hover:bg-orange-500 group-hover:text-white">{category.number}</span>
                  <span className="font-bold">{category.label}</span>
                  <span className="mt-1 block text-xs text-slate-500">{category.description}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="offers" className="mx-auto max-w-7xl px-4 pt-10 sm:pt-14">
          <div className="flex flex-col justify-between gap-4 overflow-hidden rounded-2xl bg-orange-500 px-6 py-6 text-white sm:flex-row sm:items-center sm:px-9">
            <div>
              <p className="text-sm font-semibold text-orange-100">اكتشف الجديد</p>
              <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">منتجات مميزة وأسعار من مصدر مباشر</h2>
            </div>
            <a className="w-fit rounded-lg bg-white px-5 py-3 text-sm font-bold text-orange-600 transition hover:bg-orange-50" href="#products">
              شوف المنتجات
            </a>
          </div>
        </section>

        <section id="products" className="mx-auto max-w-7xl px-4 py-10 sm:py-14" aria-labelledby="products-title">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold text-orange-600">اختيارات تستاهل</p>
              <h2 id="products-title" className="mt-1 text-2xl font-extrabold sm:text-3xl">منتجات مميزة</h2>
              {!isLoading && !error && (
                <p className="mt-2 text-sm text-slate-500">
                  {visibleProducts.length.toLocaleString('ar-EG')} منتج
                  <span className="mx-2 text-slate-300">·</span>
                  الأسعار بالدولار الأمريكي حسب بيانات المصدر
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2" aria-label="تصفية حسب القسم">
              {categories.map((category) => (
                <button
                  key={category.value}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeCategory === category.value ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-orange-300'}`}
                  type="button"
                  onClick={() => setActiveCategory(category.value)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="جاري تحميل المنتجات" aria-busy="true">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="h-56 animate-pulse bg-slate-100" />
                  <div className="space-y-3 p-4">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
                    <div className="h-5 w-4/5 animate-pulse rounded bg-slate-100" />
                    <div className="h-5 w-1/2 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center" role="alert">
              <p className="font-bold text-slate-800">{error}</p>
              <button
                className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500"
                type="button"
                onClick={() => setRetryCount((count) => count + 1)}
              >
                حاول مرة أخرى
              </button>
            </div>
          ) : visibleProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product) => (
                <article key={product.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-200/60">
                  <div className="relative grid h-56 place-items-center overflow-hidden bg-[#f5f4f1] p-5">
                    {product.discountPercentage > 0 && (
                      <span className="absolute right-3 top-3 z-10 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                        خصم {Math.round(product.discountPercentage)}%
                      </span>
                    )}
                    <img
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                      src={product.thumbnail}
                      alt={product.title}
                      loading="lazy"
                      onError={(event) => { event.currentTarget.style.display = 'none' }}
                    />
                    <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm">
                      ★ {Number(product.rating).toFixed(1)}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-orange-600">{categoryLabels[product.category]}</p>
                    <h3 className="mt-2 min-h-12 font-bold leading-6 text-slate-800">{product.title}</h3>
                    <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500">{product.description}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-lg font-extrabold text-slate-950">{formatPrice(product.price)}</span>
                      <span className="text-xs text-slate-400">{product.stock > 0 ? 'متوفر' : 'غير متوفر'}</span>
                    </div>
                    <button
                      className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
                      type="button"
                      disabled={product.stock <= 0}
                      onClick={() => onAddToCart(product)}
                    >
                      {product.stock > 0 ? 'أضف إلى السلة' : 'غير متوفر حاليًا'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <p className="font-bold text-slate-700">مفيش منتجات مطابقة للبحث.</p>
              <button
                className="mt-3 text-sm font-bold text-orange-600 underline underline-offset-4"
                type="button"
                onClick={() => {
                  setSearch('')
                  setActiveCategory('الكل')
                }}
              >
                اعرض كل المنتجات
              </button>
            </div>
          )}
        </section>
      </main>

      <footer id="footer" className="bg-slate-950 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <a href="#" className="text-2xl font-black text-white">سوق<span className="text-orange-500">تك</span></a>
            <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">اختيارات تقنية عملية وتجربة تسوق بسيطة تساعدك تلاقي اللي يناسبك.</p>
          </div>
          <div>
            <h2 className="font-bold text-white">روابط سريعة</h2>
            <div className="mt-3 flex flex-col items-start gap-2 text-sm">
              <a className="transition hover:text-white" href="#categories">الأقسام</a>
              <a className="transition hover:text-white" href="#products">المنتجات</a>
              <a className="transition hover:text-white" href="#offers">العروض</a>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-white">عن كتالوج المنتجات</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">المنتجات والصور والأسعار محمّلة مباشرة من DummyJSON API، والأسعار المعروضة بالدولار الأمريكي.</p>
            <a className="mt-2 inline-block text-sm font-bold text-orange-400 hover:text-orange-300" href="https://dummyjson.com/docs/products" target="_blank" rel="noreferrer">اعرف المزيد عن مصدر البيانات</a>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">© 2026 سوق تك. جميع الحقوق محفوظة.</div>
      </footer>

      {showCart && (
        <CartDrawer
          cartItems={cartItems}
          onCloseCart={() => setShowCart(false)}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveFromCart}
        />
      )}
    </div>
  )
}

export default Home
