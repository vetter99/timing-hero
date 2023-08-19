import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Meeting } from '../shared/model/meeting.model';
import { Response } from '../shared/model/response.model';
import { RespondantsDialogComponent } from './respondants-dialog/respondants-dialog.component';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  id: string = "";  
  title: string = "";
  meetingLength:number = 0;
  numberOfResponders: number = 0;

  private responsesCollection: AngularFirestoreCollection<Object>;
  // responses: Observable<Response[]>;
  responses: Response[] = [];

  tempTimes: Date[] = [];
  chosenTimes: Date[] = [];
  finalTimes: Array<Array<Date>> = [];

  browserTimeZone = "";

  constructor(public dialog: MatDialog,private firestore: AngularFirestore, private activatedRoute: ActivatedRoute) { 
    this.browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; 
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];  

      console.log("init");

    this.firestore.collection('meetings').doc<Meeting>(this.id).valueChanges().subscribe(result => {
       this.title = result.title;
       this.meetingLength = result.meetingLength;
       console.log("firetstore...");
    });
 
      this.responsesCollection =  this.firestore.collection("meetings").doc(this.id).collection<Response>("responses");

      // this.responsesCollection.valueChanges().subscribe(result => {
      //   this.numberOfResponders = result.length;
      //   result

      //   //wanna get their names too

      // });
      this.responsesCollection.snapshotChanges().pipe(
        map(actions => actions.map(item => {
          const data = item.payload.doc.data() as Response;

          //get the free times and translate it
          var x = new Array<Date>();
          for(var i = 0;i < data.freeTimes.length;i++){
            var utcSeconds = data.freeTimes[i];
            var d = new Date(0); 
            d.setUTCSeconds(+utcSeconds);
            x.push(d);
          }

          data.freeTimes = x; 
          return data;
        }))
      ).subscribe((responses: Response[]) => {

        this.responses = responses;
        this.numberOfResponders = responses.length;

        this.chosenTimes = responses[0].freeTimes;
        console.log("ZZZ: " + responses[0].name);

        for(var i = 0;i < responses.length; i++){

            for(var j = 0; j < responses[i].freeTimes.length;j++){
             
              var x =  this.chosenTimes.filter(item => item.getTime() == responses[i].freeTimes[j].getTime());
              //TODO: cant we just make this X become the chosen array? --> i dont think so

              if(x.length > 0){
                // console.log("Does include");
                this.tempTimes.push(responses[i].freeTimes[j]);
                
              }else{
                // console.log("Does not include");
              }
             
            }

            this.chosenTimes = this.tempTimes;
            this.tempTimes = [];

        }

        //filter with meeting length
        this.chosenTimes = this.chosenTimes.slice().sort((a, b) =>  a.getTime() - b.getTime());
        console.log("Chosen: " + this.chosenTimes);
        var numberInRow = this.meetingLength / 0.5;

        console.log("number needed in a row: " + numberInRow);

        var tempArray: Array<Date> = [];
        

        for(var i = 0; i < this.chosenTimes.length; i++){
          //8:00

             //push in the initial time
             tempArray = [];
             tempArray.push(this.chosenTimes[i]);

             //only 1 time needed then doesnt even enter here
              for(var y = i; y < i + numberInRow; y++){ // compare the time with the X number of times after to see if that range is enough for the numberInRow

              if(y + 1 >= this.chosenTimes.length){
                  console.log("breaking cuz looking at last item...");
                  tempArray = [];
                  break;
              }
              
                // var difference = (this.chosenTimes[i+1].getTime() - this.chosenTimes[i].getTime()) / (1000 * 60 * 30);
                var difference = (this.chosenTimes[y+1].getTime() - this.chosenTimes[y].getTime()) / (1000 * 60 * 30);

                console.log("y: " + y);
                console.log("time 1: " + this.chosenTimes[y]);
                console.log("time 2: " + this.chosenTimes[y+1]);

                if(difference != 1){  //right next to each other
                    console.log("difference is not 1");
                    tempArray = [];
                }else{
                  console.log("difference is 1");
                  tempArray.push(this.chosenTimes[y+1]);
                }

                    //Push when we have found a good time...actually when its last time through
                   if(tempArray.length == numberInRow){
                        console.log("Times Range found!");       
                        this.finalTimes.push(tempArray);
                        break;
                   }

              }
            
        }
    });

   });

  }

  peopleClicked(){

    const dialogRef = this.dialog.open(RespondantsDialogComponent,{
      data:{
        responses: this.responses
      },
      height: '200px',
      width: '300px'
    });
  }

}
