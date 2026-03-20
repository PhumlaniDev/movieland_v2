import { Pipe, PipeTransform, inject } from '@angular/core';

import { TmdbService } from './../../core/services/tmdb.service';

@Pipe({
  name: 'imageUrl',
})
export class ImageUrlPipe implements PipeTransform {
  private tmdb = inject(TmdbService);
  transform(path: string, size = 'w500'): string {
    return this.tmdb.getImageUrl(path, size);
  }
}
