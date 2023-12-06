export interface Question {
  number : number;
  step : number;
  type : 'text' | 'textarea' | 'number' | 'date' | 'dropdown' | 'radio' | 'check' | 'multiple' | 'range' | '';
  label : string;
  placeholder : string;
  description : string;
  required : boolean;
  options? : string;
  custom : boolean;
}
