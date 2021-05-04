#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <time.h>

#include <ctype.h>
#include "CuTest.h"

//constants to steer calcs
#define TOTALCRITERIA 9
#define KNN 3 

//user struct
typedef struct user {
    int id;
    char name[50];
    int age;
    char gender;
    double sports;       
    double food;
    double music;
    double movies;
    double art; 
    double outdoors;
    double science;
    double travel; 
    double climate;
    double pearson; 
} user;

// prototypes
int calc_users(FILE *userfile);
void load_users(FILE *userfile, int total_users, user *users);
void getmatch_js(char **argv, user* users, int total_users);
void getmatch_c(user* users, int total_users);
double pearson(user *users, int target, int compare);
double calc_mean_of_user(user user);
double calc_sqrt_of_user(user user, double mean);
user *find_best_matches(user *users, int total_users, int user_id);
user *find_best_matches_js(user *users, int total_users, int user_id, int knn);
void print_matches(user *best_matches);
void print_matches_id(user *best_matches, int knn);


int program(char *argv[]) {

    // set users file path
    char *fp = "./users.txt";

    // open file
    FILE *userfile = fopen(fp, "a+");
    if (userfile == NULL) {
        printf("filepath error.");
        exit(EXIT_FAILURE);
    }

    // calculate number of users in database
    int total_users = calc_users(userfile);
    
    // allocate memory for struct array with users
    user *users = (user *)malloc(total_users * sizeof(user));
    if (users == NULL) {
        printf("struct array error.");
        exit(EXIT_FAILURE);
    }
    
    // load userinfo into array
    load_users(userfile, total_users, users);
    
        if(strcmp(argv[1], "getmatch") == 0){
            getmatch_js(argv, users, total_users);
        }
    else {
        getmatch_c(users, total_users);
    }

    fclose(userfile);
    free(users);

    return 0;
}

int calc_users(FILE *userfile) {
    char ch;
    fseek(userfile, 0, SEEK_SET);
    int total_users = 1;
    while (!feof(userfile)) {
        ch = fgetc(userfile);
        if (ch == '\n') {
            total_users++;
        }
    }
    fseek(userfile, 0, SEEK_SET);
    return total_users;
}

void load_users(FILE *userfile, int total_users, user *users) {
    // scan in users from filepath
    for (int i = 0; i < (int)total_users; i++) {

        fscanf(userfile, " %d", &users[i].id);
        fscanf(userfile, " %[^ ]", users[i].name);
        fscanf(userfile, " %d", &users[i].age);
        fgetc(userfile);
        fscanf(userfile, " %1[^ ]", &users[i].gender);
        fscanf(userfile, " %lf", &users[i].sports);
        fscanf(userfile, " %lf", &users[i].food);
        fscanf(userfile, " %lf", &users[i].music);
        fscanf(userfile, " %lf", &users[i].movies);
        fscanf(userfile, " %lf", &users[i].art);
        fscanf(userfile, " %lf", &users[i].outdoors);
        fscanf(userfile, " %lf", &users[i].science);
        fscanf(userfile, " %lf", &users[i].travel);
        fscanf(userfile, " %lf", &users[i].climate);
        fgetc(userfile);
    }
}

void getmatch_js(char **argv, user* users, int total_users){
    //select target user
    int targetuser = atoi(argv[2]);

    //set how many matches to get (knn)
    int knn = atoi(argv[3]);
    
    //calc user similarity
    for (int i = 0; i < total_users; i++) {
        users[i].pearson = pearson(users, targetuser - 1, users[i].id -1);
    }
    //Run of all users, finding the best matches for the targetuser
    user *best_matches = find_best_matches_js(users, total_users, targetuser, knn);
    //print matches back to javascript
    print_matches_id(best_matches, knn);

    free(best_matches);       
}

void getmatch_c(user* users, int total_users){
    //select target user
    int user_id;
    printf("Enter your user id to get matches:\n");
    scanf("%d", &user_id);
    printf("Calculating best matches for %s ...\n", users[user_id-1].name);

    //calc user similarity
    for (int i = 0; i < total_users; i++) {
        users[i].pearson = pearson(users, user_id-1, users[i].id -1);
    }

    //Sort the coefficient based on highest similarity
    user *best_matches = find_best_matches(users, total_users, user_id);
    
    //prints matches to terminal
    print_matches(best_matches);

    free(best_matches);
}


double pearson(user *users, int target, int compare){
    user target_user = users[target];
    user comp_user = users[compare];

    //finding user means
    double t_mean = calc_mean_of_user(target_user);
    double c_mean = calc_mean_of_user(comp_user);
    
    //calc sqrt for each user
    double t_sqrt = calc_sqrt_of_user(target_user, t_mean);
    double c_sqrt = calc_sqrt_of_user(comp_user, c_mean);

    //calc similarity
    double sim =    ((target_user.sports - t_mean) * (comp_user.sports - c_mean)) + 
                    ((target_user.food - t_mean) * (comp_user.food - c_mean)) + 
                    ((target_user.music - t_mean) * (comp_user.music - c_mean)) +
                    ((target_user.movies - t_mean ) * (comp_user.movies - c_mean)) +
                    ((target_user.art - t_mean) * (comp_user.art - c_mean)) +
                    ((target_user.outdoors - t_mean) * (comp_user.outdoors - c_mean)) +
                    ((target_user.science - t_mean) * (comp_user.science - c_mean)) +
                    ((target_user.travel - t_mean) * (comp_user.travel - c_mean)) +
                    ((target_user.climate - t_mean) * (comp_user.climate - c_mean));

    //calculating similarity coeficient
    double coeficient = sim / (t_sqrt * c_sqrt);
    
    return coeficient; 
}

double calc_mean_of_user(user user){
    double mean = (user.sports + user.food + user.music + 
                   user.movies + user.art + user.outdoors + 
                   user.science + user.travel + user.climate) / TOTALCRITERIA;

    //special case when users have rated same rating on all items to handle dividing by zero
    if(mean == user.sports && mean == user.food && mean == user.music && 
       mean == user.movies && mean == user.art && mean == user.outdoors && 
       mean == user.science && mean == user.travel && mean == user.climate){
       mean += 0.001;
    }
    return mean;
}

double calc_sqrt_of_user(user user, double mean){
    double user_sqrt = sqrt (pow((user.sports - mean),2) + 
                       pow((user.food - mean), 2) + 
                       pow((user.music - mean), 2) +
                       pow((user.movies - mean),2) +
                       pow((user.art - mean),2) +
                       pow((user.outdoors - mean),2) +
                       pow((user.science - mean),2) +
                       pow((user.travel - mean),2) +
                       pow((user.climate - mean),2));
    return user_sqrt;
}

user *find_best_matches(user *users, int total_users, int user_id){
    user *best_matches = malloc(KNN * sizeof(user));
    if(best_matches == NULL){
        exit(EXIT_FAILURE);
    }

    for(int i = 0; i < KNN; i++){
        best_matches[i].pearson = -10;
    }
    
    for(int i = 0; i < total_users; i++){
        if(users[i].id != user_id){
            user x = users[i];
            for(int j = 0; j < KNN; j++){
                if(x.pearson > best_matches[j].pearson){
                    user temp = best_matches[j];
                    best_matches[j] = x;
                    x = temp;
                }
            } 
        }
    }
    return best_matches;
}

user *find_best_matches_js(user *users, int total_users, int user_id, int knn){
    user *best_matches = malloc(knn * sizeof(user));
    if(best_matches == NULL){
        exit(EXIT_FAILURE);
    }

    for(int i = 0; i < knn; i++){
        best_matches[i].pearson = -10;
    }
    
    for(int i = 0; i < total_users; i++){
        if(users[i].id != user_id){
            user x = users[i];
            for(int j = 0; j < knn; j++){
                if(x.pearson > best_matches[j].pearson){
                    user temp = best_matches[j];
                    best_matches[j] = x;
                    x = temp;
                }
            } 
        }
    }
    return best_matches;
}

void print_matches(user *best_matches){
    for(int i = 0; i < KNN; i++){
            printf("Userid: %d, Username: %s, Similarity: %lf\n",best_matches[i].id, best_matches[i].name, best_matches[i].pearson);
        }
}

void print_matches_id(user *best_matches, int knn){
    for(int i = 0; i < knn; i++){
            printf("%d ", best_matches[i].id);
        }
}

//--------TESTS----------

void pearsonTestExceptional1(CuTest *tc) {
    // set input
    user input[2];
    // User 0
    input[0].sports = -2;
    input[0].food = -2;
    input[0].music = -2;
    input[0].movies = -2;
    input[0].art = -2;
    input[0].outdoors = -2;
    input[0].science = -2;
    input[0].travel = -2;
    input[0].climate = 16;
    // User 1
    input[1].sports = 9;
    input[1].food = -1;
    input[1].music = -1;
    input[1].movies = -1;
    input[1].art = -1;
    input[1].outdoors = -1;
    input[1].science = -1;
    input[1].travel = -1;
    input[1].climate = -1;
    // actual
    double actual = pearson(input, 0, 1);
    // expected values:
    // t_mean value:   0
    // c_mean value:   0.111 -> 1/9
    // t sqrt:       16.97056 -> 12*sqrt(2)
    // c sqrt:       9.42809 -> (20*sqrt(2))/3
    // sim:          -20
    double expected = -0.125;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void pearsonTestExceptional2(CuTest *tc) {
    // set input
    user input[2];
    // User 0
    input[0].sports = 1;
    input[0].food = 2;
    input[0].music = 4;
    input[0].movies = 8;
    input[0].art = 16;
    input[0].outdoors = 32;
    input[0].science = 64;
    input[0].travel = 128;
    input[0].climate = 0;
    // User 1
    input[1].sports = 0;
    input[1].food = -128;
    input[1].music = -64;
    input[1].movies = -32;
    input[1].art = -16;
    input[1].outdoors = -8;
    input[1].science = -4;
    input[1].travel = -2;
    input[1].climate = -1;
    // actual
    double actual = pearson(input, 0, 1);
    // expected values:
    // t_mean value:   28.33333 -> 85/3
    // c_mean value:   -28.33333 -> -85/3
    // t sqrt:       120.91319 -> 2*sqrt(3655)
    // c sqrt:       120.91319 -> 2*sqrt(3655)
    // sim:          5433
    double expected = 0.37161;  //-> 5433/14620
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void pearsonTestExtreme1(CuTest *tc) {
    // set input
    user input[2];
    // User 0
    input[0].sports = 5;
    input[0].food = 5;
    input[0].music = 5;
    input[0].movies = 5;
    input[0].art = 5;
    input[0].outdoors = 5;
    input[0].science = 5;
    input[0].travel = 5;
    input[0].climate = 5;
    // User 1
    input[1].sports = 5;
    input[1].food = 5;
    input[1].music = 5;
    input[1].movies = 5;
    input[1].art = 5;
    input[1].outdoors = 5;
    input[1].science = 5;
    input[1].travel = 5;
    input[1].climate = 5;
    // actual
    double actual = pearson(input, 0, 1);
    // expected values:
    // t_mean value:   5.001
    // c_mean value:   5.001
    // t sqrt:       0.003
    // c sqrt:       0.003
    // sim:          0.000009
    double expected = 1;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void pearsonTestExtreme2(CuTest *tc) {
    // set input
    user input[2];
    // User 0
    input[0].sports = 1;
    input[0].food = 1;
    input[0].music = 1;
    input[0].movies = 1;
    input[0].art = 1;
    input[0].outdoors = 1;
    input[0].science = 1;
    input[0].travel = 1;
    input[0].climate = 1;
    // User 1
    input[1].sports = 10;
    input[1].food = 10;
    input[1].music = 10;
    input[1].movies = 10;
    input[1].art = 10;
    input[1].outdoors = 10;
    input[1].science = 10;
    input[1].travel = 10;
    input[1].climate = 10;
    // actual
    double actual = pearson(input, 0, 1);
    // expected values:
    // t_mean value:   1.001
    // c_mean value:   10.001
    // t sqrt:       0.003
    // c sqrt:       0.003
    // sim:          0.000009
    double expected = 1;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void pearsonTestNormal1(CuTest *tc) {
    // set input
    user input[2];
    // User 0
    input[0].sports = 2;
    input[0].food = 2;
    input[0].music = 3;
    input[0].movies = 1;
    input[0].art = 2;
    input[0].outdoors = 3;
    input[0].science = 1;
    input[0].travel = 2;
    input[0].climate = 2;
    // User 1
    input[1].sports = 3;
    input[1].food = 3;
    input[1].music = 1;
    input[1].movies = 2;
    input[1].art = 1;
    input[1].outdoors = 2;
    input[1].science = 2;
    input[1].travel = 3;
    input[1].climate = 1;
    // actual
    double actual = pearson(input, 0, 1);
    // expected values:
    // t_mean value:   2
    // c_mean value:   2
    // t sqrt:       2
    // c sqrt:       2.44948 -> sqrt(6)
    // sim:          -1
    double expected = -0.20412;  //-> -(sqrt(6)/12)
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void pearsonTestNormal2(CuTest *tc) {
    // set input
    user input[2];
    // User 0
    input[0].sports = 9;
    input[0].food = 9;
    input[0].music = 10;
    input[0].movies = 8;
    input[0].art = 9;
    input[0].outdoors = 10;
    input[0].science = 8;
    input[0].travel = 9;
    input[0].climate = 9;
    // User 1
    input[1].sports = 10;
    input[1].food = 10;
    input[1].music = 8;
    input[1].movies = 9;
    input[1].art = 8;
    input[1].outdoors = 9;
    input[1].science = 9;
    input[1].travel = 10;
    input[1].climate = 8;
    // actual
    double actual = pearson(input, 0, 1);
    // expected values:
    // t_mean value:   9
    // c_mean value:   9
    // t sqrt:       2
    // c sqrt:       2.44948 -> sqrt(6)
    // sim:          -1
    double expected = -0.20412;  //-> -(sqrt(6)/12)
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void pearsonTestNormal3(CuTest *tc) {
    // set input
    user input[2];
    // User 0
    input[0].sports = 2;
    input[0].food = 3;
    input[0].music = 3;
    input[0].movies = 3;
    input[0].art = 4;
    input[0].outdoors = 3;
    input[0].science = 3;
    input[0].travel = 2;
    input[0].climate = 4;
    // User 1
    input[1].sports = 9;
    input[1].food = 4;
    input[1].music = 3;
    input[1].movies = 6;
    input[1].art = 8;
    input[1].outdoors = 3;
    input[1].science = 7;
    input[1].travel = 1;
    input[1].climate = 4;
    // actual
    double actual = pearson(input, 0, 1);
    // expected values:
    // t_mean value:   3
    // c_mean value:   5
    // t sqrt:       2
    // c sqrt:       7.4833147 -> 2*sqrt(14)
    // sim:          2
    double expected = 0.13363;  //-> 3/sqrt(505)
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void pearsonTestNormal4(CuTest *tc) {
    // set input
    user input[2];
    // User 0
    input[0].sports = 1;
    input[0].food = 2;
    input[0].music = 3;
    input[0].movies = 4;
    input[0].art = 5;
    input[0].outdoors = 6;
    input[0].science = 7;
    input[0].travel = 8;
    input[0].climate = 9;
    // User 1
    input[1].sports = 10;
    input[1].food = 9;
    input[1].music = 8;
    input[1].movies = 7;
    input[1].art = 6;
    input[1].outdoors = 5;
    input[1].science = 4;
    input[1].travel = 3;
    input[1].climate = 2;
    // actual
    double actual = pearson(input, 0, 1);
    // expected values:
    // t_mean value:   5
    // c_mean value:   6
    // t sqrt:       7.74596 -> 2*sqrt(15)
    // c sqrt:       7.74596 -> 2*sqrt(15)
    // sim:          -60
    double expected = -1;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calcSqrtofUserTestExceptional1(CuTest *tc) {
    // set input
    user input;
    input.sports = -2;
    input.food = -2;
    input.music = -2;
    input.movies = -2;
    input.art = -2;
    input.outdoors = -2;
    input.science = -2;
    input.travel = -2;
    input.climate = 16;
    // actual
    double actual = calc_sqrt_of_user(input, 0);
    // expected
    // mean value:   0
    double expected = 16.97056;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calcSqrtofUserTestExceptional2(CuTest *tc) {
    // set input
    user input;
    input.sports = 1;
    input.food = 2;
    input.music = 4;
    input.movies = 8;
    input.art = 16;
    input.outdoors = 32;
    input.science = 64;
    input.travel = 128;
    input.climate = 0;
    // actual
    double actual = calc_sqrt_of_user(input, 28.33333);
    // expected
    // mean value:   28.33333 -> 85/3
    double expected = 120.91319;  //-> 2*sqrt(3655)
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calcSqrtofUserTestExtreme1(CuTest *tc) {
    // set input
    user input;
    input.sports = 5;
    input.food = 5;
    input.music = 5;
    input.movies = 5;
    input.art = 5;
    input.outdoors = 5;
    input.science = 5;
    input.travel = 5;
    input.climate = 5;
    // actual
    double actual = calc_sqrt_of_user(input, 5.001);
    // expected
    // mean value:   5.001
    double expected = 0.003;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calcSqrtofUserTestExtreme2(CuTest *tc) {
    // set input
    user input;
    input.sports = 1;
    input.food = 1;
    input.music = 1;
    input.movies = 1;
    input.art = 1;
    input.outdoors = 1;
    input.science = 1;
    input.travel = 1;
    input.climate = 1;
    // actual
    double actual = calc_sqrt_of_user(input, 1.001);
    // expected
    // mean value:   1.001
    double expected = 0.003;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calcSqrtofUserTestNormal1(CuTest *tc) {
    // set input
    user input;
    input.sports = 2;
    input.food = 2;
    input.music = 3;
    input.movies = 1;
    input.art = 2;
    input.outdoors = 3;
    input.science = 1;
    input.travel = 2;
    input.climate = 2;
    // actual
    double actual = calc_sqrt_of_user(input, 2);
    // expected
    // mean value:   2
    double expected = 2;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calcSqrtofUserTestNormal2(CuTest *tc) {
    // set input
    user input;
    input.sports = 9;
    input.food = 9;
    input.music = 10;
    input.movies = 8;
    input.art = 9;
    input.outdoors = 10;
    input.science = 8;
    input.travel = 9;
    input.climate = 9;
    // actual
    double actual = calc_sqrt_of_user(input, 9);
    // expected
    // mean value:   9
    double expected = 2;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calcSqrtofUserTestNormal3(CuTest *tc) {
    // set input
    user input;
    input.sports = 2;
    input.food = 3;
    input.music = 3;
    input.movies = 3;
    input.art = 4;
    input.outdoors = 3;
    input.science = 3;
    input.travel = 2;
    input.climate = 4;
    // actual
    double actual = calc_sqrt_of_user(input, 3);
    // expected
    // mean value:   3
    double expected = 2;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calcSqrtofUserTestNormal4(CuTest *tc) {
    // set input
    user input;
    input.sports = 1;
    input.food = 2;
    input.music = 3;
    input.movies = 4;
    input.art = 5;
    input.outdoors = 6;
    input.science = 7;
    input.travel = 8;
    input.climate = 9;
    // actual
    double actual = calc_sqrt_of_user(input, 5);
    // expected
    // mean value:   5
    double expected = 7.74596;  //-> 2*sqrt(15)
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calcMeanofUserTestExceptional1(CuTest *tc) {
    // set input
    user input;
    input.sports = -2;
    input.food = -2;
    input.music = -2;
    input.movies = -2;
    input.art = -2;
    input.outdoors = -2;
    input.science = -2;
    input.travel = -2;
    input.climate = 16;
    // actual
    double actual = calc_mean_of_user(input);
    // expected
    double expected = 0;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calcMeanofUserTestExceptional2(CuTest *tc) {
    // set input
    user input;
    input.sports = 1;
    input.food = 2;
    input.music = 4;
    input.movies = 8;
    input.art = 16;
    input.outdoors = 32;
    input.science = 64;
    input.travel = 128;
    input.climate = 0;
    // actual
    double actual = calc_mean_of_user(input);
    // expected
    double expected = 28.33333;  //-> 85/3
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calcMeanofUserTestExtreme1(CuTest *tc) {
    // set input
    user input;
    input.sports = 5;
    input.food = 5;
    input.music = 5;
    input.movies = 5;
    input.art = 5;
    input.outdoors = 5;
    input.science = 5;
    input.travel = 5;
    input.climate = 5;
    // actual
    double actual = calc_mean_of_user(input);
    // expected
    double expected = 5.001;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calcMeanofUserTestExtreme2(CuTest *tc) {
    // set input
    user input;
    input.sports = 1;
    input.food = 1;
    input.music = 1;
    input.movies = 1;
    input.art = 1;
    input.outdoors = 1;
    input.science = 1;
    input.travel = 1;
    input.climate = 1;
    // actual
    double actual = calc_mean_of_user(input);
    // expected
    double expected = 1.001;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calcMeanofUserTestNormal1(CuTest *tc) {
    // set input
    user input;
    input.sports = 2;
    input.food = 2;
    input.music = 3;
    input.movies = 1;
    input.art = 2;
    input.outdoors = 3;
    input.science = 1;
    input.travel = 2;
    input.climate = 2;
    // actual
    double actual = calc_mean_of_user(input);
    // expected
    double expected = 2;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calcMeanofUserTestNormal2(CuTest *tc) {
    // set input
    user input;
    input.sports = 9;
    input.food = 9;
    input.music = 10;
    input.movies = 8;
    input.art = 9;
    input.outdoors = 10;
    input.science = 8;
    input.travel = 9;
    input.climate = 9;
    // actual
    double actual = calc_mean_of_user(input);
    // expected
    double expected = 9;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calcMeanofUserTestNormal3(CuTest *tc) {
    // set input
    user input;
    input.sports = 2;
    input.food = 3;
    input.music = 3;
    input.movies = 3;
    input.art = 4;
    input.outdoors = 3;
    input.science = 3;
    input.travel = 2;
    input.climate = 4;
    // actual
    double actual = calc_mean_of_user(input);
    // expected
    double expected = 3;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calcMeanofUserTestNormal4(CuTest *tc) {
    // set input
    user input;
    input.sports = 1;
    input.food = 2;
    input.music = 3;
    input.movies = 4;
    input.art = 5;
    input.outdoors = 6;
    input.science = 7;
    input.travel = 8;
    input.climate = 9;
    // actual
    double actual = calc_mean_of_user(input);
    // expected
    double expected = 5;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calc_usersTestFail(CuTest *tc) {
    // set users file path
    char *fp = "./users_fail.txt";

    // open file
    FILE *userfile = fopen(fp, "a+");
    if (userfile == NULL) {
        printf("filepath error.");
        exit(EXIT_FAILURE);
    }

    double actual = calc_users(userfile);
    double expected = 100;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calc_usersTest0(CuTest *tc) {
    // set users file path
    char *fp = "./users_0.txt";

    // open file
    FILE *userfile = fopen(fp, "a+");
    if (userfile == NULL) {
        printf("filepath error.");
        exit(EXIT_FAILURE);
    }

    double actual = calc_users(userfile);
    double expected = 0;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calc_usersTest1000(CuTest *tc) {
    // set users file path
    char *fp = "./users_1000.txt";

    // open file
    FILE *userfile = fopen(fp, "a+");
    if (userfile == NULL) {
        printf("filepath error.");
        exit(EXIT_FAILURE);
    }

    double actual = calc_users(userfile);
    double expected = 1000;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calc_usersTest5000(CuTest *tc) {
    // set users file path
    char *fp = "./users_5000.txt";

    // open file
    FILE *userfile = fopen(fp, "a+");
    if (userfile == NULL) {
        printf("filepath error.");
        exit(EXIT_FAILURE);
    }

    double actual = calc_users(userfile);
    double expected = 5000;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calc_usersTest10000(CuTest *tc) {
    // set users file path
    char *fp = "./users_10000.txt";

    // open file
    FILE *userfile = fopen(fp, "a+");
    if (userfile == NULL) {
        printf("filepath error.");
        exit(EXIT_FAILURE);
    }

    double actual = calc_users(userfile);
    double expected = 10000;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

void calc_usersTest25000(CuTest *tc) {
    // set users file path
    char *fp = "./users_25000.txt";

    // open file
    FILE *userfile = fopen(fp, "a+");
    if (userfile == NULL) {
        printf("filepath error.");
        exit(EXIT_FAILURE);
    }

    double actual = calc_users(userfile);
    double expected = 25000;
    CuAssertDblEquals(tc, expected, actual, 0.00001);
}

CuSuite *StrUtilGetSuite() {
    CuSuite *suite = CuSuiteNew();
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
    SUITE_ADD_TEST(suite, calc_usersTestFail);
    SUITE_ADD_TEST(suite, calc_usersTest0);
    SUITE_ADD_TEST(suite, calc_usersTest1000);
    SUITE_ADD_TEST(suite, calc_usersTest5000);
    SUITE_ADD_TEST(suite, calc_usersTest10000);
    SUITE_ADD_TEST(suite, calc_usersTest25000);
    return suite;
}
