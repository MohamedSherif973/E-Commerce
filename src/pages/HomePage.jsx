import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header.jsx'
import ProductCard from '../components/ProductCard.jsx'
import CartDrawer from '../components/CartDrawer.jsx'

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

function HomePage({ cartItems, onAddToCart, onRemoveFromCart, onUpdateQuantity, onOpenCart }) {
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
        if (!response.ok) throw new Error(`Product API returned ${response.status}`)

        const data = await response.json()
        if (!Array.isArray(data.products)) throw new Error('Product API returned an unexpected response')

        const electronics = data.products.filter((product) => categoryLabels[product.category])
        setProducts(electronics)
      } catch (loadError) {
        if (loadError.name === 'AbortError' && didTimeout) {
          setError('استغرق تحميل المنتجات وقتًا طويلًا. حاول مرة أخرى.')
        } else if (loadError.name !== 'AbortError') {
          setError('تعذر تحميل المنتجات الآن. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.')
        }
      } finally {
        if (!isUnmounted) setIsLoading(false)
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

  return (
    <div dir="rtl" className="min-h-screen bg-transparent text-slate-900">
      <div className=" from-slate-950 via-slate-900 to-orange-950 text-slate-200 shadow-[0_20px_40px_rgba(15,23,42,0.15)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 text-center text-xs sm:justify-between sm:text-sm">
          <p className="font-medium">توصيل مجاني للطلبات فوق ٢٠٠٠ جنيه</p>
          <p className="text-slate-300">تسوق أذكى. اختيارات أفضل.</p>
        </div>
      </div>

      <Header
        totalItems={totalItems}
        search={search}
        onSearchChange={setSearch}
        onOpenCart={onOpenCart ?? (() => setShowCart(true))}
      />

      <main>
        <section className="soft-grid mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16" aria-labelledby="hero-title">
          <div className="py-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/90 px-3 py-1.5 text-sm font-bold text-orange-700 shadow-sm">
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
              <a className="rounded-xl  from-orange-500 to-orange-600 px-6 py-3.5 font-bold text-white shadow-[0_18px_35px_rgba(249,115,22,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(249,115,22,0.30)]" href="#products">
                اكتشف المنتجات
              </a>
              <a className="rounded-xl border border-slate-300 bg-white/80 px-6 py-3.5 font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50" href="#categories">
                تصفح الأقسام
              </a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-slate-600">
              <span className="flex items-center gap-2"><span className="text-orange-500">✓</span> كتالوج متجدد</span>
              <span className="flex items-center gap-2"><span className="text-orange-500">✓</span> تفاصيل وأسعار واضحة</span>
              <span className="flex items-center gap-2"><span className="text-orange-500">✓</span> تسوق بكل سهولة</span>
            </div>
          </div>

          <div className="premium-shell premium-shadow relative overflow-hidden rounded-[28px]  from-[#fffdfb] via-[#fffaf5] to-[#f8fafc] p-6 sm:p-9">
            <div className="absolute -left-12 -top-20 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-amber-300/15 blur-3xl" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full border border-orange-200 bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-700">اختيارات تستاهل</span>
                <span className="text-xs text-slate-500">تجدد باستمرار</span>
              </div>
              <div className="grid flex-1 items-center gap-3 sm:grid-cols-[1fr_1.2fr]">
                <div className="relative z-10 py-6 text-slate-700">
                  <p className="text-sm font-bold text-orange-600">تقنية أسهل، كل يوم</p>
                  <h2 className="mt-3 text-3xl font-extrabold leading-snug text-black sm:text-4xl">كل اللي تحتاجه. في مكان واحد.</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">من أحدث الهواتف إلى إكسسواراتك اليومية.</p>
                  <a className="mt-5 inline-flex items-center gap-2 font-bold text-orange-600 transition hover:text-orange-700" href="#products">
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
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(featuredProduct.price)}
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

        <section id="categories" className="border-y border-slate-200/60 bg-white/60 py-10 sm:py-14 backdrop-blur-sm" aria-labelledby="categories-title">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-orange-600">اختار اللي يناسبك</p>
                <h2 id="categories-title" className="mt-1 text-2xl font-extrabold sm:text-3xl">تسوق حسب القسم</h2>
              </div>
              <a className="text-sm font-bold text-slate-500 transition hover:text-orange-600" href="#products">عرض كل المنتجات ←</a>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
          <div className="premium-shadow flex flex-col justify-between gap-4 overflow-hidden rounded-[28px]  from-orange-500 via-orange-500 to-amber-500 px-6 py-6 text-white sm:flex-row sm:items-center sm:px-9">
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
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryLabel={categoryLabels[product.category]}
                  onAddToCart={onAddToCart}
                />
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

export default HomePage
