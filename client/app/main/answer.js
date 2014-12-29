'use strict';

 var generateAnswerPlaceholder = (function () {
   var answers = {};
   
   return function(quizAnswer, userAnswer, validation){
        quizAnswer = quizAnswer.toUpperCase();
        var answer_table = $('.answerTable').find('tbody').empty();
        var tr = $('<tr>').appendTo(answer_table);
        console.log("quizAnswer = " + quizAnswer);

        if(answers[quizAnswer] != null){
          console.log("========== Answer is in cache : " + answers[quizAnswer]);
          console.log("answers[quizAnswer].length = " + answers[quizAnswer].length)
          console.log("quizAnswer in cache = " + answers[quizAnswer]);
          console.log("validation = " + validation);
          console.log("userAnswer = " + userAnswer);
          
          /*
           * check if user answer is null 
           */
          var ans_positions = {};
          for(var i = 1; i < answers[quizAnswer].length; i++){
            ans_positions[i] = [];
            ans_positions[i].push(answers[quizAnswer][i]);
            ans_positions[i].push(false);
          }

          console.log("ans_positions[1] = " + ans_positions[1]);


          //user answer not null
          if(answers[quizAnswer].indexOf(userAnswer) > -1){
            var userAnswer_len = userAnswer.split(" ").length;
            console.log("userAnswer_len = " + userAnswer_len);
            
            //Check answer length
            //Answer is in cache : POKER FACE,POKER,FACE
            if(userAnswer_len == 1){
              var userAnswer_pos = answers[quizAnswer].indexOf(userAnswer);
              console.log("userAnswer_pos = " + userAnswer_pos);
              ans_positions[userAnswer_pos][1] = true;
              console.log("ans_positions[1] = " + ans_positions[1]);
            //User answer is longer than one word
            }else{ 
              userAnswer = userAnswer.split(" ");
              console.log("USER ANSWERS ARE  = " + userAnswer);
              for(var l = 0; l < userAnswer.length; l++){
                var pos = answers[quizAnswer].indexOf(userAnswer[l]);
                ans_positions[pos][1] = true;
              }
              console.log("ans_positions[1] = " + ans_positions[1]);
              console.log("ans_positions[2] = " + ans_positions[2]);
            }
            for(var j = 1; j < answers[quizAnswer].length; j++){
              for(var k = 0; k < answers[quizAnswer][j].length; k++){
                ans_positions[j][1] == false ? $("<td>").text('__').appendTo(tr) : $("<td>").text(''+ ans_positions[j][0][k]).appendTo(tr);
              }
              if(j !== quizAnswer.length - 1){
                $("<td style='text-decoration: none;'>").html('&nbsp;&nbsp;&nbsp;&nbsp;').appendTo(tr);
              }
            }
          }else{ 
            console.log("userAnswer is null");
            for(var j = 1; j < answers[quizAnswer].length; j++){
              for(var k = 0; k < answers[quizAnswer][j].length; k++){
                $("<td>").text('__').appendTo(tr);
              }
              if(j !== quizAnswer.length - 1){
                $("<td style='text-decoration: none;'>").html('&nbsp;&nbsp;&nbsp;&nbsp;').appendTo(tr);
              }
            }
          }
        }else{
          console.log("========== Answer NOT in cache yet!");
          answers[quizAnswer] = [];
          answers[quizAnswer].push(quizAnswer);
          console.log("answers[quizAnswer] = " + answers[quizAnswer]);
          var quiz_answer =  answers[quizAnswer][0].split(" ");
          console.log("quiz_answer = " + quiz_answer);
          for(var k = 0; k < quiz_answer.length; k++){
            answers[quizAnswer].push(quiz_answer[k]);
          }
          console.log("answers[quizAnswer] = " + answers[quizAnswer]);
        }
   };
}());

 