"use strict";

/* SOME CONSTANTS */
let endpoint01 = "https://misdemo.temple.edu/auth";
let endpoint02= "https://mis3502-rmohammed.com/8215";
//let endpoint02 = "";

/* SUPPORTING FUNCTIONS */


//GET to ./levelstudent
let levelstudent = function(){
	let the_serialized_data = "student_id=" + localStorage.usertoken;
	//console.log(the_serialized_data)
	$.ajax({
		"url" : endpoint02 + "/levelstudent",
		"method" : "GET",
		"data" : the_serialized_data,
		"success" : function(result){
			console.log(result);
			//console.log("levelstudent worked!");
			$("#studentlevel").val(result);
			progressbar()
			if(result == "beginner"){
				$("#intermediatedisplay").hide();
				$("#advanceddisplay").hide();
				$("#beginnerdisplay").show();
			}
			if(result == "intermediate"){
				$("#beginnerdisplay").hide();
				$("#advanceddisplay").hide();
				$("#intermediatedisplay").show();
			}
			if(result == "advanced"){
				$("#beginnerdisplay").hide();
				$("#intermediatedisplay").hide();
				$("#advanceddisplay").show();
			}	
		},
		"error" : function(data){
			console.log("Something went wrong");
			console.log(data);
		},
	});
}

//GET to ./barchart
let progressbar = function(){
	//let the_serialized_data = ""
	//console.log(the_serialized_data)
	$.ajax({
		"url" : endpoint02 + "/barchart",
		"method" : "GET",
		"data" : {},
		"success" : function(result){
			console.log(result);
			//console.log("progressbar worked!")	
			let userid = localStorage.usertoken - 1;
			let level = $("#studentlevel").val();
			let points = result[userid].total_points;
			if(level == "beginner"){
				let percentage = (points / 10)*100;
				percentage = percentage.toFixed(2);
				let reverse = 100-percentage;
				makeProgressBarBeginner(percentage,reverse);
			}
			if(level == "intermediate"){
				let percentage = (points / 20)*100;
				percentage = percentage.toFixed(2);
				let reverse = 100-percentage;
				makeProgressBarIntermediate(percentage,reverse);
			}
			if(level == "advanced" && points <= 30){
				let percentage = (points / 30)*100;
				percentage = percentage.toFixed(2);
				let reverse = 100-percentage;
				makeProgressBarAdvanced(percentage,reverse);
			}
			if(level == "advanced" && points > 30){
				makeProgressBarAdvanced("100","0");
			}
		},
		"error" : function(data){
			console.log("Something went wrong");
			console.log(data);
		},
	});
}

let makeProgressBarBeginner = function(percentage, reverse){
	let imageurl = "https://image-charts.com/chart?chco=F5C1CB%2CFFFFFF&chd=a:"+ percentage +"|"+reverse+"&chf=bg%2Cs%2CFFFFFF00%7Cb0%2Clg%2C0%2CF5C1CB%2C0.9%2CF5C1CB%2C0.2&chl=    "+ percentage + "%&chma=-10%2C0%2C0%2C-10&chs=700x80&cht=bhs&chxs=0%2CFFFFFF00%2C0%2C-1%2C_%2CFFFFFF00%2CFFFFFF00%7C1%2CFFFFFF00%2C0%2C-1%2C_%2CFFFFFF00%2CFFFFFF00&chxt=x%2Cy"
	$("#progressbar-beginner").attr("src",imageurl);
}
let makeProgressBarIntermediate = function(percentage, reverse){
	let imageurl = "https://image-charts.com/chart?chco=F5C1CB%2CFFFFFF&chd=a:"+ percentage +"|"+reverse+"&chf=bg%2Cs%2CFFFFFF00%7Cb0%2Clg%2C0%2CF5C1CB%2C0.9%2CF5C1CB%2C0.2&chl=    "+ percentage + "%&chma=-10%2C0%2C0%2C-10&chs=700x80&cht=bhs&chxs=0%2CFFFFFF00%2C0%2C-1%2C_%2CFFFFFF00%2CFFFFFF00%7C1%2CFFFFFF00%2C0%2C-1%2C_%2CFFFFFF00%2CFFFFFF00&chxt=x%2Cy"
	$("#progressbar-intermediate").attr("src",imageurl);
}
let makeProgressBarAdvanced = function(percentage, reverse){
	let imageurl = "https://image-charts.com/chart?chco=F5C1CB%2CFFFFFF&chd=a:"+ percentage +"|"+reverse+"&chf=bg%2Cs%2CFFFFFF00%7Cb0%2Clg%2C0%2CF5C1CB%2C0.9%2CF5C1CB%2C0.2&chl=    "+ percentage + "%&chma=-10%2C0%2C0%2C-10&chs=700x80&cht=bhs&chxs=0%2CFFFFFF00%2C0%2C-1%2C_%2CFFFFFF00%2CFFFFFF00%7C1%2CFFFFFF00%2C0%2C-1%2C_%2CFFFFFF00%2CFFFFFF00&chxt=x%2Cy"
	$("#progressbar-advanced").attr("src",imageurl);
}

//GET to ./level with student_id
let level = function(){
	let the_serialized_data = "student_id=" + localStorage.usertoken;
	//console.log(the_serialized_data)
	$.ajax({
		"url" : endpoint02 + "/level",
		"method" : "GET",
		"data" : the_serialized_data,
		"success" : function(result){
			$("#questiontext1").html("Question 1: <br>");
			$("#questiontext2").html("Question 2: <br>");
			$("#questiontext3").html("Question 3: <br>");
			$("#questiontext4").html("Question 4: <br>");
			$("#questiontext5").html("Question 5: <br>");
			$('input[name=studentAnswer1]').prop('checked',false);
			$('input[name=studentAnswer2]').prop('checked',false);
			$('input[name=studentAnswer3]').prop('checked',false);
			$('input[name=studentAnswer4]').prop('checked',false);
			$('input[name=studentAnswer5]').prop('checked',false);
			let leveltitle = $("#studentlevel").val();
			let newleveltitle = leveltitle[0].toUpperCase()
			for (let i = 1; i < leveltitle.length; i++){
				newleveltitle = newleveltitle + leveltitle[i]
			}
			//console.log(leveltitle[0].toUpperCase())
			$("#leveltitle").html(newleveltitle);

			console.log(result);
			//console.log("level worked!")
			let question_id_1 = result[0]["question_id"]
			$("#question_id_1").val(question_id_1);

			let question_id_2 = result[1]["question_id"]
			$("#question_id_2").val(question_id_2);

			let question_id_3 = result[2]["question_id"]
			$("#question_id_3").val(question_id_3);

			let question_id_4 = result[3]["question_id"]
			$("#question_id_4").val(question_id_4);

			let question_id_5 = result[4]["question_id"]
			$("#question_id_5").val(question_id_5);
			
			let question1 = result[0]["question"]
			$("#questiontext1").append(question1);

			let quizanswer1 = result[0]["quiz_answer"]
			$("#levelanswer1-1").html(quizanswer1)
			$("#answer1-1").attr("value",quizanswer1)

			let wronganswer11 = result[0]["wrong_answer_1"]
			$("#levelanswer1-2").html(wronganswer11)
			$("#answer1-2").attr("value",wronganswer11)

			let wronganswer12 = result[0]["wrong_answer_2"]
			$("#levelanswer1-3").html(wronganswer12)
			$("#answer1-3").attr("value",wronganswer12)




			let question2 = result[1]["question"]
			$("#questiontext2").append(question2);

			let quizanswer2 = result[1]["quiz_answer"]
			$("#levelanswer2-1").html(quizanswer2)
			$("#answer2-1").attr("value",quizanswer2)

			let wronganswer21 = result[1]["wrong_answer_1"]
			$("#levelanswer2-2").html(wronganswer21)
			$("#answer2-2").attr("value",wronganswer21)

			let wronganswer22 = result[1]["wrong_answer_2"]
			$("#levelanswer2-3").html(wronganswer22)
			$("#answer2-3").attr("value",wronganswer22)



			let question3 = result[2]["question"]
			$("#questiontext3").append(question3);

			let quizanswer3 = result[2]["quiz_answer"]
			$("#levelanswer3-1").html(quizanswer3)
			$("#answer3-1").attr("value",quizanswer3)

			let wronganswer31 = result[2]["wrong_answer_1"]
			$("#levelanswer3-2").html(wronganswer31)
			$("#answer3-2").attr("value",wronganswer31)

			let wronganswer32 = result[2]["wrong_answer_2"]
			$("#levelanswer3-3").html(wronganswer32)
			$("#answer3-3").attr("value",wronganswer32)



			let question4 = result[3]["question"]
			$("#questiontext4").append(question4);

			let quizanswer4 = result[3]["quiz_answer"]
			$("#levelanswer4-1").html(quizanswer4)
			$("#answer4-1").attr("value",quizanswer4)

			let wronganswer41 = result[3]["wrong_answer_1"]
			$("#levelanswer4-2").html(wronganswer41)
			$("#answer4-2").attr("value",wronganswer41)

			let wronganswer42 = result[3]["wrong_answer_2"]
			$("#levelanswer4-3").html(wronganswer42)
			$("#answer4-3").attr("value",wronganswer42)



			let question5 = result[4]["question"]
			$("#questiontext5").append(question5);

			let quizanswer5 = result[4]["quiz_answer"]
			$("#levelanswer5-1").html(quizanswer5)
			$("#answer5-1").attr("value",quizanswer5)

			let wronganswer51 = result[4]["wrong_answer_1"]
			$("#levelanswer5-2").html(wronganswer51)
			$("#answer5-2").attr("value",wronganswer51)

			let wronganswer52 = result[4]["wrong_answer_2"]
			$("#levelanswer5-3").html(wronganswer52)
			$("#answer5-3").attr("value",wronganswer52)


			if(leveltitle == "beginner"){
				$("#levelimages").html('<img src="css/abacus.gif" alt="" style="width:60%"><br><br><br><br><br><br><img src="css/maths.gif" alt="" style="width:60%"><br><br><br><br><br><br><img src="css/pencil.gif" alt="" style="width:60%"><br><br><br><br>');
			}
			if(leveltitle == "intermediate"){
				$("#levelimages").html('<img src="css/math.gif" alt="" style="width:60%"><br><br><br><br><br><br><img src="css/mathss.gif" alt="" style="width:60%"><br><br><br><br><br><br><img src="css/classroom.gif" alt="" style="width:60%"><br><br><br><br>')
			}
			if(leveltitle == "advanced"){
				$("#levelimages").html('<img src="css/calculator.gif" alt="" style="width:60%"><br><br><br><br><br><br><img src="css/diploma.gif" alt="" style="width:60%"><br><br><br><br><br><br><img src="css/mortarboard.gif" alt="" style="width:60%"><br><br><br><br>')
			}
			

			
		},
		"error" : function(data){
			console.log("Something went wrong");
			console.log(data);
		},
	});
}

//PUT to ./level with (student_id=1&question_id_1=1&studentAnswer1=19&question_id_2=2&studentAnswer2=20&question_id_3=3&studentAnswer3=14&question_id_4=4&studentAnswer4=17&question_id_5=5&studentAnswer5=21)
let checkGame = function(){
	$("#table-results").html("");
	$("#beginnerMessage").removeClass()
	$("#beginnerMessage").html("")

	let the_serialized_data = $("#form-beginner").serialize();
	the_serialized_data = the_serialized_data + "&student_id=" + localStorage.usertoken
	//console.log(the_serialized_data);

	let serialized_group_1 = $("#fieldsetq1").serialize()
	let serialized_group_2 = $("#fieldsetq2").serialize()
	let serialized_group_3 = $("#fieldsetq3").serialize()
	let serialized_group_4 = $("#fieldsetq4").serialize()
	let serialized_group_5 = $("#fieldsetq5").serialize()

	if(serialized_group_1.length < 25 || serialized_group_2.length < 25 || serialized_group_3.length < 25 || serialized_group_4.length < 25 || serialized_group_5.length < 25){
		$("#beginnerMessage").addClass("alert alert-danger")
		$("#beginnerMessage").html("Please answer all the questions before submitting")
		return;
	}


	$.ajax({
		"url" : endpoint02 + "/level",
		"method" : "PUT",
		"data" : the_serialized_data,
		"success" : function(result){
			console.log(result);
			//console.log("checkGame worked!")
			let score = result[5].score	
			$("#score").html("Score: " + score + "%");

			for(let i = 0 ; i < 5 ; i++){
				let question = result[i].questiontext
				let questionnumber = i + 1
				let studentanswer = result[i].studentAnswer
				let correctanswer = result[i].correctAnswer
				let status = result[i].questionStatus
				$("#table-results").append('<tr><td width="10%"><img src="css/' + status + '.png" style="width:60%"></td><td width="90%">Question ' + questionnumber + ': ' + question + '</td></tr><tr><td></td><td>Your answer: ' + studentanswer + '</td></tr><tr><td></td><td>Correct Answer: ' + correctanswer + '</td></tr<tr><td><br /></td></tr><tr><td><br /></td></tr>');
			}

			$(".content-wrapper").hide();
			$("#div-results").show();

		},
		"error" : function(data){
			console.log("Something went wrong");
			console.log(data);
		},
	});
}

//GET to ./history with student_id
let history = function(){
	$("#table-history").html("<tr><th>Attempt</th><th>Score</th></tr>")
	
	let the_serialized_data = "student_id=" + localStorage.usertoken;
	console.log(the_serialized_data);
	$.ajax({
		"url" : endpoint02 + "/history",
		"method" : "GET",
		"data" : the_serialized_data,
		"success" : function(result){
			console.log(result);
			//console.log("history worked!")
			
			for(let i = 0; i<result.length; i++){
				let attempt = i + 1;
				let pointcounter = result[i].pointcounter;
				let score = (pointcounter / 5) * 100
				$("#table-history").append('<tr><td>' + attempt + '</td><td>' + score + '%</td></tr>');
			}	
		
		},
		"error" : function(data){
			console.log("Something went wrong");
			console.log(data);
		},
	});
}

//GET to ./barchart
let barchart = function(){
	//let the_serialized_data = "";
	//console.log(the_serialized_data);
	$.ajax({
		"url" : endpoint02 + "/barchart",
		"method" : "GET",
		"data" : {},
		"success" : function(result){
			console.log(result);
			//console.log("barchart worked!")	

			var data = google.visualization.arrayToDataTable([
				['Name', 'Points', {role: 'style'}],
				[result[0].fname, result[0].total_points, '#87ddf4'],
				[result[1].fname, result[1].total_points, '#87ddf4'],
				[result[2].fname, result[2].total_points, '#87ddf4'],
				[result[3].fname, result[3].total_points, '#87ddf4'],
				[result[4].fname, result[4].total_points, '#87ddf4'],
				[result[5].fname, result[5].total_points, '#87ddf4'],
				[result[6].fname, result[6].total_points, '#87ddf4'],
				[result[7].fname, result[7].total_points, '#87ddf4'],
				[result[8].fname, result[8].total_points, '#87ddf4'],
				[result[9].fname, result[9].total_points, '#87ddf4'],
				[result[10].fname, result[10].total_points, '#87ddf4'],
				[result[11].fname, result[11].total_points, '#87ddf4']
			  ]);
		
			  var options = {
				title: 'Competition Bar Chart',
				chartArea: {width: '50%'}, 
				width: '100%', height: 450,
				legend: 'none',
				hAxis: {
				  title: 'Total Points',
				  minValue: 0
				},
				vAxis: {
				  title: 'Name'
				}
			  };
		
			  var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
		
			  chart.draw(data, options);
		},
		"error" : function(data){
			console.log("Something went wrong");
			console.log(data);
		},
	});
}

let playagain = function(){
	let the_serialized_data = "student_id=" + localStorage.usertoken;
	console.log(the_serialized_data)
	$.ajax({
		"url" : endpoint02 + "/levelstudent",
		"method" : "GET",
		"data" : the_serialized_data,
		"success" : function(result){
			console.log(result);
			//console.log("levelstudent worked!");
			$("#studentlevel").val(result);
			if(result == "beginner"){
				$("#intermediatedisplay").hide();
				$("#advanceddisplay").hide();
				$("#beginnerdisplay").show();
			}
			if(result == "intermediate"){
				$("#beginnerdisplay").hide();
				$("#advanceddisplay").hide();
				$("#intermediatedisplay").show();
			}
			if(result == "advanced"){
				$("#beginnerdisplay").hide();
				$("#intermediatedisplay").hide();
				$("#advanceddisplay").show();
			}
			level();
		},
		"error" : function(data){
			console.log("Something went wrong");
			console.log(data);
		},
	});
}

/*
//beginner
let checkResultsBeginner = function(){
	//$("#div-gamelevel").hide();
	//$("#div-gameBeginner").show();
	console.log("hello")
	var field1 = $("#fieldsetq1").serialize();
	var field2 = $("#fieldsetq2").serialize();
	var field3 = $("#fieldsetq3").serialize();
	var field4 = $("#fieldsetq4").serialize();
	var field5 = $("#fieldsetq5").serialize();
	console.log(field1)

    if (field1 == "" || field2 == "" || field3 == "" || field4 == "" || field5 == ""){
        console.log("you are missing answers")
		//$("#div-gamelevel").hide();
		//$("#div-results").hide();
		//$("#div-gameBeginner").show();
		$("#beginnerMessage").addClass("alert alert-danger")
		$("#beginnerMessage").html("Please select an answer for each question")
    } else {
        var serialized = $("#form-beginner").serialize()
        console.log(serialized)
		$("#div-gameBeginner").hide();
		$("#div-results").show();
    }
		//$("#div-gameBeginner").hide();
		//$("#div-results").show();
}

//intermediate
let checkResultsIntermediate = function(){
	//$("#div-gamelevel").hide();
	//$("#div-gameBeginner").show();
	console.log("hello")
	var field1 = $("#fieldsetq1").serialize();
	var field2 = $("#fieldsetq2").serialize();
	var field3 = $("#fieldsetq3").serialize();
	var field4 = $("#fieldsetq4").serialize();
	var field5 = $("#fieldsetq5").serialize();
	console.log(field1)

    if (field1 == "" || field2 == "" || field3 == "" || field4 == "" || field5 == ""){
        console.log("you are missing answers")
		//$("#div-gamelevel").hide();
		//$("#div-results").hide();
		//$("#div-gameBeginner").show();
		$("#beginnerMessage").addClass("alert alert-danger")
		$("#beginnerMessage").html("Please select an answer for each question")
    } else {
        var serialized = $("#form-beginner").serialize()
        console.log(serialized)
		$("#div-gameBeginner").hide();
		$("#div-results").show();
    }
		//$("#div-gameBeginner").hide();
		//$("#div-results").show();
}

//advanced
let checkResultsAdvanced = function(){
	//$("#div-gamelevel").hide();
	//$("#div-gameBeginner").show();
	console.log("hello")
	var field1 = $("#fieldsetq1").serialize();
	var field2 = $("#fieldsetq2").serialize();
	var field3 = $("#fieldsetq3").serialize();
	var field4 = $("#fieldsetq4").serialize();
	var field5 = $("#fieldsetq5").serialize();
	console.log(field1)

    if (field1 == "" || field2 == "" || field3 == "" || field4 == "" || field5 == ""){
        console.log("you are missing answers")
		//$("#div-gamelevel").hide();
		//$("#div-results").hide();
		//$("#div-gameBeginner").show();
		$("#beginnerMessage").addClass("alert alert-danger")
		$("#beginnerMessage").html("Please select an answer for each question")
    } else {
        var serialized = $("#form-beginner").serialize()
        console.log(serialized)
		$("#div-gameBeginner").hide();
		$("#div-results").show();
    }
		//$("#div-gameBeginner").hide();
		//$("#div-results").show();
}
*/
let loginController = function(){
	//clear any previous messages
	$('#login_message').html("");
	$('#login_message').removeClass();

	//first, let's do some client-side 
	//error trapping.
	let username = $("#username").val();
	let password = $("#password").val();
	if (username == "" || password == ""){
		$('#login_message').html('The user name and password are both required.');
		$('#login_message').addClass("alert alert-danger text-center");
		return; //quit the function now!  Get outta town!  Stop. 
	}
	
	//whew!  We didn't quit the function because of an obvious error
	//what luck!  Let's go make an ajax call now

	//go get the data off the login form
	let the_serialized_data = $('#form-login').serialize();
	//the data I am sending
	//console.log(the_serialized_data);;
	$.ajax({
		"url" : endpoint01,
		"method" : "GET",
		"data" : the_serialized_data,
		"success" : function(result){
			console.log(result); //the result I got back
			if (typeof result === 'string'){
				// login failed.  Remove usertoken 
				localStorage.removeItem("usertoken");
				$('#login_message').html("Login Failed. Try again.");
				$('#login_message').addClass("alert alert-danger text-center");
			} else {
				//login succeeded.  Set usertoken.
				localStorage.usertoken = result['user_id']; 
				//console log the result ... a bad idea in prodcution
				//but useful for teaching, learning and testing
				console.log(result);
				//manage the appearence of things...
				$('#login_message').html('');
				$('#login_message').removeClass();
				$('.secured').removeClass('locked');
				$('.secured').addClass('unlocked');
				$('#div-login').hide(); //hide the login page
				$("#usertoken").val(localStorage.usertoken);
				//$("#usertoken").val("Hello")
				levelstudent();
				//progressbar();
				$('#div-gamelevel').show();   //show the default page
				$("#beginnerdisplay").hide();
				$("#intermediatedisplay").hide();
				$("#advanceddisplay").hide();
			}			
		},
		"error" : function(data){
			console.log("Something went wrong");
			console.log(data);
		},
	}); //end of ajax 

	//scroll to top of page
	$("html, body").animate({ scrollTop: "0px" });
};
/*
$.ajax({
	"url" : endpoint02,
	"method" : "",
	"data" : the_serialized_data,
	"success" : function(result){
		console.log(result);	
	},
	"error" : function(data){
		console.log("Something went wrong");
		console.log(data);
	},
});
*/


//document ready section
$(document).ready(function (){
google.charts.load('current', {packages: ['corechart', 'bar']});
    /* ----------------- start up navigation -----------------*/	
    /* controls what gets revealed when the page is ready     */

    /* this reveals the default page */
	if (localStorage.usertoken){
		$("#usertoken").val(localStorage.usertoken);
		levelstudent();
		//progressbar();
		$("#div-gamelevel").show()
		$("#beginnerdisplay").hide();
		$("#intermediatedisplay").hide();
		$("#advanceddisplay").hide();

		$(".secured").removeClass("locked");		
		$(".secured").addClass("unlocked");
	}
	else {
		$("#div-login").show();
		$(".secured").removeClass("unlocked");
		$(".secured").addClass("locked");
	}

    /* ------------------  basic navigation -----------------*/	
    /* this controls navigation - show / hide pages as needed */

	/* links on the menu */
	$('#link-history').click(function(){
		$(".content-wrapper").hide(); 	/* hide all content-wrappers */
		$("#div-history").show(); /* show the chosen content wrapper */
		history();
		barchart();
		$("#table-results").html("");
	});
		
	$('#link-level').click(function(){
		$(".content-wrapper").hide();
		levelstudent();
		//progressbar();
		$("#div-gamelevel").show()
		$("#beginnerdisplay").hide();
		$("#intermediatedisplay").hide();
		$("#advanceddisplay").hide();
		$("#table-results").html("");
		progressbar(); 
	});

	$('#link-gameBeginner').click(function(){
		$(".content-wrapper").hide(); 	
		$("#div-gamelevel").hide();
		$("#div-gameBeginner").show(); 
	});
	$('#link-gameIntermediate').click(function(){
		$(".content-wrapper").hide(); 	
		$("#div-gameIntermediate").show(); 
	});
	$('#link-gameAdvanced').click(function(){
		$(".content-wrapper").hide(); 	
		$("#div-gameAdvanced").show(); 
	});
	$('#link-results').click(function(){
		$(".content-wrapper").hide(); 	
		$("#div-results").show(); 
	});
	/* what happens if any of the navigation links are clicked? */
	$('.nav-link').click(function(){
		$("html, body").animate({ scrollTop: "0px" }); /* scroll to top of page */
		$(".navbar-collapse").collapse('hide'); /* explicitly collapse the navigation menu */
	});

	/* what happens if the login button is clicked? */
	$('#btnLogin').click(function(){
		loginController();
	});
//beginner
	$('#btnBeginner').click(function(){
		$("#div-gamelevel").hide();
		$("#div-gameBeginner").show();
		level();
	});
	
	$('#submitBeginner').click(function(){
		//checkResultsBeginner();
		checkGame();
	});

//intermediate
	$('#btnIntermediate').click(function(){
		$("#div-gamelevel").hide();
		$("#div-gameBeginner").show();
		level();
	});
	$('#submitIntermediate').click(function(){
		//checkResultsIntermediate();
		checkGame();
	});

//advancedconsole
	$('#btnAdvanced').click(function(){
		$("#div-gamelevel").hide();
		$("#div-gameBeginner").show();
		level();
	});
	$('#submitAdvanced').click(function(){
		//checkResultsAdvanced();
		checkGame();
	});

	$('#btnPlayAgain').click(function(){
		$(".content-wrapper").hide();
		$("#div-results").hide();
		$("#div-gameBeginner").show();
		$("#table-results").html("");
		//levelstudent();
		//level();
		playagain();
	});
	
	/* what happens if the logout link is clicked? */
	$('#link-logout').click(function(){
		// First ... remove usertoken from localstorage
		localStorage.removeItem("usertoken");
		// Now force the page to refresh
		window.location = "./index.html";
	});

}); /* end the document ready event*/