var express = require('express'),
    router  = express.Router(),
    _       = require('underscore');
    fs      = require('fs');

router.route('/')
// the simple api to generate all the posiable permutation of six digit ticket of the provided numbers
.get(function (req, res) {
    
  res.send("Please provide correct url.");
});

router.route('/generate_ticket_number')
// the simple api to generate all the posiable permutation of six digit ticket of the provided numbers
.get(function (req, res) {
    var array_of_combination = Combinatorics.combination(["1","3","5","6","7","9","11","12","14","15","16","17","19","20","21","22","23","25","26","28","29","30","31","33","34","35","36","37","38"], 6);
  res.send(array_of_combination.toArray());
});

// api to read all previous winner ticket from text file 
router.route('/read_number_of_previous_winner')
.get(function (req, res) {
  fs.readFile("./winner.txt", "utf8", function (error, data) {
      var winner_numbers              = data.split("\n"),
        user_provided_numbers         = ["3","5","12","20","24","33"],
        lottery_result_array          = '',
        total_winning_number          = [],
        total_number_of_draw_drawn        = winner_numbers.length,
        no_of_time_given_one_correct_number   = 0,
        no_of_time_given_two_correct_number   = 0,
        no_of_time_given_three_correct_number = 0,
        no_of_time_given_four_correct_number  = 0,
        no_of_time_given_five_correct_number  = 0,
        no_of_time_hit_the_jackpot        = 0,
        details_with_one_correct_number     = [],
        details_with_two_correct_number     = [],
        details_with_three_correct_number   = [],
        details_with_four_correct_number    = [],
        details_with_five_correct_number    = [],
        details_with_six_correct_number     = [];

      //taking all the winning numbers from the winner lottery
        for(i=0;i<winner_numbers.length;i++)
        {
          var winning_number = [];
          lottery_result_array = winner_numbers[i].split("\t");
          if(lottery_result_array.length>0)
          {
            if(lottery_result_array.length>2)
            {
              for(j=1;j<lottery_result_array.length;j++)
              {
                if(lottery_result_array[j] !='')
                {
                  winning_number.push(lottery_result_array[j]);
                }
              }
            }
            else
            {
              new_lottery_result_array = winner_numbers[i].split(" ");
              for(j=1;j<new_lottery_result_array.length;j++)
              {
                if(new_lottery_result_array[j] != '')
                {
                  winning_number.push(new_lottery_result_array[j]);
                }
              }
            }
            var result_json ={
                  "date"      : lottery_result_array[0],
                  "winnig_numbers": winning_number
                 };

            total_winning_number.push(result_json);
          }
        }
       
        res.send(total_winning_number);
    });
});
// api to provide stats that how many time a use can win if he/she might used this lotto before
router.route('/winning_prediction_of_user')
.get(function (req, res) {
    
    fs.readFile("./winner.txt", "utf8", function (error, data) {
      var winner_numbers              = data.split("\n"),
        user_provided_numbers           = ["3","5","12","20","24","33"],
        lottery_result_array          = '',
        total_winning_number          = [],
        total_number_of_draw_drawn        = winner_numbers.length,
        no_of_time_given_one_correct_number   = 0,
        no_of_time_given_two_correct_number   = 0,
        no_of_time_given_three_correct_number = 0,
        no_of_time_given_four_correct_number  = 0,
        no_of_time_given_five_correct_number  = 0,
        no_of_time_hit_the_jackpot        = 0,
        details_with_one_correct_number     = [],
        details_with_two_correct_number     = [],
        details_with_three_correct_number   = [],
        details_with_four_correct_number    = [],
        details_with_five_correct_number    = [],
        details_with_six_correct_number     = [];

      //taking all the winning numbers from the winner lottery
        for(i=0;i<winner_numbers.length;i++)
        {
          var winning_number = [];
          lottery_result_array = winner_numbers[i].split("\t");
          if(lottery_result_array.length>0)
          {
            if(lottery_result_array.length>2)
            {
              for(j=1;j<lottery_result_array.length;j++)
              {
                if(lottery_result_array[j] !='')
                {
                  winning_number.push(lottery_result_array[j]);
                }
              }
            }
            else
            {
              new_lottery_result_array = winner_numbers[i].split(" ");
              for(j=1;j<new_lottery_result_array.length;j++)
              {
                if(new_lottery_result_array[j] != '')
                {
                  winning_number.push(new_lottery_result_array[j]);
                }
              }
            }
            var result_json ={
                  "date"      : lottery_result_array[0],
                  "winnig_numbers": winning_number
                 };

            total_winning_number.push(result_json);
          }
        }
        for(k=0;k<total_winning_number.length;k++)
        {
          var winning_numbers=_.intersection(user_provided_numbers,total_winning_number[k].winnig_numbers);
          if(winning_numbers.length==1)
          {
            no_of_time_given_one_correct_number++;
            details_with_one_correct_number.push({  
                      "provided_number" : user_provided_numbers,
                      "lottery_number"  : total_winning_number[k],
                      "winning_number"  : winning_numbers
                      });
          }
          if(winning_numbers.length==2)
          {
            no_of_time_given_two_correct_number++;
            details_with_two_correct_number.push({  
                      "provided_number" : user_provided_numbers,
                      "lottery_number"  : total_winning_number[k],
                      "winning_number"  : winning_numbers
                      });
          }
          if(winning_numbers.length==3)
          {
            no_of_time_given_three_correct_number++;
            details_with_three_correct_number.push({
                      "provided_number" : user_provided_numbers,
                      "lottery_number"  : total_winning_number[k],
                      "winning_number"  : winning_numbers
                      });
          }
          if(winning_numbers.length==4)
          {
            no_of_time_given_four_correct_number++;
            details_with_four_correct_number.push({ 
                      "provided_number" : user_provided_numbers,
                      "lottery_number"  : total_winning_number[k],
                      "winning_number"  : winning_numbers
                      });
          }
          if(winning_numbers.length==5)
          {
            no_of_time_given_five_correct_number++;
            details_with_five_correct_number.push({ 
                      "provided_number" : user_provided_numbers,
                      "lottery_number"  : total_winning_number[k],
                      "winning_number"  : winning_numbers
                      });
          }
          if(winning_numbers.length==6)
          {
            no_of_time_hit_the_jackpot++;
            details_with_six_correct_number.push({
                      "provided_number" : user_provided_numbers,
                      "lottery_number"  : total_winning_number[k],
                      "winning_number"  : winning_numbers
                      });
          }
        }
        // creating the respose json
        var response = {};
        response.loterry_number_provided_by_customer  = user_provided_numbers;

        response.no_of_time_hit_one_correct_number  = no_of_time_given_one_correct_number;
        response.details_of_one_correct_loterry   = details_with_one_correct_number;

        response.no_of_time_hit_two_correct_number  = no_of_time_given_two_correct_number;
        response.details_of_two_correct_loterry   = details_with_two_correct_number;

        response.no_of_time_hit_three_correct_number  = no_of_time_given_three_correct_number;
        response.details_of_three_correct_loterry = details_with_three_correct_number;

        response.no_of_time_hit_four_correct_number = no_of_time_given_four_correct_number;
        response.details_with_four_correct_number = details_with_four_correct_number;

        response.no_of_time_hit_five_correct_number = no_of_time_given_five_correct_number;
        response.details_with_five_correct_number = details_with_five_correct_number;

        response.no_of_time_hit_the_jackpot   = no_of_time_hit_the_jackpot;
        response.details_with_six_correct_number  = details_with_six_correct_number;


        res.send(response);
    });
});

// api to add new result in text file
router.route('/add_new_winner_in_list')
.post(function (req, res) {
  
  var async =require("async");
  // creating the respose json
  var response                    = {};
    response.validate_successfully= "yes",
    provided_date                 = req.body.date,
    provided_number               = req.body.winning_numbers,
    lottery_result_already_added  = "no";
    previous_lottery_details      = '';
    previous_lottery_numbers      = '';
  async.series([
    //here in this block of async i am validating all the data
    function(callback) {
      if(typeof provided_date=='undefined' || provided_date =='' || provided_date == null)
      {
          response.validate_successfully  = "no";
          response.code                   =  "203";
          response.error_message          = "please provide lottery date.";
      }
      if(typeof provided_number=='undefined')
      {
          responsevalidate_successfully   = "no";
          response.code                   =  "203";
          response.error_message          = "please provide lottery Numbers.";
      }
      else
      {
        if(provided_number.length !=6)
        {
          response.validate_successfully  = "no";
          response.code                   =  "203";
          response.error_message          = "please provide six lottery Numbers.";
        }
      }
      callback();
    },
 //Load posts (won't be called before task 1's "task callback" has been called)
    function(callback) {
        if(response.validate_successfully == "yes")
        {
          fs.readFile("./winner.txt", "utf8", function (error, text_details) {
            previous_lottery_numbers  = text_details;
            var winner_numbers  = text_details.split("\n");
            //taking all the winning numbers from the winner lottery
              for(i=0;i<winner_numbers.length;i++)
              {
                var lottery_result_array  = winner_numbers[i].split("\t");
                if(lottery_result_array.length>0)
                {
                  // checking if previously added the same date lottery or not
                  if(provided_date == lottery_result_array[0])
                  {
                    response.code                   =  "203";
                    response.validate_successfully  = "no";
                    response.error_message          = "lottery details already added.";
                    response.previous_lottery_details= lottery_result_array;
                  }
                }
              }
            callback();
          });
          
        }
        else
        {
          callback();
        }
    }
    ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
      if(response.validate_successfully == "yes")
      {
        var fs = require("fs");
        var path = "./winner.txt";
        var data = provided_date+"\t";
        for(i=0;i<provided_number.length;i++)
        {
          data+= provided_number[i]+"\t";
        }
        data +="\n"+previous_lottery_numbers;
        fs.writeFile(path, data, function(error) {
             if (error) {
                response.code                   =  "203";
                response.error_message          = "winning lottery details cannot be added please try again.";
                res.send(response);
             } else {
               response.code                   =  "200";
                response.error_message          = "you had successfully added the winning lottery details.";
                res.send(response);
             }
        });
        
      }
      else
      {

       res.send(response);
      }
    });
});

// api to add new result in text file
router.route('/get_current_jackpot_number')
.get(function (req, res) {
  var response = {};
   fs.readFile("./winner.txt", "utf8", function (error, data) {
      var winner_numbers          = data.split("\n");
      var current_jackpot_number  = winner_numbers[0].split("\t");
      var jackpot_date            = current_jackpot_number[0];
      var jackpot_number          = [];
      for(i=1;i<current_jackpot_number.length;i++)
      {
          jackpot_number.push(current_jackpot_number[i]);

      }
      var response_data        = {
                                  "date"          : jackpot_date,
                                  "jackpot_number": jackpot_number
                                };
      response.response_code  = 200;
      response.response_data  = response_data;
      res.send(response);
    });
});

module.exports = router;