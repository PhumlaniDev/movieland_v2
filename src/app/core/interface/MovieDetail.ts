import { CastMember } from './CastMember';
import { CrewMember } from './CrewMember';
import { Movie } from './Movie';

export interface MovieDetail extends Movie {
  credits: {
    cast: CastMember[];
    crew: CrewMember[];
  };
}
