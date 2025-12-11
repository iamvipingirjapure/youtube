import { useEffect, useRef } from "react";

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: any;
    }
}

interface YouTubePlayerProps {
    videoId: string;
}

export default function YouTubePlayer({ videoId }: YouTubePlayerProps) {
    const playerRef = useRef<any>(null);

    useEffect(() => {
        // Check if script is already loaded
        if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        const initPlayer = () => {
            if (window.YT && window.YT.Player) {
                playerRef.current = new window.YT.Player("yt-player", {
                    videoId,
                    height: "100%",
                    width: "100%",
                    playerVars: {
                        autoplay: 1,
                        playsinline: 1,
                    }
                });
            }
        }

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            window.onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        }
    }, [videoId]);

    return <div id="yt-player" className="w-full h-full"></div>;
}
