const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeComment {
    kind: string;
    etag: string;
    id: string;
    snippet: {
        authorDisplayName: string;
        authorProfileImageUrl: string;
        authorChannelUrl: string;
        authorChannelId: {
            value: string;
        };
        textDisplay: string;
        textOriginal: string;
        canRate: boolean;
        viewerRating: string;
        likeCount: number;
        publishedAt: string;
        updatedAt: string;
    };
}

export interface YouTubeCommentThread {
    kind: string;
    etag: string;
    id: string;
    snippet: {
        channelId: string;
        videoId: string;
        topLevelComment: YouTubeComment;
        canReply: boolean;
        totalReplyCount: number;
        isPublic: boolean;
    };
    replies?: {
        comments: YouTubeComment[];
    };
}

export interface CommentThreadsResponse {
    kind: string;
    etag: string;
    nextPageToken?: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    items: YouTubeCommentThread[];
}

export interface PostCommentParams {
    videoId: string;
    textOriginal: string;
    accessToken?: string;
}

export interface UpdateCommentParams {
    commentId: string;
    textOriginal: string;
    accessToken?: string;
}

export interface PostReplyParams {
    parentId: string;
    textOriginal: string;
    accessToken?: string;
}

/**
 * Fetch comment threads for a video
 * GET https://youtube.googleapis.com/youtube/v3/commentThreads
 */
export const fetchCommentThreads = async (
    videoId: string,
    pageToken?: string,
    maxResults: number = 20
): Promise<CommentThreadsResponse> => {
    try {
        if (!API_KEY) {
            throw new Error('YouTube API key is not configured');
        }

        const params = new URLSearchParams({
            part: 'snippet,replies',
            videoId,
            key: API_KEY,
            maxResults: maxResults.toString(),
            order: 'relevance',
        });

        if (pageToken) {
            params.append('pageToken', pageToken);
        }

        const response = await fetch(`${BASE_URL}/commentThreads?${params}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.error?.message || `Failed to fetch comments: ${response.status}`
            );
        }

        const data: CommentThreadsResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching comment threads:', error);
        throw error;
    }
};

/**
 * Post a new top-level comment
 * POST https://www.googleapis.com/youtube/v3/comments
 * Requires OAuth 2.0 authentication
 */
export const postComment = async ({
    videoId,
    textOriginal,
    accessToken,
}: PostCommentParams): Promise<YouTubeComment> => {
    try {
        if (!accessToken) {
            throw new Error('Authentication required to post comments');
        }

        const response = await fetch(`${BASE_URL}/commentThreads?part=snippet`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                snippet: {
                    videoId,
                    topLevelComment: {
                        snippet: {
                            textOriginal,
                        },
                    },
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.error?.message || `Failed to post comment: ${response.status}`
            );
        }

        const data = await response.json();
        return data.snippet.topLevelComment;
    } catch (error) {
        console.error('Error posting comment:', error);
        throw error;
    }
};
export const updateComment = async ({
    commentId,
    textOriginal,
    accessToken,
}: UpdateCommentParams): Promise<YouTubeComment> => {
    try {
        if (!accessToken) {
            throw new Error('Authentication required to update comments');
        }

        const response = await fetch(`${BASE_URL}/comments?part=snippet`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                id: commentId,
                snippet: {
                    textOriginal,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.error?.message || `Failed to update comment: ${response.status}`
            );
        }

        const data: YouTubeComment = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating comment:', error);
        throw error;
    }
};

export const postReply = async ({
    parentId,
    textOriginal,
    accessToken,
}: PostReplyParams): Promise<YouTubeComment> => {
    try {
        if (!accessToken) {
            throw new Error('Authentication required to post replies');
        }

        const response = await fetch(`${BASE_URL}/comments?part=snippet`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                snippet: {
                    parentId,
                    textOriginal,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.error?.message || `Failed to post reply: ${response.status}`
            );
        }

        const data: YouTubeComment = await response.json();
        return data;
    } catch (error) {
        console.error('Error posting reply:', error);
        throw error;
    }
};
