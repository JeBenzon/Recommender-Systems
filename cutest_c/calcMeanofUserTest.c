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

double calc_mean_of_user(user user){
    double mean = (user.sports + user.food + user.music + 
                   user.movies + user.drinking + user.cars + 
                   user.hiking + user.magic + user.djing) / TOTALCRITERIA;

    //special case when users have rated same rating on all items to handle dividing by zero
    if(mean == user.sports && mean == user.food && mean == user.music && 
       mean == user.movies && mean == user.drinking && mean == user.cars && 
       mean == user.hiking && mean == user.magic && mean == user.djing){
       mean += 0.001;
    }

    return mean;
}

//--------TEST---------
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
    double actual = calc_mean_of_user(input);
    //expected
    double expected = 5.001;
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
    double actual = calc_mean_of_user(input);
    //expected
    double expected = 2.00000000;
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
    double actual = calc_mean_of_user(input);
    //expected
    double expected = 9.0;
    CuAssertDblEquals(tc, expected, actual, 0.0);
}
//blandede ratings
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