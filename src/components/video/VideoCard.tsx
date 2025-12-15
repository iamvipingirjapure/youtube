import { useNavigate } from "react-router-dom";
import type { SearchResultItem } from "../../redux/searchSlice";

export interface VideoProps {
    id: string;
    title: string;
    thumbnail: string;
    channelName: string;
    channelAvatar: string;
    views: string;
    postedAt: string;
    duration: string;
    channelId: string;
    channelTitle: string;
    description: string;
    liveBroadcastContent: string;
    publishTime: string;
    publishedAt: string;
}

interface VideoCardProps {
    video: VideoProps | SearchResultItem | any;
    variant?: 'vertical' | 'compact';
}

export const VideoCard = ({ video, variant = 'vertical' }: VideoCardProps) => {
    const navigate = useNavigate();
    const isCompact = variant === 'compact';

    let title, channelName, channelAvatar, postedAt, duration;
    console.log(video)
    return (
        <div
            onClick={() => {
                video.id
                    && navigate(`/watch/${video.id}`, { state: video });
            }} className={`flex ${isCompact ? 'gap-2' : 'flex-col gap-2'} cursor-pointer group`}>
            <div className={`relative rounded-xl overflow-hidden ${isCompact ? 'w-40 min-w-[168px] aspect-video flex-shrink-0' : 'aspect-video w-full'}`}>
                <img
                    src={video?.snippet?.thumbnails?.medium?.url ?? 'https://imgs.search.brave.com/6khSh_NPDLOjDucvUStVVnHKqLiPNhgzIqmF03m1t5Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMnVv/bGd1eHI1NnM0ZS5j/bG91ZGZyb250Lm5l/dC9pbWcva2FydHJh/cGFnZXMvdmlkZW9f/cGxheWVyX3BsYWNl/aG9sZGVyLmdpZg.gif'}
                    alt={title ?? 'title'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {duration && (
                    <div className={`absolute ${isCompact ? 'bottom-1 right-1' : 'bottom-2 right-2'} bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium`}>
                        {duration}
                    </div>
                )}
            </div>

            <div className={`flex ${isCompact ? 'flex-col gap-1 min-w-0' : 'gap-3 mt-1'}`}>
                {!isCompact && (
                    <div className="flex-shrink-0">
                        {channelAvatar ? (
                            <img
                                src={channelAvatar}
                                alt={channelName}
                                className="w-9 h-9 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                {video?.snippet?.channelTitle.charAt(0)}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-col">
                    <h3 className={`text-sm font-bold text-yt-text line-clamp-2 leading-tight group-hover:text-black ${isCompact ? 'mb-1' : ''}`} dangerouslySetInnerHTML={{ __html: video?.snippet?.title }}>
                    </h3>
                    <div className="text-xs text-gray-600">
                        <div className="hover:text-gray-900">{video?.snippet?.channelTitle}</div>
                        <div className="flex items-center">
                            <span>{video?.snippet?.viewCount}</span>
                            {video?.snippet?.viewCount && !isCompact && <span className="mx-1">•</span>}
                            {video?.snippet?.viewCount && isCompact && <span className="mx-1">•</span>}
                            <span>{postedAt}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};
