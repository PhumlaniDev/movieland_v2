import { CastMember } from './CastMember';
import { CrewMember } from './CrewMember';
import { Movie } from './Movie';
import { Video } from './Video';

export interface MovieDetailInt extends Movie {
  credits: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  videos: { results: Video[] };
  similar: { results: Movie[] };
}
