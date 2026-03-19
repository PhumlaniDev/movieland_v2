import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { Movie } from './../../core/interface/Movie';
import { MovieCard } from '../../shared/components/movie-card/movie-card';
import { TmdbService } from '../../core/services/tmdb.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MovieCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private tmdb = inject(TmdbService);
  private router = inject(Router);

  searchCtrl = new FormControl('');

  skeletonItems = Array.from({ length: 10 }, (_, i) => i);

  // Signals
  trending = signal<Movie[]>([]);
  nowPlaying = signal<Movie[]>([]);
  topRated = signal<Movie[]>([]);
  upcoming = signal<Movie[]>([]);
  heroIndex = signal(0);
  loading = signal(true);

  hero = () => this.trending()[this.heroIndex()] ?? null;

  heroBackdrop = () => this.tmdb.getImageUrl(this.hero()?.backdrop_path ?? null, 'original');
  ngOnInit(): void {
    forkJoin({
      trending: this.tmdb.getTrending('week'),
      nowPlaying: this.tmdb.getNowPlaying(),
      topRated: this.tmdb.getTopRated(),
      upcoming: this.tmdb.getUpcoming(),
    }).subscribe(({ trending, nowPlaying, topRated, upcoming }) => {
      this.trending.set(trending);
      this.nowPlaying.set(nowPlaying);
      this.topRated.set(topRated);
      this.upcoming.set(upcoming);
      this.loading.set(false);
    });
  }

  onSearch(): void {
    const q = this.searchCtrl.value?.trim();
    if (q) this.router.navigate(['/search'], { queryParams: { q } });
  }

  onHeroWatchlist(): void {
    const movie = this.hero();
    if (movie) this.tmdb.toggleWatchlist(movie);
  }
}
