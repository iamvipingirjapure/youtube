import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { Home } from "./pages/Home";
import { VideoDetails } from "./pages/VideoDetails";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const isVideoPage = location.pathname.startsWith('/watch');

  useEffect(() => {
    if (isVideoPage) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isVideoPage, location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden w-full min-h-dvh">
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden pt-14">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isOverlay={isVideoPage}
        />
        <main
          className={`
            flex-1 w-full h-full overflow-y-auto overflow-x-hidden transition-all duration-200 
            ${isVideoPage ? '' : (isSidebarOpen ? 'md:ml-60' : 'md:ml-[72px]')}
          `}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<VideoDetails />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
