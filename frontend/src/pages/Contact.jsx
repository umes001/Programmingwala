import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/public/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message })
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setSubmitted(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 }
        });
      } else {
        alert(data.message || 'Failed to send query');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('Network error. Failed to submit.');
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="px-4 py-12 mx-auto space-y-12 max-w-7xl md:px-8">

      {/* Title */}
      <div className="max-w-2xl mx-auto space-y-4 text-center">
        <span className="px-3 py-1 text-xs font-bold tracking-widest uppercase border rounded-full text-brandCoral bg-brandCoral/10 border-brandCoral/20">GET IN TOUCH</span>
        <h1 className="text-4xl font-bold font-quicksand text-slate-800">Contact Our Admissions Desk</h1>
        <p className="text-sm text-slate-500">
          Have questions about tuition schemes, admission deadlines, or bus timings? Send us a query message.
        </p>
      </div>

      <div className="grid items-start grid-cols-1 gap-8 lg:grid-cols-12">

        {/* Left Column: Info */}
        <div className="space-y-6 lg:col-span-5">
          <div className="p-6 space-y-6 bg-white border shadow-sm border-orange-50 rounded-3xl md:p-8">
            <h3 className="text-xl font-bold font-quicksand text-slate-800">School Contacts</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brandCoral shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold font-quicksand text-slate-800">Address</h4>
                  <p className="font-semibold leading-relaxed text-slate-600">
                    C-60 R.K tower 3rd Floor Rdc ghaziabad 
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-brandSky shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold font-quicksand text-slate-800">Phone Numbers</h4>
                  <p className="font-semibold leading-relaxed text-slate-600">
                    +91 7503962162
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-brandYellow-dark shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold font-quicksand text-slate-800">Email Address</h4>
                  <p className="font-semibold leading-relaxed text-slate-600">
              hr@appletreeinfotech.in
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-orange-50" />

            {/* WhatsApp Integration */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold font-quicksand text-slate-800">Instant Chat Support</h4>
              <p className="text-xs leading-relaxed text-slate-500">
                Connect directly with our admissions counselor on WhatsApp for immediate feedback on fee models.
              </p>
              <a
                href="https://wa.me/917503962162?text=Hello%20Appletree%20Infotech%20Admissions%20Team%2C%20I%20have%20an%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full py-3 space-x-2 text-xs font-bold text-white transition-all shadow-md font-quicksand bg-emerald-500 hover:bg-emerald-600 rounded-xl"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>CHAT ON WHATSAPP</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Query Form */}
        <div className="p-6 bg-white border shadow-sm lg:col-span-7 border-orange-50 rounded-3xl md:p-8">
          <h3 className="pb-4 text-xl font-bold border-b font-quicksand text-slate-800 border-orange-50">
            Send a Query Message
          </h3>

          {submitted ? (
            <div className="py-12 space-y-4 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-brandMint/10 text-brandMint">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold font-quicksand text-slate-800">Query Sent Successfully!</h4>
              <p className="max-w-sm mx-auto text-xs leading-relaxed text-slate-500">
                Thank you for contacting us. Our administration desk will review your query and write back to you at your email within 24 business hours.
              </p>
              <button
                onClick={resetForm}
                className="font-quicksand font-bold text-xs bg-brandCoral hover:bg-brandCoral-dark text-white px-6 py-2.5 rounded-full transition-all shadow"
              >
                SEND ANOTHER INQUIRY
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Jenkins"
                    className="w-full p-3 text-xs transition-colors border border-orange-100 outline-none bg-slate-50 focus:border-brandCoral rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full p-3 text-xs transition-colors border border-orange-100 outline-none bg-slate-50 focus:border-brandCoral rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Phone Number (Optional)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full p-3 text-xs transition-colors border border-orange-100 outline-none bg-slate-50 focus:border-brandCoral rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Fee installment query"
                    className="w-full p-3 text-xs transition-colors border border-orange-100 outline-none bg-slate-50 focus:border-brandCoral rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Your Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your query here..."
                  className="w-full p-3 text-xs transition-colors border border-orange-100 outline-none resize-none bg-slate-50 focus:border-brandCoral rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full font-quicksand font-bold text-sm bg-brandCoral hover:bg-brandCoral-dark text-white py-3.5 rounded-xl shadow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending query...' : 'SUBMIT CONTACT QUERY'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Styled Google Maps Integration Box */}
      <section className="space-y-4 overflow-hidden bg-white border shadow-sm border-orange-50 rounded-3xl">
        <div className="flex flex-col items-start justify-between gap-2 p-5 border-b border-orange-50 sm:flex-row sm:items-center">
          <div>
            <h4 className="text-base font-bold font-quicksand text-slate-800">Campus Location Map</h4>
            <p className="text-[10px] text-slate-500">Find directions to our preschool gates.</p>
          </div>
          <a
            href="https://www.google.com/maps/place/Apple+Tree+infotech+-IT+Training+and+Web+Development+center/@28.6765208,77.441029,600m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3973a326f1fa1fe3:0x67667b8e9e018621!8m2!3d28.6765161!4d77.4436039!16s%2Fg%2F11v0x4cn6b?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="font-quicksand font-bold text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full border border-slate-200 transition-colors"
          >
            OPEN IN GOOGLE MAPS
          </a>
        </div>

        {/* Map Simulator */}
        <div className="relative flex items-center justify-center h-64 overflow-hidden bg-slate-100">
          {/* Stylized background lines mimicking roads */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="absolute w-full h-2 pointer-events-none bg-brandCoral/30 rotate-12 top-20" />
          <div className="absolute w-full h-2 -rotate-45 pointer-events-none bg-brandSky/30 top-36" />
          <div className="absolute w-2 h-full pointer-events-none bg-brandYellow/30 left-1/3" />

          {/* Location Pin */}
          <div className="relative z-10 flex flex-col items-center animate-bounce">
            <div className="flex items-center justify-center w-12 h-12 text-white border-2 border-white rounded-full shadow-lg bg-brandCoral">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="bg-white px-3 py-1.5 rounded-lg border border-orange-100 shadow text-[10px] font-bold text-slate-800 mt-2 font-quicksand whitespace-nowrap">
             Appletree Infotech coaching center
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
