//All expected values of tests are calculated on Wolframalpha.com
#include <stdio.h>
#include <ctype.h>
#include <stdlib.h>
#include <math.h>
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

//---------TEST---------
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
    double actual = calc_sqrt_of_user(input, 5.001);
    //expected
    double expected = 0.003000;
    CuAssertDblEquals(tc, expected, actual, 0.0);
}

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
    double actual = calc_sqrt_of_user(input, 5.0);
    //expected 
    double expected = 9.4868329;
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
    double actual = calc_sqrt_of_user(input, 2.0);
    //expected
    double expected = 8.4852813;
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
    double actual = calc_sqrt_of_user(input, 9.0);
    //expected 
    double expected = 2.4494897;
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