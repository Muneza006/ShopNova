const PrivacyPage = () => (
  <div className="max-w-3xl mx-auto px-4 py-16">
    <h1 className="text-3xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
    <p className="text-gray-400 text-sm mb-8">Last updated: January 2026</p>
    {[
      { title: 'Information We Collect', body: 'We collect your name, email, phone number, and delivery address when you create an account or place an order.' },
      { title: 'How We Use Your Information', body: 'We use your information to process orders, send delivery updates, and improve our services.' },
      { title: 'Data Security', body: 'Your data is encrypted and stored securely. We never sell your personal information to third parties.' },
      { title: 'Cookies', body: 'We use cookies to keep you logged in and remember your cart. You can disable cookies in your browser settings.' },
      { title: 'Contact', body: 'For privacy concerns, contact us at pascalmuneza0@gmail.com.' },
    ].map((s, i) => (
      <div key={i} className="mb-6">
        <h2 className="font-bold text-gray-800 mb-2">{s.title}</h2>
        <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
      </div>
    ))}
  </div>
)

export default PrivacyPage
