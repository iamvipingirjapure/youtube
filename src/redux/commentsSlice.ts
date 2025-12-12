import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
    fetchCommentThreads,
    postComment,
    updateComment,
    postReply,
    type YouTubeCommentThread,
    type YouTubeComment,
    type CommentThreadsResponse,
} from '../services/youtubeApi';

export interface CommentsState {
    commentThreads: YouTubeCommentThread[];
    loading: boolean;
    error: string | null;
    totalComments: number;
    nextPageToken?: string;
    currentVideoId: string | null;
    posting: boolean;
    updating: boolean;
}

const initialState: CommentsState = {
    commentThreads: [],
    loading: false,
    error: null,
    totalComments: 0,
    nextPageToken: undefined,
    currentVideoId: null,
    posting: false,
    updating: false,
};

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async (
        { videoId, pageToken }: { videoId: string; pageToken?: string },
        { rejectWithValue }
    ) => {
        try {
            const data: CommentThreadsResponse = await fetchCommentThreads(videoId, pageToken);
            return { data, videoId };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch comments';
            return rejectWithValue(message);
        }
    }
);

export const createComment = createAsyncThunk(
    'comments/createComment',
    async (
        { videoId, textOriginal, accessToken }: { videoId: string; textOriginal: string; accessToken?: string },
        { rejectWithValue }
    ) => {
        try {
            const comment = await postComment({ videoId, textOriginal, accessToken });
            return comment;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to post comment';
            return rejectWithValue(message);
        }
    }
);

export const editComment = createAsyncThunk(
    'comments/editComment',
    async (
        { commentId, textOriginal, accessToken }: { commentId: string; textOriginal: string; accessToken?: string },
        { rejectWithValue }
    ) => {
        try {
            const comment = await updateComment({ commentId, textOriginal, accessToken });
            return comment;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update comment';
            return rejectWithValue(message);
        }
    }
);

export const createReply = createAsyncThunk(
    'comments/createReply',
    async (
        { parentId, textOriginal, accessToken }: { parentId: string; textOriginal: string; accessToken?: string },
        { rejectWithValue }
    ) => {
        try {
            const reply = await postReply({ parentId, textOriginal, accessToken });
            return { reply, parentId };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to post reply';
            return rejectWithValue(message);
        }
    }
);

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        clearComments: (state) => {
            state.commentThreads = [];
            state.totalComments = 0;
            state.nextPageToken = undefined;
            state.error = null;
        },
        setCurrentVideoId: (state, action: PayloadAction<string>) => {
            state.currentVideoId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch comments
            .addCase(fetchComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.loading = false;
                const { data, videoId } = action.payload;

                // If it's a new video, replace comments; otherwise append for pagination
                if (state.currentVideoId !== videoId) {
                    state.commentThreads = data.items;
                    state.currentVideoId = videoId;
                } else {
                    state.commentThreads = [...state.commentThreads, ...data.items];
                }

                state.totalComments = data.pageInfo.totalResults;
                state.nextPageToken = data.nextPageToken;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create comment
            .addCase(createComment.pending, (state) => {
                state.posting = true;
                state.error = null;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.posting = false;
                // Add optimistic comment to the top of the list
                const newThread: YouTubeCommentThread = {
                    kind: 'youtube#commentThread',
                    etag: '',
                    id: action.payload.id,
                    snippet: {
                        channelId: '',
                        videoId: state.currentVideoId || '',
                        topLevelComment: action.payload,
                        canReply: true,
                        totalReplyCount: 0,
                        isPublic: true,
                    },
                };
                state.commentThreads = [newThread, ...state.commentThreads];
                state.totalComments += 1;
            })
            .addCase(createComment.rejected, (state, action) => {
                state.posting = false;
                state.error = action.payload as string;
            })

            // Edit comment
            .addCase(editComment.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(editComment.fulfilled, (state, action) => {
                state.updating = false;
                // Update the comment in the state
                const updatedComment = action.payload;
                state.commentThreads = state.commentThreads.map((thread) => {
                    if (thread.snippet.topLevelComment.id === updatedComment.id) {
                        return {
                            ...thread,
                            snippet: {
                                ...thread.snippet,
                                topLevelComment: updatedComment,
                            },
                        };
                    }
                    if (thread.replies?.comments) {
                        const updatedReplies = thread.replies.comments.map((reply) =>
                            reply.id === updatedComment.id ? updatedComment : reply
                        );
                        return {
                            ...thread,
                            replies: {
                                comments: updatedReplies,
                            },
                        };
                    }
                    return thread;
                });
            })
            .addCase(editComment.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload as string;
            })

            .addCase(createReply.pending, (state) => {
                state.posting = true;
                state.error = null;
            })
            .addCase(createReply.fulfilled, (state, action) => {
                state.posting = false;
                const { reply, parentId } = action.payload;
                // Add reply to the appropriate thread
                state.commentThreads = state.commentThreads.map((thread) => {
                    if (thread.id === parentId || thread.snippet.topLevelComment.id === parentId) {
                        const existingReplies = thread.replies?.comments || [];
                        return {
                            ...thread,
                            snippet: {
                                ...thread.snippet,
                                totalReplyCount: thread.snippet.totalReplyCount + 1,
                            },
                            replies: {
                                comments: [...existingReplies, reply],
                            },
                        };
                    }
                    return thread;
                });
            })
            .addCase(createReply.rejected, (state, action) => {
                state.posting = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearComments, setCurrentVideoId } = commentsSlice.actions;
export default commentsSlice.reducer;
