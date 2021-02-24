#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

//constant to steer calcs
#define TOTALCRITERIA 3;
#define K 4

// basic user struct - needs more parameters later
typedef struct user {
    int id;
    char name[25];
    int age;
    char gender;
    double dog;
    double triangle;
    double football;
    double pearsson;
} user;

// prototypes
void new_user(FILE *userfile);
int calc_users(FILE *userfile);
void load_users(FILE *userfile, int totalusers, user *users);
double calc_avgage(user *users, int totalusers);
double pearsson(user *users, int target, int compare);
int cmpfunc(const void *a, const void *b);
user *find_age_match(user *users, int totalusers, int targetuser, int *matches);
void printusers(int totalusers, user *users);

int main(void) {
    // set user file path
    char *fp = "./test-files/users.txt";

    // open file
    FILE *userfile = fopen(fp, "a+");
    if (userfile == NULL) {
    printf("filepath error.");
    exit(EXIT_FAILURE);
    }

    //new user input
    char answer;
    int sentinel = 1;
    while (sentinel) {
        printf("Wish to enter new user? (y/n)\n");
        scanf(" %c", &answer);
        if(answer == 'y'){
            new_user(userfile);
        } else{
            sentinel = 0;
        }
    }

    // calculate number of users in database
    int totalusers = calc_users(userfile);

    // allocate memory for struct array with users
    user *users = (user *)malloc(totalusers * sizeof(user));
    if (users == NULL) {
    printf("struct array error.");
    exit(EXIT_FAILURE);
    }

    // load userinfo into array
    load_users(userfile, totalusers, users);

    //select target user
    int user_id;
    printf("Enter your user id to get match:\n");
    scanf("%d", &user_id);
    printf("Calculating best matches for %s ...\n", users[user_id - 1].name);

    //calc user similarity
    for (int i = 0; i < totalusers; i++) {
        users[i].pearsson = pearsson(users, user_id - 1, users[i].id);
    }

    qsort(users, totalusers, sizeof(user), cmpfunc);

    for (int i = totalusers - K; i < totalusers - 1; i++){
        printf("Username: %-10s \t Similarity: %lf\n", users[i].name,users[i].pearsson);
    }

    // random calculations on struct info
    // double avg_age = calc_avgage(users, totalusers);

    // int matches = 0;
    // user *agematches = find_age_match(users, totalusers, 8, &matches);

    // test to show agematches gets filled
    // for(int i = 0; i < matches; i++){
    //     printf("Match in array: name %s age %d gender %c\n",
    //     agematches[i].name,  agematches[i].age, agematches[i].gender);
    // }

    // print all userinfo
    //printusers(totalusers, users);

    // free(agematches);
    fclose(userfile);
    free(users);
    return 0;
}

void new_user(FILE *userfile){
    char u_name[25];
    int u_age;
    char u_gender;
    int u_dog;
    int u_triangle;
    int u_football;

    printf("Enter your name: \n");
    scanf("%s", u_name);
    printf("Enter age: \n");
    scanf("%d", &u_age);
    printf("Enter your gender: \n");
    scanf(" %c", &u_gender);
    printf("Enter chiaua rating: \n");
    scanf("%d", &u_dog);
    printf("Enter triangle rating: \n");
    scanf("%d", &u_triangle);
    printf("Enter football rating: \n");
    scanf("%d", &u_football);
    
    fprintf(userfile, "\n%s %d %c %d %d %d", u_name, u_age, u_gender, u_dog, u_triangle, u_football);

    fseek(userfile, 0, SEEK_SET);
    return;
}

int calc_users(FILE *userfile) {
    char ch;
    int totalusers = 1;
    while (!feof(userfile)) {
        ch = fgetc(userfile);
        if (ch == '\n') {
            totalusers++;
        }
    }
    fseek(userfile, 0, SEEK_SET);
    return totalusers;
}

void load_users(FILE *userfile, int totalusers, user *users) {
// scan in users from filepath
for (int i = 0; i < (int)totalusers; i++) {
    users[i].id = i;
    fscanf(userfile, " %[^ ]", users[i].name);
    fscanf(userfile, " %d", &users[i].age);
    fgetc(userfile);
    fscanf(userfile, " %1[^ ]", &users[i].gender);
    fscanf(userfile, " %lf", &users[i].dog);
    fscanf(userfile, " %lf", &users[i].triangle);
    fscanf(userfile, " %lf", &users[i].football);
    fgetc(userfile);
}

return;
}

double calc_avgage(user *users, int totalusers) {
    double avg_age = 0;
    for (int i = 0; i < totalusers; i++) {
        avg_age = avg_age + users[i].age;
    }
        avg_age = avg_age / totalusers;

    return avg_age;
}

double pearsson(user *users, int target, int compare){
    user targetuser = users[target];
    user comp_user = users[compare];
    
    //finding user means
    double t_mean = (targetuser.dog + targetuser.triangle + targetuser.football) / TOTALCRITERIA;
    double c_mean = (comp_user.dog + comp_user.triangle + comp_user.football) / TOTALCRITERIA;

    //calc sqrt for each user
    double t_sqrt = (sqrt (pow((targetuser.dog - t_mean),2)  + 
                    (pow((targetuser.triangle - t_mean), 2 ) + 
                    (pow((targetuser.football - t_mean), 2)))));

    double c_sqrt = (sqrt(pow((comp_user.dog - c_mean), 2) + 
                    (pow((comp_user.triangle - c_mean), 2) + 
                    (pow((comp_user.football - c_mean), 2)))));
    
    //calc similarity
    double sim =    ((targetuser.dog - t_mean) * (comp_user.dog - c_mean)) + 
                    ((targetuser.triangle - t_mean) * (comp_user.triangle - c_mean)) + 
                    ((targetuser.football - t_mean) * (comp_user.football - c_mean));

    //special case when users have rated same rating on all items to handle dividing by zero
    if(t_mean == targetuser.dog && t_mean == targetuser.triangle && t_mean == targetuser.football){
        t_mean += 0.1;
    }
    if(c_mean == comp_user.dog && c_mean == comp_user.triangle && c_mean == comp_user.football){
        c_mean += 0.1;
    }

    //calculating similarity coeficient
    long double coeficient = sim / (t_sqrt * c_sqrt);

    return coeficient; 
}


user *find_age_match(user *users, int totalusers, int targetuser, int *matches) {
    int t_user_age = users[targetuser].age;
    int arr_index = 0;
    user *agematches = (user *)malloc(5 * sizeof(user));
    if (agematches == NULL) {
        printf("age array error.");
        exit(EXIT_FAILURE);
    }

    printf("targetuser age: %d\n", t_user_age);
    for (int i = 0; i < totalusers; i++) {
    if (users[i].age >= t_user_age / 2 + 7 && users[i].age <= t_user_age + 7) {
        strcpy(agematches[arr_index].name, users[i].name);
        agematches[arr_index].age = users[i].age;
        agematches[arr_index].gender = users[i].gender;
        arr_index++;
    }
}
    *matches = arr_index;

return agematches;
}

int cmpfunc(const void *a, const void *b) {

    user *user1 = (user *) a;
    user *user2 = (user *) b;
    if(user1->pearsson < user2->pearsson){
        return -1;
    }
    else if(user1->pearsson > user2->pearsson){
        return 1;
    }
    else{
        return 0;
    }
}

void printusers(int totalusers, user *users) {
    // test that struct array is filled
    printf("total users: %d\n", totalusers);
    for (int i = 0; i < (int)totalusers; i++) {
        printf("user %2d: name: %s, age: %d, gender %c chiaua: %lf triangle: %lf football: %lf\n",
        i + 1, users[i].name, users[i].age, users[i].gender, users[i].dog, users[i].triangle, users[i].football);
    }
    return;
}


