import { Component, Input, computed, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Movie } from '../../../core/interface/Movie';
import { RouterModule } from '@angular/router';
import { TmdbService } from '../../../core/services/tmdb.service';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCard {
  @Input({ required: true }) movie!: Movie;

  private tmdb = inject(TmdbService);

  get posterUrl(): string {
    return this.tmdb.getImageUrl(this.movie.poster_path, 'w342');
  }

  get ratingColor(): string {
    const rating = this.movie.vote_average;
    if (rating >= 7.5) return 'text-green-400';
    if (rating >= 6) return 'text-orange-400';
    return 'text-red-400';
  }

  inWatchlist = computed(() => this.tmdb.isInWatchlist(this.movie.id)());

  onWatchlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.tmdb.toggleWatchlist(this.movie);
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/no-image.png';
  }
}
