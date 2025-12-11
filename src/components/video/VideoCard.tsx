import { Link } from "react-router-dom";
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
}

interface VideoCardProps {
    video: VideoProps | SearchResultItem;
    variant?: 'vertical' | 'compact';
}

export const VideoCard = ({ video, variant = 'vertical' }: VideoCardProps) => {
    const isCompact = variant === 'compact';

    let id, title, thumbnail, channelName, channelAvatar, views, postedAt, duration;

    if ('snippet' in video) {
        const snippet = video.snippet;
        id = video.id.videoId;
        title = snippet.title;
        thumbnail = snippet.thumbnails.medium.url; 
        channelName = snippet.channelTitle;
        channelAvatar = ""; 
        views = "1M views";
        postedAt = new Date(snippet.publishedAt).toLocaleDateString(); 
        duration = "";
    } else {
        id = video.id;
        title = video.title;
        thumbnail = video.thumbnail;
        channelName = video.channelName;
        channelAvatar = video.channelAvatar;
        views = video.views;
        postedAt = video.postedAt;
        duration = video.duration;
    }

    return (
        <Link to={`/watch/${id}`} className={`flex ${isCompact ? 'gap-2' : 'flex-col gap-2'} cursor-pointer group`}>
            <div className={`relative rounded-xl overflow-hidden ${isCompact ? 'w-40 min-w-[168px] aspect-video flex-shrink-0' : 'aspect-video w-full'}`}>
                <img
                    src={thumbnail}
                    alt={title}
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
                                {channelName.charAt(0)}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-col">
                    <h3 className={`text-sm font-bold text-yt-text line-clamp-2 leading-tight group-hover:text-black ${isCompact ? 'mb-1' : ''}`} dangerouslySetInnerHTML={{ __html: title }}>
                    </h3>
                    <div className="text-xs text-gray-600">
                        <div className="hover:text-gray-900">{channelName}</div>
                        <div className="flex items-center">
                            <span>{views}</span>
                            {!isCompact && <span className="mx-1">•</span>}
                            {isCompact && <span className="mx-1">•</span>}
                            <span>{postedAt}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};
