import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-primary">
      <div className="relative">
        <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
        <div 
          className="relative h-screen bg-cover bg-center z-0"
          style={{ 
            backgroundImage: `url('https://i.imgur.com/kq7QXkY.jpeg')`,  
          }}
        >
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
              Pipo Berber
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Profesyonel berber hizmetleriyle kendinizi özel hissedin.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/appointments" 
                className="btn btn-primary text-lg px-8 py-3"
              >
                Randevu Al
              </Link>
              <Link 
                href="/guest/newAppointment" 
                className="btn btn-secondary text-lg px-8 py-3"
              >
                Giriş Yapmadan Hemen Randevu Al
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Neden Bizi Tercih Etmelisiniz?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
            Profesyonel ekibimiz ve kaliteli hizmet anlayışımızla sizlere en iyi deneyimi sunuyoruz.
          </p>
        </div>
      </section>
      
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Yeni bir tarza hazır mısınız?
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link href="/appointments" className="btn btn-primary text-lg px-8 py-3">
                  Randevu Al
                </Link>
              </div>
              <div className="inline-flex rounded-md shadow">
                <Link href="/guest/newAppointment" className="btn btn-secondary text-lg px-8 py-3">
                  Hemen Randevu Al
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Müşteri Yorumları
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
            Müşterilerimizin deneyimlerini okuyun
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-secondary p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-700"></div>
              <div className="ml-4">
                <h4 className="text-lg font-bold text-white">Ahmet Yılmaz</h4>
                <div className="flex text-accent">
                  <span>★★★★★</span>
                </div>
              </div>
            </div>
            <p className="text-gray-400">
              "Bugüne kadar aldığım en iyi saç kesimi! Berber tam olarak istediğimi anladı ve beklentilerimin üzerinde bir hizmet aldım."
            </p>
          </div>
          
          <div className="bg-secondary p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-700"></div>
              <div className="ml-4">
                <h4 className="text-lg font-bold text-white">Mehmet Kaya</h4>
                <div className="flex text-accent">
                  <span>★★★★★</span>
                </div>
              </div>
            </div>
            <p className="text-gray-400">
              "Sıcak havlu ile tıraş müthişti! Rahatlatıcı bir deneyim oldu ve cildim çok iyi hissetti. Kesinlikle tekrar geleceğim."
            </p>
          </div>
          
          <div className="bg-secondary p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-700"></div>
              <div className="ml-4">
                <h4 className="text-lg font-bold text-white">Emre Demir</h4>
                <div className="flex text-accent">
                  <span>★★★★★</span>
                </div>
              </div>
            </div>
            <p className="text-gray-400">
              "Ortam harika, personel çok dostça ve sakal düzeltmesi mükemmeldi. Artık sürekli geleceğim berberim burası."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}