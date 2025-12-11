import { useSelector } from "react-redux";
import { CategoryPills } from "../components/ui/CategoryPills";
import { VideoCard } from "../components/video/VideoCard";
import type { RootState } from "../redux/store";

export const Home = () => {

    const { results } = useSelector((state: RootState) => state.search)

    return (
        <div className="w-full h-full flex flex-col">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 w-full flex-shrink-0">
                <div className="px-4 py-3 w-full overflow-x-hidden">
                    <CategoryPills />
                </div>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8 gap-x-4 pb-16 overflow-y-auto flex-1">
                {results?.map((video) => (
                    <VideoCard key={video.id.videoId} video={video} />
                ))}
            </div>
        </div>
    );
};
