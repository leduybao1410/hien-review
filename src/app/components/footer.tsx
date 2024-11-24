import { FiFacebook, FiInstagram, FiLinkedin, FiTwitter } from "react-icons/fi";

{/* Footer */ }
export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h4 className="text-xl font-bold mb-4">Về Hiển Review</h4>
                        <p className="text-gray-400">Chia sẻ những đánh giá chân thực và chuyên sâu về các sản phẩm công nghệ như laptop và tai nghe.</p>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold mb-4">Liên kết nhanh</h4>
                        <div className="space-y-2">
                            <a href="/about" className="block text-gray-400 hover:text-white transition-colors">Về Hiển Review</a>
                            {/* <a href="#" className="block text-gray-400 hover:text-white transition-colors">Contact</a> */}
                            {/* <a href="#" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a> */}
                        </div>
                    </div>
                    {/* <div>
                        <h4 className="text-xl font-bold mb-4">Categories</h4>
                        <div className="space-y-2">
                            <a href="#" className="block text-gray-400 hover:text-white transition-colors">Technology</a>
                            <a href="#" className="block text-gray-400 hover:text-white transition-colors">Lifestyle</a>
                            <a href="#" className="block text-gray-400 hover:text-white transition-colors">Health</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold mb-4">Follow Us</h4>
                        <div className="flex space-x-4">
                            <FiInstagram className="text-2xl text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            <FiTwitter className="text-2xl text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            <FiLinkedin className="text-2xl text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            <FiFacebook className="text-2xl text-gray-400 hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div> */}
                </div>
                <div className="border-t border-gray-700 pt-8 text-center">
                    <p className="text-gray-400">&copy; 2024 Hiển Review. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
