import { useLang } from '../context/LanguageContext'

const content = {
  en: {
    title: 'Terms of Service', updated: 'Last updated: January 2026',
    sections: [
      { title: '1. Acceptance of Terms', body: 'By using ShopNova, you agree to these terms. If you do not agree, please do not use our services.' },
      { title: '2. Use of Service', body: 'You may use ShopNova for lawful purposes only. You must not misuse our platform or attempt to access it using unauthorized methods.' },
      { title: '3. Account Responsibility', body: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.' },
      { title: '4. Orders & Payments', body: 'All orders are subject to availability. We accept MTN Mobile Money and Cash on Delivery. Prices are in RWF.' },
      { title: '5. Returns & Refunds', body: 'Items may be returned within 7 days of delivery if unused and in original packaging. See our Returns Policy for details.' },
      { title: '6. Privacy', body: 'Your personal data is handled according to our Privacy Policy. We do not sell your data to third parties.' },
      { title: '7. Changes to Terms', body: 'We may update these terms at any time. Continued use of ShopNova after changes constitutes acceptance.' },
      { title: '8. Contact', body: 'For questions about these terms, contact us at pascalmuneza0@gmail.com.' },
    ],
  },
  rw: {
    title: "Amategeko y'Serivisi", updated: 'Ivugururwa rya nyuma: Mutarama 2026',
    sections: [
      { title: '1. Kwemera Amategeko', body: 'Ukoresha ShopNova, wemera aya mategeko. Niba utayemera, ntukoreshe serivisi zacu.' },
      { title: '2. Gukoresha Serivisi', body: 'Ushobora gukoresha ShopNova gusa mu bikorwa byemewe n\'amategeko.' },
      { title: '3. Inshingano z\'Konti', body: 'Uri inshingano yo kubika ibanga rya konti yawe no gutwara ibikorwa byose bikorwa muri konti yawe.' },
      { title: '4. Amatumwa n\'Ubwishyu', body: 'Amatumwa yose ateganwa n\'ibikurikiraho. Twakira MTN Mobile Money na Cash on Delivery. Ibiciro biri mu RWF.' },
      { title: '5. Gusubiza no Gusubizwa Amafaranga', body: 'Ibicuruzwa bishobora gusubizwa mu minsi 7 nyuma yo kubihabwa niba bitarakoreshwa.' },
      { title: '6. Ibanga', body: 'Amakuru yawe bwite akurikiranwa hakurikijwe Politiki yacu y\'Ibanga.' },
      { title: '7. Guhindura Amategeko', body: 'Dushobora guhindura aya mategeko igihe icyo aricyo cyose.' },
      { title: '8. Twandikire', body: 'Ku bibazo bijyanye n\'aya mategeko, twandikire kuri pascalmuneza0@gmail.com.' },
    ],
  },
  fr: {
    title: "Conditions d'Utilisation", updated: 'Dernière mise à jour : Janvier 2026',
    sections: [
      { title: '1. Acceptation des Conditions', body: "En utilisant ShopNova, vous acceptez ces conditions. Si vous n'êtes pas d'accord, veuillez ne pas utiliser nos services." },
      { title: '2. Utilisation du Service', body: 'Vous ne pouvez utiliser ShopNova qu\'à des fins légales.' },
      { title: '3. Responsabilité du Compte', body: 'Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités sous votre compte.' },
      { title: '4. Commandes et Paiements', body: 'Toutes les commandes sont soumises à disponibilité. Nous acceptons MTN Mobile Money et le paiement à la livraison.' },
      { title: '5. Retours et Remboursements', body: 'Les articles peuvent être retournés dans les 7 jours suivant la livraison s\'ils sont non utilisés.' },
      { title: '6. Confidentialité', body: 'Vos données personnelles sont traitées conformément à notre Politique de Confidentialité.' },
      { title: '7. Modifications des Conditions', body: 'Nous pouvons mettre à jour ces conditions à tout moment.' },
      { title: '8. Contact', body: 'Pour toute question, contactez-nous à pascalmuneza0@gmail.com.' },
    ],
  },
}

const TermsPage = () => {
  const [activeSection, setActiveSection] = useState('general')
  const { lang } = useLang()
  const c = content[lang]

  const sections = {
    general: {
      title: 'General Terms',
      content: [
        c.sections[0].body,
        c.sections[1].body,
        c.sections[2].body,
        c.sections[3].body,
      ]
    },
    privacy: {
      title: 'Privacy Policy',
      content: [
        c.sections[4].body,
        c.sections[5].body,
        c.sections[6].body,
        c.sections[7].body,
      ]
    },
    shipping: {
      title: 'Shipping & Delivery',
      content: [
        'We deliver across all provinces in Rwanda.',
        'Standard delivery takes 3-5 business days.',
        'Free delivery for orders over RWF 20,000.',
        'Tracking information will be provided once your order ships.'
      ]
    },
    returns: {
      title: 'Returns & Refunds',
      content: [
        'You can return items within 30 days of purchase.',
        'Items must be unused and in original packaging.',
        'Refunds will be processed within 5-7 business days.',
        'Shipping costs for returns are the responsibility of the customer unless the item is defective.'
      ]
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{c.title}</h1>
      
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 p-4">
            {Object.keys(sections).map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`pb-2 border-b-2 font-medium text-sm transition ${
                  activeSection === section
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {sections[section].title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="prose max-w-none">
          {sections[activeSection].content.map((item, index) => (
            <p key={index} className="text-gray-600 mb-4">
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TermsPage
