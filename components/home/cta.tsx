export default function Cta() {
    return (
        <section className="bg-linear-to-r from-black via-black/95 to-black py-16 md:py-24 px-6 md:px-12">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-black font-brand text-white mb-6">
                    Ready to Start Your Journey?
                </h2>

                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    Join millions of readers and writers discovering stories that move them. Your next favorite book or your breakthrough as a writer is waiting.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-10 py-4 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-colors duration-300 text-lg shadow-lg hover:shadow-xl">
                        Start Reading Now
                    </button>
                    <button className="px-10 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300 text-lg">
                        Start Writing
                    </button>
                </div>

                <p className="text-gray-400 mt-8">
                    It only takes 30 seconds to create your account. No payment required.
                </p>
            </div>
        </section>
    );
}
