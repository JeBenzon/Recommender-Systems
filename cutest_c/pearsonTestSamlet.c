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

void pearsonTestExceptional1(CuTest *tc){
    //set input
    user input[2];
    //User 0
    input[0].sports = -2;
    input[0].food = -2;
    input[0].music = -2;
    input[0].movies = -2;
    input[0].drinking = -2;
    input[0].cars = -2;
    input[0].hiking = -2;
    input[0].magic = -2;
    input[0].djing = 16;
    //User 1
    input[1].sports = 9;
    input[1].food = -1;
    input[1].music = -1;
    input[1].movies = -1;
    input[1].drinking = -1;
    input[1].cars = -1;
    input[1].hiking = -1;
    input[1].magic = -1;
    input[1].djing = -1;
    //actual
    double actual = pearson(input, 0, 1);
    //expected values:
    //t_mean value:   0
    //c_mean value:   0.111 -> 1/9
    //t sqrt:       16.97056 -> 12*sqrt(2)
    //c sqrt:       9.42809 -> (20*sqrt(2))/3
    //sim:          -20
    double expected = -0.125;
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void pearsonTestExceptional2(CuTest *tc){
    //set input
    user input[2];
    //User 0
    input[0].sports = 1;
    input[0].food = 2;
    input[0].music = 4;
    input[0].movies = 8;
    input[0].drinking = 16;
    input[0].cars = 32;
    input[0].hiking = 64;
    input[0].magic = 128;
    input[0].djing = 0;
    //User 1
    input[1].sports = 0;
    input[1].food = -128;
    input[1].music = -64;
    input[1].movies = -32;
    input[1].drinking = -16;
    input[1].cars = -8;
    input[1].hiking = -4;
    input[1].magic = -2;
    input[1].djing = -1;
    //actual
    double actual = pearson(input, 0, 1);
    //expected values:
    //t_mean value:   28.33333 -> 85/3
    //c_mean value:   -28.33333 -> -85/3
    //t sqrt:       120.91319 -> 2*sqrt(3655)
    //c sqrt:       120.91319 -> 2*sqrt(3655)
    //sim:          5433
    double expected = 0.37161; //-> 5433/14620
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void pearsonTestExtreme1(CuTest *tc){
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
    //expected values:
    //t_mean value:   5.001
    //c_mean value:   5.001
    //t sqrt:       0.003
    //c sqrt:       0.003
    //sim:          0.000009
    double expected = 1;
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void pearsonTestExtreme2(CuTest *tc){
    //set input
    user input[2];
    //User 0
    input[0].sports = 1;
    input[0].food = 1;
    input[0].music = 1;
    input[0].movies = 1;
    input[0].drinking = 1;
    input[0].cars = 1;
    input[0].hiking = 1;
    input[0].magic = 1;
    input[0].djing = 1;
    //User 1
    input[1].sports = 10;
    input[1].food = 10;
    input[1].music = 10;
    input[1].movies = 10;
    input[1].drinking = 10;
    input[1].cars = 10;
    input[1].hiking = 10;
    input[1].magic = 10;
    input[1].djing = 10;
    //actual
    double actual = pearson(input, 0, 1);
    //expected values:
    //t_mean value:   1.001
    //c_mean value:   10.001
    //t sqrt:       0.003
    //c sqrt:       0.003
    //sim:          0.000009
    double expected = 1;
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void pearsonTestNormal1(CuTest *tc){
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
    //expected values:
    //t_mean value:   2
    //c_mean value:   2
    //t sqrt:       2
    //c sqrt:       2.44948 -> sqrt(6)
    //sim:          -1
    double expected = -0.20412; //-> -(sqrt(6)/12)
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void pearsonTestNormal2(CuTest *tc){
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
    //t_mean value:   9
    //c_mean value:   9 
    //t sqrt:       2
    //c sqrt:       2.44948 -> sqrt(6)
    //sim:          -1
    double expected = -0.20412; //-> -(sqrt(6)/12)
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void pearsonTestNormal3(CuTest *tc){
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
    //actual
    double actual = pearson(input, 0, 1);
    //expected values:
    //t_mean value:   3
    //c_mean value:   4.88888 -> (44/9)
    //t sqrt:       2
    //c sqrt:       7.49073 -> sqrt(505)/3
    //sim:          2
    double expected = 0.13349; //-> 3/sqrt(505)
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void pearsonTestNormal4(CuTest *tc){
    //set input
    user input[2];
    //User 0
    input[0].sports = 1;
    input[0].food = 2;
    input[0].music = 3;
    input[0].movies = 4;
    input[0].drinking = 5;
    input[0].cars = 6;
    input[0].hiking = 7;
    input[0].magic = 8;
    input[0].djing = 9;
    //User 1
    input[1].sports = 10;
    input[1].food = 9;
    input[1].music = 8;
    input[1].movies = 7;
    input[1].drinking = 6;
    input[1].cars = 5;
    input[1].hiking = 4;
    input[1].magic = 3;
    input[1].djing = 2;
    //actual
    double actual = pearson(input, 0, 1);
    //expected values:
    //t_mean value:   5
    //c_mean value:   6
    //t sqrt:       7.74596 -> 2*sqrt(15)
    //c sqrt:       7.74596 -> 2*sqrt(15)
    //sim:          -60
    double expected = -1;
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void calcSqrtofUserTestExceptional1(CuTest *tc){
    //set input
    user input;
    input.sports = -2;
    input.food = -2;
    input.music = -2;
    input.movies = -2;
    input.drinking = -2;
    input.cars = -2;
    input.hiking = -2;
    input.magic = -2;
    input.djing = 16;
    //actual
    double actual = calc_sqrt_of_user(input, 0);
    //expected
    //mean value:   0
    double expected = 16.97056;
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void calcSqrtofUserTestExceptional2(CuTest *tc){
    //set input
    user input;
    input.sports = 1;
    input.food = 2;
    input.music = 4;
    input.movies = 8;
    input.drinking = 16;
    input.cars = 32;
    input.hiking = 64;
    input.magic = 128;
    input.djing = 0;
    //actual
    double actual = calc_sqrt_of_user(input, 28.33333);
    //expected
    //mean value:   28.33333 -> 85/3
    double expected = 120.91319 ; //-> 2*sqrt(3655)
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void calcSqrtofUserTestExtreme1(CuTest *tc){
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
    //mean value:   5.001
    double expected = 0.003;
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void calcSqrtofUserTestExtreme2(CuTest *tc){
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
    input.djing = 1;
    //actual
    double actual = calc_sqrt_of_user(input, 1.001);
    //expected
    //mean value:   1.001
    double expected = 0.003;
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void calcSqrtofUserTestNormal1(CuTest *tc){
    //set input
    user input;
    input.sports = 2;
    input.food = 2;
    input.music = 3;
    input.movies = 1;
    input.drinking = 2;
    input.cars = 3;
    input.hiking = 1;
    input.magic = 2;
    input.djing = 2;
    //actual
    double actual = calc_sqrt_of_user(input, 2);
    //expected
    //mean value:   2
    double expected = 2;
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void calcSqrtofUserTestNormal2(CuTest *tc){
    //set input
    user input;
    input.sports = 9;
    input.food = 9;
    input.music = 10;
    input.movies = 8;
    input.drinking = 9;
    input.cars = 10;
    input.hiking = 8;
    input.magic = 9;
    input.djing = 9;
    //actual
    double actual = calc_sqrt_of_user(input, 9);
    //expected
    //mean value:   9
    double expected = 2;
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void calcSqrtofUserTestNormal3(CuTest *tc){
    //set input
    user input;
    input.sports = 2;
    input.food = 3;
    input.music = 3;
    input.movies = 3;
    input.drinking = 4;
    input.cars = 3;
    input.hiking = 3;
    input.magic = 2;
    input.djing = 4;
    //actual
    double actual = calc_sqrt_of_user(input, 3);
    //expected
    //mean value:   3
    double expected = 2;
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void calcSqrtofUserTestNormal4(CuTest *tc){
    //set input
    user input;
    input.sports = 1;
    input.food = 2;
    input.music = 3;
    input.movies = 4;
    input.drinking = 5;
    input.cars = 6;
    input.hiking = 7;
    input.magic = 8;
    input.djing = 9;
    //actual
    double actual = calc_sqrt_of_user(input, 5);
    //expected
    //mean value:   5
    double expected = 7.74596; //-> 2*sqrt(15)
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void calcMeanofUserTestExceptional1(CuTest *tc){
    //set input
    user input;
    input.sports = -2;
    input.food = -2;
    input.music = -2;
    input.movies = -2;
    input.drinking = -2;
    input.cars = -2;
    input.hiking = -2;
    input.magic = -2;
    input.djing = 16;
    //actual
    double actual = calc_mean_of_user(input);
    //expected
    double expected = 0;
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void calcMeanofUserTestExceptional2(CuTest *tc){
    //set input
    user input;
    input.sports = 1;
    input.food = 2;
    input.music = 4;
    input.movies = 8;
    input.drinking = 16;
    input.cars = 32;
    input.hiking = 64;
    input.magic = 128;
    input.djing = 0;
    //actual
    double actual = calc_mean_of_user(input);
    //expected
    double expected = 28.33333; //-> 85/3
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void calcMeanofUserTestExtreme1(CuTest *tc){
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
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void calcMeanofUserTestExtreme2(CuTest *tc){
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
    input.djing = 1;
    //actual
    double actual = calc_mean_of_user(input);
    //expected
    double expected = 1.001;
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void calcMeanofUserTestNormal1(CuTest *tc){
    //set input
    user input;
    input.sports = 2;
    input.food = 2;
    input.music = 3;
    input.movies = 1;
    input.drinking = 2;
    input.cars = 3;
    input.hiking = 1;
    input.magic = 2;
    input.djing = 2;
    //actual
    double actual = calc_mean_of_user(input);
    //expected
    double expected = 2;
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void calcMeanofUserTestNormal2(CuTest *tc){
    //set input
    user input;
    input.sports = 9;
    input.food = 9;
    input.music = 10;
    input.movies = 8;
    input.drinking = 9;
    input.cars = 10;
    input.hiking = 8;
    input.magic = 9;
    input.djing = 9;
    //actual
    double actual = calc_mean_of_user(input);
    //expected
    double expected = 9;
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void calcMeanofUserTestNormal3(CuTest *tc){
    //set input
    user input;
    input.sports = 2;
    input.food = 3;
    input.music = 3;
    input.movies = 3;
    input.drinking = 4;
    input.cars = 3;
    input.hiking = 3;
    input.magic = 2;
    input.djing = 4;
    //actual
    double actual = calc_mean_of_user(input);
    //expected
    double expected = 3;
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

void calcMeanofUserTestNormal4(CuTest *tc){
    //set input
    user input;
    input.sports = 1;
    input.food = 2;
    input.music = 3;
    input.movies = 4;
    input.drinking = 5;
    input.cars = 6;
    input.hiking = 7;
    input.magic = 8;
    input.djing = 9;
    //actual
    double actual = calc_mean_of_user(input);
    //expected
    double expected = 5;
    CuAssertDblEquals(tc, expected, actual, 0.000001);
}

CuSuite* StrUtilGetSuite() {
    CuSuite* suite = CuSuiteNew();
    SUITE_ADD_TEST(suite, pearsonTestExceptional1);
    SUITE_ADD_TEST(suite, pearsonTestExceptional2);
    SUITE_ADD_TEST(suite, pearsonTestExtreme1);
    SUITE_ADD_TEST(suite, pearsonTestExtreme2);
    SUITE_ADD_TEST(suite, pearsonTestNormal1);
    SUITE_ADD_TEST(suite, pearsonTestNormal2);
    SUITE_ADD_TEST(suite, pearsonTestNormal3);
    SUITE_ADD_TEST(suite, pearsonTestNormal4);
    SUITE_ADD_TEST(suite, calcSqrtofUserTestExceptional1);
    SUITE_ADD_TEST(suite, calcSqrtofUserTestExceptional2);
    SUITE_ADD_TEST(suite, calcSqrtofUserTestExtreme1);
    SUITE_ADD_TEST(suite, calcSqrtofUserTestExtreme2);
    SUITE_ADD_TEST(suite, calcSqrtofUserTestNormal1);
    SUITE_ADD_TEST(suite, calcSqrtofUserTestNormal2);
    SUITE_ADD_TEST(suite, calcSqrtofUserTestNormal3);
    SUITE_ADD_TEST(suite, calcSqrtofUserTestNormal4);
    SUITE_ADD_TEST(suite, calcMeanofUserTestExceptional1);
    SUITE_ADD_TEST(suite, calcMeanofUserTestExceptional2);
    SUITE_ADD_TEST(suite, calcMeanofUserTestExtreme1);
    SUITE_ADD_TEST(suite, calcMeanofUserTestExtreme2);
    SUITE_ADD_TEST(suite, calcMeanofUserTestNormal1);
    SUITE_ADD_TEST(suite, calcMeanofUserTestNormal2);
    SUITE_ADD_TEST(suite, calcMeanofUserTestNormal3);
    SUITE_ADD_TEST(suite, calcMeanofUserTestNormal4);
    return suite;
}
