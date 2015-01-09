//'use strict';

console.log('in grid controller');
var answerPositions = {};

var Grid = function(scope){
  var isMouseDown = false;
  var isSelected;
  var selectedWord = "";
  
  $("#musicSearch td")
    .on("mousedown",function(event) {
      event.stopPropagation();
      isMouseDown = true;
      selectedWord += $(this).text();
      $(this).addClass("selected");
      return false;
    })

    .on("mouseover",function (event) {
      event.stopPropagation();
      if (isMouseDown) {
        selectedWord += $(this).text();
        $(this).addClass("selected");
      }
    })

    .on("mouseup", function(event){
      event.stopPropagation();
        isMouseDown = false;
        scope.validateAnswer(selectedWord,"grid");
        selectedWord = "";
    });

    grid = this;
}

Grid.prototype.updateHorizontal = function(horizontal, vertical, answer, horRow){
  for(var j = 0; j < answer.length; j++){
    var indexToRemoveHor = horizontal[horRow].indexOf(answer[j]);
    var verRow = parseInt(answer[j].split('')[1]);
    var indexToRemoveVer = vertical[verRow-1].indexOf(answer[j]);
    horizontal[horRow].splice(indexToRemoveHor , 1);
    vertical[verRow-1].splice(indexToRemoveVer, 1);
  }
}

Grid.prototype.updateVertical = function(horizontal,vertical,answer,verRow){
  for(var j = 0; j < answer.length; j++){
    var indexToRemoveVer = vertical[verRow].indexOf(answer[j]);
    var horRow = parseInt(answer[j].split('')[0]);
    var indexToRemoveHor = horizontal[horRow-1].indexOf(answer[j]);
    vertical[verRow].splice(indexToRemoveVer, 1);
    horizontal[horRow-1].splice(indexToRemoveHor, 1);
  }
}

Grid.prototype.generateAnswer = function(answer){
  var MAXCELLSIZE = 9;
  var position = ["horizontal","vertical"];
  var songAnswer = answer.toUpperCase().split(" ");

  var horizontal = [['11', '12', '13', '14', '15', '16', '17', '18', '19'],
                    ['21', '22', '23', '24', '25', '26', '27', '28', '29'],
                    ['31', '32', '33', '34', '35', '36', '37', '38', '39'],
                    ['41', '42', '43', '44', '45', '46', '47', '48', '49'],
                    ['51', '52', '53', '54', '55', '56', '57', '58', '59'],
                    ['61', '62', '63', '64', '65', '66', '67', '68', '69'],
                    ['71', '72', '73', '74', '75', '76', '77', '78', '79'],
                    ['81', '82', '83', '84', '85', '86', '87', '88', '89'],
                    ['91', '92', '93', '94', '95', '96', '97', '98', '99']];
   var vertical = [['11', '21', '31', '41', '51', '61', '71', '81', '91'],
                   ['12', '22', '32', '42', '52', '62', '72', '82', '92'],
                   ['13', '23', '33', '43', '53', '63', '73', '83', '93'],
                   ['14', '24', '34', '44', '54', '64', '74', '84', '94'],
                   ['15', '25', '35', '45', '55', '65', '75', '85', '95'],
                   ['16', '26', '36', '46', '56', '66', '76', '86', '96'],
                   ['17', '27', '37', '47', '57', '67', '77', '87', '97'],
                   ['18', '28', '38', '48', '58', '68', '78', '88', '98'],
                   ['19', '29', '39', '49', '59', '69', '79', '89', '99']];
  
  var hor_cell = [1,2,3,4,5,6,7,8,9];
  var ver_cell = [1,2,3,4,5,6,7,8,9];

  var occupiedHor = [];
  var occupiedVer = [];
  var ranPos = Math.floor(Math.random() * 2);

  if(position[ranPos] === 'horizontal'){
    var posHorizontal = true;
    var posVertical = false;
  }else if(position[ranPos] === 'vertical'){
    var posHorizontal = false;
    var posVertical = true;
  }
  for(var k = 0; k < songAnswer.length; k++){
    var answerLength = songAnswer[k].length;
    answerPositions["answer_pos_"+(k+1)] = [];
    if(posHorizontal === true){
      var found = false;

      while(found == false){
        if(k === 0){
          var randomRow = hor_cell[Math.floor(Math.random() * hor_cell.length)];
          var counter = 0;
          for(var i = 0; i < songAnswer[k].length; i++){
            $('#cell_'+horizontal[randomRow-1][i]).html(''+ songAnswer[k].charAt(counter));
            answerPositions["answer_pos_"+(k+1)].push(''+ horizontal[randomRow-1][i]);
            counter++;
          }
          found = true;
          grid.updateHorizontal(horizontal, vertical, answerPositions["answer_pos_"+(k+1)], randomRow-1);
        }else{
          var counter = 0;
          var startPoint, endPoint;
          var usableRow = false;

          var randomRowToStart = hor_cell[Math.floor(Math.random() * hor_cell.length)] - 1;

          for(var x = randomRowToStart; x < horizontal.length; x++){
            if(x === 8 && x < horizontal.length){
              x = 0;
            }
            var occupied_container = [];
            var head = parseInt((x + 1) + '1');
            for(var j = head; j < head+8; j++){
              if(horizontal[x].indexOf(j.toString()) < 0){
                occupied_container.push([j.toString()]);
              }
            }

            if(occupied_container.length > 0){
              for(var m=0; m < occupied_container.length; m++){
                if( occupied_container.length > 1){
                  if( m == 0){
                    var left = occupied_container[m] - head;
                    var right = occupied_container[m+1] - occupied_container[m] - 1;
                    if( left >= songAnswer[k].length ){
                      startPoint = parseInt(head);
                      endPoint = parseInt(head) + songAnswer[k].length - 1;
                      usableRow = true;
                    }else if(right >= songAnswer[k].length){
                      startPoint = parseInt(occupied_container[m]) + 1;
                      endPoint = parseInt(occupied_container[m]) + songAnswer[k].length;
                      usableRow = true;;
                    }
                  }else if(m == occupied_container.length-1){
                    var left = occupied_container[m] - occupied_container[m-1] - 1;
                    var right = (head+8) - occupied_container[m];
                    if( left >= songAnswer[k].length ){
                      startPoint = parseInt(occupied_container[m-1]) + 1;
                      endPoint = parseInt(occupied_container[m-1]) + songAnswer[k].length;
                      usableRow = true;
                    }else if(right >= songAnswer[k].length){
                      startPoint = parseInt(occupied_container[m]) + 1;
                      endPoint = parseInt(occupied_container[m]) + songAnswer[k].length;
                      usableRow = true;
                    }
                  }else{
                    var left = occupied_container[m] - occupied_container[m-1] - 1;
                    var right = occupied_container[m+1] - occupied_container[m] - 1;
                    if( left >= songAnswer[k].length){
                      startPoint = parseInt(occupied_container[m-1]) + 1;
                      endPoint = parseInt(occupied_container[m-1]) + songAnswer[k].length;
                      usableRow = true;
                    }else if(right >= songAnswer[k].length){
                      startPoint = parseInt(occupied_container[m]) + 1;
                      endPoint = parseInt(occupied_container[m]) + songAnswer[k].length;
                      usableRow = true;
                    }
                  }
                }else{
                  var left = occupied_container[m] - head;
                  var right = (head+8) - occupied_container[m];
                  if( left >= songAnswer[k].length ){
                    startPoint = parseInt(head);
                    endPoint = parseInt(head) + songAnswer[k].length - 1;
                    usableRow = true;
                  }else if(right >= songAnswer[k].length){
                    startPoint = parseInt(occupied_container[m]) + 1;
                    endPoint = parseInt(occupied_container[m]) + songAnswer[k].length;
                    usableRow = true;
                  }
                }
              }

              if(usableRow == true){
                var counter = 0;
                for(var i = startPoint; i <= endPoint; i++){
                  $('#cell_'+ i).html(''+ songAnswer[k].charAt(counter));
                  answerPositions["answer_pos_"+(k+1)].push(''+ i);
                  counter++;
                }
                found = true;
                grid.updateHorizontal(horizontal, vertical, answerPositions["answer_pos_"+(k+1)], x);
                break;
              }else{
                found = false;
              }
            }else{ // if occupied_container.length < 1 or whole rows are not occupied
              var counter = 0;
              for(var i = 0; i < songAnswer[k].length; i++){
                $('#cell_'+horizontal[x][i]).html(''+ songAnswer[k].charAt(counter));
                answerPositions["answer_pos_"+(k+1)].push(''+ horizontal[x][i]);
                counter++;
              }
              found = true;
              grid.updateHorizontal(horizontal, vertical, answerPositions["answer_pos_"+(k+1)], x);
              break;
            }
          }
        }//end of else
      }//end of while loop
      posHorizontal = false;
      posVertical = true;
    }else if(posVertical === true){
      var found = false;
      while(found == false){
        if(k === 0){
          var randomCol = hor_cell[Math.floor(Math.random() * hor_cell.length)];
          var counter = 0;
          for(var i = 0; i < songAnswer[k].length; i++){
            $('#cell_'+vertical[randomCol-1][i]).html(''+ songAnswer[k].charAt(counter));
            answerPositions["answer_pos_"+(k+1)].push(''+ vertical[randomCol-1][i]);
            counter++;
          }
          found = true;
          grid.updateVertical(horizontal, vertical, answerPositions["answer_pos_"+(k+1)], randomCol-1);
        }else{
          var counter = 0;
          var startPoint, endPoint;
          var usableRow = false;


          var randomColToStart = hor_cell[Math.floor(Math.random() * hor_cell.length)] - 1;
          
          for(var x = randomColToStart; x < vertical.length; x++){
            if(x === 8 && x < vertical.length){
              x = 0;
            }
            var occupied_container = [];
            var head =  parseInt('1' + (x + 1));
            for(var j = head; j < head+80; j += 10){
              if(vertical[x].indexOf(j.toString()) < 0){
                occupied_container.push([j.toString()]);
              }
            }

            if(occupied_container.length > 0){
              for(var m=0; m < occupied_container.length; m++){
                if( occupied_container.length > 1){
                  if( m == 0){
                    var top = (occupied_container[m] - head) / 10;
                    var bottom = (occupied_container[m+1] - occupied_container[m] - 10) / 10;
                    if( top >= songAnswer[k].length ){
                      startPoint = parseInt(head);
                      endPoint = parseInt(head) + (songAnswer[k].length * 10) - 10;
                      usableRow = true;
                    }else if(bottom >= songAnswer[k].length){
                      startPoint = parseInt(occupied_container[m]) + 10;
                      endPoint = parseInt(occupied_container[m]) + (songAnswer[k].length * 10);
                      usableRow = true;
                    }
                  }else if(m == occupied_container.length-1){
                    var top = (occupied_container[m] - occupied_container[m-1] - 10) / 10;
                    var bottom = ((head+80) - occupied_container[m]) / 10;
                    if( top >= songAnswer[k].length ){
                      startPoint = parseInt(occupied_container[m-1]) + 10;
                      endPoint = parseInt(occupied_container[m-1]) + (songAnswer[k].length * 10);
                      usableRow = true;
                    }else if(bottom >= songAnswer[k].length){
                      startPoint = parseInt(occupied_container[m]) + 10;
                      endPoint = parseInt(occupied_container[m]) + (songAnswer[k].length * 10);
                      usableRow = true;
                    }
                  }else{
                    var top = (occupied_container[m] - occupied_container[m-1] - 10) / 10;
                    var bottom = (occupied_container[m+1] - occupied_container[m] - 10) / 10;
                    if( top >= songAnswer[k].length){
                      startPoint = parseInt(occupied_container[m-1]) + 10;
                      endPoint = parseInt(occupied_container[m-1]) + (songAnswer[k].length * 10);
                      usableRow = true;
                    }else if(bottom >= songAnswer[k].length){
                      startPoint = parseInt(occupied_container[m]) + 10;
                      endPoint = parseInt(occupied_container[m]) + (songAnswer[k].length * 10);
                      usableRow = true;
                    }
                  }
                }else{
                  var top = (occupied_container[m] - head) / 10;
                  var bottom = ((head+80) - occupied_container[m]) / 10;
                  if( top >= songAnswer[k].length ){
                    startPoint = parseInt(head);
                    endPoint = parseInt(head) + (songAnswer[k].length * 10) - 10;
                    usableRow = true;
                  }else if(bottom >= songAnswer[k].length){
                    startPoint = parseInt(occupied_container[m]) + 10;
                    endPoint = parseInt(occupied_container[m]) + (songAnswer[k].length * 10);
                    usableRow = true;
                  }
                }
              }
              if(usableRow == true){
                var counter = 0;
                for(var i = startPoint; i <= endPoint; i +=10){
                  $('#cell_'+ i).html(''+ songAnswer[k].charAt(counter));
                  answerPositions["answer_pos_"+(k+1)].push(''+ i);
                  counter++;
                }
                found = true;
                grid.updateVertical(horizontal, vertical, answerPositions["answer_pos_"+(k+1)], x);
                break;
              }else{
                found = false;
              }
            }else{ // if occupied_container.length < 1 or whole rows are not occupied
              var counter = 0;
              for(var i = 0; i < songAnswer[k].length; i++){
                $('#cell_'+vertical[x][i]).html(''+ songAnswer[k].charAt(counter));
                answerPositions["answer_pos_"+(k+1)].push(''+ vertical[x][i]);
                counter++;
              }
              found = true;
              grid.updateVertical(horizontal, vertical, answerPositions["answer_pos_"+(k+1)], x);
              break;
            }
          }
        }//end of else
      }//end of while loop
     posHorizontal = true;
    posVertical = false;
    }//end of if else horizontal or vertical
  }
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
    
    $scope.correctAnswer = '';
    $scope.hasSubmitted = false;
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
      $scope.mediaPlayer = MediaPlayer.player();
      $scope.hasSubmitted = false;
      $scope.resetGrid();
      console.log('--- IN GRID UPDATE---- need to update grid received at ' + Date.now());
      console.log('--- IN GRID UPDATE ---- question in grid is guess the ' + data.question);
      console.log('--- IN GRID UPDATE ---- title is ' +  data.song['title'] );
      console.log('--- IN GRID UPDATE ---- artist is ' +  data.song['artist'] );
      $scope.song = data.song;
      $scope.question = "The " + data.question + " is:";
      $scope.artist = angular.uppercase(data.song['artist']);
      $scope.correctAnswer = angular.uppercase(data['title']);
      if(data.question === 'title'){
        $scope.correctAnswer = angular.uppercase(data.song['title']);
      }else if(data.question === 'artist'){
        $scope.correctAnswer = angular.uppercase(data.song['artist']);
      }
      console.log("$scope.correctAnswer = " + $scope.correctAnswer);
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      var grid = new Grid($scope);
      grid.populateTable();
      grid.generateAnswer($scope.correctAnswer);
      $scope.generateAnswerPlaceholder($scope.correctAnswer,null,false);
    });

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
        for(var p in answers){
          if(answers.hasOwnProperty(p)){
            console.log("p = " + p);
            console.log("answers[p] = " + answers[p]);
            answers[p] = null;
            console.log("answers[p] now = " + answers[p]);
          }
        }    

        console.log("answers = " + answers);
        return true;
      }

      return function(quizAnswer, userAnswer, validation){
        console.log("~~~~answers = " + answers);
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

          //check if answer is in answers{} cache
          if(answers[quizAnswer] != null){
            for(var r = 1; r < answers[quizAnswer].length; r++){
              if(ans_positions[r] == null){
                ans_positions[r] = [];
                ans_positions[r].push(answers[quizAnswer][r]);
                ans_positions[r].push(false);
              }
            }


            //user answer not null
            if(answers[quizAnswer].indexOf(userAnswer) > -1){
              var userAnswer_len = userAnswer.split(" ").length;
              
              if(userAnswer_len === 1 && quizAnswer.split(" ").length === 1){
                ans_positions[1][1] = true;
              }else if(userAnswer_len === 1 && quizAnswer.split(" ").length > 1){
                var userAnswer_pos = answers[quizAnswer].indexOf(userAnswer);
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
                    $("<td>").text(''+ ans_positions[t][0][u]).appendTo(tr);
                    for(var l = 0; l < answerPositions['answer_pos_'+t].length; l++){
                      $('#cell_'+answerPositions['answer_pos_'+t][l]).addClass("selectedSuccess");
                      $('#cell_'+answerPositions['answer_pos_'+t][l]).unbind('mousedown');
                      $('#cell_'+answerPositions['answer_pos_'+t][l]).unbind('mouseup');
                      $('#cell_'+answerPositions['answer_pos_'+t][l]).unbind('mouseover');
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
              answers[quizAnswer] = null;   
              console.log("answers[quizAnswer] = " + answers[quizAnswer]);
              console.log("ALL ANSWERS ARE CORRECT!");
              $("#musicSearch td").unbind('mousedown');
              $("#musicSearch td").unbind('mouseup');
              $("#musicSearch td").unbind('mouseover');
              $scope.calculateTotalTime();
              
              
            }
            

          }else{
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
                if(w !== quizAnswer.length - 1 && quiz_answer.length > 1){
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
      if($scope.hasSubmitted === false){
        console.log("*************************************************");
        console.log("************ Your time = "+ $scope.mediaPlayer.currentTime + " seconds");
        console.log("*************************************************");
        var time = $scope.mediaPlayer.currentTime
        var data = {
          song: $scope.song, 
          guessTime: time
        };
        if (time < 30 && time > 0)
          $rootScope.$emit('guess-time', data); 
        else
          $rootScope.$emit('good slow guess');
        $scope.hasSubmitted = true;
      }

    }

    $scope.$watch('answer', function(val) {
      $scope.answer = $filter('uppercase')(val);
    }, true);

    $scope.validateAnswer = function(userInput, type){
      if(type === "grid"){
        console.log("userInput = " + userInput);
        if($scope.correctAnswer.split(" ").indexOf(userInput) > -1){
          console.log("~~~~~~AHA !");
          $scope.generateAnswerPlaceholder($scope.correctAnswer, userInput, true)
          $('#musicSearch td').each(function(i, elem){
            if($(elem).hasClass("selected") == true){
              $(elem).addClass("selectedSuccess");
              $(elem).removeClass("selected");
            }
          })
          
        }else{
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
          //$scope.calculateTotalTime();
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


