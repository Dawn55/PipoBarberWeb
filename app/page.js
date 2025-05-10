import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-primary">
      <div className="relative">
        <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
        <div 
          className="relative h-screen bg-cover bg-center z-0"
          style={{ 
            backgroundImage: `url('https://i.imgur.com/KrQ9fuH.jpeg')`,  
          }}
        >
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
              Stylish Barber
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Experience premium grooming services with our expert barbers.
            </p>
            <div className="mt-10 flex justify-center">
              <Link href="/appointments" className="btn btn-primary text-lg px-8 py-3">
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Our Premium Services
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
            We offer a wide range of premium barbershop services.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-secondary rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 bg-gray-700">
              {/* Image placeholder 400x300 */}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Haircut</h3>
              <p className="text-gray-400">
                Professional haircut services tailored to your style preferences.
              </p>
              <div className="mt-4">
                <span className="text-accent text-lg font-bold">$30</span>
              </div>
            </div>
          </div>
          
          <div className="bg-secondary rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 bg-gray-700">
              {/* Image placeholder 400x300 */}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Beard Trim</h3>
              <p className="text-gray-400">
                Expert beard grooming and styling for the perfect look.
              </p>
              <div className="mt-4">
                <span className="text-accent text-lg font-bold">$20</span>
              </div>
            </div>
          </div>
          
          <div className="bg-secondary rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 bg-gray-700">
              {/* Image placeholder 400x300 */}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Hot Shave</h3>
              <p className="text-gray-400">
                Classic hot towel shave for the ultimate refreshing experience.
              </p>
              <div className="mt-4">
                <span className="text-accent text-lg font-bold">$25</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready for a fresh look?
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link href="/appointments" className="btn btn-primary text-lg px-8 py-3">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            What Our Clients Say
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
            Don't just take our word for it — hear from our satisfied customers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-secondary p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-700"></div>
              <div className="ml-4">
                <h4 className="text-lg font-bold text-white">John Doe</h4>
                <div className="flex text-accent">
                  <span>★★★★★</span>
                </div>
              </div>
            </div>
            <p className="text-gray-400">
              "Best haircut I've ever had! The stylist really understood what I wanted and exceeded my expectations."
            </p>
          </div>
          
          <div className="bg-secondary p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-700"></div>
              <div className="ml-4">
                <h4 className="text-lg font-bold text-white">Michael Brown</h4>
                <div className="flex text-accent">
                  <span>★★★★★</span>
                </div>
              </div>
            </div>
            <p className="text-gray-400">
              "Incredible service! The hot towel shave was relaxing and left my skin feeling amazing. Will definitely return."
            </p>
          </div>
          
          <div className="bg-secondary p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-700"></div>
              <div className="ml-4">
                <h4 className="text-lg font-bold text-white">Robert Wilson</h4>
                <div className="flex text-accent">
                  <span>★★★★★</span>
                </div>
              </div>
            </div>
            <p className="text-gray-400">
              "The atmosphere is great, staff is friendly, and the beard trim was perfect. This is now my go-to barbershop."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}