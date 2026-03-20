import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { CastMember } from '../../core/interface/CastMember';
import { MovieCard } from '../../shared/components/movie-card/movie-card';
import { MovieDetailInt } from '../../core/interface/MovieDetailInt';
import { TmdbService } from '../../core/services/tmdb.service';
import { Video } from '../../core/interface/Video';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-movie-detail',
  imports: [RouterModule, MovieCard, DecimalPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.scss',
})
export class MovieDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private tmdb = inject(TmdbService);
  private sanitizer = inject(DomSanitizer);

  movie = signal<MovieDetailInt | null>(null);
  loading = signal(true);
  trailerOpen = signal(false);

  backdropUrl = computed(() =>
    this.tmdb.getImageUrl(this.movie()?.backdrop_path ?? null, 'original'),
  );
  posterUrl = computed(() => this.tmdb.getImageUrl(this.movie()?.poster_path ?? null, 'w500'));
  topCast = computed(() => this.movie()?.credits.cast.slice(0, 16) ?? []);
  similar = computed(() => this.movie()?.similar?.results ?? []);
  director = computed(() => this.movie()?.credits.crew?.find((c) => c.job === 'Director'));
  trailer = computed<Video | undefined>(() =>
    this.movie()?.videos?.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer'),
  );
  trailerUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.trailer()?.key}?autoplay=1`,
    ),
  );
  inWatchlist = computed(() => this.tmdb.watchlist().some((m) => m.id === this.movie()?.id));

  ngOnInit(): void {
    this.route.paramMap
      .pipe(switchMap((p) => this.tmdb.getMovieDetail(Number(p.get('id')))))
      .subscribe((detail) => {
        this.movie.set(detail);
        this.loading.set(false);
      });
  }

  toggleWatchlist(): void {
    const m = this.movie();
    if (m) this.tmdb.toggleWatchlist(m);
  }

  castImage(person: CastMember): string {
    return person.profile_path
      ? this.tmdb.getImageUrl(person.profile_path, 'w185')
      : 'assets/no-image.png';
  }
}
