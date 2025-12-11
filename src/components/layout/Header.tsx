import { Menu, Search, Mic, Video, Bell, Play } from "lucide-react";
import { useState } from "react";
import { ProfileMenu } from "./ProfileMenu";

import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../redux/store";
import { searchVideos } from "../../redux/searchSlice";

interface HeaderProps {
    toggleSidebar: () => void;
}

export const Header = ({ toggleSidebar }: HeaderProps) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch<AppDispatch>();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            dispatch(searchVideos(searchQuery));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 h-14 bg-white flex items-center justify-between px-4 z-50">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-yt-hover rounded-full"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <a href="/" className="flex items-center gap-1 cursor-pointer">
                    <div className="w-8 h-6 bg-red-600 rounded-[6px] flex items-center justify-center text-white text-[2px] font-bold">
                        <Play size={10} fill="white" />
                    </div>
                    <span className="text-xl font-bold tracking-tighter letter-spacing-[-1px] text-black">YouTube</span>
                    <span className="text-[10px] text-gray-500 mb-4">IN</span>
                </a>
            </div>

            <div className="hidden md:flex items-center gap-4 flex-1 max-w-[720px] ml-16">
                <div className="flex flex-1 items-center">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full px-4 py-2 border border-yt-border rounded-l-full focus:border-blue-500 outline-none shadow-inner"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={handleSearch}
                        className="px-6 py-2 bg-gray-100 border border-l-0 border-yt-border rounded-r-full hover:bg-gray-200"
                    >
                        <Search className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
                <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full">
                    <Mic className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-2 relative">
                <div className="md:hidden">
                    <button className="p-2 hover:bg-yt-hover rounded-full">
                        <Search className="w-6 h-6" />
                    </button>
                </div>
                <button className="hidden sm:block p-2 hover:bg-yt-hover rounded-full">
                    <Video className="w-6 h-6" />
                </button>
                <button className="p-2 hover:bg-yt-hover rounded-full relative">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] px-1 rounded-full">
                        9+
                    </span>
                </button>

                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="p-2 hover:bg-yt-hover rounded-full"
                    >
                        <div className="w-8 h-8 bg-purple-600 rounded-full text-white flex items-center justify-center">
                            V
                        </div>
                    </button>
                    {isProfileOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsProfileOpen(false)}
                            />
                            <ProfileMenu />
                        </>
                    )}
                </div>
            </div>
        </div >
    );
};
