import {
    LogOut, Settings, HelpCircle, MessageSquare,
    Moon, Languages, Shield, MapPin, Keyboard,
    CreditCard, LayoutGrid, SwitchCamera
} from "lucide-react";
import { GoogleIcon } from "../../assets/GoogleIcon";

export const ProfileMenu = () => {
    const menuGroups = [
        [
            { icon: GoogleIcon, label: "Google Account" },
            { icon: SwitchCamera, label: "Switch account", hasArrow: true },
            { icon: LogOut, label: "Sign out" },
        ],
        [
            { icon: LayoutGrid, label: "YouTube Studio" },
            { icon: CreditCard, label: "Purchases and memberships" },
        ],
        [
            { icon: Shield, label: "Your data in YouTube" },
            { icon: Moon, label: "Appearance: Device theme", hasArrow: true },
            { icon: Languages, label: "Display language: English", hasArrow: true },
            { icon: Shield, label: "Restricted Mode: Off", hasArrow: true },
            { icon: MapPin, label: "Location: India", hasArrow: true },
            { icon: Keyboard, label: "Keyboard shortcuts" },
        ],
        [
            { icon: Settings, label: "Settings" },
        ],
        [
            { icon: HelpCircle, label: "Help" },
            { icon: MessageSquare, label: "Send feedback" },
        ]
    ];

    return (
        <div className="absolute top-12 right-0 w-[300px] bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
            <div className="px-4 py-3 flex gap-3 border-b border-gray-200">
                <div className="w-10 h-10 bg-purple-600 rounded-full text-white flex items-center justify-center text-lg font-bold shrink-0">
                    V
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-base">IamBatman</span>
                    <span className="text-gray-600 text-sm">@iambatman-0-0-1</span>
                    <a href="#" className="text-blue-600 text-sm mt-1 hover:text-blue-700">View your channel</a>
                </div>
            </div>
            <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
                {menuGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="py-2 border-b border-gray-200 last:border-0">
                        {group.map((item, itemIndex) => (
                            <div
                                key={itemIndex}
                                className="px-4 py-2 hover:bg-gray-100 flex items-center justify-between cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5 text-gray-600" />
                                    <span className="text-sm text-gray-800">{item.label}</span>
                                </div>
                                {item.hasArrow && (
                                    <span className="text-gray-500">›</span>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

