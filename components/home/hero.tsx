export default function Hero() {
    return (
        <section 
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat pt-20"
            style={{
                backgroundImage: "url('/images/hero-bg.avif')"
            }}
        >
            {/* Enhanced gradient overlay for superior text readability */}
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/70 to-black/40"></div>
            
            {/* Additional dark vignette for center text area */}
            <div 
                className="absolute inset-0" 
                style={{
                    background: "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.6) 100%)"
                }}
            ></div>
            
            {/* Content */}
            <div className="relative z-10 max-w-4xl px-6 md:px-12 text-center">
                <h1 className="text-5xl md:text-7xl font-black font-brand text-white mb-6 leading-tight drop-shadow-lg">
                    Stories Worth Reading
                </h1>
                
                <p className="text-xl md:text-2xl text-white mb-8 font-light max-w-2xl mx-auto drop-shadow">
                    Discover millions of original stories, connect with passionate writers, and join a community that celebrates creativity.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-full hover:bg-black transition-colors duration-300 shadow-lg hover:shadow-xl">
                        Start Reading
                    </button>
                    <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-lg hover:shadow-xl">
                        Start Writing
                    </button>
                </div>
            </div>
        </section>
    );
}