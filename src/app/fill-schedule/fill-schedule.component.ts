import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute, Event, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Meeting } from '../shared/model/meeting.model';
import {firestore} from 'firebase/app';
import Timestamp = firestore.Timestamp;
import { httpClientInMemBackendServiceFactory } from 'angular-in-memory-web-api';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatDialog } from '@angular/material/dialog';
import { NameDialogComponent } from './name-dialog/name-dialog.component';
import { Meta, Title } from '@angular/platform-browser';


@Component({
  selector: 'app-fill-schedule',
  templateUrl: './fill-schedule.component.html',
  styleUrls: ['./fill-schedule.component.scss']
})
export class FillScheduleComponent implements OnInit {
 
  public listOfDates:Date [] = [];

  id: string = "";  
  name:string = "";
  selectedDate:Date;
  meeting: Meeting = new Meeting('xxx','xxx',4, []);
  // public times = ["8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM"];
  public times:Date [] = [];

  constructor(public title: Title,public meta: Meta,public dialog: MatDialog,@Inject(DOCUMENT) private document: Document,private firestore: AngularFirestore, private activatedRoute: ActivatedRoute, private router: Router) {
    this.openDialog();
}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];  // (+) converts string 'id' to a number
      
      this.firestore.collection("meetings").doc<Meeting>(this.id).valueChanges().subscribe(result => {
      console.log('res: ' + JSON.stringify(result));

      this.meeting.title = result.title;
      this.meeting.id = result.id;
      this.meeting.meetingLength = result.meetingLength;
      this.meeting.meetingDays = result.meetingDays;

      //set selected date to the first date
      this.selectedDate = this.meeting._meetingDays[0];
      console.log(this.selectedDate);


        //create array of times
        for(let hour = 10; hour <= 20; hour++) {
          var time = new Date(this.selectedDate);
          time.setHours(hour);

          var time2 = new Date(time);
          time2.setMinutes(30);

          this.times.push(time);
          this.times.push(time2); // h:mm A
      }


      });
   
   });

   
  }

  public freeTimes:Date[] = [];
  public displayedTimes:Date[] = [];

  onTimeClick(timeIN:Date,index:number) {

    let filteredTimes = this.freeTimes.filter(item => item.getTime() == timeIN.getTime()); 
    
    if(filteredTimes.length > 0){
      //  console.log("item was already in free times...REMOVE IT");
        this.freeTimes = this.freeTimes.filter(item => item.getTime() != timeIN.getTime());
        this.displayedTimes = this.displayedTimes.filter(item => item.getTime() != timeIN.getTime());
    }else{
      // console.log("item was not in free times...ADD IT");
      this.freeTimes.push(timeIN);
      this.displayedTimes.push(timeIN);
    }

    console.log("free: " + this.freeTimes);
    (<HTMLElement>this.document.getElementById('available-block'+ index)).classList.toggle('invisible');
  }


// Miscellaneous
  getDayOfWeek(date:any){
      var weekdays = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
      var day = date.getDay();
      return weekdays[day];
    }

  onDateChange(dateChanged:Date){

    //need to update ALL the TIMES ARRAY TO the correct DAY!!!
    this.selectedDate = dateChanged;
    console.log("selected Date: " + this.selectedDate);

    this.times = [];
    for(let hour = 10; hour <= 20; hour++) {
      var time = new Date(this.selectedDate);
      time.setHours(hour);
      
      var time2 = new Date(time);
      time2.setMinutes(30);

      this.times.push(time);
      this.times.push(time2);// h:mm A
  }

    this.displayedTimes = [];

    //get all the free times that are for the selected date
    this.displayedTimes = this.freeTimes.filter(item => item.getMonth() == dateChanged.getMonth() && item.getDay() == dateChanged.getDay());

    
    console.log('free times: ' + this.freeTimes);
    console.log('display times: ' + this.displayedTimes);    

  }

  doesExist(time:Date){

    if(this.displayedTimes.find(d => d.getTime() === time.getTime()) == undefined){
      return 'invisible';
    }else{
      return 'available-block';
    }
  }

  save(){
    if(this.freeTimes.length > 1){
      this.firestore.collection("meetings").doc(this.id).collection("responses").doc(this.name).set({freeTimes: this.freeTimes, name: this.name}).then((value) => {
        this.router.navigateByUrl('/' + this.id + "/result");
        //TODO display a spinner and undisplay here
      });
    }else{
      alert("Please select at least 1 free time");
    }
    
  }

  openDialog(){
    const dialogRef = this.dialog.open(NameDialogComponent,{
      data:{
        message: 'Name',
        buttonText: {
          cancel: 'Done'
        }
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.name = result;
      console.log(`Dialog result: ${result}`); 
    });
    
  }

  moveover(event:any){
    var touch = event.touches[0];
    
    //if client X or client Y is outside of our table. then do nothing
    var listPosition =  (<HTMLInputElement>this.document.getElementById("mat-list")).getBoundingClientRect();
     //console.log("current Y : " + touch.clientY + " list Y: " + listPosition.top + " " + listPosition.bottom);

    if((touch.clientY > listPosition.top && touch.clientY < listPosition.bottom) && touch.clientX > listPosition.left && touch.clientX < listPosition.right){
      var element = (<HTMLElement>this.document.elementFromPoint(touch.clientX, touch.clientY)).classList.toggle('highlight');
    }else{
      return;
    }

  }

}


