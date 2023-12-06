export interface Submission {
  id : string;
  biometrics : {
    heartRate : number,
    bloodOxygenation : number,
    skinTemperature : number
  };
  answers : {
    answered : boolean;
    label : string;
    order : number;
    value : string;
    code : number;
  }[]
}
