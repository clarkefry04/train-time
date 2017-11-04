/* global moment firebase */
var config = {
    apiKey: "AIzaSyBdddcXt-HQJ_fRqAVXZbxJF7N-5fXMlMo",
    authDomain: "traintime-81b63.firebaseapp.com",
    databaseURL: "https://traintime-81b63.firebaseio.com",
    projectId: "traintime-81b63",
    storageBucket: "traintime-81b63.appspot.com",
    messagingSenderId: "1086447700150"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Initial Values
var trainName = "Kansas City Southern";
var destination = "Kansas City";
var firstTrainTime = "12:00";
var frequency = "5";



//Call values from page and insert into Firebase
$(document).on("click", ".submit", function(){

  trainName = $("#trainName").val().trim();
  destination = $("#destination").val().trim();
  firstTrainTime = $("#firstTrainTime").val().trim();
  frequency =$("#frequency").val().trim();

  var firstTrainTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
  var currentTime = moment();
  var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes")
  var tRemainder = diffTime % frequency;
  var minutesUntilTrain = frequency - tRemainder;
  var nextTrain = moment().add(minutesUntilTrain, "minutes");
  var nextTrainFormatted = moment(nextTrain).format("hh:mm");

  console.log(database.ref());
  database.ref("trains").push(
    {
    Name: trainName,
    Destination: destination,
    FirstTrainTime: firstTrainTime,
    Frequency: frequency,
    nextTrainFormatted: nextTrainFormatted,
    minutesUntilTrain: minutesUntilTrain,
  });

console.log(database.ref().child("trains"));

});

var trainRef= database.ref("trains");


trainRef.on('value', function(snapshot){
  $(".train-data-table").empty();
  snapshot.forEach(function(childSnapshot) {
  
  console.log(childSnapshot.val().Name);
  var newTR = $("<tr>");
  var newTrain = $("<td>");
  var newDestination = $("<td>");
  var newFrequency = $("<td>");
  var newArrival = $("<td>");
  var newMinutesAway = $("<td>");

  newTrain.text(childSnapshot.val().Name);
  newDestination.text(childSnapshot.val().Destination);
  newFrequency.text(childSnapshot.val().Frequency);
  newArrival.text(childSnapshot.val().nextTrainFormatted);
  newMinutesAway.text(childSnapshot.val().minutesUntilTrain);
  
  newTR.append(newTrain);
  newTR.append(newDestination);
  newTR.append(newFrequency);
  newTR.append(newArrival);
  newTR.append(newMinutesAway);
  console.log(newTR);

 $(".train-data-table").append(newTR);

     // clear text-boxes
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrainTime").val("");
    $("#frequency").val("");


    // Prevents page from refreshing
    return false;
  });
});
