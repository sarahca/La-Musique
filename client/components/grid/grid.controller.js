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

    grid = this;
}

Grid.prototype.sayHi = function(){
  console.log("~~~~~~~~~~~~~~MUAHAHAHAHAHA  ALOHA!~~~~~~~~~~~~~~~");
}

Grid.prototype.updateHorizontal = function(horizontal, vertical, answer, horRow){
  console.log("UPDATE HORIZONTAL - answer = " + answer);
  for(var j = 0; j < answer.length; j++){
      console.log("horizontal[randomRow-1] = " + horizontal[horRow]);
      console.log("answer[j] = " + answer[j]);
      var indexToRemoveHor = horizontal[horRow].indexOf(answer[j]);
      var verRow = parseInt(answer[j].split('')[1]);
      console.log("verRow = " + verRow);
      var indexToRemoveVer = vertical[verRow-1].indexOf(answer[j]);
      console.log("index to be removed Horizontal = " + indexToRemoveHor);
      console.log("index to be removed Vertical = " + indexToRemoveVer);
      horizontal[horRow].splice(indexToRemoveHor , 1);
      vertical[verRow-1].splice(indexToRemoveVer, 1);
      console.log("after splice vertical["+verRow+"] = " + vertical[verRow-1]);
  }
  console.log("after splice horizontal[horRow] = " + horizontal[horRow]);
}

Grid.prototype.updateVertical = function(horizontal,vertical,answer,verRow){
  console.log("UPDATE VERTICAL - answer = " + answer);
  for(var j = 0; j < answer.length; j++){
    console.log("vertical[verRow] = " + vertical[verRow]);
    var indexToRemoveVer = vertical[verRow].indexOf(answer[j]);
    var horRow = parseInt(answer[j].split('')[0]);
    console.log("horRow = " + horRow);
    var indexToRemoveHor = horizontal[horRow-1].indexOf(answer[j]);
    console.log("indexToRemoveHor = " + indexToRemoveHor);
    console.log("before splice horizontal["+horRow+"] = " + horizontal[horRow-1]);
    vertical[verRow].splice(indexToRemoveVer, 1);
    horizontal[horRow-1].splice(indexToRemoveHor, 1);
    console.log("after splice horizontal["+horRow+"] = " + horizontal[horRow-1]);
  }
  console.log("after splice vertical[verRow] = " + vertical[verRow] );
}

Grid.prototype.generateAnswer = function(answer){
  var MAXCELLSIZE = 9;
  var position = ["horizontal","vertical"];
  var songAnswer = answer.toUpperCase().split(" ");
  var songPosition = {
    horizontal: [],
    vertical: []
  };

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

  console.log("songAnswer = " + songAnswer);
  console.log("songAnswer.length = " + songAnswer.length);
  var occupiedHor = [];
  var occupiedVer = [];
  for(var k = 0; k < songAnswer.length; k++){
    var answerLength = songAnswer[k].length;
    var ranPos = Math.floor(Math.random() * 2);
    console.log("ranPos = " + ranPos);
    console.log("position[ranPos] = " + position[ranPos]);
    console.log("~~~~~~~~~k = " + k);
    answerPositions["answer_pos_"+(k+1)] = [];
    console.log("~~~~~~~~~answerPositions['answer_pos_'"+(k+1)+"] = " + answerPositions["answer_pos_"+(k+1)]);
    if(position[ranPos] === 'horizontal'){
      console.log("===================================================");
      console.log(" =====================HORIZONTAL! =================");
      console.log("===================================================");
      console.log("songAnswer[k] = " + songAnswer[k]);
      console.log("songAnswer[k].length = " + songAnswer[k].length);
     
      var found = false;

      while(found == false){
        var randomRow = hor_cell[Math.floor(Math.random() * hor_cell.length)];
        console.log("randomRow = " + randomRow);
        console.log("horizontal[randomRow-1] = " + horizontal[randomRow-1]);
        if(horizontal[randomRow-1].length >= songAnswer[k].length){
          var counter = 0;
          // 20, 21, ?, 23, 24, ? 26, 27, 28, 29
          var occupied_container = [];
          var head = parseInt(horizontal[randomRow-1][0].split('')[0] + '1');
          console.log("head = " + head);
          //for(var i = 0; i < 10; i++){
            for(var j = head; j < head+8; j++){
              if(horizontal[randomRow-1].indexOf(j.toString()) < 0){
                console.log("j = " + j);
                occupied_container.push([j.toString()]);
              }
            }
          //}
          console.log("occupied_container.length = " + occupied_container.length);
          if(occupied_container.length > 0){
            var startPoint, endPoint;
            var usableRow = false;
            for(var m=0; m < occupied_container.length; m++){
              if( occupied_container.length > 1){
                if( m == 0){
                  console.log("CASE - A");
                  var left = occupied_container[m] - head;
                  var right = occupied_container[m+1] - occupied_container[m] - 1;
                  console.log("occupied_container[m] = " + occupied_container[m]);
                  console.log("occupied_container[m+1] = " + occupied_container[m+1]);
                  console.log("left = " + left);
                  console.log("right = " + right);
                  if( left >= songAnswer[k].length ){
                    startPoint = parseInt(head);
                    endPoint = parseInt(head) + songAnswer[k].length - 1;
                    usableRow = true;
                    console.log("CASE - A1");
                  }else if(right >= songAnswer[k].length){
                    startPoint = parseInt(occupied_container[m]) + 1;
                    endPoint = parseInt(occupied_container[m]) + songAnswer[k].length;
                    usableRow = true;
                    console.log("CASE - A2");
                  }
                }else if(m == occupied_container.length-1){
                  console.log("CASE - C");
                  var left = occupied_container[m] - occupied_container[m-1] - 1;
                  var right = (head+8) - occupied_container[m];
                  console.log("occupied_container[m] = " + occupied_container[m]);
                  console.log("typeof occupied_container[m] = " + typeof occupied_container[m]);
                  console.log("occupied_container[m-1] = " + occupied_container[m-1]);
                  console.log("left = " + left);
                  console.log("right = " + right);
                  console.log("songAnswer[m].length = " + songAnswer[m].length);
                  if( left >= songAnswer[k].length ){
                    startPoint = parseInt(occupied_container[m-1]) + 1;
                    endPoint = parseInt(occupied_container[m-1]) + songAnswer[k].length;
                    usableRow = true;
                    console.log("CASE - C1");
                  }else if(right >= songAnswer[k].length){
                    startPoint = parseInt(occupied_container[m]) + 1;
                    endPoint = parseInt(occupied_container[m]) + songAnswer[k].length;
                    usableRow = true;
                    console.log("CASE - C2");
                  }else{
                    console.log("left = " + left);
                    console.log("right = " + right);
                    console.log("typeof right = " + typeof right);
                    console.log("songAnswer[k].length = " + songAnswer[k].length);
                    console.log("typeof songAnswer[k].length = " + typeof songAnswer[k].length);
                  }
                }else{
                  console.log("CASE - B");
                  var left = occupied_container[m] - occupied_container[m-1] - 1;
                  var right = occupied_container[m+1] - occupied_container[m] - 1;
                  console.log("occupied_container[m] = " + occupied_container[m]);
                  console.log("occupied_container[m+1] = " + occupied_container[m+1]);
                  console.log("left = " + left);
                  console.log("right = " + right);
                  if( left >= songAnswer[k].length){
                    startPoint = parseInt(occupied_container[m-1]) + 1;
                    endPoint = parseInt(occupied_container[m-1]) + songAnswer[k].length;
                    usableRow = true;
                    console.log("CASE - B1");
                  }else if(right >= songAnswer[k].length){
                    startPoint = parseInt(occupied_container[m]) + 1;
                    endPoint = parseInt(occupied_container[m]) + songAnswer[k].length;
                    usableRow = true;
                    console.log("CASE - B2");
                  }
                }
              }else{
                console.log("CASE - D");
                var left = occupied_container[m] - head;
                var right = (head+8) - occupied_container[m];
                console.log("left = " + left);
                console.log("right = " + right);
                if( left >= songAnswer[k].length ){
                  startPoint = parseInt(head);
                  endPoint = parseInt(head) + songAnswer[k].length - 1;
                  usableRow = true;
                  console.log("CASE - D1");
                }else if(right >= songAnswer[k].length){
                  startPoint = parseInt(occupied_container[m]) + 1;
                  endPoint = parseInt(occupied_container[m]) + songAnswer[k].length;
                  usableRow = true;
                  console.log("CASE - D2");
                }
              }
            }

            if(usableRow == true){
              var counter = 0;
              console.log("startPoint = " + startPoint);
              console.log("endPoint = " + endPoint);
              for(var i = startPoint; i <= endPoint; i++){
                $('#cell_'+ i).html(''+ songAnswer[k].charAt(counter));
                console.log("k= " + k);
                console.log("answerPositions['answer_pos_'"+(k+1)+"] = " + answerPositions["answer_pos_"+(k+1)]);
                answerPositions["answer_pos_"+(k+1)].push(''+ i);
                counter++;
              }
              found = true;
            }else{
              console.log("THIS ROW IS NOT USABLE");
              found = false;
            }
          }else{ // if occupied_container.length < 1 or whole rows are not occupied
            for(var i = 0; i < songAnswer[k].length; i++){
              $('#cell_'+horizontal[randomRow-1][i]).html(''+ songAnswer[k].charAt(counter));
              answerPositions["answer_pos_"+(k+1)].push(''+ horizontal[randomRow-1][i]);
              counter++;
            }
            found = true;
          }
          
          console.log("answerPositions['answer_pos_'"+(k+1)+"] = " + answerPositions["answer_pos_"+(k+1)]);

          grid.updateHorizontal(horizontal, vertical, answerPositions["answer_pos_"+(k+1)], randomRow-1);
          
        }else{
          found = false; 
        }
      }

      

      
    }else if(position[ranPos] === 'vertical'){
      console.log("===================================================");
      console.log(" =====================VERTICAL! =================");
      console.log("===================================================");
      console.log("songAnswer[k] = " + songAnswer[k]);

      var found = false;

      while(found == false){
        var randomCol = ver_cell[Math.floor(Math.random() * ver_cell.length)];
        if(vertical[randomCol-1].length >= songAnswer[k].length){
          console.log("randomCol = " + randomCol);
          var counter = 0;
          console.log("vertical[randomCol-1] = " + vertical[randomCol-1]);

          var occupied_container = [];
          var head = parseInt('1' + vertical[randomCol-1][0].split('')[1]);
          console.log("head = " + head);
          //for(var i = 0; i < 10; i++){
            for(var j = head; j < head+80; j += 10){
              if(vertical[randomCol-1].indexOf(j.toString()) < 0){
                console.log("j = " + j);
                occupied_container.push([j.toString()]);
              }
            }
          //}
          console.log("occupied_container.length = " + occupied_container.length);
          if(occupied_container.length > 0){
            var startPoint, endPoint;
            var usableRow = false;
            for(var m=0; m < occupied_container.length; m++){
              if( occupied_container.length > 1){
                if( m == 0){
                  console.log("CASE - A");
                  var top = (occupied_container[m] - head) / 10;
                  var bottom = (occupied_container[m+1] - occupied_container[m] - 10) / 10;
                  console.log("occupied_container[m] = " + occupied_container[m]);
                  console.log("occupied_container[m+1] = " + occupied_container[m+1]);
                  console.log("top = " + top);
                  console.log("bottom = " + bottom);
                  console.log("songAnswer[k].length = " + songAnswer[k].length);
                  if( top >= songAnswer[k].length ){
                    startPoint = parseInt(head);
                    endPoint = parseInt(head) + (songAnswer[k].length * 10) - 10;
                    usableRow = true;
                    console.log("CASE - A1");
                  }else if(bottom >= songAnswer[k].length){
                    startPoint = parseInt(occupied_container[m]) + 10;
                    endPoint = parseInt(occupied_container[m]) + (songAnswer[k].length * 10);
                    usableRow = true;
                    console.log("CASE - A2");
                  }
                }else if(m == occupied_container.length-1){
                  console.log("CASE - C");
                  var top = (occupied_container[m] - occupied_container[m-1] - 10) / 10;
                  //console.log("(parseInt(head)+80) = " + (parseInt(head)+80));
                  var bottom = ((head+80) - occupied_container[m]) / 10;
                  console.log("occupied_container[m] = " + occupied_container[m]);
                  console.log("typeof occupied_container[m] = " + typeof occupied_container[m]);
                  console.log("occupied_container[m-1] = " + occupied_container[m-1]);
                  console.log("top = " + top);
                  console.log("bottom = " + bottom);
                  console.log("songAnswer[k].length = " + songAnswer[k].length);
                  if( top >= songAnswer[k].length ){
                    startPoint = parseInt(occupied_container[m-1]) + 10;
                    endPoint = parseInt(occupied_container[m-1]) + (songAnswer[k].length * 10);
                    usableRow = true;
                    console.log("CASE - C1");
                  }else if(bottom >= songAnswer[k].length){
                    startPoint = parseInt(occupied_container[m]) + 10;
                    endPoint = parseInt(occupied_container[m]) + (songAnswer[k].length * 10);
                    usableRow = true;
                    console.log("CASE - C2");
                  }else{
                    console.log("typeof right = " + typeof right);
                    console.log("songAnswer[k].length = " + songAnswer[k].length);
                  }
                }else{
                  console.log("CASE - B");
                  var top = (occupied_container[m] - occupied_container[m-1] - 10) / 10;
                  var bottom = (occupied_container[m+1] - occupied_container[m] - 10) / 10;
                  console.log("occupied_container[m] = " + occupied_container[m]);
                  console.log("occupied_container[m+1] = " + occupied_container[m+1]);
                  console.log("top = " + top);
                  console.log("bottom = " + bottom);
                  console.log("songAnswer[k].length = " + songAnswer[k].length);
                  if( top >= songAnswer[k].length){
                    startPoint = parseInt(occupied_container[m-1]) + 10;
                    endPoint = parseInt(occupied_container[m-1]) + (songAnswer[k].length * 10);
                    usableRow = true;
                    console.log("CASE - B1");
                  }else if(bottom >= songAnswer[k].length){
                    startPoint = parseInt(occupied_container[m]) + 10;
                    endPoint = parseInt(occupied_container[m]) + (songAnswer[k].length * 10);
                    usableRow = true;
                    console.log("CASE - B2");
                  }
                }
              }else{
                console.log("CASE - D");
                var top = (occupied_container[m] - head) / 10;
                var bottom = ((head+80) - occupied_container[m]) / 10;
                console.log("top = " + top);
                console.log("bottom = " + bottom);
                console.log("songAnswer[k].length = " + songAnswer[k].length);
                if( top >= songAnswer[k].length ){
                  startPoint = parseInt(head);
                  endPoint = parseInt(head) + (songAnswer[k].length * 10) - 10;
                  usableRow = true;
                  console.log("CASE - D1");
                }else if(bottom >= songAnswer[k].length){
                  startPoint = parseInt(occupied_container[m]) + 10;
                  endPoint = parseInt(occupied_container[m]) + (songAnswer[k].length * 10);
                  usableRow = true;
                  console.log("CASE - D2");
                }
              }
            }

            if(usableRow == true){
              var counter = 0;
              console.log("startPoint = " + startPoint);
              console.log("endPoint = " + endPoint);
              for(var i = startPoint; i <= endPoint; i +=10){
                $('#cell_'+ i).html(''+ songAnswer[k].charAt(counter));
                console.log("k= " + k);
                console.log("answerPositions['answer_pos_'"+(k+1)+"] = " + answerPositions["answer_pos_"+(k+1)]);
                answerPositions["answer_pos_"+(k+1)].push(''+ i);
                counter++;
              }
              found = true;
            }else{
              console.log("THIS ROW IS NOT USABLE");
              found = false;
            }
          }else{
            for(var i = 0; i < songAnswer[k].length; i++){
              $('#cell_'+vertical[randomCol-1][i]).html(''+ songAnswer[k].charAt(counter));
              answerPositions["answer_pos_"+(k+1)].push(''+ vertical[randomCol-1][i]);
              counter++;
            }
            found = true;
          }
          
          grid.updateVertical(horizontal, vertical, answerPositions["answer_pos_"+(k+1)], randomCol-1);

          // for(var j = 0; j < songAnswer[k].length; j++){
          //   console.log("vertical[randomCol-1] = " + vertical[randomCol-1]);
          //   console.log("answerPositions[answer_pos_"+(k+1)+"][j] = " + answerPositions["answer_pos_"+(k+1)][j]);
          //   var indexToRemoveVer = vertical[randomCol-1].indexOf(answerPositions["answer_pos_"+(k+1)][j]);
          //   var horRow = parseInt(answerPositions["answer_pos_"+(k+1)][j].split('')[0]);
          //   console.log("horRow = " + horRow);
          //   var indexToRemoveHor = horizontal[horRow-1].indexOf(answerPositions["answer_pos_"+(k+1)][j]);
          //   console.log("indexToRemoveHor = " + indexToRemoveHor);
          //   console.log("before splice horizontal["+horRow+"] = " + horizontal[horRow-1]);
          //   vertical[randomCol-1].splice(indexToRemoveVer, 1);
          //   horizontal[horRow-1].splice(indexToRemoveHor, 1);
          //   console.log("after splice horizontal["+horRow+"] = " + horizontal[horRow-1]);
          // }
          // console.log("answerPositions['answer_pos_'"+(k+1)+"] = " + answerPositions["answer_pos_"+(k+1)]);
          // console.log("after splice vertical[randomCol-1] = " + vertical[randomCol-1] );
          //found = true;
        }else{
          found = false;
        }
      }//end of while loop
    }//end of if else horizontal or vertical
  }
  for(var ans in answerPositions){
    if(answerPositions.hasOwnProperty(ans)){
      console.log("Answer Position = " + answerPositions[ans]);
    }
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
      //$scope.correctAnswer = angular.uppercase(data['title']);
      $scope.correctAnswer = 'ALL ABOUT THAT BASS OF MISTER EMINEM';
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
      console.log("*************************************************");
      console.log("************ Your time = "+ $scope.mediaPlayer.currentTime + " seconds");
      console.log("*************************************************");
      //$rootScope.$emit('guess-time', $scope.mediaPlayer.currentTime); 
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


