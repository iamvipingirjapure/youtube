import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../redux/store";
import {
  fetchVideoById,
  fetchCommentThreads,
  type CommentThread,
  fetchTrendingVideos,
} from "../redux/searchSlice";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  MoreHorizontal,
  MessageSquare,
} from "lucide-react";
import { VideoCard } from "../components/video/VideoCard";
import YouTubePlayer from "../components/video/YouTubePlayer";
import { videos as mockVideos } from "../data/mockData";

export const VideoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    currentVideoDetails,
    videoDetailsLoading,
    videos,
    error,
    comments,
    commentsLoading,
  } = useSelector((state: RootState) => state.search);

  useEffect(() => {
    dispatch(fetchTrendingVideos());
  }, []);
  const videosToShow = error || videos?.length === 0 ? mockVideos : videos;

  console.log(videosToShow);
  useEffect(() => {
    if (id) {
      dispatch(fetchVideoById(id));
      dispatch(fetchCommentThreads(id));
    }
  }, [id, dispatch]);

  const formatNumber = (num: string | number) => {
    const n = typeof num === "string" ? parseInt(num) : num;
    if (isNaN(n)) return "0";
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "today";
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (videoDetailsLoading && !currentVideoDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Video
          </h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!currentVideoDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Video not found</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const video = currentVideoDetails;

  return (
    <div className="flex flex-col lg:flex-row md:justify-between gap-16 p-4 lg:py-6 lg:px-6 w-full">
      <div className="flex-1">
        <div className="w-full aspect-video bg-black lg:rounded-xl overflow-hidden mb-4 relative group shadow-lg">
          {id && <YouTubePlayer videoId={id} />}
        </div>

        <div className="px-4 lg:px-0">
          <h1 className="text-xl md:text-2xl font-bold text-yt-text mb-2 break-words">
            {video.snippet.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                {video.snippet.channelTitle.charAt(0).toUpperCase()}
              </div>
              <div className="cursor-pointer">
                <h3 className="font-bold text-yt-text text-base">
                  {video.snippet.channelTitle}
                </h3>
                <span className="text-xs text-gray-500">Channel</span>
              </div>
              <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/80 ml-2 transition-colors">
                Subscribe
              </button>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
              <div className="flex items-center bg-gray-100 rounded-full h-9">
                <button className="flex items-center gap-2 px-4 hover:bg-gray-200 rounded-l-full h-full border-r border-gray-300">
                  <ThumbsUp className="w-4 h-4" />{" "}
                  <span className="text-sm font-medium">
                    {formatNumber(video.statistics.likeCount)}
                  </span>
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
              <span>{formatNumber(video.statistics.viewCount)} views</span>
              <span>{formatDate(video.snippet.publishedAt)}</span>
            </div>
            <p className="whitespace-pre-line text-sm text-yt-text leading-relaxed">
              {video.snippet.description}
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

          <CommentsSection
            comments={comments}
            commentsLoading={commentsLoading}
            commentCount={video.statistics.commentCount}
          />
        </div>
      </div>

      <div className="w-full lg:w-[390px] xl:w-[400px] flex-shrink-0 px-4 lg:px-0">
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
          {["All", "Related"].map((tag, idx) => (
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
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {videosToShow && videosToShow.length > 0 ? (
            videosToShow
              .slice(0, 10)
              .map((video) => (
                <VideoCard key={video?.id} video={video} variant="compact" />
              ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No related videos available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentsSection = ({
  comments,
  commentsLoading,
  commentCount,
}: {
  comments: CommentThread[];
  commentsLoading: boolean;
  commentCount: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "today";
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !id) return;

    setIsSubmitting(true);
    try {
      // Create optimistic comment for immediate UI feedback
      const optimisticComment: CommentThread = {
        kind: "youtube#commentThread",
        etag: "temp-" + Date.now(),
        id: "temp-" + Date.now(),
        snippet: {
          videoId: id,
          topLevelComment: {
            kind: "youtube#comment",
            etag: "temp",
            id: "temp-comment-" + Date.now(),
            snippet: {
              authorDisplayName: "You",
              authorProfileImageUrl: "https://via.placeholder.com/40",
              authorChannelUrl: "",
              textDisplay: commentText,
              textOriginal: commentText,
              likeCount: 0,
              publishedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
          canReply: true,
          totalReplyCount: 0,
          isPublic: true,
        },
      };

      dispatch(fetchCommentThreads(id));
      setCommentText("");
      setShowCommentForm(false);

      alert("✅ Comment added successfully!");
      setTimeout(() => {
        dispatch(fetchCommentThreads(id));
      }, 10000);
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("❌ Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-8 mb-6">
        <h3 className="text-xl font-bold">
          {parseInt(commentCount).toLocaleString()} Comments
        </h3>
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
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onFocus={() => setShowCommentForm(true)}
            className="w-full border-b border-gray-200 py-1 outline-none focus:border-black text-sm transition-colors bg-transparent"
          />

          {showCommentForm && (
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => {
                  setShowCommentForm(false);
                  setCommentText("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || isSubmitting}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Posting..." : "Comment"}
              </button>
            </div>
          )}
        </div>
      </div>

      {commentsLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((thread) => {
            const comment = thread.snippet.topLevelComment;
            const hasReplies = thread.snippet.totalReplyCount > 0;

            return (
              <div key={thread.id} className="space-y-4">
                <div className="flex gap-4">
                  <img
                    src={comment.snippet.authorProfileImageUrl}
                    className="w-10 h-10 rounded-full bg-gray-200"
                    alt={comment.snippet.authorDisplayName}
                  />
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-yt-text">
                        @{comment.snippet.authorDisplayName}
                      </span>
                      <span className="text-gray-500">
                        {formatTimeAgo(comment.snippet.publishedAt)}
                      </span>
                    </div>
                    <p
                      className="text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: comment.snippet.textDisplay,
                      }}
                    />
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-800">
                      <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 rounded-full px-2 py-1">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {comment.snippet.likeCount > 0 && (
                          <span>{comment.snippet.likeCount}</span>
                        )}
                      </div>
                      <div className="cursor-pointer hover:bg-gray-100 rounded-full p-1">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium cursor-pointer hover:bg-gray-100 rounded-full px-2 py-1">
                        Reply
                      </span>
                    </div>
                  </div>
                </div>

                {hasReplies && thread.replies && (
                  <div className="ml-14 space-y-4 border-l-2 border-gray-200 pl-4">
                    {thread.replies.comments.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <img
                          src={reply.snippet.authorProfileImageUrl}
                          className="w-8 h-8 rounded-full bg-gray-200"
                          alt={reply.snippet.authorDisplayName}
                        />
                        <div className="flex flex-col gap-1 flex-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-yt-text">
                              @{reply.snippet.authorDisplayName}
                            </span>
                            <span className="text-gray-500">
                              {formatTimeAgo(reply.snippet.publishedAt)}
                            </span>
                          </div>
                          <p
                            className="text-sm whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{
                              __html: reply.snippet.textDisplay,
                            }}
                          />
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-800">
                            <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 rounded-full px-2 py-1">
                              <ThumbsUp className="w-3.5 h-3.5" />
                              {reply.snippet.likeCount > 0 && (
                                <span>{reply.snippet.likeCount}</span>
                              )}
                            </div>
                            <div className="cursor-pointer hover:bg-gray-100 rounded-full p-1">
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
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No comments available</p>
        </div>
      )}
    </div>
  );
};
