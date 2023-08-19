import { formatDate } from '@angular/common';
export class Response {
    private _name:string;
    private _freeTimes:Array<Date>;

    constructor(freeTimesIN:Array<Date>, nameIN:string ){
            this.name = nameIN;
            this.freeTimes = freeTimesIN;
    }


    public set name(nameIN: string) {
        console.log("setting title");
        this._name = nameIN;  
    }

    public set freeTimes(freeTimesIN: Array<Date>) {
        console.log("setting free times!")
      var x = new Array<Date>();
      for(var i = 0;i < freeTimesIN.length;i++){
        var utcSeconds = freeTimesIN[i];
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(+utcSeconds);
        x.push(d);
      }
        this._freeTimes = x;  
    }

    public get name(): string {
        return this._name;
    }

    public get freeTimes(): Array<Date> {
   
        return this._freeTimes;
    }


}