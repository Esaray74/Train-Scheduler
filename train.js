// Initialize Firebase
var config = {
    apiKey: "AIzaSyBLBtj-npZTNwxzsvABPcnNyGsIn7CI_lY",
    authDomain: "train-scheduler-87a39.firebaseapp.com",
    databaseURL: "https://train-scheduler-87a39.firebaseio.com",
    projectId: "train-scheduler-87a39",
    storageBucket: "",
    messagingSenderId: "1057240856236"
};
firebase.initializeApp(config);

var database = firebase.database();

var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";
var addTrain = $("#train-name");
var addTrainDestination = $("#train-destination");
var addTrainTime = $("#train-time");
var addTimeFreq = $("#time-freq");

database.ref().on("child_added", function (snapshot) {
    var trainDiff = 0;
    var trainRemainder = 0;
    var minutesTillArrival = "";
    var nextTrainTime = "";
    var frequency = snapshot.val().frequency;

    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");
    trainRemainder = trainDiff % frequency;
    minutesTillArrival = frequency - trainRemainder;
    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

    $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    //--------------
    $("span").hide();

    
   

    //--------------
});


var storeInputs = function(event) {
    event.preventDefault();

    trainName = addTrain.val().trim();
    trainDestination = addTrainDestination.val().trim();
    trainTime = moment(addTrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = addTimeFreq.val().trim();

    database.ref().push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    addTrain.val("");
    addTrainDestination.val("");
    addTrainTime.val("");
    addTimeFreq.val("");
};

$("#btn-add").on("click", function(event) {
    if (addTrain.val().length === 0 || addTrainDestination.val().length === 0 || addTrainTime.val().length === 0 || addTimeFreq === 0) {
        alert("Please Fill All Required Fields");
    } else {
        storeInputs(event);
    }
});
