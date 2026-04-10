import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const ITEMS_PER_PAGE = 9
const bgColors = ['#FFF7ED','#EFF6FF','#F0FDF4','#FDF4FF','#FFFBEB','#F0FDFA','#FFF1F2']

const Stars = ({ n = 4 }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => <svg key={s} className="w-3 h-3" fill={s<=n?'#F97316':'#E5E7EB'} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
  </div>
)

const CheckBox = ({ checked, onChange }) => (
  <div onClick={onChange} className={`w-4 h-4 rounded flex items-center justify-center border cursor-pointer flex-shrink-0 ${checked ? 'bg-orange-500 border-orange-500' : 'border-gray-300'}`}>
    {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
  </div>
)

const ProductsPage = ({ products: propProducts = [], onAddToCart, wishlistItems = [], onToggleWishlist }) => {
  const { t } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '')
  const [search] = useState(searchParams.get('q') || '')
  const [maxPrice, setMaxPrice] = useState(500000)
  const [appliedMax, setAppliedMax] = useState(500000)
  const [discountFilter, setDiscountFilter] = useState(0)
  const [fetchedProducts, setFetchedProducts] = useState([])

  // Fetch products from backend if none passed as props
  useEffect(() => {
    if (propProducts.length === 0) {
      axios.get(`${BASE}/api/products`)
        .then(res => setFetchedProducts(Array.isArray(res.data) ? res.data : []))
        .catch(() => setFetchedProducts([]))
    }
  }, [propProducts.length])

  const products = propProducts.length > 0 ? propProducts : fetchedProducts
  const [brandFilter, setBrandFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState(0)
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState('grid')
  const [page, setPage] = useState(1)

  const categories = [...new Set(products.map(p => p.category?.name).filter(Boolean))]
  const brands = [...new Set(products.map(p => p.brand?.name).filter(Boolean))]

  let filtered = products
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => !categoryFilter || p.category?.name === categoryFilter)
    .filter(p => (p.discountPrice || p.price) <= appliedMax)
    .filter(p => {
      if (!discountFilter) return true
      if (!p.discountPrice) return false
      return Math.round(((p.price - p.discountPrice) / p.price) * 100) >= discountFilter
    })
    .filter(p => !brandFilter || p.brand?.name === brandFilter)

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a,b) => (a.discountPrice||a.price)-(b.discountPrice||b.price))
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a,b) => (b.discountPrice||b.price)-(a.discountPrice||a.price))
  if (sortBy === 'discount') filtered = [...filtered].sort((a,b) => {
    const da = a.discountPrice ? Math.round(((a.price-a.discountPrice)/a.price)*100) : 0
    const db = b.discountPrice ? Math.round(((b.price-b.discountPrice)/b.price)*100) : 0
    return db-da
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE)

  const activeFilters = [
    ...(search ? [{type:'search', label: search}] : []),
    ...(categoryFilter ? [{type:'category', label: categoryFilter}] : []),
    ...(discountFilter ? [{type:'discount', label: `${discountFilter}%+ off`}] : []),
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-orange-500">Home</Link>
          <span>›</span>
          <span className="font-medium" style={{color:'#E8813A'}}>All Products</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="w-60 flex-shrink-0 hidden lg:block">
          {/* Categories */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <h3 className="font-bold text-gray-800 text-sm mb-4">Categories</h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => { setCategoryFilter(''); setPage(1) }}>
                <div className="flex items-center gap-2"><CheckBox checked={!categoryFilter} onChange={() => {}} /><span className={`text-sm ${!categoryFilter ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>All Products</span></div>
                <span className="text-xs text-gray-400">{products.length}</span>
              </div>
              {categories.map(cat => (
                <div key={cat} className="flex items-center justify-between cursor-pointer" onClick={() => { setCategoryFilter(cat); setPage(1) }}>
                  <div className="flex items-center gap-2"><CheckBox checked={categoryFilter===cat} onChange={() => {}} /><span className="text-sm text-gray-600">{cat}</span></div>
                  <span className="text-xs text-gray-400">{products.filter(p=>p.category?.name===cat).length}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <h3 className="font-bold text-gray-800 text-sm mb-4">Price range</h3>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center text-gray-600">0 RWF</div>
              <span className="text-gray-400 text-xs">—</span>
              <div className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center text-gray-600">{maxPrice.toLocaleString()} RWF</div>
            </div>
            <input type="range" min={0} max={500000} step={5000} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full mb-3 accent-orange-500" />
            <button onClick={() => { setAppliedMax(maxPrice); setPage(1) }} className="w-full py-2 rounded-xl text-white text-sm font-semibold" style={{backgroundColor:'#E8813A'}}>Apply</button>
          </div>

          {/* Customer Rating */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <h3 className="font-bold text-gray-800 text-sm mb-4">Customer rating</h3>
            <div className="space-y-2.5">
              {[5, 4, 3].map(r => (
                <div key={r} className="flex items-center gap-2 cursor-pointer" onClick={() => { setRatingFilter(ratingFilter===r?0:r); setPage(1) }}>
                  <CheckBox checked={ratingFilter===r} onChange={() => {}} />
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className="w-3.5 h-3.5" fill={s<=r?'#F97316':'#E5E7EB'} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">& up</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discount */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <h3 className="font-bold text-gray-800 text-sm mb-4">Discount</h3>
            <div className="space-y-2.5">
              {[10,20,30,50].map(d => (
                <div key={d} className="flex items-center gap-2 cursor-pointer" onClick={() => { setDiscountFilter(discountFilter===d?0:d); setPage(1) }}>
                  <CheckBox checked={discountFilter===d} onChange={() => {}} />
                  <span className="text-sm text-gray-600">{d}% or more</span>
                </div>
              ))}
            </div>
          </div>

          {/* Brand */}
          {brands.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
              <h3 className="font-bold text-gray-800 text-sm mb-4">Brand</h3>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => { setBrandFilter(''); setPage(1) }}>
                  <div className="flex items-center gap-2"><CheckBox checked={!brandFilter} onChange={() => {}} /><span className={`text-sm ${!brandFilter ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>All Brands</span></div>
                </div>
                {brands.map(brand => (
                  <div key={brand} className="flex items-center justify-between cursor-pointer" onClick={() => { setBrandFilter(brand); setPage(1) }}>
                    <div className="flex items-center gap-2"><CheckBox checked={brandFilter===brand} onChange={() => {}} /><span className="text-sm text-gray-600">{brand}</span></div>
                    <span className="text-xs text-gray-400">{products.filter(p=>p.brand?.name===brand).length}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Topbar */}
          <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
            <div>
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-800">{Math.min((page-1)*ITEMS_PER_PAGE+1, filtered.length)}–{Math.min(page*ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-semibold text-gray-800">{filtered.length}</span> products
              </p>
              {activeFilters.length > 0 && (
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs text-gray-500">Filters:</span>
                  {activeFilters.map(f => (
                    <span key={f.type} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-orange-200 bg-orange-50" style={{color:'#E8813A'}}>
                      {f.label}
                      <button onClick={() => { if(f.type==='category'){setCategoryFilter('');setPage(1)} if(f.type==='discount'){setDiscountFilter(0);setPage(1)} }} className="ml-0.5 hover:text-red-500 font-bold">×</button>
                    </span>
                  ))}
                  <button onClick={() => { setCategoryFilter(''); setDiscountFilter(0); setBrandFilter(''); setAppliedMax(500000); setMaxPrice(500000); setPage(1) }} className="text-xs font-medium hover:underline" style={{color:'#E8813A'}}>Clear all</button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1) }} className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none bg-white">
                <option value="popular">Most popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
              </select>
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode==='grid'?'text-white':'bg-white text-gray-400'}`} style={viewMode==='grid'?{backgroundColor:'#E8813A'}:{}}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode==='list'?'text-white':'bg-white text-gray-400'}`} style={viewMode==='list'?{backgroundColor:'#E8813A'}:{}}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          {paginated.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg font-medium">No products found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {paginated.map((product, idx) => {
                const discount = product.discountPrice ? Math.round(((product.price-product.discountPrice)/product.price)*100) : 0
                const wishlisted = wishlistItems.some(i => i.id === product.id)
                const bg = bgColors[idx % bgColors.length]
                return (
                  <Link key={product.id} to={`/product/${product.id}`} className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all overflow-hidden group flex flex-col">
                    <div className="relative aspect-square flex items-center justify-center overflow-hidden" style={{background: bg}}>
                      {discount > 0 && <span className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded z-10" style={{backgroundColor:'#EF4444'}}>-{discount}%</span>}
                      <button onClick={e => { e.preventDefault(); onToggleWishlist(product) }}
                        className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow z-10 opacity-0 group-hover:opacity-100 transition">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill={wishlisted?'#E8294A':'none'} stroke={wishlisted?'#E8294A':'#9CA3AF'} strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                        </svg>
                      </button>
                      <img src={product.imageUrl} alt={product.name} className="w-3/4 h-3/4 object-contain group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 leading-snug">{product.name}</p>
                      <Stars n={4} />
                      <div className="flex items-baseline gap-2 mt-2 mb-3">
                        <span className="text-base font-bold" style={{color:'#E8813A'}}>{(product.discountPrice||product.price).toLocaleString()} RWF</span>
                        {product.discountPrice && <span className="text-xs text-gray-400 line-through">{product.price.toLocaleString()} RWF</span>}
                      </div>
                      <button onClick={e => { e.preventDefault(); onAddToCart(product) }}
                        className="w-full py-2 text-xs font-semibold text-white rounded-xl mt-auto transition hover:opacity-90"
                        style={{backgroundColor:'#E8813A'}}>{t.addToCart}</button>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {paginated.map((product, idx) => {
                const discount = product.discountPrice ? Math.round(((product.price-product.discountPrice)/product.price)*100) : 0
                const wishlisted = wishlistItems.some(i => i.id === product.id)
                const bg = bgColors[idx % bgColors.length]
                return (
                  <Link key={product.id} to={`/product/${product.id}`} className="bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all flex gap-4 p-4 group">
                    <div className="w-24 h-24 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden relative" style={{background: bg}}>
                      {discount > 0 && <span className="absolute top-1 left-1 text-white text-xs font-bold px-1.5 py-0.5 rounded" style={{backgroundColor:'#EF4444', fontSize:10}}>-{discount}%</span>}
                      <img src={product.imageUrl} alt={product.name} className="w-4/5 h-4/5 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 mb-1">{product.name}</p>
                      <p className="text-xs text-gray-400 mb-2 line-clamp-1">{product.description}</p>
                      <Stars n={4} />
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-base font-bold" style={{color:'#E8813A'}}>{(product.discountPrice||product.price).toLocaleString()} RWF</span>
                        {product.discountPrice && <span className="text-sm text-gray-400 line-through">{product.price.toLocaleString()} RWF</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <button onClick={e => { e.preventDefault(); onToggleWishlist(product) }} className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill={wishlisted?'#E8294A':'none'} stroke={wishlisted?'#E8294A':'#9CA3AF'} strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                        </svg>
                      </button>
                      <button onClick={e => { e.preventDefault(); onAddToCart(product) }} className="px-4 py-2 text-xs font-semibold text-white rounded-xl" style={{backgroundColor:'#E8813A'}}>{t.addToCart}</button>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-orange-400 disabled:opacity-40">← Prev</button>
              {Array.from({length: Math.min(totalPages, 5)}, (_, i) => i+1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className="w-9 h-9 rounded-xl text-sm font-semibold border transition"
                  style={page===p ? {backgroundColor:'#E8813A', color:'white', borderColor:'#E8813A'} : {background:'white', color:'#374151', borderColor:'#E5E7EB'}}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-orange-400 disabled:opacity-40">Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
