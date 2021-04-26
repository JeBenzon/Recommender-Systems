#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <time.h>

//constants to steer calcs
#define TOTALCRITERIA 9
#define K 3 

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


int main(int argc, char *argv[]) {

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
    if(argc > 2) {
        if(strcmp(argv[1], "getmatch") == 0){
            getmatch_js(argv, users, total_users);
        }
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
    int knn = atoi(argv[3]);
    //calc user similarity
    for (int i = 0; i < total_users; i++) {
        users[i].pearson = pearson(users, targetuser - 1, users[i].id -1);
    }
    //Run of all users, finding the best matches for the targetuser
    user *best_matches = find_best_matches_js(users, total_users, targetuser, knn);
    //print matches back to javascript
    print_matches_id(best_matches, knn);       
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
    user *best_matches = malloc(K * sizeof(user));
    if(best_matches == NULL){
        exit(EXIT_FAILURE);
    }

    for(int i = 0; i < K; i++){
        best_matches[i].pearson = -10;
    }
    
    for(int i = 0; i < total_users; i++){
        if(users[i].id != user_id){
            user x = users[i];
            for(int j = 0; j < K; j++){
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
    for(int i = 0; i < K; i++){
            printf("Userid: %d, Username: %s, Similarity: %lf\n",best_matches[i].id, best_matches[i].name, best_matches[i].pearson);
        }
}

void print_matches_id(user *best_matches, int knn){
    for(int i = 0; i < knn; i++){
            printf("%d ", best_matches[i].id);
        }
}