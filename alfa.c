#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

//constants to steer calcs
#define TOTALCRITERIA 9
#define K 3 

//TODO: Lav sortering om så den er mere effektiv end qsort

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

// prototypes
void new_user(FILE *userfile);
int calc_users(FILE *userfile);
void load_users(FILE *userfile, int total_users, user *users);
void getmatch_js(char **argv, user* users, int total_users);
void getmatch_c(FILE *userfile, user* users, int total_users);
double pearson(user *users, int target, int compare);
double calc_mean_of_user(user user);
double calc_sqrt_of_user(user user, double mean);
int cmpfunc(const void *a, const void *b);
void print_matches(int total_users, user *users);
void print_matches_id(int total_users, user *users);


int main(int argc, char *argv[]) {

    // set user file path
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
        getmatch_c(userfile, users, total_users);
    }

    fclose(userfile);
    free(users);

    return 0;
}

int calc_users(FILE *userfile) {
    char ch;
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
        fscanf(userfile, " %lf", &users[i].drinking);
        fscanf(userfile, " %lf", &users[i].cars);
        fscanf(userfile, " %lf", &users[i].hiking);
        fscanf(userfile, " %lf", &users[i].magic);
        fscanf(userfile, " %lf", &users[i].djing);
        fgetc(userfile);
    }
    return;
}

void getmatch_js(char **argv, user* users, int total_users){
    //select target user
    int targetuser = atoi(argv[2]);
    
    //calc user similarity
    for (int i = 0; i < total_users; i++) {
        users[i].pearson = pearson(users, targetuser - 1, users[i].id -1);
    }
    
    //Sort the coefficient based on highest similarity
    qsort(users, total_users, sizeof(user), cmpfunc);
    
    //print matches back to javascript
    print_matches_id(total_users, users);
    return;        
}

void getmatch_c(FILE *userfile, user* users, int total_users){
    printf("One argument.\n");

        // new user input
        char answer;
        int sentinel = 1;
        while (sentinel) {
            printf("Wish to enter new user? (y/n)\n");
            scanf(" %c", &answer);
            
            if(answer == 'y'){
                new_user(userfile);                
                //Update total users, if new user is created
                total_users++;    
            } else{
                sentinel = 0;
            }
        }

        //select target user
        int user_id;
        printf("Enter your user id to get match:\n");
        scanf("%d", &user_id);
        printf("Calculating best matches for %s ...\n", users[user_id-1].name);

        //calc user similarity
        for (int i = 0; i < total_users; i++) {
            users[i].pearson = pearson(users, user_id-1, users[i].id -1);
        }
        
        //Sort the coefficient based on highest similarity
        qsort(users, total_users, sizeof(user), cmpfunc);
        
        //prints matches to terminal
        print_matches(total_users, users);
}

void new_user(FILE *userfile){
    char u_name[25];
    int u_age;
    char u_gender;
    int u_id, u_dog, u_triangle, u_football, u_red, u_drinking, 
        u_green, u_blue, u_magic, u_pizza;
    //skal måske ændres senere
    printf("Enter your id: \n");
    scanf("%d", &u_id);
    printf("Enter your name: \n");
    scanf("%s", u_name);
    printf("Enter age: \n");
    scanf("%d", &u_age);
    printf("Enter your gender: \n");
    scanf(" %c", &u_gender);
    printf("Enter chiaua rating: \n");
    scanf("%d", &u_dog);
    printf("Enter food rating: \n");
    scanf("%d", &u_triangle);
    printf("Enter music rating: \n");
    scanf("%d", &u_football);
    printf("Enter colour (movies) rating: \n");
    scanf("%d", &u_red);
    printf("Enter colour (drinking) rating: \n");
    scanf("%d", &u_drinking);
    printf("Enter colour (cars) rating: \n");
    scanf("%d", &u_green);
    printf("Enter colour (hiking) rating: \n");
    scanf("%d", &u_blue);
    printf("Enter magic rating: \n");
    scanf("%d", &u_magic);
    printf("Enter djing rating: \n");
    scanf("%d", &u_pizza);
    fprintf(userfile, "\n%d %s %d %c %d %d %d %d %d %d %d %d %d", u_id, u_name, u_age, u_gender, 
                                                               u_dog, u_triangle, u_football, 
                                                               u_red, u_drinking, u_green, u_blue, 
                                                               u_magic, u_pizza);

    fseek(userfile, 0, SEEK_SET);
    return;
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
                    ((target_user.drinking - t_mean) * (comp_user.drinking - c_mean)) +
                    ((target_user.cars - t_mean) * (comp_user.cars - c_mean)) +
                    ((target_user.hiking - t_mean) * (comp_user.hiking - c_mean)) +
                    ((target_user.magic - t_mean) * (comp_user.magic - c_mean)) +
                    ((target_user.djing - t_mean) * (comp_user.djing - c_mean));

    //calculating similarity coeficient
    double coeficient = sim / (t_sqrt * c_sqrt);
    
    return coeficient; 
}

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

int cmpfunc(const void *a, const void *b) {

    user *user1 = (user *) a;
    user *user2 = (user *) b;
    if(user1->pearson < user2->pearson){
        return -1;
    }
    else if(user1->pearson > user2->pearson){
        return 1;
    }
    else{
        return 0;
    }
}

void print_matches(int total_users, user *users){
    for (int i = total_users-2; i > (total_users-2)- K ; i--){
        printf("Userid: %d, Username: %s, Similarity: %lf\n", users[i].id, users[i].name, users[i].pearson);
    }
    return;
}

void print_matches_id(int total_users, user *users){
    for(int i = total_users-2; i > (total_users-2)- K ; i--){
        printf("%d ", users[i].id);
    }
}
