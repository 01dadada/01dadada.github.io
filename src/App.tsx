import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import AmpPage from "./pages/AmpPage";
import ContactPage from "./pages/ContactPage";
import DownloadsPage from "./pages/DownloadsPage";
import HomePage from "./pages/HomePage";
import MicPage from "./pages/MicPage";

export default function App() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* 背景装饰 */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -left-1/4 top-0 h-[800px] w-[800px] rounded-full bg-brand-500/10 blur-3xl animate-pulse" />
                <div className="absolute -right-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10">
                <Header />
                <main className="pb-16">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/mic" element={<MicPage />} />
                        <Route path="/amp" element={<AmpPage />} />
                        <Route path="/downloads" element={<DownloadsPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

