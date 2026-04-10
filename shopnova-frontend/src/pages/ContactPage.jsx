const content = {
  title: 'Contact Us', subtitle: "We're here to help.",
  channels: [
    { icon: '📞', title: 'Phone', value: '0790 765 114', href: 'tel:0790765114', btn: 'Call Now' },
    { icon: '💬', title: 'WhatsApp', value: '+250 790 765 114', href: 'https://wa.me/250790765114', btn: 'Chat on WhatsApp' },
    { icon: '✉️', title: 'Email', value: 'pascalmuneza0@gmail.com', href: 'mailto:pascalmuneza0@gmail.com', btn: 'Send Email' },
    { icon: '📍', title: 'Location', value: 'Kicukiro – Kanombe, Kigali, Rwanda', href: 'https://maps.google.com/?q=Kanombe,Kigali,Rwanda', btn: 'View on Map' },
    ],
  hoursTitle: 'Business Hours', hoursSubtitle: 'We typically respond within a few hours.',
  hours: [{ day: 'Monday – Friday', hours: '8:00 AM – 6:00 PM' }, { day: 'Saturday', hours: '9:00 AM – 4:00 PM' }, { day: 'Sunday', hours: 'Closed' }],
  closed: 'Closed'
}

const ContactPage = () => {
  const c = content.en

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{c.title}</h1>
      <p className="text-gray-500 mb-10">{c.subtitle}</p>
      <div className="grid sm:grid-cols-2 gap-6">
        {c.channels.map((ch, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl">{ch.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-800">{ch.title}</h3>
                <p className="text-sm text-gray-600">{ch.value}</p>
              </div>
            </div>
            <a
              href={ch.href}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-orange-600 transition"
            >
              {ch.btn}
            </a>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{c.hoursTitle}</h2>
        <p className="text-sm text-gray-600 mb-4">{c.hoursSubtitle}</p>
        <div className="space-y-2">
          {c.hours.map((h, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-700">{h.day}</span>
              <span className="text-gray-600">{h.hours}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-red-500 font-medium mt-4">{c.closed}</p>
      </div>
    </div>
  )
}

export default ContactPage
