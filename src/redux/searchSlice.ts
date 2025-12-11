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

export interface SearchState {
    query: string;
    results: SearchResultItem[];
    loading: boolean;
    error: string | null;
}

const initialState: SearchState = {
    query: '',
    results: videos as any,
    loading: false,
    error: null,
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
            });
    },
});

export const { setQuery, setSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
