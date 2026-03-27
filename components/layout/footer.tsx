import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-black text-gray-300 py-16 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="text-4xl leading-none font-black font-brand text-white mb-4 block">
                            Caesura
                        </Link>
                        <p className="text-gray-400 text-sm">
                            Where stories come alive and voices are heard.
                        </p>
                    </div>

                    {/* Discover */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Discover</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/discover" className="hover:text-orange-500 transition-colors">All Stories</Link></li>
                            <li><Link href="/genres" className="hover:text-orange-500 transition-colors">Genres</Link></li>
                            <li><Link href="/trending" className="hover:text-orange-500 transition-colors">Trending</Link></li>
                            <li><Link href="/new" className="hover:text-orange-500 transition-colors">New Releases</Link></li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Community</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/write" className="hover:text-orange-500 transition-colors">Start Writing</Link></li>
                            <li><Link href="/community" className="hover:text-orange-500 transition-colors">Forums</Link></li>
                            <li><Link href="/contests" className="hover:text-orange-500 transition-colors">Contests</Link></li>
                            <li><Link href="/clubs" className="hover:text-orange-500 transition-colors">Reading Clubs</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
                            <li><Link href="/faq" className="hover:text-orange-500 transition-colors">FAQ</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Social & Copyright */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-sm text-gray-500">
                            © 2024 Caesura. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link href="#" className="hover:text-orange-500 transition-colors">Twitter</Link>
                            <Link href="#" className="hover:text-orange-500 transition-colors">Instagram</Link>
                            <Link href="#" className="hover:text-orange-500 transition-colors">Facebook</Link>
                            <Link href="#" className="hover:text-orange-500 transition-colors">Discord</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
