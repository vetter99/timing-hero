import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDatepicker, MatDatepickerInputEvent} from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Meeting } from '../shared/model/meeting.model';
import { Clipboard } from "@angular/cdk/clipboard";
import { MatSliderChange } from '@angular/material/slider';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {

  todayDate:Date = new Date();

  public listOfDates:Date [] = [

  ];

  meeting: Meeting = new Meeting('','',1,[])
  link = "";
   private meetingCollection: AngularFirestoreCollection<Meeting>;
  // meetings: Observable<Meeting[]>;

  constructor(private _snackBar: MatSnackBar,private clipboard: Clipboard, private firestore: AngularFirestore, private router: Router) {
      this.meetingCollection = firestore.collection<Meeting>('meetings');      
      // this.meetings = this.meetingCollection.valueChanges();
  }

  public CLOSE_ON_SELECTED = false;
  public init = new Date();
  public resetModel = new Date(0);

  
  @ViewChild('picker', { static: true }) _picker: MatDatepicker<Date>;

  public dateClass = (date: Date) => {
    if (this._findDate(date) !== -1) {
      return [ 'selected' ];
    }
    return [ ];
  }

  public dateChanged(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const date = event.value;
      const index = this._findDate(date);
      if (index === -1) {
        this.listOfDates.push(date);
      } else {
        this.listOfDates.splice(index, 1)
      }
      this.resetModel = new Date(0);
      if (!this.CLOSE_ON_SELECTED) {
        const closeFn = this._picker.close;
        this._picker.close = () => { };
        this._picker['_popupComponentRef'].instance._calendar.monthView._createWeekCells()
        setTimeout(() => {
          this._picker.close = closeFn;
        });
      }
    }
  }

  public remove(date: Date): void {
    const index = this._findDate(date);
    this.listOfDates.splice(index, 1)
  }

  private _findDate(date: Date): number {
    return this.listOfDates.map((m) => +m).indexOf(+date);
  }

  autoTicks = false;
  showTicks = true;
  tickInterval = 1;

  getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }

    return 0;
  }

  meetingID = "";


  
  onGenerate(){

    if(this.meeting.title.length > 1 && this.listOfDates.length > 0){
      this.meetingID = this.addMeeting();
      this.link = "http://findtime.s3-website.us-east-2.amazonaws.com/" + this.meetingID;
    }else{
      alert("Please enter a title and select at least 1 date.")
    }

  }

  addMeeting() {
    // Persist a document id...side note all the firebase stuff should prolly be moved to a service....
    const id = this.firestore.createId();
    this.meeting.id = id;
    // this.meeting.meetingDays = this.listOfDates;

    this.meetingCollection.doc(id).set(
      {id: this.meeting.id, 
      meetingDays: this.listOfDates, 
      meetingLength: this.meeting.meetingLength, 
      title: this.meeting.title
    });

    return id;
  }

  displayMeetingLength = "1 hour"


  onInputChange(event: MatSliderChange){
    if(event.value == 0.5){
      this.displayMeetingLength = "30 minutes";
    }else if(event.value == 1){
      this.displayMeetingLength = "1 hour";
    }else{
      this.displayMeetingLength = event.value + " hours";
    }
   
  }

  goToLink(){
    this.router.navigateByUrl('/' + this.meetingID);
  }

  copyLink(){
    this.clipboard.copy(this.link);

    this._snackBar.open('Copied', '', {
      duration: 1250,
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
    });
  }

}
