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
    double sports;       
    double food;
    double music;
    double movies;
    double drinking;
    double cars;
    double hiking;
    double magic;
    double djing;
    double pearson; 
} user;

double calc_sqrt_of_user(user user, double mean){
    double user_sqrt = sqrt (pow((user.sports - mean),2) + 
                       pow((user.food - mean), 2) + 
                       pow((user.music - mean), 2) +
                       pow((user.movies - mean),2) +
                       pow((user.drinking - mean),2) +
                       pow((user.cars - mean),2) +
                       pow((user.hiking - mean),2) +
                       pow((user.magic - mean),2) +
                       pow((user.djing - mean),2));
    return user_sqrt;
}

//---------TEST---------
//alle ens rating
void TestAllSameRating(CuTest *tc){
    //set input
    user input;
    input.sports = 5;
    input.food = 5;
    input.music = 5;
    input.movies = 5;
    input.drinking = 5;
    input.cars = 5;
    input.hiking = 5;
    input.magic = 5;
    input.djing = 5;
    //actual
    double actual = calc_sqrt_of_user(input, 5.001);
    //expected
    double expected = 0.003000;
    CuAssertDblEquals(tc, expected, actual, 0.0);
}

void TestMixedRating(CuTest *tc){
    //set input
    user input;
    input.sports = 10;
    input.food = 9;
    input.music = 8;
    input.movies = 4;
    input.drinking = 3;
    input.cars = 2;
    input.hiking = 1;
    input.magic = 2;
    input.djing = 6;
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
    input.sports = 1;
    input.food = 1;
    input.music = 1;
    input.movies = 1;
    input.drinking = 1;
    input.cars = 1;
    input.hiking = 1;
    input.magic = 1;
    input.djing = 10;
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
    input.sports = 10;
    input.food = 9;
    input.music = 8;
    input.movies = 8;
    input.drinking = 9;
    input.cars = 10;
    input.hiking = 8;
    input.magic = 9;
    input.djing = 10;
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