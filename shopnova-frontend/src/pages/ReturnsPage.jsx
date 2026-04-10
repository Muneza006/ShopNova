import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

const content = {
  en: {
    title: 'Returns & Refunds Policy', subtitle: "We want you to be 100% satisfied.", updated: 'Last updated: January 2026',
    sections: [
      { icon: '📦', title: 'What Can Be Returned?', items: ['Items must be returned within 7 days of delivery.', 'Products must be unused and in original packaging.', 'All original tags and accessories must be included.'] },
      { icon: '🚫', title: 'What Cannot Be Returned?', items: ['Items that have been used or damaged by the customer.', 'Perishable goods and personal care products.', 'Items returned after 7 days of delivery.'] },
      { icon: '💸', title: 'How Refunds Work', items: ['Approved refunds are processed within 3–5 business days.', 'Refunds are sent to your original MTN Mobile Money number.', 'Shipping fees (500 RWF) are non-refundable.'] },
      { icon: '🔄', title: 'Exchanges', items: ['We offer free exchanges for defective or wrong items.', 'Contact us within 7 days of receiving your order.', 'If the item is out of stock, a full refund will be issued.'] },
    ],
    stepsTitle: 'How to Start a Return', step: 'Step',
    steps: [
      { number: '01', title: 'Contact Us', desc: 'Reach out via WhatsApp or email within 7 days. Include your order number and reason.' },
      { number: '02', title: 'Get Approval', desc: 'Our team will review and send confirmation within 24 hours.' },
      { number: '03', title: 'Ship the Item', desc: 'Pack securely and drop off at the agreed location.' },
      { number: '04', title: 'Receive Refund', desc: 'Refund sent to your MoMo within 3–5 business days.' },
    ],
    helpTitle: 'Need Help?', helpSubtitle: 'Contact us directly:', whatsapp: 'WhatsApp Us', email: 'Email Us', back: '← Back to Shopping',
  },
  rw: {
    title: 'Politiki yo Gusubiza no Gusubizwa Amafaranga', subtitle: 'Dushaka ko unezerwa 100%.', updated: 'Ivugururwa rya nyuma: Mutarama 2026',
    sections: [
      { icon: '📦', title: 'Ni Ibihe Bicuruzwa Bishobora Gusubizwa?', items: ['Ibicuruzwa bigomba gusubizwa mu minsi 7.', 'Ibicuruzwa bigomba kuba bitarakoreshwa.', 'Ibirango byose bigomba gukomeza.'] },
      { icon: '🚫', title: 'Ni Ibihe Bicuruzwa Bitisubizwa?', items: ['Ibicuruzwa byarakoreshejwe cyangwa byangiritse.', 'Ibicuruzwa byangirira vuba.', 'Ibicuruzwa byasubijwe nyuma y\'iminsi 7.'] },
      { icon: '💸', title: 'Uburyo Gusubizwa Amafaranga Bigenda', items: ['Gusubizwa amafaranga bikorwa mu minsi 3–5.', 'Amafaranga asubizwa kuri MTN Mobile Money yawe.', 'Amafaranga y\'ubutumwa (500 RWF) ntasubizwa.'] },
      { icon: '🔄', title: 'Guhindura Ibicuruzwa', items: ['Dutanga guhindura ubuntu ibicuruzwa bifite inenge.', 'Twandikire mu minsi 7 nyuma yo kubona itumwa.', 'Niba igicuruzwa kidahari, amafaranga yose azasubizwa.'] },
    ],
    stepsTitle: 'Uburyo bwo Gutangira Gusubiza', step: 'Intambwe',
    steps: [
      { number: '01', title: 'Twandikire', desc: 'Twandikire kuri WhatsApp cyangwa imeyili mu minsi 7.' },
      { number: '02', title: 'Bona Uruhushya', desc: 'Itsinda ryacu rizasuzuma ubusabe bwawe mu masaa 24.' },
      { number: '03', title: 'Ohereza Igicuruzwa', desc: 'Pakira neza igicuruzwa ucikie ahantu twumvikanye.' },
      { number: '04', title: 'Subizwa Amafaranga', desc: 'Amafaranga azatumwa kuri MoMo yawe mu minsi 3–5.' },
    ],
    helpTitle: 'Ukeneye Inkunga?', helpSubtitle: 'Twandikire directly:', whatsapp: 'Twandikire kuri WhatsApp', email: 'Twandikire kuri Imeyili', back: '← Subira Guterura',
  },
  fr: {
    title: 'Politique de Retour & Remboursement', subtitle: 'Nous voulons que vous soyez 100% satisfait.', updated: 'Dernière mise à jour : Janvier 2026',
    sections: [
      { icon: '📦', title: 'Que Peut-on Retourner ?', items: ['Les articles doivent être retournés dans les 7 jours.', 'Les produits doivent être non utilisés.', 'Toutes les étiquettes doivent être incluses.'] },
      { icon: '🚫', title: 'Que Ne Peut-on Pas Retourner ?', items: ['Articles utilisés ou endommagés.', 'Produits périssables.', 'Articles retournés après 7 jours.'] },
      { icon: '💸', title: 'Comment Fonctionnent les Remboursements', items: ['Remboursements traités dans 3 à 5 jours ouvrables.', 'Remboursements envoyés sur votre MTN Mobile Money.', 'Les frais de livraison (500 RWF) ne sont pas remboursables.'] },
      { icon: '🔄', title: 'Échanges', items: ['Échanges gratuits pour articles défectueux.', 'Contactez-nous dans les 7 jours.', 'Si rupture de stock, remboursement complet.'] },
    ],
    stepsTitle: 'Comment Initier un Retour', step: 'Étape',
    steps: [
      { number: '01', title: 'Contactez-nous', desc: 'Contactez-nous via WhatsApp ou e-mail dans les 7 jours.' },
      { number: '02', title: "Obtenir l'Approbation", desc: 'Notre équipe vous répondra dans les 24 heures.' },
      { number: '03', title: "Expédier l'Article", desc: "Emballez l'article et déposez-le à l'endroit convenu." },
      { number: '04', title: 'Recevoir le Remboursement', desc: 'Remboursement envoyé sur votre MoMo dans 3 à 5 jours.' },
    ],
    helpTitle: "Besoin d'Aide ?", helpSubtitle: 'Contactez-nous directement :', whatsapp: 'WhatsApp', email: 'Envoyer un E-mail', back: '← Retour aux Achats',
  },
}

const ReturnsPage = () => {
  const { lang } = useLang()
  const c = content[lang]
  const [formData, setFormData] = useState({
    orderNumber: '',
    email: '',
    reason: '',
    description: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Return request:', formData)
    // Handle return submission
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-4xl">🔄</span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-3 mb-2">{c.title}</h1>
          <p className="text-gray-500 text-sm">{c.subtitle}</p>
          <p className="text-xs text-gray-400 mt-2">{c.updated}</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {c.sections.map((sec, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4"><span className="text-2xl">{sec.icon}</span><h3 className="text-base font-bold text-gray-800">{sec.title}</h3></div>
              <ul className="space-y-2">
                {sec.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-500">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#E8813A' }} />{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">{c.stepsTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {c.steps.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">{c.step} {step.number}</span>
                <h3 className="text-base font-bold text-gray-800 mt-1 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-gray-800 mb-2">{c.helpTitle}</h3>
          <p className="text-sm text-gray-500 mb-4">{c.helpSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="https://wa.me/250790765114" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-green-500 hover:bg-green-600 transition">{c.whatsapp}</a>
            <a href="mailto:pascalmuneza0@gmail.com" className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition" style={{ backgroundColor: '#E8813A' }}>{c.email}</a>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Returns & Refunds</h1>
          <p className="text-gray-600 mb-8">We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return it within 30 days.</p>
          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your order number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Return</label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select a reason</option>
                  <option value="wrong-item">Wrong Item</option>
                  <option value="damaged">Damaged Item</option>
                  <option value="not-as-described">Not as Described</option>
                  <option value="changed-mind">Changed Mind</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Please describe the issue..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition"
              >
                Submit Return Request
              </button>
            </form>
          </div>
        </div>
        <div className="text-center"><Link to="/" className="text-sm text-orange-500 hover:text-orange-600 font-medium transition">{c.back}</Link></div>
      </div>
    </div>
  )
}

export default ReturnsPage
