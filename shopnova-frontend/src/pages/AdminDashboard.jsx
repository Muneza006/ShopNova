import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8081'
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` } })

const EMPTY_FORM = { name:'', description:'', price:'', discountPrice:'', stockQuantity:'', sku:'', imageUrl:'', isFeatured:false, categoryId:'', brandId:'' }

const css = {
  bg:'#0D0F14', bg2:'#13161E', bg3:'#1A1E2A', bg4:'#222736',
  border:'rgba(255,255,255,0.07)', text:'#F0F2F8', muted:'#6B7280', dim:'#374151',
  orange:'#F97316', green:'#22C55E', red:'#EF4444', blue:'#3B82F6',
  purple:'#A855F7', yellow:'#EAB308'
}

const statusStyle = {
  PENDING:{bg:'rgba(234,179,8,0.12)',color:'#EAB308'},
  PENDING_PAYMENT:{bg:'rgba(249,115,22,0.12)',color:'#F97316'},
  PROCESSING:{bg:'rgba(59,130,246,0.12)',color:'#60A5FA'},
  SHIPPED:{bg:'rgba(168,85,247,0.12)',color:'#C084FC'},
  DELIVERED:{bg:'rgba(34,197,94,0.12)',color:'#4ADE80'},
  PAID:{bg:'rgba(34,197,94,0.12)',color:'#4ADE80'},
  PAYMENT_FAILED:{bg:'rgba(239,68,68,0.12)',color:'#F87171'},
  CANCELLED:{bg:'rgba(239,68,68,0.12)',color:'#F87171'},
}

export default function AdminDashboard({ user, onLogout }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [showCatModal, setShowCatModal] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [catForm, setCatForm] = useState({ name:'', nameRw:'', nameFr:'', description:'', imageUrl:'', parentId:'' })
  const [productSearch, setProductSearch] = useState('')
  const [productCatFilter, setProductCatFilter] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderStatusFilter, setOrderStatusFilter] = useState('')
  const [dismissAlert, setDismissAlert] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!user) return
    
    // Mock data for deployed version without backend
    const mockProducts = [
      { id: 1, name: 'Wireless Headphones', price: 89.99, discountPrice: 79.99, stockQuantity: 45, sku: 'WH001', isFeatured: true, imageUrl: '/headphones.jpg', description: 'High-quality wireless headphones with noise cancellation', category: { id: 1, name: 'Electronics' }, brand: { id: 1, name: 'Sony' } },
      { id: 2, name: 'Smart Watch', price: 199.99, stockQuantity: 23, sku: 'SW002', isFeatured: true, imageUrl: '/watch.jpg', description: 'Advanced smartwatch with health tracking features', category: { id: 1, name: 'Electronics' }, brand: { id: 2, name: 'Apple' } },
      { id: 3, name: 'Denim Jacket', price: 79.99, discountPrice: 59.99, stockQuantity: 67, sku: 'DJ003', isFeatured: false, imageUrl: '/jacket.jpg', description: 'Classic denim jacket for casual wear', category: { id: 2, name: 'Fashion' }, brand: { id: 3, name: 'Levi\'s' } },
      { id: 4, name: 'Coffee Maker', price: 149.99, stockQuantity: 12, sku: 'CM004', isFeatured: false, imageUrl: '/coffee.jpg', description: 'Automatic coffee maker with timer function', category: { id: 3, name: 'Home' }, brand: { id: 4, name: 'Keurig' } }
    ]
    
    const mockCategories = [
      { id: 1, name: 'Electronics', nameRw: 'Elektroniki', nameFr: 'Électronique', productCount: 156 },
      { id: 2, name: 'Fashion', nameRw: 'Imyenda', nameFr: 'Mode', productCount: 234 },
      { id: 3, name: 'Home', nameRw: 'Inzu', nameFr: 'Maison', productCount: 89 }
    ]
    
    const mockOrders = [
      { id: 1, orderNumber: 'ORD-001', customerName: 'John Doe', customerEmail: 'john@example.com', total: 289.98, status: 'PENDING', createdAt: '2026-04-10T10:30:00Z', items: 2 },
      { id: 2, orderNumber: 'ORD-002', customerName: 'Jane Smith', customerEmail: 'jane@example.com', total: 149.99, status: 'PROCESSING', createdAt: '2026-04-10T09:15:00Z', items: 1 },
      { id: 3, orderNumber: 'ORD-003', customerName: 'Bob Johnson', customerEmail: 'bob@example.com', total: 425.00, status: 'SHIPPED', createdAt: '2026-04-09T16:45:00Z', items: 3 }
    ]
    
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'CUSTOMER', createdAt: '2026-04-01T10:00:00Z', lastLogin: '2026-04-10T09:30:00Z' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'CUSTOMER', createdAt: '2026-04-02T14:20:00Z', lastLogin: '2026-04-09T15:45:00Z' },
      { id: 3, name: 'Admin User', email: 'admin@shopnova.com', role: 'SUPER_ADMIN', createdAt: '2026-03-15T08:00:00Z', lastLogin: '2026-04-10T08:15:00Z' }
    ]
    
    const safe = p => p.catch(() => ({ data: [] }))
    Promise.all([
      safe(axios.get(`${API}/api/admin/products`, auth())),
      safe(axios.get(`${API}/api/admin/categories`, auth())),
      safe(axios.get(`${API}/api/admin/orders`, auth())),
      safe(axios.get(`${API}/api/admin/users`, auth())),
    ]).then(([p, c, o, u]) => {
      setProducts(Array.isArray(p.data) && p.data.length > 0 ? p.data : mockProducts)
      setCategories(Array.isArray(c.data) && c.data.length > 0 ? c.data : mockCategories)
      setOrders(Array.isArray(o.data) && o.data.length > 0 ? o.data : mockOrders)
      setUsers(Array.isArray(u.data) && u.data.length > 0 ? u.data : mockUsers)
    })
  }, [user])

  const fetchAll = () => {
    // Mock data for deployed version without backend
    const mockProducts = [
      { id: 1, name: 'Wireless Headphones', price: 89.99, discountPrice: 79.99, stockQuantity: 45, sku: 'WH001', isFeatured: true, imageUrl: '/headphones.jpg', description: 'High-quality wireless headphones with noise cancellation', category: { id: 1, name: 'Electronics' }, brand: { id: 1, name: 'Sony' } },
      { id: 2, name: 'Smart Watch', price: 199.99, stockQuantity: 23, sku: 'SW002', isFeatured: true, imageUrl: '/watch.jpg', description: 'Advanced smartwatch with health tracking features', category: { id: 1, name: 'Electronics' }, brand: { id: 2, name: 'Apple' } },
      { id: 3, name: 'Denim Jacket', price: 79.99, discountPrice: 59.99, stockQuantity: 67, sku: 'DJ003', isFeatured: false, imageUrl: '/jacket.jpg', description: 'Classic denim jacket for casual wear', category: { id: 2, name: 'Fashion' }, brand: { id: 3, name: 'Levi\'s' } },
      { id: 4, name: 'Coffee Maker', price: 149.99, stockQuantity: 12, sku: 'CM004', isFeatured: false, imageUrl: '/coffee.jpg', description: 'Automatic coffee maker with timer function', category: { id: 3, name: 'Home' }, brand: { id: 4, name: 'Keurig' } }
    ]
    
    const mockCategories = [
      { id: 1, name: 'Electronics', nameRw: 'Elektroniki', nameFr: 'Électronique', productCount: 156 },
      { id: 2, name: 'Fashion', nameRw: 'Imyenda', nameFr: 'Mode', productCount: 234 },
      { id: 3, name: 'Home', nameRw: 'Inzu', nameFr: 'Maison', productCount: 89 }
    ]
    
    const mockOrders = [
      { id: 1, orderNumber: 'ORD-001', customerName: 'John Doe', customerEmail: 'john@example.com', total: 289.98, status: 'PENDING', createdAt: '2026-04-10T10:30:00Z', items: 2 },
      { id: 2, orderNumber: 'ORD-002', customerName: 'Jane Smith', customerEmail: 'jane@example.com', total: 149.99, status: 'PROCESSING', createdAt: '2026-04-10T09:15:00Z', items: 1 },
      { id: 3, orderNumber: 'ORD-003', customerName: 'Bob Johnson', customerEmail: 'bob@example.com', total: 425.00, status: 'SHIPPED', createdAt: '2026-04-09T16:45:00Z', items: 3 }
    ]
    
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'CUSTOMER', createdAt: '2026-04-01T10:00:00Z', lastLogin: '2026-04-10T09:30:00Z' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'CUSTOMER', createdAt: '2026-04-02T14:20:00Z', lastLogin: '2026-04-09T15:45:00Z' },
      { id: 3, name: 'Admin User', email: 'admin@shopnova.com', role: 'SUPER_ADMIN', createdAt: '2026-03-15T08:00:00Z', lastLogin: '2026-04-10T08:15:00Z' }
    ]
    
    const safe = p => p.catch(() => ({ data: [] }))
    Promise.all([
      safe(axios.get(`${API}/api/admin/products`, auth())),
      safe(axios.get(`${API}/api/admin/categories`, auth())),
      safe(axios.get(`${API}/api/admin/orders`, auth())),
      safe(axios.get(`${API}/api/admin/users`, auth())),
    ]).then(([p, c, o, u]) => {
      setProducts(Array.isArray(p.data) && p.data.length > 0 ? p.data : mockProducts)
      setCategories(Array.isArray(c.data) && c.data.length > 0 ? c.data : mockCategories)
      setOrders(Array.isArray(o.data) && o.data.length > 0 ? o.data : mockOrders)
      setUsers(Array.isArray(u.data) && u.data.length > 0 ? u.data : mockUsers)
    })
  }

  const openAdd = () => { setEditingProduct(null); setForm(EMPTY_FORM); setFormError(''); setShowModal(true) }
  const openEdit = p => { setEditingProduct(p); setForm({ name:p.name||'', description:p.description||'', price:p.price||'', discountPrice:p.discountPrice||'', stockQuantity:p.stockQuantity||'', sku:p.sku||'', imageUrl:p.imageUrl||'', isFeatured:p.isFeatured||false, categoryId:p.category?.id||'', brandId:p.brand?.id||'' }); setFormError(''); setShowModal(true) }

  const handleSave = async e => {
    e.preventDefault()
    if (!form.name || !form.price || !form.stockQuantity) { setFormError('Name, price and stock are required.'); return }
    setSaving(true); setFormError('')
    try {
      const payload = { ...form, price:parseFloat(form.price), discountPrice:form.discountPrice?parseFloat(form.discountPrice):null, stockQuantity:parseInt(form.stockQuantity), categoryId:form.categoryId||null, brandId:form.brandId||null }
      if (editingProduct) await axios.put(`${API}/api/admin/products/${editingProduct.id}`, payload, auth())
      else await axios.post(`${API}/api/admin/products`, payload, auth())
      setShowModal(false); fetchAll()
    } catch (err) { setFormError(err.response?.data?.error || err.response?.data?.cause || 'Failed to save.') }
    finally { setSaving(false) }
  }

  const handleDelete = async id => { if (!confirm('Delete?')) return; await axios.delete(`${API}/api/admin/products/${id}`, auth()); fetchAll() }
  const updateOrderStatus = async (id, status) => { await axios.put(`${API}/api/admin/orders/${id}/status`, { status }, auth()); fetchAll() }
  const toggleUserStatus = async id => { await axios.put(`${API}/api/admin/users/${id}/toggle-status`, {}, auth()); fetchAll() }
  const deleteUser = async id => { if (!confirm('Delete user?')) return; await axios.delete(`${API}/api/admin/users/${id}`, auth()); fetchAll() }
  const openAddCat = () => { setEditingCat(null); setCatForm({ name:'',nameRw:'',nameFr:'',description:'',imageUrl:'',parentId:'' }); setShowCatModal(true) }
  const openEditCat = cat => { setEditingCat(cat); setCatForm({ name:cat.name,nameRw:cat.nameRw||'',nameFr:cat.nameFr||'',description:cat.description||'',imageUrl:cat.imageUrl||'',parentId:cat.parentId||'' }); setShowCatModal(true) }
  const handleSaveCat = async e => {
    e.preventDefault()
    try {
      const payload = { ...catForm, parentId:catForm.parentId||null }
      if (editingCat) await axios.put(`${API}/api/admin/categories/${editingCat.id}`, payload, auth())
      else await axios.post(`${API}/api/admin/categories`, payload, auth())
      setShowCatModal(false); fetchAll()
    } catch (err) { alert(err.response?.data?.message || 'Failed') }
  }
  const handleDeleteCat = async id => { if (!confirm('Delete category?')) return; await axios.delete(`${API}/api/admin/categories/${id}`, auth()); fetchAll() }

  if (!user) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:css.bg, color:css.text }}>
      <div style={{ textAlign:'center' }}>
        <p style={{ fontSize:48, marginBottom:12 }}>🔒</p>
        <p style={{ marginBottom:16, color:css.muted }}>Admin access required.</p>
        <Link to="/" style={{ padding:'10px 24px', background:css.orange, color:'white', borderRadius:10, textDecoration:'none', fontWeight:600 }}>Go Home</Link>
      </div>
    </div>
  )

  const today = new Date().toDateString()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const todaySales = orders.filter(o => new Date(o.createdAt).toDateString() === today && o.status !== 'CANCELLED' && o.status !== 'PAYMENT_FAILED').reduce((s,o) => s + parseFloat(o.totalAmount||0), 0)
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today).length
  const totalRevenue = orders.filter(o => o.status !== 'CANCELLED' && o.status !== 'PAYMENT_FAILED').reduce((s,o) => s + parseFloat(o.totalAmount||0), 0)
  const lowStock = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5)
  const outOfStock = products.filter(p => p.stockQuantity === 0).length
  const initials = `${user?.firstName?.[0]||''}${user?.lastName?.[0]||''}`

  const navSections = [
    { label:'OVERVIEW', items:[{id:'overview',icon:'▦',label:'Dashboard'},{id:'analytics',icon:'📈',label:'Analytics'}] },
    { label:'STORE', items:[{id:'products',icon:'📦',label:'Products',count:products.length},{id:'orders',icon:'🛒',label:'Orders',count:orders.filter(o=>o.status==='PENDING').length,countColor:css.orange},{id:'categories',icon:'🏷️',label:'Categories'}] },
    { label:'PEOPLE', items:[{id:'users',icon:'👥',label:'Users'}] },
    { label:'SYSTEM', items:[{id:'notifications',icon:'🔔',label:'Notifications',count:orders.filter(o=>o.status==='PENDING'||o.status==='PENDING_PAYMENT').length,countColor:css.red},{id:'settings',icon:'⚙️',label:'Settings'}] },
  ]

  const S = ({ children, style }) => <span style={style}>{children}</span>

  return (
    <div style={{ display:'flex', height:'100vh', background:css.bg, color:css.text, fontFamily:"'DM Sans',sans-serif", overflow:'hidden' }}>
      {/* Sidebar */}
      <aside style={{ width:220, background:css.bg2, borderRight:`1px solid ${css.border}`, display:'flex', flexDirection:'column', flexShrink:0, overflow:'hidden' }}>
        <div style={{ padding:'20px 16px', borderBottom:`1px solid ${css.border}`, display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:34, height:34, background:css.orange, borderRadius:8, display:'grid', placeItems:'center', fontWeight:800, fontSize:16, color:'white', flexShrink:0 }}>S</div>
          <div>
            <p style={{ fontWeight:800, fontSize:16, lineHeight:1 }}>Shop<span style={{ color:css.orange }}>Nova</span></p>
            <p style={{ fontSize:10, color:css.muted, marginTop:2 }}>Admin Panel</p>
          </div>
        </div>
        <nav style={{ flex:1, overflowY:'auto', padding:'12px 8px' }}>
          {navSections.map(section => (
            <div key={section.label} style={{ marginBottom:8 }}>
              <p style={{ fontSize:9, fontWeight:700, color:css.dim, letterSpacing:'1.5px', textTransform:'uppercase', padding:'8px 10px 4px' }}>{section.label}</p>
              {section.items.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 12px', borderRadius:8, border:'none', cursor:'pointer', fontSize:13, fontWeight:500, marginBottom:2, background:activeTab===item.id?'rgba(249,115,22,0.12)':'transparent', color:activeTab===item.id?css.orange:css.muted, textAlign:'left' }}>
                  <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
                  <span style={{ flex:1 }}>{item.label}</span>
                  {item.count > 0 && <span style={{ background:item.countColor||css.orange, color:'white', fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:10 }}>{item.count}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div style={{ padding:'12px 8px', borderTop:`1px solid ${css.border}` }}>
          <button onClick={onLogout} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 12px', borderRadius:8, border:'none', cursor:'pointer', fontSize:13, fontWeight:500, background:'transparent', color:css.red, textAlign:'left' }}>
            <span>🚪</span><span>Logout</span>
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', marginTop:4 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${css.orange},#FCD34D)`, display:'grid', placeItems:'center', fontWeight:700, fontSize:12, color:'white', flexShrink:0 }}>{initials}</div>
            <div style={{ minWidth:0 }}>
              <p style={{ fontSize:12, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.firstName} {user?.lastName}</p>
              <p style={{ fontSize:10, color:css.orange }}>{user?.role?.replace('_',' ')}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Topbar */}
        <header style={{ background:css.bg2, borderBottom:`1px solid ${css.border}`, padding:'0 24px', display:'flex', alignItems:'center', gap:16, height:58, flexShrink:0 }}>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:16, fontWeight:700 }}>{activeTab === 'overview' ? 'Dashboard' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</p>
            <p style={{ fontSize:11, color:css.muted }}>Admin / {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</p>
          </div>
          <div style={{ position:'relative' }}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search orders, products, users..."
              style={{ padding:'7px 14px 7px 32px', background:'rgba(255,255,255,0.05)', border:`1px solid ${css.border}`, borderRadius:8, color:css.text, fontSize:12, outline:'none', width:220 }}/>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:css.muted, fontSize:12 }}>🔍</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ background:'rgba(255,255,255,0.05)', border:`1px solid ${css.border}`, borderRadius:8, padding:'6px 12px', fontSize:12, color:css.muted }}>
              📅 {new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
            </div>
            <div style={{ position:'relative' }}>
              <button style={{ width:34, height:34, borderRadius:8, background:'rgba(255,255,255,0.05)', border:`1px solid ${css.border}`, display:'grid', placeItems:'center', cursor:'pointer', color:css.muted, position:'relative' }}>
                🔔
                {orders.filter(o=>o.status==='PENDING'||o.status==='PENDING_PAYMENT').length > 0 && (
                  <span style={{ position:'absolute', top:-4, right:-4, width:15, height:15, background:css.red, color:'white', fontSize:9, fontWeight:700, borderRadius:'50%', display:'grid', placeItems:'center' }}>{orders.filter(o=>o.status==='PENDING'||o.status==='PENDING_PAYMENT').length}</span>
                )}
              </button>
            </div>
            <button style={{ width:34, height:34, borderRadius:8, background:'rgba(255,255,255,0.05)', border:`1px solid ${css.border}`, display:'grid', placeItems:'center', cursor:'pointer', color:css.muted }}>⚙️</button>
            <div style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${css.orange},#FCD34D)`, display:'grid', placeItems:'center', fontWeight:700, fontSize:13, color:'white', cursor:'pointer' }}>{initials}</div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex:1, overflowY:'auto', padding:24 }}>

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {/* Greeting + actions */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                <div>
                  <h1 style={{ fontSize:28, fontWeight:800, fontFamily:"'Syne',sans-serif" }}>{greeting}, <span style={{ color:css.orange }}>{user?.firstName}</span> 👋</h1>
                  <p style={{ color:css.muted, fontSize:13, marginTop:4 }}>Here's what's happening with your store today, {new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}.</p>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button style={{ padding:'9px 16px', background:'rgba(255,255,255,0.06)', border:`1px solid ${css.border}`, borderRadius:10, color:css.muted, fontSize:13, fontWeight:500, cursor:'pointer' }}>📊 Export Report</button>
                  <button onClick={openAdd} style={{ padding:'9px 16px', background:css.orange, border:'none', borderRadius:10, color:'white', fontSize:13, fontWeight:600, cursor:'pointer' }}>+ Add Product</button>
                </div>
              </div>

              {/* Low stock alert */}
              {!dismissAlert && (lowStock.length + outOfStock) > 0 && (
                <div style={{ background:'rgba(234,179,8,0.08)', border:'1px solid rgba(234,179,8,0.2)', borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <p style={{ fontSize:13, color:css.yellow }}>⚠️ <strong>{lowStock.length + outOfStock} products</strong> are running low on stock. <button onClick={() => setActiveTab('products')} style={{ background:'none', border:'none', color:css.orange, cursor:'pointer', fontSize:13, fontWeight:600 }}>Review now →</button></p>
                  <button onClick={() => setDismissAlert(true)} style={{ background:'rgba(234,179,8,0.15)', border:'1px solid rgba(234,179,8,0.3)', borderRadius:6, padding:'4px 10px', color:css.yellow, fontSize:11, fontWeight:600, cursor:'pointer' }}>Dismiss</button>
                </div>
              )}

              {/* KPI Cards */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
                {[
                  { label:"Today's Revenue", value:`${todaySales >= 1000000 ? (todaySales/1000000).toFixed(1)+'M' : todaySales >= 1000 ? (todaySales/1000).toFixed(1)+'K' : todaySales.toLocaleString()} RWF`, sub:`vs ${(todaySales*0.82).toFixed(0)} yesterday`, change:'+18.4%', up:true, accent:css.orange, icon:'💰' },
                  { label:'Orders Today', value:todayOrders, sub:`${orders.filter(o=>o.status==='PENDING').length} pending · ${orders.filter(o=>o.status==='PROCESSING').length} processing`, change:`+${todayOrders}`, up:true, accent:css.blue, icon:'🛒' },
                  { label:'Total Customers', value:users.length, sub:`+${users.filter(u=>new Date(u.createdAt).toDateString()===today).length} new today`, change:`+${users.filter(u=>new Date(u.createdAt).toDateString()===today).length}`, up:true, accent:css.purple, icon:'👥' },
                  { label:'Low Stock Alerts', value:lowStock.length+outOfStock, sub:'Action required', change:'Critical', up:false, accent:lowStock.length+outOfStock>0?css.red:css.green, icon:'⚠️' },
                ].map((s,i) => (
                  <div key={i} style={{ background:css.bg2, border:`1px solid ${css.border}`, borderRadius:16, padding:20, position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:s.accent }}/>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                      <div style={{ width:40, height:40, borderRadius:10, background:`${s.accent}20`, display:'grid', placeItems:'center', fontSize:20 }}>{s.icon}</div>
                      <span style={{ fontSize:11, fontWeight:700, color:s.up?css.green:css.red, background:s.up?'rgba(34,197,94,0.12)':'rgba(239,68,68,0.12)', padding:'3px 8px', borderRadius:6 }}>{s.up?'↑':''} {s.change}</span>
                    </div>
                    <p style={{ fontSize:26, fontWeight:800, fontFamily:"'Syne',sans-serif", lineHeight:1 }}>{s.value}</p>
                    <p style={{ fontSize:12, color:css.muted, marginTop:6 }}>{s.label}</p>
                    <p style={{ fontSize:11, color:css.dim, marginTop:2 }}>{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:16 }}>
                {/* Revenue Line Chart */}
                <div style={{ background:css.bg2, border:`1px solid ${css.border}`, borderRadius:16, padding:20 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                    <div>
                      <p style={{ fontWeight:700, fontSize:15 }}>📈 Revenue — Last 7 Days</p>
                      <p style={{ fontSize:12, color:css.muted, marginTop:2 }}>{totalRevenue >= 1000000 ? (totalRevenue/1000000).toFixed(1)+'M' : (totalRevenue/1000).toFixed(1)+'K'} RWF total</p>
                    </div>
                    <div style={{ display:'flex', gap:6 }}>
                      {['Week','Month'].map(l => <button key={l} style={{ padding:'5px 12px', borderRadius:6, border:`1px solid ${css.border}`, background:l==='Week'?css.orange:'transparent', color:l==='Week'?'white':css.muted, fontSize:11, fontWeight:600, cursor:'pointer' }}>{l}</button>)}
                    </div>
                  </div>
                  {(() => {
                    const days = Array.from({length:7},(_,i) => { const d=new Date(); d.setDate(d.getDate()-(6-i)); return { label:d.toLocaleDateString('en-US',{month:'short',day:'numeric'}), total:orders.filter(o=>new Date(o.createdAt).toDateString()===d.toDateString()&&o.status!=='CANCELLED'&&o.status!=='PAYMENT_FAILED').reduce((s,o)=>s+parseFloat(o.totalAmount||0),0) } })
                    const max = Math.max(...days.map(d=>d.total), 1)
                    const w = 100/7
                    const pts = days.map((d,i) => `${i*w+w/2},${100-(d.total/max)*85}`).join(' ')
                    return (
                      <div>
                        <svg viewBox="0 0 100 100" style={{ width:'100%', height:160 }} preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={css.orange} stopOpacity="0.4"/>
                              <stop offset="100%" stopColor={css.orange} stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                          <polygon points={`0,100 ${pts} 100,100`} fill="url(#rg)"/>
                          <polyline points={pts} fill="none" stroke={css.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
                          {days.map((d,i) => <circle key={i} cx={i*w+w/2} cy={100-(d.total/max)*85} r="1.8" fill={css.orange} vectorEffect="non-scaling-stroke"/>)}
                        </svg>
                        <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
                          {days.map((d,i) => <span key={i} style={{ fontSize:10, color:css.muted }}>{d.label}</span>)}
                        </div>
                      </div>
                    )
                  })()}
                </div>

                {/* Sales by Category */}
                <div style={{ background:css.bg2, border:`1px solid ${css.border}`, borderRadius:16, padding:20 }}>
                  <p style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>🍩 Sales by Category</p>
                  {(() => {
                    const catSales = {}
                    orders.filter(o=>o.status!=='CANCELLED'&&o.status!=='PAYMENT_FAILED').forEach(o => {
                      o.items?.forEach(item => { const cat=item.product?.category?.name||'Other'; catSales[cat]=(catSales[cat]||0)+parseFloat(item.price||0)*item.quantity })
                    })
                    const total = Object.values(catSales).reduce((s,v)=>s+v,0)||1
                    const colors = [css.orange,'#3B82F6','#A855F7','#22C55E','#EAB308']
                    const entries = Object.entries(catSales).sort((a,b)=>b[1]-a[1]).slice(0,5)
                    if (entries.length === 0) {
                      const defaults = [['Electronics',35],['Fashion',25],['Beauty',20],['Sports',12],['Other',8]]
                      return (
                        <div>
                          <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}>
                            <svg viewBox="0 0 100 100" width="120" height="120">
                              {defaults.reduce((acc,[,pct],i) => {
                                const start = acc.offset; const end = start + pct/100*360
                                const r=40; const cx=50; const cy=50
                                const x1=cx+r*Math.cos((start-90)*Math.PI/180); const y1=cy+r*Math.sin((start-90)*Math.PI/180)
                                const x2=cx+r*Math.cos((end-90)*Math.PI/180); const y2=cy+r*Math.sin((end-90)*Math.PI/180)
                                const large=pct>50?1:0
                                acc.paths.push(<path key={i} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`} fill={colors[i%colors.length]} opacity="0.85"/>)
                                acc.offset = end; return acc
                              },{paths:[],offset:0}).paths}
                              <circle cx="50" cy="50" r="25" fill={css.bg2}/>
                              <text x="50" y="54" textAnchor="middle" fill={css.text} fontSize="10" fontWeight="700">35%</text>
                            </svg>
                          </div>
                          {defaults.map(([cat,pct],i) => (
                            <div key={cat} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                <div style={{ width:8, height:8, borderRadius:'50%', background:colors[i%colors.length] }}/>
                                <span style={{ fontSize:12 }}>{cat}</span>
                              </div>
                              <span style={{ fontSize:12, fontWeight:600, color:colors[i%colors.length] }}>{pct}%</span>
                            </div>
                          ))}
                        </div>
                      )
                    }
                    return (
                      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                        {entries.map(([cat,val],i) => {
                          const pct = Math.round((val/total)*100)
                          return (
                            <div key={cat}>
                              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                                <span style={{ fontSize:12 }}>{cat}</span>
                                <span style={{ fontSize:12, fontWeight:600, color:colors[i%colors.length] }}>{pct}%</span>
                              </div>
                              <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:3 }}>
                                <div style={{ height:'100%', width:`${pct}%`, background:colors[i%colors.length], borderRadius:3 }}/>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>
              </div>

              {/* Bottom stats + recent orders */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                {[
                  { label:'Total Revenue', value:`${(totalRevenue/1000000).toFixed(2)}M RWF`, change:'+24.1%', up:true },
                  { label:'Total Orders', value:orders.length, change:`+${todayOrders} today`, up:true },
                  { label:'Avg Order Value', value:`${orders.length ? Math.round(totalRevenue/orders.length).toLocaleString() : 0} RWF`, change:'this month', up:true },
                ].map((s,i) => (
                  <div key={i} style={{ background:css.bg2, border:`1px solid ${css.border}`, borderRadius:12, padding:16 }}>
                    <p style={{ fontSize:11, color:css.muted, marginBottom:8 }}>{s.label}</p>
                    <p style={{ fontSize:22, fontWeight:800 }}>{s.value}</p>
                    <p style={{ fontSize:11, color:s.up?css.green:css.red, marginTop:4 }}>{s.up?'↑':''} {s.change}</p>
                  </div>
                ))}
              </div>

              {/* Recent orders table */}
              <div style={{ background:css.bg2, border:`1px solid ${css.border}`, borderRadius:16, overflow:'hidden' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px', borderBottom:`1px solid ${css.border}` }}>
                  <span style={{ fontWeight:700, fontSize:15 }}>Recent Orders</span>
                  <button onClick={() => setActiveTab('orders')} style={{ color:css.orange, background:'none', border:'none', cursor:'pointer', fontSize:13 }}>View All →</button>
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr style={{ background:css.bg3 }}>{['Order #','Customer','Date','Status','Total'].map(h => <th key={h} style={{ textAlign:'left', padding:'10px 20px', fontSize:10, fontWeight:700, color:css.muted, textTransform:'uppercase', letterSpacing:'1px' }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {orders.slice(0,6).map(o => (
                      <tr key={o.id} style={{ borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
                        <td style={{ padding:'12px 20px', fontFamily:'monospace', fontSize:12, color:css.muted }}>{o.orderNumber}</td>
                        <td style={{ padding:'12px 20px', fontSize:13 }}>{o.customerName}</td>
                        <td style={{ padding:'12px 20px', fontSize:12, color:css.muted }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding:'12px 20px' }}><span style={{ background:statusStyle[o.status]?.bg||'rgba(120,120,120,0.12)', color:statusStyle[o.status]?.color||'#888', padding:'3px 10px', borderRadius:6, fontSize:11, fontWeight:600 }}>{o.status}</span></td>
                        <td style={{ padding:'12px 20px', fontWeight:700, color:css.orange }}>{parseFloat(o.totalAmount).toLocaleString()} RWF</td>
                      </tr>
                    ))}
                    {orders.length === 0 && <tr><td colSpan={5} style={{ padding:'32px 20px', textAlign:'center', color:css.muted }}>No orders yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {activeTab === 'products' && (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                <div>
                  <h2 style={{ fontSize:22, fontWeight:700, fontFamily:"'Syne',sans-serif" }}>Products</h2>
                  <p style={{ color:css.muted, fontSize:13, marginTop:4 }}>Manage your product inventory</p>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    style={{ padding:'8px 12px', border:`1px solid ${css.border}`, borderRadius:8, background:css.bg2, color:css.text, fontSize:13, width:200 }}
                  />
                  <button onClick={openAdd} style={{ padding:'9px 16px', background:css.orange, border:'none', borderRadius:10, color:'white', fontSize:13, fontWeight:600, cursor:'pointer' }}>+ Add Product</button>
                </div>
              </div>

              <div style={{ background:css.bg2, border:`1px solid ${css.border}`, borderRadius:16, overflow:'hidden' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:css.bg3 }}>
                      {['Image','Name','Category','Price','Stock','SKU','Status','Actions'].map(h => (
                        <th key={h} style={{ textAlign:'left', padding:'12px 20px', fontSize:11, fontWeight:700, color:css.muted, textTransform:'uppercase', letterSpacing:'1px' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(p => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()))
                      .filter(p => !productCatFilter || p.category?.name === productCatFilter)
                      .map(p => (
                        <tr 
                          key={p.id} 
                          style={{ borderBottom:`1px solid rgba(255,255,255,0.04)`, cursor:'pointer' }}
                          onClick={() => openEdit(p)}
                          onMouseEnter={e => e.currentTarget.style.background = css.bg3}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding:'12px 20px' }}>
                            <div style={{ width:40, height:40, borderRadius:8, background:css.bg3, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
                              {p.category?.name === 'Electronics' ? ' phones' : p.category?.name === 'Fashion' ? ' shirt' : ' home'}
                            </div>
                          </td>
                          <td style={{ padding:'12px 20px' }}>
                            <div>
                              <p style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>{p.name}</p>
                              <p style={{ fontSize:11, color:css.muted }}>{p.sku}</p>
                            </div>
                          </td>
                          <td style={{ padding:'12px 20px', fontSize:13 }}>{p.category?.name || 'N/A'}</td>
                          <td style={{ padding:'12px 20px', fontSize:13, fontWeight:600 }}>
                            ${p.price}
                            {p.discountPrice && (
                              <span style={{ fontSize:11, color:css.muted, textDecoration:'line-through', marginLeft:4 }}>
                                ${p.discountPrice}
                              </span>
                            )}
                          </td>
                          <td style={{ padding:'12px 20px' }}>
                            <span style={{ 
                              fontSize:12, 
                              fontWeight:600, 
                              color: p.stockQuantity === 0 ? css.red : p.stockQuantity <= 5 ? css.yellow : css.green,
                              background: p.stockQuantity === 0 ? 'rgba(239,68,68,0.12)' : p.stockQuantity <= 5 ? 'rgba(234,179,8,0.12)' : 'rgba(34,197,94,0.12)',
                              padding:'2px 8px', borderRadius:4
                            }}>
                              {p.stockQuantity} units
                            </span>
                          </td>
                          <td style={{ padding:'12px 20px', fontFamily:'monospace', fontSize:12, color:css.muted }}>{p.sku}</td>
                          <td style={{ padding:'12px 20px' }}>
                            <span style={{ 
                              fontSize:11, 
                              fontWeight:600, 
                              color: p.isFeatured ? css.orange : css.muted,
                              background: p.isFeatured ? 'rgba(249,115,22,0.12)' : 'rgba(107,114,128,0.12)',
                              padding:'2px 8px', borderRadius:4
                            }}>
                              {p.isFeatured ? 'Featured' : 'Standard'}
                            </span>
                          </td>
                          <td style={{ padding:'12px 20px' }}>
                            <div style={{ display:'flex', gap:6 }}>
                              <button 
                                onClick={e => { e.stopPropagation(); openEdit(p) }}
                                style={{ padding:'4px 8px', background:css.blue, border:'none', borderRadius:4, color:'white', fontSize:11, cursor:'pointer' }}
                              >
                                Edit
                              </button>
                              <button 
                                onClick={e => { e.stopPropagation(); handleDelete(p.id) }}
                                style={{ padding:'4px 8px', background:css.red, border:'none', borderRadius:4, color:'white', fontSize:11, cursor:'pointer' }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ padding:'32px 20px', textAlign:'center', color:css.muted }}>
                          No products yet. <button onClick={openAdd} style={{ background:'none', border:'none', color:css.orange, cursor:'pointer', fontSize:13, fontWeight:600 }}>Add your first product</button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                <div>
                  <h2 style={{ fontSize:22, fontWeight:700, fontFamily:"'Syne',sans-serif" }}>Orders</h2>
                  <p style={{ color:css.muted, fontSize:13, marginTop:4 }}>Manage customer orders</p>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <select 
                    value={orderStatusFilter}
                    onChange={e => setOrderStatusFilter(e.target.value)}
                    style={{ padding:'8px 12px', border:`1px solid ${css.border}`, borderRadius:8, background:css.bg2, color:css.text, fontSize:13 }}
                  >
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div style={{ background:css.bg2, border:`1px solid ${css.border}`, borderRadius:16, overflow:'hidden' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:css.bg3 }}>
                      {['Order #','Customer','Date','Status','Total','Items','Actions'].map(h => (
                        <th key={h} style={{ textAlign:'left', padding:'12px 20px', fontSize:11, fontWeight:700, color:css.muted, textTransform:'uppercase', letterSpacing:'1px' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(o => !orderStatusFilter || o.status === orderStatusFilter)
                      .map(o => (
                        <tr key={o.id} style={{ borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
                          <td style={{ padding:'12px 20px', fontFamily:'monospace', fontSize:12, color:css.muted }}>{o.orderNumber}</td>
                          <td style={{ padding:'12px 20px', fontSize:13 }}>
                            <div>
                              <p style={{ fontWeight:600, marginBottom:2 }}>{o.customerName}</p>
                              <p style={{ fontSize:11, color:css.muted }}>{o.customerEmail}</p>
                            </div>
                          </td>
                          <td style={{ padding:'12px 20px', fontSize:13, color:css.muted }}>
                            {new Date(o.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding:'12px 20px' }}>
                            <span style={{ 
                              fontSize:11, 
                              fontWeight:600, 
                              ...statusStyle[o.status] || { background:'rgba(107,114,128,0.12)', color:css.muted },
                              padding:'2px 8px', borderRadius:4
                            }}>
                              {o.status}
                            </span>
                          </td>
                          <td style={{ padding:'12px 20px', fontSize:13, fontWeight:600 }}>${o.total}</td>
                          <td style={{ padding:'12px 20px', fontSize:13 }}>{o.items}</td>
                          <td style={{ padding:'12px 20px' }}>
                            <select 
                              value={o.status}
                              onChange={e => updateOrderStatus(o.id, e.target.value)}
                              style={{ padding:'4px 8px', border:`1px solid ${css.border}`, borderRadius:4, background:css.bg2, color:css.text, fontSize:11, cursor:'pointer' }}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="PROCESSING">Processing</option>
                              <option value="SHIPPED">Shipped</option>
                              <option value="DELIVERED">Delivered</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ padding:'32px 20px', textAlign:'center', color:css.muted }}>
                          No orders yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Product Modal */}
        {showModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, padding:20 }}>
            <div style={{ background:css.bg, border:`1px solid ${css.border}`, borderRadius:16, width:'100%', maxWidth:500, maxHeight:'90vh', overflowY:'auto' }}>
              <div style={{ padding:24, borderBottom:`1px solid ${css.border}` }}>
                <h3 style={{ fontSize:18, fontWeight:700, margin:0 }}>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
              </div>
              <form onSubmit={handleSave} style={{ padding:24 }}>
                {formError && (
                  <div style={{ background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:12, marginBottom:16 }}>
                    <p style={{ color:css.red, fontSize:13, margin:0 }}>{formError}</p>
                  </div>
                )}
                <div style={{ display:'grid', gap:16 }}>
                  <div>
                    <label style={{ display:'block', fontSize:12, fontWeight:600, color:css.text, marginBottom:6 }}>Product Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({...form, name:e.target.value})}
                      style={{ width:'100%', padding:'10px 12px', border:`1px solid ${css.border}`, borderRadius:8, background:css.bg2, color:css.text, fontSize:14 }}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:12, fontWeight:600, color:css.text, marginBottom:6 }}>Description</label>
                    <textarea
                      value={form.description}
                      onChange={e => setForm({...form, description:e.target.value})}
                      style={{ width:'100%', padding:'10px 12px', border:`1px solid ${css.border}`, borderRadius:8, background:css.bg2, color:css.text, fontSize:14, minHeight:80, resize:'vertical' }}
                      placeholder="Enter product description"
                    />
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                    <div>
                      <label style={{ display:'block', fontSize:12, fontWeight:600, color:css.text, marginBottom:6 }}>Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={form.price}
                        onChange={e => setForm({...form, price:e.target.value})}
                        style={{ width:'100%', padding:'10px 12px', border:`1px solid ${css.border}`, borderRadius:8, background:css.bg2, color:css.text, fontSize:14 }}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:12, fontWeight:600, color:css.text, marginBottom:6 }}>Discount Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={form.discountPrice}
                        onChange={e => setForm({...form, discountPrice:e.target.value})}
                        style={{ width:'100%', padding:'10px 12px', border:`1px solid ${css.border}`, borderRadius:8, background:css.bg2, color:css.text, fontSize:14 }}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                    <div>
                      <label style={{ display:'block', fontSize:12, fontWeight:600, color:css.text, marginBottom:6 }}>Stock Quantity *</label>
                      <input
                        type="number"
                        value={form.stockQuantity}
                        onChange={e => setForm({...form, stockQuantity:e.target.value})}
                        style={{ width:'100%', padding:'10px 12px', border:`1px solid ${css.border}`, borderRadius:8, background:css.bg2, color:css.text, fontSize:14 }}
                        placeholder="0"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:12, fontWeight:600, color:css.text, marginBottom:6 }}>SKU</label>
                      <input
                        type="text"
                        value={form.sku}
                        onChange={e => setForm({...form, sku:e.target.value})}
                        style={{ width:'100%', padding:'10px 12px', border:`1px solid ${css.border}`, borderRadius:8, background:css.bg2, color:css.text, fontSize:14 }}
                        placeholder="SKU-001"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:12, fontWeight:600, color:css.text, marginBottom:6 }}>Image URL</label>
                    <input
                      type="url"
                      value={form.imageUrl}
                      onChange={e => setForm({...form, imageUrl:e.target.value})}
                      style={{ width:'100%', padding:'10px 12px', border:`1px solid ${css.border}`, borderRadius:8, background:css.bg2, color:css.text, fontSize:14 }}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={e => setForm({...form, isFeatured:e.target.checked})}
                      style={{ width:16, height:16 }}
                    />
                    <label style={{ fontSize:13, color:css.text, cursor:'pointer' }}>Featured Product</label>
                  </div>
                </div>
                <div style={{ display:'flex', gap:12, marginTop:24 }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{ flex:1, padding:'10px 16px', border:`1px solid ${css.border}`, borderRadius:8, background:css.bg2, color:css.text, fontSize:14, fontWeight:600, cursor:'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{ flex:1, padding:'10px 16px', border:'none', borderRadius:8, background:css.orange, color:'white', fontSize:14, fontWeight:600, cursor:'pointer', opacity: saving ? 0.6 : 1 }}
                  >
                    {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  )
}
