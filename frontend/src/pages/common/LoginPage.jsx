import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LoginPage() {
    const handleGoogleLogin = () => {
        window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-950 via-zinc-900 to-stone-800">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-screen">

                    {/* Login Card First On Mobile */}
                    <div className="order-1 lg:order-2 flex justify-center">
                        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">

                            <div className="text-center">
                                <img
                                    src="/logo.png"
                                    alt="Gayatri Granites"
                                    className="h-20 mx-auto mb-4"
                                />

                                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                                    Welcome Back
                                </h2>

                                <p className="text-gray-300 mt-3 text-sm sm:text-base">
                                    Sign in to continue exploring our granite collection
                                </p>

                                <button
                                    onClick={handleGoogleLogin}
                                    className="w-full mt-6 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl flex items-center justify-center gap-3 transition"
                                >
                                    <FcGoogle size={24} />
                                    Continue with Google
                                </button>

                                <p className="mt-6 text-xs sm:text-sm text-gray-400">
                                    By continuing, you agree to our{" "}
                                    <Link to="/terms">
                                    <span className="text-white">
                                        Terms & Conditions
                                    </span>
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className="order-2 lg:order-1 text-center lg:text-left text-white">

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            Transform Your Space With
                            <span className="text-amber-400">
                                {" "}Premium Granites
                            </span>
                        </h1>

                        <p className="text-gray-300 mt-5 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
                            Browse premium granite collections, compare products,
                            visualize designs, and place orders seamlessly.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            <Feature text="Premium Granite Collection" />
                            <Feature text="AI Room Visualizer" />
                            <Feature text="Instant Quotes" />
                            <Feature text="Secure Ordering" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function Feature({ text }) {
    return (
        <div className="bg-white/10 border border-white/10 rounded-xl p-4 text-center text-white">
            {text}
        </div>
    );
}