import { formatDate } from '@angular/common';
import { firestore } from 'firebase';

export class Meeting {
    private _title:string;
    private _id:string;
    private _meetingLength:number;
    
    public _meetingDays:Array<Date>;

    constructor(id:string, titleIN:string,meetingLength: number,timestampArray:Array<firestore.Timestamp>){

            this.id = id;
            this.title = titleIN;
            this.meetingLength = meetingLength;
           this.meetingDays = timestampArray;

    }

    public set id(idIN: string) {
        this._id = idIN;  
    }

    public set title(titleIN: string) {
        this._title = titleIN;  
    }

    public set meetingLength(meetingIN: number) {
        this._meetingLength = meetingIN;  
    }

    public set meetingDays(timestampArray: Array<firestore.Timestamp>) {
        //Items are in this format: Timestamp(seconds=1604984400, nanoseconds=0)

        var z = new firestore.Timestamp(2343241,0);
      var x = new Array<Date>();
      for(var i = 0;i < timestampArray.length;i++){
        var utcSeconds = timestampArray[i].seconds;  //The seconds here were making the year be 3989, becuz it was a Timestamp Object not date
        console.log("seconds: " + utcSeconds);
        var d = new Date(0); // 0 sets the date to the epoch
        d.setUTCSeconds(+utcSeconds);
        console.log("d: " + d);
        
        x.push(d);
      }
        this._meetingDays = x;  
    }

    public get title(): string {
        return this._title;
    }

    public get id(): string {
        return this._id;
    }

    public get meetingLength(): number {
        return this._meetingLength;
    }

    // public get meetingDays(): Array<firestore.Timestamp> {
   
    //     return this._meetingDays;
    // }


}