import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { videos } from '../data/mockData';

export interface Thumbnail {
    url: string;
    width: number;
    height: number;
}

export interface Snippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
        default: Thumbnail;
        medium: Thumbnail;
        high: Thumbnail;
    };
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
}

export interface SearchResultId {
    kind: string;
    videoId: string;
}

export interface SearchResultItem {
    kind: string;
    etag: string;
    id: SearchResultId;
    snippet: Snippet;
}

export interface PageInfo {
    totalResults: number;
    resultsPerPage: number;
}

export interface SearchResponse {
    kind: string;
    etag: string;
    nextPageToken: string;
    regionCode: string;
    pageInfo: PageInfo;
    items: SearchResultItem[];
}

export interface VideoStatistics {
    viewCount: string;
    likeCount: string;
    dislikeCount?: string;
    favoriteCount: string;
    commentCount: string;
}

export interface VideoContentDetails {
    duration: string;
    dimension: string;
    definition: string;
    caption: string;
    licensedContent: boolean;
    projection: string;
}

export interface VideoDetails {
    kind: string;
    etag: string;
    id: string;
    snippet: Snippet;
    statistics: VideoStatistics;
    contentDetails: VideoContentDetails;
}

export interface VideoDetailsResponse {
    kind: string;
    etag: string;
    items: VideoDetails[];
    pageInfo: PageInfo;
}

export interface CommentSnippet {
    authorDisplayName: string;
    authorProfileImageUrl: string;
    authorChannelUrl: string;
    textDisplay: string;
    textOriginal: string;
    likeCount: number;
    publishedAt: string;
    updatedAt: string;
}

export interface Comment {
    kind: string;
    etag: string;
    id: string;
    snippet: CommentSnippet;
}

export interface CommentThreadSnippet {
    videoId: string;
    topLevelComment: Comment;
    canReply: boolean;
    totalReplyCount: number;
    isPublic: boolean;
}

export interface CommentThread {
    kind: string;
    etag: string;
    id: string;
    snippet: CommentThreadSnippet;
    replies?: {
        comments: Comment[];
    };
}

export interface CommentThreadsResponse {
    kind: string;
    etag: string;
    nextPageToken?: string;
    pageInfo: PageInfo;
    items: CommentThread[];
}

export interface SearchState {
    query: string;
    results: SearchResultItem[];
    loading: boolean;
    error: string | null;
    currentVideoDetails: VideoDetails | null;
    videoDetailsLoading: boolean;
    comments: CommentThread[];
    commentsLoading: boolean;
    totalComments: number;
    videos?: VideoDetails[];
}

const initialState: SearchState = {
    query: '',
    results: videos as any,
    loading: false,
    error: null,
    currentVideoDetails: null,
    videoDetailsLoading: false,
    comments: [],
    commentsLoading: false,
    totalComments: 0,
    videos: [],
};

export const searchVideos = createAsyncThunk(
    'search/searchVideos',
    async (query: string, { rejectWithValue }) => {
        try {
            const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
            if (!API_KEY) {
                return rejectWithValue("API Key missing");
            }

            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=4&q=${query}&type=video&key=${API_KEY}`
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data: SearchResponse = await response.json();
            return data.items;
        } catch (error) {
            return rejectWithValue('Failed to search videos');
        }
    }
);

export const fetchVideoById = createAsyncThunk(
    'search/fetchVideoById',
    async (videoId: string, { rejectWithValue }) => {
        try {
            const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
            if (!API_KEY) {
                return rejectWithValue("API Key missing");
            }

            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${API_KEY}`
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data: VideoDetailsResponse = await response.json();

            if (!data.items || data.items.length === 0) {
                return rejectWithValue('Video not found');
            }

            return data.items[0];
        } catch (error) {
            return rejectWithValue('Failed to fetch video details');
        }
    }
);


export const fetchTrendingVideos = createAsyncThunk(
    "videos/fetchTrendingVideos",
    async (_, { rejectWithValue }) => {
        try {
            const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

            if (!API_KEY) {
                return rejectWithValue("API Key missing");
            }

            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=IN&maxResults=4&key=${API_KEY}`
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            if (!data.items || data.items.length === 0) {
                return rejectWithValue("No trending videos found");
            }

            return data.items;
        } catch (error) {
            return rejectWithValue("Failed to fetch trending videos");
        }
    }
);

export const fetchCommentThreads = createAsyncThunk(
    'search/fetchCommentThreads',
    async (videoId: string, { rejectWithValue }) => {
        try {
            const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
            if (!API_KEY) {
                return rejectWithValue("API Key missing");
            }

            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&maxResults=25&order=relevance&key=${API_KEY}`
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.error?.message || `Failed to fetch comments: ${response.status}`
                );
            }

            const data: CommentThreadsResponse = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue('Failed to fetch comments');
        }
    }
);

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
        },
        setSearchResults: (state, action: PayloadAction<SearchResultItem[]>) => {
            state.results = action.payload;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchVideos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchVideos.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload;
            })
            .addCase(searchVideos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchVideoById.pending, (state) => {
                state.videoDetailsLoading = true;
                state.error = null;
            })
            .addCase(fetchVideoById.fulfilled, (state, action) => {
                state.videoDetailsLoading = false;
                state.currentVideoDetails = action.payload;
            })
            .addCase(fetchVideoById.rejected, (state, action) => {
                state.videoDetailsLoading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchCommentThreads.pending, (state) => {
                state.commentsLoading = true;
                state.error = null;
            })
            .addCase(fetchCommentThreads.fulfilled, (state, action) => {
                state.commentsLoading = false;
                state.comments = action.payload.items;
                state.totalComments = action.payload.pageInfo.totalResults;
            })
            .addCase(fetchCommentThreads.rejected, (state, action) => {
                state.commentsLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchTrendingVideos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrendingVideos.fulfilled, (state, action) => {
                state.loading = false;
                state.videos = action.payload;
            })
            .addCase(fetchTrendingVideos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

    },
});

export const { setQuery, setSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
