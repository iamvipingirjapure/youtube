import { Home, Compass, PlaySquare, Clock, ThumbsUp, User, Gamepad2, Music2, Film, Radio, Flame } from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isOverlay?: boolean;
}

export const Sidebar = ({ isOpen, onClose, isOverlay = false }: SidebarProps) => {
    const mainLinks = [
        { icon: Home, label: "Home", active: true },
        { icon: Compass, label: "Shorts" },
        { icon: PlaySquare, label: "Subscriptions" },
    ];

    const secondaryLinks = [
        { icon: User, label: "Your channel" },
        { icon: Clock, label: "History" },
        { icon: PlaySquare, label: "Your videos" },
        { icon: Clock, label: "Watch later" },
        { icon: ThumbsUp, label: "Liked videos" },
    ];

    const exploreLinks = [
        { icon: Flame, label: "Trending" },
        { icon: Music2, label: "Music" },
        { icon: Gamepad2, label: "Gaming" },
        { icon: Film, label: "Movies" },
        { icon: Radio, label: "Live" },
    ];

    const SidebarRow = ({ Icon, label, active = false }: { Icon: any, label: string, active?: boolean }) => (
        <div className={`flex items-center ${isOpen ? "gap-5 px-3" : isOverlay ? "gap-5 px-3" : "md:flex-col md:gap-1 md:px-1 md:justify-center gap-5 px-3"} py-2 rounded-lg cursor-pointer ${active ? "bg-gray-100 font-semibold hover:bg-gray-200" : "hover:bg-yt-hover"}`}>
            <Icon className={`w-6 h-6 ${active ? "fill-black" : ""}`} />
            <span className={`${isOpen ? "text-sm" : isOverlay ? "text-sm" : "text-sm md:text-[10px]"} truncate`}>{label}</span>
        </div>
    );

    return (
        <>
            {isOpen && (
                <div
                    className={`fixed inset-0 bg-black/50 z-30 ${isOverlay ? "block" : "md:hidden"}`}
                    onClick={onClose}
                />
            )}

            <div className={`
        fixed left-0 top-14 bottom-0 bg-white z-40 overflow-y-auto hover:overflow-y-scroll pb-4 scrollbar-thin transition-transform duration-200
        ${isOpen ? "translate-x-0 w-60 px-3" :
                    isOverlay
                        ? "-translate-x-full w-60 px-3"
                        : "-translate-x-full w-60 md:translate-x-0 md:w-[72px] md:px-1"
                }
      `}>
                <div className="space-y-1 mb-3 mt-2">
                    {mainLinks.map((link) => (
                        <SidebarRow key={link.label} Icon={link.icon} label={link.label} active={link.active} />
                    ))}
                </div>

                {(isOpen) && (
                    <>
                        <div className="h-[1px] bg-gray-200 my-3" />
                        <div className="mb-2">
                            <h3 className="px-3 py-2 text-base font-semibold flex items-center gap-2 hover:bg-yt-hover rounded-lg cursor-pointer">
                                You <span className="text-lg">›</span>
                            </h3>
                            {secondaryLinks.map((link) => (
                                <SidebarRow key={link.label} Icon={link.icon} label={link.label} />
                            ))}
                        </div>
                        <div className="h-[1px] bg-gray-200 my-3" />
                        <div className="mb-2">
                            <h3 className="px-3 py-2 text-base font-semibold">Explore</h3>
                            {exploreLinks.map((link) => (
                                <SidebarRow key={link.label} Icon={link.icon} label={link.label} />
                            ))}
                        </div>
                        <div className="h-[1px] bg-gray-200 my-3" />
                        <div className="px-3 py-2 text-xs text-gray-500 font-semibold">
                            <p className="mb-2">About Press Copyright Contact us Creators Advertise Developers</p>
                            <p className="mb-2">Terms Privacy Policy & Safety How YouTube works Test new features</p>
                            <p className="font-normal text-gray-400">© 2024 Google LLC</p>
                        </div>
                    </>
                )}

                {!isOpen && !isOverlay && (
                    <div className="hidden md:block space-y-1 mb-3 mt-2">
                        <SidebarRow Icon={User} label="You" />
                        <SidebarRow Icon={Clock} label="History" />
                    </div>
                )}
            </div>
        </>
    );
};
