import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VideoCard } from "../components/video/VideoCard";
import { CategoryPills } from "../components/ui/CategoryPills";
import { fetchTrendingVideos } from "../redux/searchSlice";
import { type AppDispatch, type RootState } from "../redux/store";
import { AlertCircle, RefreshCw, X } from "lucide-react";
import { videos as mockVideos } from "../data/mockData";

export const Home = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, videos } = useSelector(
        (state: RootState) => state.search
    );
    const [showBanner, setShowBanner] = useState(true);

    useEffect(() => {
        dispatch(fetchTrendingVideos());
    }, []);

    const handleRetry = () => {
        dispatch(fetchTrendingVideos());
        setShowBanner(true);
    };

    const videosToShow = error || videos?.length === 0 ? mockVideos : videos;
    const isShowingMockData = error || videos?.length === 0;

    if (loading && videos?.length === 0) {
        return (
            <div className="p-4 lg:p-6">
                <CategoryPills />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 aspect-video rounded-xl mb-2"></div>
                            <div className="flex gap-2">
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-6">
            <CategoryPills />

            {isShowingMockData && showBanner && (
                <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-amber-900 text-sm mb-1">
                            {error === "API Key missing"
                                ? "YouTube API Key Not Configured"
                                : "Unable to Load Live Videos"}
                        </h3>
                        <p className="text-amber-800 text-sm">
                            {error === "API Key missing"
                                ? "Add VITE_YOUTUBE_API_KEY to your .env file to see live YouTube videos."
                                : "Showing sample videos. Check your internet connection or API quota limits."}
                        </p>
                        <button
                            onClick={handleRetry}
                            className="mt-2 flex items-center gap-1.5 text-sm font-medium text-amber-900 hover:text-amber-700 transition-colors"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Try Again
                        </button>
                    </div>
                    <button
                        onClick={() => setShowBanner(false)}
                        className="text-amber-600 hover:text-amber-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
                {videosToShow?.map((video: any) => (
                    <VideoCard key={video.id?.videoId || video.id} video={video} />
                ))}
            </div>
        </div>
    );
};
