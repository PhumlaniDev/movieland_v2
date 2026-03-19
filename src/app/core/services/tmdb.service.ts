import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

import { Genre } from '../interface/Genre';
import { Movie } from '../interface/Movie';
import { PaginationResponse } from './../interface/PaginationResponse';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TmdbServiceTs {
  private http = inject(HttpClient);
  private base = environment.tmdbBaseUrl;

  // Global signals
  readonly genre = signal<Genre[]>([]);
  readonly watchlist = signal<Movie[]>(JSON.parse(localStorage.getItem('watchlist') || '[]'));
  readonly isInWatchlist = (id: number) =>
    computed(() => this.watchlist().some((m) => m.id === id));

  getTrending(timeWindow: 'day' | 'week' = 'week'): Observable<Movie[]> {
    return this.http
      .get<PaginationResponse<Movie>>(`${this.base}/trending/movie/${timeWindow}`)
      .pipe(
        map((r) => r.results),
        catchError(() => of([])),
      );
  }

  getNowPlaying(page = 1): Observable<Movie[]> {
    return this.http
      .get<PaginationResponse<Movie>>(`${this.base}/movie/now_playing`, { params: { page } })
      .pipe(
        map((r) => r.results),
        catchError(() => of([])),
      );
  }

  getTopRated(page = 1): Observable<Movie[]> {
    return this.http
      .get<PaginationResponse<Movie>>(`${this.base}/movie/top_rated`, { params: { page } })
      .pipe(
        map((r) => r.results),
        catchError(() => of([])),
      );
  }

  getUpcoming(page = 1): Observable<Movie[]> {
    return this.http
      .get<PaginationResponse<Movie>>(`${this.base}/movie/upcoming`, { params: { page } })
      .pipe(
        map((r) => r.results),
        catchError(() => of([])),
      );
  }

  getMovieDetail(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.base}/movie/${id}`, {
      params: new HttpParams().set('append_to_response', 'credits,similar,videos'),
    });
  }

  searchMovies(query: string, page = 1): Observable<PaginationResponse<Movie>> {
    return this.http
      .get<PaginationResponse<Movie>>(`${this.base}/search/movie`, { params: { query, page } })
      .pipe(catchError(() => of({ results: [], total_pages: 0, total_results: 0, page: 1 })));
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<{ genres: Genre[] }>(`${this.base}/genre/movie/list`).pipe(
      map((r) => {
        this.genre.set(r.genres);
        return r.genres;
      }),
      catchError(() => of([])),
    );
  }

  getImageUrl(path: string, size = 'w500'): string {
    return path ? `${environment.tmdbImageBaseUrl}${size}${path}` : 'assets/no-image.png';
  }

  toggleWatchlist(movie: Movie): void {
    const current = this.watchlist();
    const exists = current.some((m) => m.id === movie.id);
    const updated = exists ? current.filter((m) => m.id !== movie.id) : [...current, movie];
    this.watchlist.set(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
  }
}
