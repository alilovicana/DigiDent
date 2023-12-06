import { Question } from './question';

export interface Form {
  id : string;
  name : string;
  compliance : string;
  status : 'editing' | 'open' | 'closed' ;
  submissions : number;
  steps : Question[];
  questions : Question[];
  boxbreathing: boolean;
}
