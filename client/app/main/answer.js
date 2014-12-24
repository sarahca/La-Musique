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
 $(function(){
    var isMouseDown = false;
    var isSelected;
    var selectedWord = "";
    var alphabetSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var maxCellSize = 9;
    var validation = false;
    populateTable();
    generateAnswer("Poker Face");
    
    $("#musicSearch td")
      .on("mousedown",function() {
        isMouseDown = true;
        selectedWord += $(this).text();
        $(this).addClass("selected");
        //isSelected = $(this).hasClass("selected");
        return false;
      })

      .on("mouseover",function () {
        if (isMouseDown) {
          selectedWord += $(this).text();
          $(this).addClass("selected");
        }
      })

      .on("mouseup", function(){
          isMouseDown = false;
          console.log("SELECTED WORD = " + selectedWord);
          checkAnswer(selectedWord);
          selectedWord = "";
      })

    function checkAnswer(input){
      if(input === "POKER" || input === "FACE"){
        console.log("CORRECT");
        $('#musicSearch td').each(function(i, elem){
          if($(elem).hasClass("selected") == true){
            $(elem).addClass("selectedSuccess");
            $(elem).removeClass("selected");
          }
        })
        
      }else{
        console.log("INCORRECT");
        $('#musicSearch td').removeClass("selected");

      }

    }

    function populateTable(){
      for(var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){
          $('#cell_'+i+j).html(alphabetSet.charAt(Math.floor(Math.random() * 26)));
        }
      }
    }

    function generateAnswer(answer){
      var position = ["horizontal", "vertical"];
      var songAnswer = answer.toUpperCase().split(" ");
      var songPosition = {
        horizontal: [],
        vertical: []
      };
      var hor_cell = [0,1,2,3,4,5,6,7,8,9];
      var ver_cell = [0,1,2,3,4,5,6,7,8,9];
      console.log("songAnswer = " + songAnswer);
      console.log("songAnswer.length = " + songAnswer.length);

      for(var k = 0; k < songAnswer.length; k++){
  
        var answerLength = songAnswer[k].length;
        var ranPos = Math.floor(Math.random() * 2);
        //console.log("randomPosition = " + ranPos);
        if(position[ranPos] === 'horizontal'){
          console.log(" ======== HORIZONTAL! ========");
          console.log("songAnswer[k] = " + songAnswer[k]);

          //check songPosition array

         if(!songPosition.horizontal.length == 0){
          console.log("AAA");
          console.log("hor_cell before splice = " + hor_cell);
          for(var i in songPosition.horizontal){
            console.log("songPosition.horizontal[i] = " + songPosition.horizontal[i]);
            var indexToRemove = hor_cell.indexOf(songPosition.horizontal[i])
            hor_cell.splice(indexToRemove , 1);
          }
          console.log("hor_cell after splice = " + hor_cell);
          var randomRow = hor_cell[Math.floor(Math.random() * hor_cell.length)];
          var randomCol = ver_cell[Math.floor(Math.random() * (maxCellSize - songAnswer[k].length + 2))];
          console.log("randomRow = " + randomRow);
          console.log("randomCol = " + randomCol);
          var counter = 0;
            for(var m = randomCol; m < (randomCol + songAnswer[k].length); m++){
              //console.log("songAnswer[k].charAt(c) = " + songAnswer[k].charAt(counter));
              //console.log("randomRow = " + randomRow + " and m = " + m);
              $('#cell_'+randomRow+m).html(''+ songAnswer[k].charAt(counter));
              songPosition.vertical.push(m);
              counter++;
            }
           songPosition.horizontal.push(randomRow);
           console.log("===================================================");
           console.log("current songPosition.horizontal = " + songPosition.horizontal);
           console.log("current songPosition.vertical = " + songPosition.vertical);
            // console.log("songPosition = " + songPosition);
          }else{
            console.log("BBB");
            var randomRow = hor_cell[Math.floor(Math.random() * hor_cell.length)];
            var randomCol = ver_cell[Math.floor(Math.random() * (maxCellSize - songAnswer[k].length + 2))];
            console.log("randomRow = " + randomRow);
            console.log("randomCol = " + randomCol);

            var counter = 0;
              for(var m = randomCol; m < (randomCol + songAnswer[k].length); m++){
                //console.log("songAnswer[k].charAt(c) = " + songAnswer[k].charAt(counter));
                //console.log("randomRow = " + randomRow + " and m = " + m);
                $('#cell_'+randomRow+m).html(''+ songAnswer[k].charAt(counter));
                songPosition.vertical.push(m);
                counter++;
              }
             songPosition.horizontal.push(randomRow);
             console.log("===================================================");
             console.log("current songPosition.horizontal = " + songPosition.horizontal);
             console.log("current songPosition.vertical = " + songPosition.vertical);
            
          }
          
         
            //console.log("songPosition = " + songPosition);
        }else if(position[ranPos] === 'vertical'){

         if(!songPosition.vertical.length == 0){
          console.log("CCC");
          console.log(" ======== VERTICAL! ========= ");
          console.log("ver_cell before splice = " + ver_cell);
          for(var i in songPosition.vertical){
            console.log("songPosition.vertical[i] = " + songPosition.vertical[i]);
            var indexToRemove = ver_cell.indexOf(songPosition.vertical[i])
            ver_cell.splice(indexToRemove , 1);

          }
          console.log("ver_cell after splice = " + ver_cell);
          
         
          var randomRow = hor_cell[Math.floor(Math.random() * (maxCellSize - songAnswer[k].length + 2))];
          var randomCol = ver_cell[Math.floor(Math.random() * ver_cell.length)];
          console.log("randomRow = " + randomRow);
          console.log("randomCol = " + randomCol);
          var counter = 0;
            for(var n = randomRow; n < (randomRow + songAnswer[k].length); n++){
              $('#cell_'+n+randomCol).html(''+ songAnswer[k].charAt(counter));
              songPosition.horizontal.push(n);
              counter++;
            }
           songPosition.vertical.push(randomCol);
           console.log("===================================================");
           console.log("current songPosition.horizontal = " + songPosition.horizontal);
           console.log("current songPosition.vertical = " + songPosition.vertical);
         }else{
          console.log("DDD");
          console.log("VERTICAL!");
          console.log("songAnswer[k] = " + songAnswer[k]);
          var randomRow = hor_cell[Math.floor(Math.random() * (maxCellSize - songAnswer[k].length + 2))];
          var randomCol = ver_cell[Math.floor(Math.random() * ver_cell.length)];
          console.log("randomRow = " + randomRow);
          console.log("randomCol = " + randomCol);
          var counter = 0;
          for(var n = randomRow; n < (randomRow + songAnswer[k].length); n++){
              $('#cell_'+n+randomCol).html(''+ songAnswer[k].charAt(counter));
              songPosition.horizontal.push(n);
              counter++;
            }
           songPosition.vertical.push(randomCol);
           console.log("===================================================");
           console.log("current songPosition.horizontal = " + songPosition.horizontal);
           console.log("current songPosition.vertical = " + songPosition.vertical);
         }
         
        }
      }//end of for loop
      console.log("===================================================");
      console.log("final songPosition.horizontal = " + songPosition.horizontal);
      console.log("final songPosition.vertical = " + songPosition.vertical);
    }

  })//end of document ready