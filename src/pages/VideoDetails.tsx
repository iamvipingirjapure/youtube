import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  MoreHorizontal,
  MessageSquare,
} from "lucide-react";
import { videos } from "../data/mockData";
import { VideoCard } from "../components/video/VideoCard";
import YouTubePlayer from "../components/video/YouTubePlayer";

export const VideoDetails = () => {
  const { id } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const currentVideo = videos.find((v) => v.id === id) || videos[0];

  return (
    <div className="flex flex-col lg:flex-row md:justify-between gap-16 p-4 lg:py-6 lg:px-6 w-full">
      <div className="flex-1">
        <div className="w-full aspect-video bg-black lg:rounded-xl overflow-hidden mb-4 relative group shadow-lg">
          {id ? (
            <YouTubePlayer videoId={id} />
          ) : (
            <img
              src={currentVideo.thumbnail}
              alt="Video"
              className="w-full h-full object-cover opacity-80 "
            />
          )}
        </div>

        <div className="px-4 lg:px-0">
          <h1 className="text-xl md:text-2xl font-bold text-yt-text mb-2 break-words line-clamp-2">
            {currentVideo.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <img
                src={currentVideo.channelAvatar}
                alt={currentVideo.channelName}
                className="w-10 h-10 rounded-full cursor-pointer"
              />
              <div className="cursor-pointer">
                <h3 className="font-bold text-yt-text text-base">
                  {currentVideo.channelName}
                </h3>
                <span className="text-xs text-gray-500">592K subscribers</span>
              </div>
              <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/80 ml-2 transition-colors">
                Subscribe
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
              <div className="flex items-center bg-gray-100 rounded-full h-9">
                <button className="flex items-center gap-2 px-4 hover:bg-gray-200 rounded-l-full h-full border-r border-gray-300">
                  <ThumbsUp className="w-4 h-4" />{" "}
                  <span className="text-sm font-medium">3.4K</span>
                </button>
                <button className="px-4 hover:bg-gray-200 rounded-r-full h-full relative">
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium whitespace-nowrap transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium whitespace-nowrap transition-colors hidden sm:flex">
                <Download className="w-4 h-4" /> Download
              </button>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors rotate-90">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            className={`bg-gray-100/80 p-3 rounded-xl text-sm mb-6 cursor-pointer hover:bg-gray-200 transition ${
              isExpanded ? "" : "h-20 overflow-hidden relative"
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex gap-2 font-bold mb-1 text-sm">
              <span>{currentVideo.views} views</span>
              <span>{currentVideo.postedAt}</span>
            </div>
            <p className="whitespace-pre-line text-sm text-yt-text leading-relaxed">
              Walter ने अपने ही RAW के Agents को मरवाके पाकिस्तानी जनरल का भरोसा
              जीता | RAW | John | Spy Movie
              <br />
              <br />
              A bank cashier, Romeo, is recruited by India's intelligence agency
              (RAW) for an espionage operation in Pakistan. He must infiltrate
              the Pakistani army and gain their trust to pass sensitive
              information to India.
              <br />
              <br />
              Cast: John Abraham, Mouni Roy, Jackie Shroff, Sikandar Kher
              <br />
              Director: Robbie Grewal
              <br />
              <br />
              #RomeoAkbarWalter #JohnAbraham #SpyThriller #Bollywood #Action
            </p>
            {!isExpanded && (
              <span className="font-bold cursor-pointer mt-2 block hover:underline">
                ...more
              </span>
            )}
            {isExpanded && (
              <span className="font-bold cursor-pointer mt-2 block hover:underline">
                Show less
              </span>
            )}
          </div>
          <CommentsSection />
        </div>
      </div>

      <div className="w-full lg:w-[390px] xl:w-[400px] flex-shrink-0 px-4 lg:px-0">
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
          {["All", "From " + currentVideo.channelName, "Similar"].map(
            (tag, idx) => (
              <button
                key={idx}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  idx === 0
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-yt-text"
                }`}
              >
                {tag}
              </button>
            )
          )}
        </div>
        <div className="flex flex-col gap-2">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} variant="compact" />
          ))}
        </div>
      </div>
    </div>
  );
};

const CommentsSection = () => {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-8 mb-6">
        <h3 className="text-xl font-bold">77 Comments</h3>
        <div className="flex items-center gap-2 text-sm font-medium cursor-pointer">
          <MessageSquare className="w-4 h-4" /> Sort by
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="w-10 h-10 bg-purple-600 rounded-full text-white flex items-center justify-center text-sm font-bold shrink-0">
          V
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full border-b border-gray-200 py-1 outline-none focus:border-black text-sm transition-colors bg-transparent"
          />
        </div>
      </div>

      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <img
              src={`https://i.pravatar.cc/150?u=${i}`}
              className="w-10 h-10 rounded-full bg-gray-200"
              alt="User"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-yt-text">@user-{i}</span>
                <span className="text-gray-500">4 months ago</span>
              </div>
              <p className="text-sm">
                This is a fantastic movie! Really enjoyed the plot twist at the
                end. 😎
              </p>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-800">
                <div className="flex items-center gap-1 cursor-pointer">
                  <ThumbsUp className="w-3.5 h-3.5" /> 12
                </div>
                <div className="cursor-pointer">
                  <ThumbsDown className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium cursor-pointer hover:bg-gray-100 rounded-full px-2 py-1">
                  Reply
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
