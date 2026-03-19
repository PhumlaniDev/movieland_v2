import { MovieDetail } from './features/movie-detail/movie-detail';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then((m) => m.Home) },
  {
    path: 'movies',
    loadComponent: () => import('./features/movies/movies').then((m) => m.Movies),
    title: 'Moveland = Discover Movies',
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./features/movie-detail/movie-detail').then((m) => m.MovieDetail),
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search').then((m) => m.Search),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
