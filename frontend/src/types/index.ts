export interface Artist {
  _id: string;
  name: string;
  imgUrl?: string;
  genre?: string | string[];
  language?: string;
  bio?: string;
}

export interface Song {
  _id: string;
  title: string;
  artist: Artist;
  imgUrl?: string;
  audioUrl: string;
  duration: number;
  genre?: string;
  language?: string;
  albumId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Album {
  _id: string;
  title: string;
  artist: Artist;
  imgUrl: string;
  releaseYear: number;
  songs?: Song[];
}

export interface DecodedToken {
  id: string;
  username?: string;
  email?: string;
  imageUrl?: string;
  exp?: number;
  isAdmin?: boolean;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  imageUrl?: string;
  likedSongs: Song[];
  followedArtists: Artist[];
  createdAt: string;
  updatedAt: string;
}
