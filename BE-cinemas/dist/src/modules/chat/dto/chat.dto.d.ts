export declare enum MessageType {
    TEXT = "TEXT",
    VOICE = "VOICE",
    IMAGE = "IMAGE"
}
export declare class ChatDto {
    message: string;
    userId?: number;
    messageType?: MessageType;
    sessionId?: string;
    language?: string;
}
export declare class RateMovieDto {
    movieId: number;
    rating: number;
    content?: string;
}
export declare class SearchMovieDto {
    keyword: string;
    limit?: number;
}
export declare class ChatResponseDto {
    reply: string;
    type: 'TEXT' | 'MOVIE_LIST' | 'SHOWTIME_LIST' | 'BOOKING_INFO' | 'ERROR';
    data?: Record<string, unknown>;
    suggestions?: string[];
}
