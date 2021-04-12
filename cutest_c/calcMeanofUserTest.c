#include <stdio.h>
#include <ctype.h>
#include <stdlib.h>
#include "CuTest.h"


#define TOTALCRITERIA 9
#define K 3 

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

//--------TEST---------
//alle ens rating
void TestAllSameRating(CuTest *tc){
    //set input
    user input;
    input.dog = 5;
    input.triangle = 5;
    input.football = 5;
    input.red = 5;
    input.yellow = 5;
    input.green = 5;
    input.blue = 5;
    input.spaghetti = 5;
    input.pizza = 5;
    //actual
    double actual = calc_mean_of_user(input);
    //expected
    double expected = 5.001;
    CuAssertDblEquals(tc, expected, actual, 0.0);
}
//lave ratings
void TestLowRatings(CuTest *tc){
    //set input
    user input;
    input.dog = 1;
    input.triangle = 1;
    input.football = 1;
    input.red = 1;
    input.yellow = 1;
    input.green = 1;
    input.blue = 1;
    input.spaghetti = 1;
    input.pizza = 10;
    //actual
    double actual = calc_mean_of_user(input);
    //expected
    double expected = 2.00000000;
    CuAssertDblEquals(tc, expected, actual, 0.0);
}
//høje ratings
void TestHighRating(CuTest *tc){
    //set input
    user input;
    input.dog = 10;
    input.triangle = 9;
    input.football = 8;
    input.red = 8;
    input.yellow = 9;
    input.green = 10;
    input.blue = 8;
    input.spaghetti = 9;
    input.pizza = 10;
    //actual
    double actual = calc_mean_of_user(input);
    //expected
    double expected = 9.0;
    CuAssertDblEquals(tc, expected, actual, 0.0);
}
//blandede ratings
void TestMixedRating(CuTest *tc){
    //set input
    user input;
    input.dog = 10;
    input.triangle = 9;
    input.football = 8;
    input.red = 4;
    input.yellow = 3;
    input.green = 2;
    input.blue = 1;
    input.spaghetti = 2;
    input.pizza = 6;
    //actual
    double actual = calc_mean_of_user(input);
    //expected
    double expected = 5.0;
    CuAssertDblEquals(tc, expected, actual, 0.0);
}

CuSuite* StrUtilGetSuite() {
    CuSuite* suite = CuSuiteNew();
    SUITE_ADD_TEST(suite, TestAllSameRating);
    SUITE_ADD_TEST(suite, TestLowRatings);
    SUITE_ADD_TEST(suite, TestHighRating);
    SUITE_ADD_TEST(suite, TestMixedRating);
    return suite;
}