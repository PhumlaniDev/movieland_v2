import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./features/home/home-module').then((m) => m.HomeModule) },
  {
    path: 'movies',
    loadChildren: () => import('./features/movies/movies-module').then((m) => m.MoviesModule),
  },
  {
    path: 'movie/:id',
    loadChildren: () =>
      import('./features/movie-detail/movie-detail-module').then((m) => m.MovieDetailModule),
  },
  {
    path: 'search',
    loadChildren: () => import('./features/search/search-module').then((m) => m.SearchModule),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
