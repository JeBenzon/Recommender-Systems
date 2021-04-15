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
    double sim =    ((target_user.sports - t_mean) * (comp_user.sports - c_mean)) + 
                    ((target_user.food - t_mean) * (comp_user.food - c_mean)) + 
                    ((target_user.music - t_mean) * (comp_user.music - c_mean)) +
                    ((target_user.movies - t_mean ) * (comp_user.movies - c_mean)) +
                    ((target_user.drinking - t_mean) * (comp_user.drinking - c_mean)) +
                    ((target_user.cars - t_mean) * (comp_user.cars - c_mean)) +
                    ((target_user.hiking - t_mean) * (comp_user.hiking - c_mean)) +
                    ((target_user.magic - t_mean) * (comp_user.magic - c_mean)) +
                    ((target_user.djing - t_mean) * (comp_user.djing - c_mean));

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
    input[0].sports = 5;
    input[0].food = 5;
    input[0].music = 5;
    input[0].movies = 5;
    input[0].drinking = 5;
    input[0].cars = 5;
    input[0].hiking = 5;
    input[0].magic = 5;
    input[0].djing = 5;
    //User 1
    input[1].sports = 5;
    input[1].food = 5;
    input[1].music = 5;
    input[1].movies = 5;
    input[1].drinking = 5;
    input[1].cars = 5;
    input[1].hiking = 5;
    input[1].magic = 5;
    input[1].djing = 5;
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
    input[0].sports = 2;
    input[0].food = 2;
    input[0].music = 3;
    input[0].movies = 1;
    input[0].drinking = 2;
    input[0].cars = 3;
    input[0].hiking = 1;
    input[0].magic = 2;
    input[0].djing = 2;
    //User 1
    input[1].sports = 3;
    input[1].food = 3;
    input[1].music = 1;
    input[1].movies = 2;
    input[1].drinking = 1;
    input[1].cars = 2;
    input[1].hiking = 2;
    input[1].magic = 3;
    input[1].djing = 1;
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
    input[0].sports = 9;
    input[0].food = 9;
    input[0].music = 10;
    input[0].movies = 8;
    input[0].drinking = 9;
    input[0].cars = 10;
    input[0].hiking = 8;
    input[0].magic = 9;
    input[0].djing = 9;
    //User 1
    input[1].sports = 10;
    input[1].food = 10;
    input[1].music = 8;
    input[1].movies = 9;
    input[1].drinking = 8;
    input[1].cars = 9;
    input[1].hiking = 9;
    input[1].magic = 10;
    input[1].djing = 8;
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
    input[0].sports = 2;
    input[0].food = 3;
    input[0].music = 3;
    input[0].movies = 3;
    input[0].drinking = 4;
    input[0].cars = 3;
    input[0].hiking = 3;
    input[0].magic = 2;
    input[0].djing = 4;
    //mean = 3
    //User 1
    input[1].sports = 9;
    input[1].food = 4;
    input[1].music = 3;
    input[1].movies = 6;
    input[1].drinking = 8;
    input[1].cars = 3;
    input[1].hiking = 7;
    input[1].magic = 1;
    input[1].djing = 4;
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

