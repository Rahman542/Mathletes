let express = require('express'); //import express, because I want easier management of GET and POST requests.  
//let fs = require('fs');  //fs is used to manipulate the file system
let MySql = require('sync-mysql');  //MySql is used to manipulate a database connection
"use strict";

//set up the database connection 
const options = {
  user: 'mis116',
  password: 'BA56O6',
  database: 'mis116blue',
  host: 'dataanalytics.temple.edu'
};

// create the database connection
const connection = new MySql(options);

let app = express();  //the express method returns an instance of a app object
app.use(express.urlencoded({extended:false}));  //use this because incoming data is urlencoded

app.use(function(req, res, next) {
    express.urlencoded({extended:false})
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();  //go process the next matching condition
  });

//supporting functions *******************************************************************
/*let startGame = function(res,student_id,fname,lname){
    let txtSQL = "INSERT INTO student (student_id, fname, lname, level, total_points) VALUES (?, ?, ?, 'beginner', 0);";
     try{
     
        var result = connection.query(txtSQL,[student_id, fname, lname]);

    }
    catch(e){
        console.log(e);
         // the e is called an exception, to get a more detailed view
        responseWrite(res, "Unexpected Error (startGame)",500)
        return;
    }
    responseWrite(res,result.insertId, 200);
    return;
 };*/

 let updateLevel = function(res, question_id_1, question_id_2, question_id_3, question_id_4, question_id_5, student_id, studentAnswer1, studentAnswer2, studentAnswer3, studentAnswer4, studentAnswer5){
    let txtSQL = "SELECT * FROM questions WHERE question_id = ?;";
    let txtSQL2 = "SELECT * FROM student WHERE student_id = ?"
    
    try{
        var quizQuestion1 = connection.query(txtSQL,[question_id_1]);
        var quizQuestion2 = connection.query(txtSQL,[question_id_2]);
        var quizQuestion3 = connection.query(txtSQL,[question_id_3]);
        var quizQuestion4 = connection.query(txtSQL,[question_id_4]);
        var quizQuestion5 = connection.query(txtSQL,[question_id_5]);
        var resultStudent = connection.query(txtSQL2,[student_id]);
    }
    catch(e){
        console.log(e);
         // the e is called an exception, to get a more detailed view
        responseWrite(res, "Unexpected Error (updateLevel)",500)
        return;
    }
    
    var pointCounter = 0;

    var qq1 = quizQuestion1[0].quiz_answer;
    var qq2 = quizQuestion2[0].quiz_answer;
    var qq3 = quizQuestion3[0].quiz_answer;
    var qq4 = quizQuestion4[0].quiz_answer;
    var qq5 = quizQuestion5[0].quiz_answer;
    var question1 = quizQuestion1[0].question;
    var question2 = quizQuestion2[0].question;
    var question3 = quizQuestion3[0].question;
    var question4 = quizQuestion4[0].question;
    var question5 = quizQuestion5[0].question;
    var level = resultStudent[0].student_level;
    var totalPoints = resultStudent[0].total_points;

    if (qq1 == studentAnswer1){
        pointCounter += 1;
        var q1status = "correct"
    } else {
        var q1status = "incorrect"
    }
    if (qq2 == studentAnswer2){
        pointCounter += 1;
        var q2status = "correct"
    } else {
        var q2status = "incorrect"
    }
    if (qq3 == studentAnswer3){
        pointCounter += 1;
        var q3status = "correct"
    } else {
        var q3status = "incorrect"
    }
    if (qq4 == studentAnswer4){
        pointCounter += 1;
        var q4status = "correct"
    } else {
        var q4status = "incorrect"
    }
    if (qq5 == studentAnswer5){
        pointCounter += 1;
        var q5status = "correct"
    } else {
        var q5status = "incorrect"
    }

    let score = (pointCounter/5)*100
    totalPoints += pointCounter;
    createHistory(res,pointCounter,level,student_id)

    if (level == "beginner" && totalPoints >= 10){
        level = "intermediate"
        updateStudent(res,totalPoints,level,student_id)
    } else if (level == "intermediate" && totalPoints >= 20){
        level = "advanced"
        updateStudent(res,totalPoints,level,student_id)
    } else {
        //keep level the same but increase totalpoints
        updateStudent(res,totalPoints,level,student_id)
    }

    responseToClient = [{"questiontext" : question1, "studentAnswer" : studentAnswer1, "correctAnswer" : qq1, "questionStatus" : q1status}, 
                        {"questiontext" : question2, "studentAnswer" : studentAnswer2, "correctAnswer" : qq2, "questionStatus" : q2status},
                        {"questiontext" : question3, "studentAnswer" : studentAnswer3, "correctAnswer" : qq3, "questionStatus" : q3status},
                        {"questiontext" : question4, "studentAnswer" : studentAnswer4, "correctAnswer" : qq4, "questionStatus" : q4status},
                        {"questiontext" : question5, "studentAnswer" : studentAnswer5, "correctAnswer" : qq5, "questionStatus" : q5status},
                        {"score" : score}]
    responseWrite(res,responseToClient, 200);
    return;
};

let createHistory = function(res,pointcounter,history_level,student_id){
    txtSQL = "INSERT INTO history (pointcounter, history_level, student_id) VALUES (?,?,?)"
    try{
        var result = connection.query(txtSQL,[pointcounter, history_level, student_id]);
    }catch(e){
        console.log(e);
         // the e is called an exception, to get a more detailed view
        responseWrite(res, "Unexpected Error (createHistory)",500)
        return;
    }
    return;
}

let updateStudent = function(res,totalPoints,level,student_id){
    txtSQL = "UPDATE student SET student_level = ?, total_points = ? WHERE student_id = ?"
    try{
        var result = connection.query(txtSQL,[level, totalPoints, student_id]);
    }catch(e){
        console.log(e);
         // the e is called an exception, to get a more detailed view
        responseWrite(res, "Unexpected Error (updateStudent)",500)
        return;
    }
    return;
}


let getLevelBySTudentId = function(res,student_id){
    let txtSQL = "SELECT * FROM student WHERE student_id = ?"
    try{
        var result = connection.query(txtSQL,[student_id]);
        var level = result[0].student_level;
    }catch(e){
        console.log(e);
         // the e is called an exception, to get a more detailed view
        responseWrite(res, "Unexpected Error (getLevelBySTudentId)",500)
        return;
    }
    return level;
}

 let getLevel = function(res, student_id){
    ///Randint

    let level = getLevelBySTudentId(res, student_id)

    let txtSQL = " SELECT * FROM questions WHERE question_level = ? ORDER BY rand() LIMIT 5;";
    try{
        var result = connection.query(txtSQL,[level]);
    }
    catch(e){
        console.log(e);
         // the e is called an exception, to get a more detailed view
        responseWrite(res, "Unexpected Error (getLevel)",500)
        return;
    }
    responseWrite(res,result, 200);
    return;
 };

 let historyTable = function(res,student_id){
        
    let txtSQL = "SELECT * FROM history WHERE student_id = ?;";

    try{
       var result = connection.query(txtSQL,[student_id]);
   }
   catch(e){
       console.log(e);
        // the e is called an exception, to get a more detailed view
       responseWrite(res, "Unexpected Error (historyTable)",500)
       return;
   }
   responseWrite(res,result, 200);
   return;

};

let barchart = function(res){
    try{
    let txtSQL = "SELECT fname, lname, total_points FROM student;";
    let result = connection.query(txtSQL);
    responseWrite(res,result, 200);
    return;
}
    catch(e){
    console.log(e);
    responseWrite(res,"Unexpected Error (barchart)",500);
    return;
}
}; 

/*let progress = function(res){
    try{
    let txtSQL = "SELECT fname, lname, total_points FROM student;";
    let result = connection.query(txtSQL);
    responseWrite(res,result, 200);
    return;
}
    catch(e){
    console.log(e);
    responseWrite(res,"Unexpected Error (progress)",500);
    return;
}
}; */

let getLevelStudent = function(res, student_id){
    try{
    let result = getLevelBySTudentId(res, student_id)
    responseWrite(res,result, 200);
    return;
}
    catch(e){
    console.log(e);
    responseWrite(res,"Unexpected Error (getLevelStudent)",500);
    return;
}
}; 

/*let studentAnswer = function(res, student_id, question_id, student_answer){
    try{
        let txtSQL = "SELECT"
        let txtSQL2 = "INSERT INTO " //insert with a JOIN
        let result = connection.query(txtSQL2,[student_id, question_id, student_answer]);
        responseWrite(res,result, 200);
        return;
    }
    catch(e){
        console.log(e);
        responseWrite(res,"Unexpected Error (studentAnswer)",500);
        return;

    }
}*/
//responseWrite is a supporting function.  It sends 
// output to the API consumer and ends the response.
// This is hard-coded to always send a json response.
let responseWrite = function(res,Output,responseStatus){
    res.writeHead(responseStatus, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(Output));
    res.end();
};

//error trapping ************************************************************************
/*app.post("/student", function(req,res,next){
    let student_id = req.body.student_id;
    let fname = req.body.fname;
    let lname = req.body.lname;

    if (student_id == undefined || student_id == ''|| student_id == isNaN(student_id)){
        responseWrite(res, "The student_id was missing or incorrect.", 400);
        return;
    }
    if (fname == undefined || fname == '' || isNaN(fname) == false){
        responseWrite(res, "The fname key was missing or incorrect.", 400);
        return;
    }
    if (lname == undefined || lname == '' || isNaN(lname) == false){
        responseWrite(res, "The lname key was missing or incorrect.", 400);
        return;
    }
    next();
});*/

app.put("/level", function(req,res,next){
    let student_id = req.body.student_id;
    let question_id_1 = req.body.question_id_1
    let question_id_2 = req.body.question_id_2
    let question_id_3 = req.body.question_id_3
    let question_id_4 = req.body.question_id_4
    let question_id_5 = req.body.question_id_5
    let studentAnswer1 = req.body.studentAnswer1 
    let studentAnswer2 = req.body.studentAnswer2
    let studentAnswer3 = req.body.studentAnswer3
    let studentAnswer4 = req.body.studentAnswer4
    let studentAnswer5 = req.body.studentAnswer5


    if (student_id == undefined || student_id == ''|| student_id == isNaN(student_id)){
        responseWrite(res, "The student_id was missing or incorrect.", 400);
        return;
    }

    if (question_id_1 == undefined || question_id_1 == ''){
        responseWrite(res, "The question_id_1 key was missing or incorrect.", 400);
        return;
    }

    if (question_id_2 == undefined || question_id_2 == ''){
        responseWrite(res, "The question_id_2 key was missing or incorrect.", 400);
        return;
    }

    if (question_id_3 == undefined || question_id_3 == ''){
        responseWrite(res, "The question_id_3 key was missing or incorrect.", 400);
        return;
    }

    if (question_id_4 == undefined || question_id_4 == ''){
        responseWrite(res, "The question_id_4 key was missing or incorrect.", 400);
        return;
    }

    if (question_id_5 == undefined || question_id_5 == ''){
        responseWrite(res, "The question_id_5 key was missing or incorrect.", 400);
        return;
    }

    if (studentAnswer1 == undefined || studentAnswer1 == ''){
        responseWrite(res, "The studentAnswer1 key was missing or incorrect.", 400);
        return;
    }

    if (studentAnswer2 == undefined || studentAnswer2 == ''){
        responseWrite(res, "The studentAnswer2 key was missing or incorrect.", 400);
        return;
    }

    if (studentAnswer3 == undefined || studentAnswer3 == ''){
        responseWrite(res, "The studentAnswer3 key was missing or incorrect.", 400);
        return;
    }

    if (studentAnswer4 == undefined || studentAnswer4 == ''){
        responseWrite(res, "The studentAnswer4 key was missing or incorrect.", 400);
        return;
    }

    if (studentAnswer5 == undefined || studentAnswer5 == ''){
        responseWrite(res, "The studentAnswer5 key was missing or incorrect.", 400);
        return;
    }
    next();
});

app.get("/level", function(req,res,next){
    let student_id = req.query.student_id;
    //let question = req.query.question;
    //console.log(student_level);
    if (student_id == undefined || student_id == ''|| student_id == isNaN(student_id)){
        responseWrite(res, "The student_id was missing or incorrect.", 400);
        return;
    }
   /* if (question == undefined || question == ''){
        responseWrite(res, "The question was missing or incorrect.", 400);
        return;
    }*/
    next();
});

app.get("/levelstudent", function(req,res,next){
    let student_id = req.query.student_id;
    //let question = req.query.question;
    //console.log(student_level);
    if (student_id == undefined || student_id == ''|| student_id == isNaN(student_id)){
        responseWrite(res, "The student_id was missing or incorrect.", 400);
        return;
    }
   /* if (question == undefined || question == ''){
        responseWrite(res, "The question was missing or incorrect.", 400);
        return;
    }*/
    next();
});

/*app.post("/answer", function(req,res,next){
    let student_id = req.body.student_id;
    let question_id = req.body.question_id;
    let student_answer = req.body.student_answer;

    if (student_id == undefined || student_id == ''|| student_id == isNaN(student_id)){
        responseWrite(res, "The student_id was missing or incorrect.", 400);
        return;
    }
    if (question_id == undefined || question_id == ''|| question_id == isNaN(student_id)){
        responseWrite(res, "The question_id was missing or incorrect.", 400);
        return;
    }
    if (student_answer == undefined || student_answer == ''){
        responseWrite(res, "The student_answer was missing or incorrect.", 400);
        return;
    }
    next();
});*/

app.get("/history", function(req,res,next){
    let student_id = req.query.student_id;

    if (student_id == undefined || student_id == ''|| student_id == isNaN(student_id)){
        responseWrite(res, "The student_id was missing or incorrect.", 400);
        return;
    }
    next();
})

app.get("/barchart", function(req,res,next){
    next();
});

/*app.get("/progress", function(req,res,next){
    next();
});*/
//event handlers ************************************************************************
/*app.post("/student", function(req,res){
    let student_id = req.body.student_id;
    let fname = req.body.fname;
    let lname = req.body.lname;
    startGame(res,student_id,fname,lname);
});*/

app.put("/level", function(req, res){
    let student_id = req.body.student_id;
    let question_id_1 = req.body.question_id_1
    let question_id_2 = req.body.question_id_2
    let question_id_3 = req.body.question_id_3
    let question_id_4 = req.body.question_id_4
    let question_id_5 = req.body.question_id_5
    let studentAnswer1 = req.body.studentAnswer1 
    let studentAnswer2 = req.body.studentAnswer2
    let studentAnswer3 = req.body.studentAnswer3
    let studentAnswer4 = req.body.studentAnswer4
    let studentAnswer5 = req.body.studentAnswer5
    updateLevel(res, question_id_1, question_id_2, question_id_3, question_id_4, question_id_5, student_id, studentAnswer1, studentAnswer2, studentAnswer3, studentAnswer4, studentAnswer5);
});

app.get("/level", function(req, res){
    let student_id = req.query.student_id;
   // let question = req.query.question;
    getLevel(res, student_id);
});

app.get("/levelstudent", function(req, res){
    let student_id = req.query.student_id;
   // let question = req.query.question;
    getLevelStudent(res, student_id);
});

/*app.post("/answer", function(req,res){
    let student_id = req.body.student_id;
    let question_id = req.body.question_id;
    let student_answer = req.body.student_answer;
    studentAnswer(res, student_id, question_id, student_answer);
});*/

app.get("/history", function(req,res){
    let student_id = req.query.student_id;
    historyTable(res, student_id);
}); 

app.get('/barchart', function(req,res){
    barchart(res);
});

/*app.get('/progress', function(req,res){
    progress(res);
});*/

//what the app should do when it received a "GET" against the root
app.get('/', function(req, res) {
    //what to do if request has no route ... show instructions
    let message = [];
    
    /*message[message.length] = "Issue a POST against “./student”  that creates and returns a student_id for a given student." + 
    " The user must provide a fname and lname. The level will be beginner and the total_points will be set to 0."*/
    message[message.length] = " Issue a PUT against “./level” where the user has to provide question_id_1, question_id_2, question_id_3,"+
    " question_id_4, question_id_5, student_id, studentAnswer1, studentAnswer2, studentAnswer3, studentAnswer4, studentAnswer5. The pointcounter "+
    "awards 1 point for a correct student_answer. This adds to the total_points of a student. The service will add data to the history table and "+
    "update the student table. The student levels up every 10 points until they reach advanced."
    message[message.length] = " Issue a GET against “./level” where level returns 5 random questions for a quiz based on their level." +
    "The user must send a student_id."
    message[message.length] = " Issue a GET against “./history” with student_id to return the history of quiz results."
    message[message.length] = " Issue a GET against “./barchart” to return a barchart of totalpoints for all students." +
    " and return a progress bar of totalpoints needed to advance for the student."
    message[message.length] = " This web service was created by Rahman Mohammed, Sarah Park, Rebecca Murgia"
	responseWrite(res,message,200);
    return;
});
  
//This piece of code creates the server  
//and listens for requests on a specific port
//we are also generating a message once the 
//server is created
let server = app.listen(8215, "0.0.0.0" ,function(){
    let host = server.address().address;
    let port = server.address().port;
    console.log("The endpoint server is listening on port:" + port);
});