//Includes based on original file for pearson 
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
//Includes based on CuTest
#include <ctype.h>
#include "CuTest.h"

//constants to steer calcs
#define TOTALCRITERIA 9
#define K 3 

//user struct
typedef struct user {
    int id;
    char name[25];
    int age;
    char gender;
    double dog;       
    double triangle;
    double football;
    double red;
    double yellow;
    double green;
    double blue;
    double spaghetti;
    double pizza;
    double pearson; 
} user;

double calc_mean_of_user(user user){
    double mean = (user.dog + user.triangle + user.football + 
                   user.red + user.yellow + user.green + 
                   user.blue + user.spaghetti + user.pizza) / TOTALCRITERIA;

    //special case when users have rated same rating on all items to handle dividing by zero
    if(mean == user.dog && mean == user.triangle && mean == user.football && 
       mean == user.red && mean == user.yellow && mean == user.green && 
       mean == user.blue && mean == user.spaghetti && mean == user.pizza){
       mean += 0.001;
    }

    return mean;
}

double calc_sqrt_of_user(user user, double mean){
    double user_sqrt = sqrt (pow((user.dog - mean),2) + 
                       pow((user.triangle - mean), 2) + 
                       pow((user.football - mean), 2) +
                       pow((user.red - mean),2) +
                       pow((user.yellow - mean),2) +
                       pow((user.green - mean),2) +
                       pow((user.blue - mean),2) +
                       pow((user.spaghetti - mean),2) +
                       pow((user.pizza - mean),2));
    return user_sqrt;
}

double pearson(user *users, int target, int compare){
    user target_user = users[target];
    user comp_user = users[compare];

    //means are considered to be correct based on calcMeanofUserTest.c
    //finding user means
    double t_mean = calc_mean_of_user(target_user);
    double c_mean = calc_mean_of_user(comp_user);
    
    //means are considered to be correct based on calcSqrtofUserTest.c
    //calc sqrt for each user
    double t_sqrt = calc_sqrt_of_user(target_user, t_mean);
    double c_sqrt = calc_sqrt_of_user(comp_user, c_mean);

    //calc similarity
    double sim =    ((target_user.dog - t_mean) * (comp_user.dog - c_mean)) + 
                    ((target_user.triangle - t_mean) * (comp_user.triangle - c_mean)) + 
                    ((target_user.football - t_mean) * (comp_user.football - c_mean)) +
                    ((target_user.red - t_mean ) * (comp_user.red - c_mean)) +
                    ((target_user.yellow - t_mean) * (comp_user.yellow - c_mean)) +
                    ((target_user.green - t_mean) * (comp_user.green - c_mean)) +
                    ((target_user.blue - t_mean) * (comp_user.blue - c_mean)) +
                    ((target_user.spaghetti - t_mean) * (comp_user.spaghetti - c_mean)) +
                    ((target_user.pizza - t_mean) * (comp_user.pizza - c_mean));

    //calculating similarity coeficient
    double coeficient = sim / (t_sqrt * c_sqrt);
    
    return coeficient; 
}

//--------TESTS----------

//alle ens rating
void TestAllSameRating(CuTest *tc){
    //set input
    user input[2];
    //User 0
    input[0].dog = 5;
    input[0].triangle = 5;
    input[0].football = 5;
    input[0].red = 5;
    input[0].yellow = 5;
    input[0].green = 5;
    input[0].blue = 5;
    input[0].spaghetti = 5;
    input[0].pizza = 5;
    //User 1
    input[1].dog = 5;
    input[1].triangle = 5;
    input[1].football = 5;
    input[1].red = 5;
    input[1].yellow = 5;
    input[1].green = 5;
    input[1].blue = 5;
    input[1].spaghetti = 5;
    input[1].pizza = 5;
    //actual
    double actual = pearson(input, 0, 1);
    //expected values
    //mean: 2.0
    //sim: 0.000009
    //t sqrt & c sqrt: 0.003000
    double expected = 1.000000;
    CuAssertDblEquals(tc, expected, actual, 0.0);
    //Output: Gives failure, but results checks out equal, due to rounding
}

//lave ratings
void TestLowRatings(CuTest *tc){
    //set input
    user input[2];
    //User 0
    input[0].dog = 2;
    input[0].triangle = 2;
    input[0].football = 3;
    input[0].red = 1;
    input[0].yellow = 2;
    input[0].green = 3;
    input[0].blue = 1;
    input[0].spaghetti = 2;
    input[0].pizza = 2;
    //User 1
    input[1].dog = 3;
    input[1].triangle = 3;
    input[1].football = 1;
    input[1].red = 2;
    input[1].yellow = 1;
    input[1].green = 2;
    input[1].blue = 2;
    input[1].spaghetti = 3;
    input[1].pizza = 1;
    //actual
    double actual = pearson(input, 0, 1);
    //expected values
    //sim: -1
    //t sqrt: 2.00
    //c sqrt: 2.4494897
    double expected = -0.2041241;
    CuAssertDblEquals(tc, expected, actual, 0.0);
    //Output: Gives failure, but results checks out equal, due to rounding
}

//høje ratings
void TestHighRatings(CuTest *tc){
    //set input
    user input[2];
    //User 0
    input[0].dog = 9;
    input[0].triangle = 9;
    input[0].football = 10;
    input[0].red = 8;
    input[0].yellow = 9;
    input[0].green = 10;
    input[0].blue = 8;
    input[0].spaghetti = 9;
    input[0].pizza = 9;
    //User 1
    input[1].dog = 10;
    input[1].triangle = 10;
    input[1].football = 8;
    input[1].red = 9;
    input[1].yellow = 8;
    input[1].green = 9;
    input[1].blue = 9;
    input[1].spaghetti = 10;
    input[1].pizza = 8;
    //actual
    double actual = pearson(input, 0, 1);
    //expected values:
    //mean value:   9
    //sim:          -1    
    //t sqrt:       2
    //c sqrt:       2.4494897
    double expected = -0.2041241;
    CuAssertDblEquals(tc, expected, actual, 0.0);
    //Output: as expected
}

//Mixed ratings
void TestMixedRatings(CuTest *tc){
    //set input
    user input[2];
    //User 0
    input[0].dog = 2;
    input[0].triangle = 3;
    input[0].football = 3;
    input[0].red = 3;
    input[0].yellow = 4;
    input[0].green = 3;
    input[0].blue = 3;
    input[0].spaghetti = 2;
    input[0].pizza = 4;
    //mean = 3
    //User 1
    input[1].dog = 9;
    input[1].triangle = 4;
    input[1].football = 3;
    input[1].red = 6;
    input[1].yellow = 8;
    input[1].green = 3;
    input[1].blue = 7;
    input[1].spaghetti = 1;
    input[1].pizza = 4;
    //mean = 5
    //actual
    double actual = pearson(input, 0, 1);
    //expected values:
    //mean value:   3L & 5H
    //sim:          2    
    //t sqrt:       2
    //c sqrt:       7.48331477
    double expected = 0.1336306;
    CuAssertDblEquals(tc, expected, actual, 0.0);
    //Output: as expected
}

CuSuite* StrUtilGetSuite() {
    CuSuite* suite = CuSuiteNew();
    SUITE_ADD_TEST(suite, TestAllSameRating);
    SUITE_ADD_TEST(suite, TestLowRatings);
    SUITE_ADD_TEST(suite, TestHighRatings);
    SUITE_ADD_TEST(suite, TestMixedRatings);
    return suite;
}

