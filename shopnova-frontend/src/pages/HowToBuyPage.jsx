const HowToBuyPage = () => (
  <div className="max-w-3xl mx-auto px-4 py-16">
    <h1 className="text-3xl font-bold text-gray-800 mb-8">How To Buy</h1>
    <div className="space-y-6">
      {[
        { step: '01', title: 'Browse Products', desc: 'Browse our wide selection of products by category or use the search bar.' },
        { step: '02', title: 'Add to Cart', desc: 'Click "Add to Cart" on any product you want to purchase.' },
        { step: '03', title: 'Checkout', desc: 'Go to your cart and click checkout. Fill in your delivery address.' },
        { step: '04', title: 'Pay', desc: 'Choose Cash on Delivery or MTN Mobile Money. For MoMo, you\'ll get a push notification on your phone.' },
        { step: '05', title: 'Receive', desc: 'Your order will be delivered to your address within 1-3 business days.' },
      ].map((s, i) => (
        <div key={i} className="flex gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <span className="text-2xl font-extrabold text-orange-500 flex-shrink-0">{s.step}</span>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">{s.title}</h3>
            <p className="text-sm text-gray-500">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default HowToBuyPage
