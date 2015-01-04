//'use strict';

console.log('in grid controller');
var answerPositions = {};

var Grid = function(scope){
  var isMouseDown = false;
  var isSelected;
  var selectedWord = "";
  
  $("#musicSearch td")
    .on("mousedown",function() {
      isMouseDown = true;
      selectedWord += $(this).text();
      $(this).addClass("selected");
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
        scope.validateAnswer(selectedWord,"grid");
        selectedWord = "";
    })
}

Grid.prototype.generateAnswer = function(answer){
  var MAXCELLSIZE = 9;
  var position = ["horizontal", "vertical"];
  var songAnswer = answer.toUpperCase().split(" ");
  var songPosition = {
    horizontal: [],
    vertical: []
  };

  var horizontal = [['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'],
               ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19'],
               ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29'],
               ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39'],
               ['40', '41', '42', '43', '44', '45', '46', '47', '48', '49'],
               ['50', '51', '52', '53', '54', '55', '56', '57', '58', '59'],
               ['60', '61', '62', '63', '64', '65', '66', '67', '68', '69'],
               ['70', '71', '72', '73', '74', '75', '76', '77', '78', '79'],
               ['80', '81', '82', '83', '84', '85', '86', '87', '88', '89'],
               ['90', '91', '92', '93', '94', '95', '96', '97', '98', '99']];
   var vertical = [['00', '10', '20', '30', '40', '50', '60', '70', '80', '90'],
               ['01', '11', '21', '31', '41', '51', '61', '71', '81', '91'],
               ['02', '12', '22', '32', '42', '52', '62', '72', '82', '92'],
               ['03', '13', '23', '33', '43', '53', '63', '73', '83', '93'],
               ['04', '14', '24', '34', '44', '54', '64', '74', '84', '94'],
               ['05', '15', '25', '35', '45', '55', '65', '75', '85', '95'],
               ['06', '16', '26', '36', '46', '56', '66', '76', '86', '96'],
               ['07', '17', '27', '37', '47', '57', '67', '77', '87', '97'],
               ['08', '18', '28', '38', '48', '58', '68', '78', '88', '98'],
               ['09', '19', '29', '39', '49', '59', '69', '79', '89', '99']];
  
  var hor_cell = [0,1,2,3,4,5,6,7,8,9];
  var ver_cell = [0,1,2,3,4,5,6,7,8,9];

  console.log("songAnswer = " + songAnswer);
  console.log("songAnswer.length = " + songAnswer.length);
  var occupiedHor = [];
  var occupiedVer = [];
  for(var k = 0; k < songAnswer.length; k++){
    var answerLength = songAnswer[k].length;
    var ranPos = Math.floor(Math.random() * 2);
    answerPositions["answer_pos_"+(k+1)] = [];
    if(position[ranPos] === 'horizontal'){
      console.log("===================================================");
      console.log(" =====================HORIZONTAL! =================");
      console.log("===================================================");
      console.log("songAnswer[k] = " + songAnswer[k]);
     
      //var randomCol = ver_cell[Math.floor(Math.random() * ver_cell.length)];
      var bool = false;

      while(bool == false){
        var randomRow = hor_cell[Math.floor(Math.random() * hor_cell.length)];
        if(horizontal[randomRow].length >= songAnswer[k].length){
          console.log("randomRow = " + randomRow);
          var counter = 0;
          for(var i = 0; i < songAnswer[k].length; i++){
            $('#cell_'+horizontal[randomRow][i]).html(''+ songAnswer[k].charAt(counter));
            answerPositions["answer_pos_"+(k+1)].push(''+ horizontal[randomRow][i]);
            counter++;
          }
          for(var j = 0; j < songAnswer[k].length; j++){
            console.log("horizontal[randomRow] = " + horizontal[randomRow]);
            console.log("answerPositions[answer_pos_"+(k+1)+"][j] = " + answerPositions["answer_pos_"+(k+1)][j]);
            //console.log("typeof answerPositions[answer_pos_"+(k+1)+"][j] = " + typeof answerPositions["answer_pos_"+(k+1)][j]);
            var indexToRemoveHor = horizontal[randomRow].indexOf(answerPositions["answer_pos_"+(k+1)][j]);
            var verRow = parseInt(answerPositions["answer_pos_"+(k+1)][j].split('')[1]);
            console.log("verRow = " + verRow);
            var indexToRemoveVer = vertical[verRow].indexOf(answerPositions["answer_pos_"+(k+1)][j]);
            //console.log("index to be removed Horizontal = " + indexToRemoveHor);
            //console.log("index to be removed Vertical = " + indexToRemoveVer);
            horizontal[randomRow].splice(indexToRemoveHor , 1);
            vertical[verRow].splice(indexToRemoveVer, 1);
            console.log("after splice vertical["+verRow+"] = " + vertical[verRow]);
          }
          console.log("answerPositions['answer_pos_'"+(k+1)+"] = " + answerPositions["answer_pos_"+(k+1)]);
          console.log("after splice horizontal[randomRow] = " + horizontal[randomRow]);
          bool = true;
        }else{
          bool = false;
        }
      }

      

      
    }else if(position[ranPos] === 'vertical'){
      console.log("===================================================");
      console.log(" =====================VERTICAL! =================");
      console.log("===================================================");
      console.log("songAnswer[k] = " + songAnswer[k]);
     
      //var randomCol = ver_cell[Math.floor(Math.random() * ver_cell.length)];
      var bool = false;

      while(bool == false){
        var randomCol = ver_cell[Math.floor(Math.random() * ver_cell.length)];
        if(vertical[randomCol].length >= songAnswer[k].length){
          console.log("randomCol = " + randomCol);
          var counter = 0;
          for(var i = 0; i < songAnswer[k].length; i++){
            $('#cell_'+vertical[randomCol][i]).html(''+ songAnswer[k].charAt(counter));
            answerPositions["answer_pos_"+(k+1)].push(''+ vertical[randomCol][i]);
            counter++;
          }
          for(var j = 0; j < songAnswer[k].length; j++){
            console.log("vertical[randomCol] = " + vertical[randomCol]);
            console.log("answerPositions[answer_pos_"+(k+1)+"][j] = " + answerPositions["answer_pos_"+(k+1)][j]);
            var indexToRemoveVer = vertical[randomCol].indexOf(answerPositions["answer_pos_"+(k+1)][j]);
            var horRow = parseInt(answerPositions["answer_pos_"+(k+1)][j].split('')[0]);
            console.log("horRow = " + verRow);
            var indexToRemoveHor = horizontal[horRow].indexOf(answerPositions["answer_pos_"+(k+1)][j]);
            
            vertical[randomCol].splice(indexToRemoveVer, 1);
            horizontal[horRow].splice(indexToRemoveHor, 1);
            console.log("after splice horizontal["+horRow+"] = " + horizontal[horRow]);
          }
          console.log("answerPositions['answer_pos_'"+(k+1)+"] = " + answerPositions["answer_pos_"+(k+1)]);
          console.log("after splice vertical[randomCol] = " + vertical[randomCol] );
          bool = true;
        }else{
          bool = false;
        }
      }

      

    }
  }
  for(var ans in answerPositions){
    if(answerPositions.hasOwnProperty(ans)){
      console.log("Answer Position = " + answerPositions[ans]);
    }
  }

  // for(var k = 0; k < songAnswer.length; k++){

  //   var answerLength = songAnswer[k].length;
  //   var ranPos = Math.floor(Math.random() * 2);
  //   //console.log("randomPosition = " + ranPos);
  //   answerPositions["answer_pos_"+(k+1)] = [];
  //   if(position[ranPos] === 'horizontal'){
  //     console.log("===================================================");
  //     console.log(" ======== HORIZONTAL! ========");
  //     console.log("songAnswer[k] = " + songAnswer[k]);

  //     //check songPosition array

  //    if(!songPosition.horizontal.length == 0){
  //     console.log("AAA");
  //     //console.log("hor_cell before splice = " + hor_cell);
  //     // for(var i in songPosition.horizontal){
  //     //   //console.log("songPosition.horizontal[i] = " + songPosition.horizontal[i]);
  //     //   var indexToRemove = hor_cell.indexOf(songPosition.horizontal[i])
  //     //   hor_cell.splice(indexToRemove , 1);
  //     // }
  //     //console.log("hor_cell after splice = " + hor_cell);
  //     console.log("songAnswer[k].length  = " + songAnswer[k].length );
  //     var randomRow = hor_cell[Math.floor(Math.random() * hor_cell.length)];
  //     var randomCol = ver_cell[Math.floor(Math.random() * (ver_cell.length - songAnswer[k].length))];
  //     console.log("randomRow = " + randomRow);
  //     console.log("randomCol = " + randomCol);
  //     var counter = 0;
  //       for(var m = randomCol; m < (randomCol + songAnswer[k].length); m++){
  //         //console.log("songAnswer[k].charAt(c) = " + songAnswer[k].charAt(counter));
  //         //console.log("randomRow = " + randomRow + " and m = " + m);
  //         $('#cell_'+randomRow+m).html(''+ songAnswer[k].charAt(counter));
  //         answerPositions["answer_pos_"+(k+1)].push(''+randomRow+m);
  //         songPosition.vertical.push(m);
  //         counter++;
  //       }
  //      songPosition.horizontal.push(randomRow);
  //       for(var i in songPosition.horizontal){
  //         var indexToRemove = hor_cell.indexOf(songPosition.horizontal[i]);
  //         console.log("Horizontal index to be removed = " + indexToRemove);
  //         hor_cell.splice(indexToRemove , 1);
  //        }
  //        console.log("current songPosition.horizontal = " + songPosition.horizontal);
  //        console.log("current songPosition.vertical = " + songPosition.vertical); 
  //        console.log("after splice current hor_cell = " + hor_cell);
  //        console.log("after splice current ver_cell = " + ver_cell);
  //      console.log("===================================================");
  //     }else{
  //       console.log("===================================================");
  //       console.log("BBB");
  //       var randomRow = hor_cell[Math.floor(Math.random() * hor_cell.length)];
  //       var randomCol = ver_cell[Math.floor(Math.random() * (ver_cell.length - songAnswer[k].length + 2))];
  //       console.log("randomRow = " + randomRow);
  //       console.log("randomCol = " + randomCol);

  //       var counter = 0;
  //         for(var m = randomCol; m < (randomCol + songAnswer[k].length); m++){
  //           //console.log("songAnswer[k].charAt(c) = " + songAnswer[k].charAt(counter));
  //           //console.log("randomRow = " + randomRow + " and m = " + m);
  //           $('#cell_'+randomRow+m).html(''+ songAnswer[k].charAt(counter));
  //           answerPositions["answer_pos_"+(k+1)].push(''+randomRow+m);
  //           songPosition.vertical.push(m);
  //           counter++;
  //         }
  //        songPosition.horizontal.push(randomRow);
  //        for(var i in songPosition.horizontal){
  //         var indexToRemove = hor_cell.indexOf(songPosition.horizontal[i])
  //         console.log("Horizontal index to be removed = " + indexToRemove);
  //         hor_cell.splice(indexToRemove , 1);
  //        }
        
  //        console.log("current songPosition.horizontal = " + songPosition.horizontal);
  //        console.log("current songPosition.vertical = " + songPosition.vertical); 
  //        console.log("after splice current hor_cell = " + hor_cell);
  //        console.log("after splice current ver_cell = " + ver_cell);
  //        console.log("===================================================");
  //     }
  //       console.log("songPosition = " + songPosition);
  //   }else if(position[ranPos] === 'vertical'){

  //    if(!songPosition.vertical.length == 0){
  //     console.log("===================================================");
  //     console.log("CCC");
  //     console.log(" ======== VERTICAL! ========= ");
  //     console.log("songAnswer[k] = " + songAnswer[k]);
  //     // console.log("ver_cell before splice = " + ver_cell);
  //     // for(var i in songPosition.vertical){
  //     //  //console.log("songPosition.vertical[i] = " + songPosition.vertical[i]);
  //     //   var indexToRemove = ver_cell.indexOf(songPosition.vertical[i])
  //     //   ver_cell.splice(indexToRemove , 1);

  //     // }
  //     // console.log("ver_cell after splice = " + ver_cell);
      
     
  //     var randomRow = hor_cell[Math.floor(Math.random() * (hor_cell.length - songAnswer[k].length + 2))];
  //     var randomCol = ver_cell[Math.floor(Math.random() * ver_cell.length)];
  //     console.log("randomRow = " + randomRow);
  //     console.log("randomCol = " + randomCol);
  //     var counter = 0;
  //       for(var n = randomRow; n < (randomRow + songAnswer[k].length); n++){
  //         $('#cell_'+n+randomCol).html(''+ songAnswer[k].charAt(counter));
  //         answerPositions["answer_pos_"+(k+1)].push(''+n+randomCol);
  //         songPosition.horizontal.push(n);
  //         counter++;
  //       }
  //      songPosition.vertical.push(randomCol);

  //        for(var i in songPosition.vertical){
  //           var indexToRemove = ver_cell.indexOf(songPosition.vertical[i]);
  //           console.log("Vertical index to be removed = " + indexToRemove);
  //           ver_cell.splice(indexToRemove , 1);
  //        }
  //        console.log("current songPosition.horizontal = " + songPosition.horizontal);
  //        console.log("current songPosition.vertical = " + songPosition.vertical); 
  //        console.log("after splice current hor_cell = " + hor_cell);
  //        console.log("after splice current ver_cell = " + ver_cell);
  //      console.log("===================================================");
  //    }else{
  //     console.log("===================================================");
  //     console.log("DDD");
  //     console.log("VERTICAL!");
  //     console.log("songAnswer[k] = " + songAnswer[k]);
  //     var randomRow = hor_cell[Math.floor(Math.random() * (hor_cell.length - songAnswer[k].length + 2))];
  //     var randomCol = ver_cell[Math.floor(Math.random() * ver_cell.length)];
  //     console.log("randomRow = " + randomRow);
  //     console.log("randomCol = " + randomCol);
  //     var counter = 0;
  //     for(var n = randomRow; n < (randomRow + songAnswer[k].length); n++){
  //       $('#cell_'+n+randomCol).html(''+ songAnswer[k].charAt(counter));
  //       answerPositions["answer_pos_"+(k+1)].push(''+n+randomCol);
  //       songPosition.horizontal.push(n);
  //       counter++;
  //     }
  //      songPosition.vertical.push(randomCol);

  //        for(var i in songPosition.vertical){
  //           var indexToRemove = ver_cell.indexOf(songPosition.vertical[i]);
  //           console.log("Vertical index to be removed = " + indexToRemove);
  //           ver_cell.splice(indexToRemove , 1);
  //        }
  //        console.log("current songPosition.horizontal = " + songPosition.horizontal);
  //        console.log("current songPosition.vertical = " + songPosition.vertical); 
  //        console.log("after splice current hor_cell = " + hor_cell);
  //        console.log("after splice current ver_cell = " + ver_cell);
  //      console.log("===================================================");
  //    }
     
  //   }
  // }//end of for loop
  // console.log("===================================================");
  // console.log("final songPosition.horizontal = " + songPosition.horizontal);
  // console.log("final songPosition.vertical = " + songPosition.vertical);
  
  // console.log("Answer Position 1 = " + answerPositions["answer_pos_1"]);
  // console.log("Answer Position 2 = " + answerPositions["answer_pos_2"]);
  // console.log("Answer Position 3 = " + answerPositions["answer_pos_3"]);
}

Grid.prototype.populateTable = function(){
  var alphabetSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(var p = 0; p < 10; p++){
    for(var q = 0; q < 10; q++){
      $('#cell_'+p+q).html(alphabetSet.charAt(Math.floor(Math.random() * 26)));
    }
  }
}

angular.module('lamusiqueApp')
  .controller('GridCtrl', function ($rootScope, $scope, $filter, $timeout, MediaPlayer) {
    console.log('GridCtrl');
    $scope.mediaPlayer = MediaPlayer;
    $scope.correctAnswer = '';

    $scope.resetGrid = function(){
      $('#musicSearch td').each(function(i, elem){
        $(elem).removeClass("selectedSuccess");
        $(elem).removeClass("selected");
      })
      $scope.generateAnswerPlaceholder(null,null,false);
      $scope.answer = '';
      $('#answerValidation').html('');

      for(var p in answerPositions){
        if(answerPositions.hasOwnProperty(p)){
          answerPositions[p] = null;
        }
      }       
    }

    $rootScope.$on('update grid', function (e, data){
      $scope.resetGrid();
      console.log('~~~~~~~~~~~~ data["artist"] = ' + data['artist']);
      console.log('~~~~~~~~~~~~ data["title"] = ' + data['title']);
      console.log('********************* data =  ' + data['title'] + ' received at ' + Date.now());
      $scope.artist = angular.uppercase(data['artist']);
      $scope.correctAnswer = angular.uppercase(data['title']);
      console.log("$scope.correctAnswer = " + $scope.correctAnswer);
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      var grid = new Grid($scope);
      grid.populateTable();
      grid.generateAnswer($scope.correctAnswer);
      $scope.generateAnswerPlaceholder($scope.correctAnswer,null,false);
    });

    // just another suggestion,
    //IN THE CHAT CONTROLLER, I added an event listener (line 196) which listens for the event 'guess-time'
    // in order to send a message to the back end to give points to the player
    // I was planning to prepare the backend to give points to players.


    //$scope.correctAnswer = 'SWEET HOME ALABAMA';

    //$timeout(function () {

      
    //});

    $scope.generateAnswerPlaceholder = (function(){

      var answers = {};
      var ans_positions = {};
      
      function fullAnswerValidation(obj){
        for(var ans_pos in obj){
          var answers = obj[ans_pos];
          for(var ans in answers){
            if(answers.hasOwnProperty(ans)){
              if(!answers[ans]) return false;
            }
          }
        }
        return true;
      }

      return function(quizAnswer, userAnswer, validation){

        if(quizAnswer === null){
          for(var p in ans_positions){
            if(ans_positions.hasOwnProperty(p)){
              ans_positions[p] = null;
            }
          }       
        }else{
          quizAnswer = quizAnswer.toUpperCase();
          var answer_table = $('.answerTable').find('tbody').empty();
          var tr = $('<tr>').appendTo(answer_table);
          console.log("########### quizAnswer = " + quizAnswer + " ,artist = " + $scope.artist);

          //check if answer is in answers{} cache
          if(answers[quizAnswer] != null){
            // console.log("========== Answer is in cache : " + answers[quizAnswer]);
            // console.log("answers[quizAnswer].length = " + answers[quizAnswer].length)
            // console.log("quizAnswer in cache = " + answers[quizAnswer]);
            // console.log("validation = " + validation);
            // console.log("userAnswer = " + userAnswer);
            for(var r = 1; r < answers[quizAnswer].length; r++){
              if(ans_positions[r] == null){
                ans_positions[r] = [];
                ans_positions[r].push(answers[quizAnswer][r]);
                ans_positions[r].push(false);
                //console.log("ans_positions["+r+"] = " + ans_positions[r]);
              }
            }


            //user answer not null
            if(answers[quizAnswer].indexOf(userAnswer) > -1){
              var userAnswer_len = userAnswer.split(" ").length;
              
              if(userAnswer_len === 1 && quizAnswer.split(" ").length === 1){
                ans_positions[1][1] = true;
              }else if(userAnswer_len === 1 && quizAnswer.split(" ").length > 1){
                var userAnswer_pos = answers[quizAnswer].indexOf(userAnswer);
                // console.log("answers[quizAnswer] = " + answers[quizAnswer]);
                // console.log("userAnswer_pos = " + userAnswer_pos)
                // console.log("ans_positions[userAnswer_pos][1] = " + ans_positions[userAnswer_pos][1])
                ans_positions[userAnswer_pos][1] = true;
              }else{ 
                userAnswer = userAnswer.split(" ");
                for(var s = 0; s < userAnswer.length; s++){
                  var pos = answers[quizAnswer].indexOf(userAnswer[s]);
                  ans_positions[pos][1] = true;
                }
              }

              //Either draw underscore placeholder or fill in the placeholder with correct userAnswers
              for(var t = 1; t < answers[quizAnswer].length; t++){
                for(var u = 0; u < answers[quizAnswer][t].length; u++){
                  if(ans_positions[t][1] === true){
                    //console.log("ans_positions[t] = " + ans_positions[t]);
                    $("<td>").text(''+ ans_positions[t][0][u]).appendTo(tr);
                    for(var l = 0; l < answerPositions['answer_pos_'+t].length; l++){
                      $('#cell_'+answerPositions['answer_pos_'+t][l]).addClass("selectedSuccess");
                    }
                  }else{
                    $("<td>").text('_').appendTo(tr);
                  }                
                }       
                if(t !== quizAnswer.length - 1){
                  $("<td style='text-decoration: none;'>").html('&nbsp;&nbsp;&nbsp;&nbsp;').appendTo(tr);
                }
              }
            }

            //Check if all answers's placeholders are filled with correct answers
            if(fullAnswerValidation(ans_positions)){
              console.log("ALL ANSWERS ARE CORRECT");
              $scope.calculateTotalTime();
            }

          }else{
            //console.log("==========Answer NOT in cache yet!");
            answers[quizAnswer] = [];
            answers[quizAnswer].push(quizAnswer);
            var quiz_answer =  answers[quizAnswer][0].split(" ");
            for(var v = 0; v < quiz_answer.length; v++){
              answers[quizAnswer].push(quiz_answer[v]);
            }

            if(userAnswer === null){
              for(var w = 1; w < answers[quizAnswer].length; w++){
                for(var x = 0; x < answers[quizAnswer][w].length; x++){
                  $("<td>").text('_').appendTo(tr);
                }       
                if(w !== quizAnswer.length - 1){
                  $("<td style='text-decoration: none;'>").html('&nbsp;&nbsp;&nbsp;&nbsp;').appendTo(tr);
                }
              }
            }
          }        
        }
      };
    }());

    
   
    
    $scope.answer = '';
    
    $scope.calculateTotalTime = function(){
      console.log("*************************************************");
      console.log("************ Your time = "+ $scope.mediaPlayer.currentTime + " seconds");
      console.log("*************************************************");
      $scope.mediaPlayer.next();
    }

    $scope.$watch('answer', function(val) {
      $scope.answer = $filter('uppercase')(val);
    }, true);

    $scope.validateAnswer = function(userInput, type){
      console.log("######### $scope.correctAnswer = " + $scope.correctAnswer);
      if(type === "grid"){
        if($scope.correctAnswer.split(" ").indexOf(userInput) > -1){
          console.log("CORRECT");
          $scope.generateAnswerPlaceholder($scope.correctAnswer, userInput, true)
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
      }else if(type === "inputBox"){
        var userInput = userInput.toUpperCase();
        if($scope.correctAnswer.split(" ").indexOf(userInput) > -1 && userInput.split(" ").length == 1){
          $('#answerValidation').html('&#10004;');
          $('#answerValidation').removeClass('error');
          $('#answerValidation').addClass('success');
          $scope.generateAnswerPlaceholder($scope.correctAnswer,angular.uppercase($scope.answer), true);
        }else if(userInput === $scope.correctAnswer){
          $scope.calculateTotalTime();
          $('#answerValidation').html('&#10004;');
          $('#answerValidation').removeClass('error');
          $('#answerValidation').addClass('success');
          $scope.generateAnswerPlaceholder($scope.correctAnswer,angular.uppercase($scope.answer), true);
        }else{
          $('#answerValidation').html('&#10008;');
          $('#answerValidation').addClass('error');
          $('#answerValidation').removeClass('success');
        }
      }
      
    }

    $scope.change = function(){
      $scope.validateAnswer($scope.answer, "inputBox");
    }
});


