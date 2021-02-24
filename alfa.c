#include <stdio.h>
#include <stdlib.h>
#include <string.h>

//basic user struct - needs more parameters later
typedef struct user {
    char name[25];
    int age;
    char gender;
} user;

//prototypes
int calc_users(FILE *userfile);
void load_users(FILE *userfile, int totalusers, user *users);
double calc_avgage(user *users, int totalusers);
user *find_age_match(user *users,int totalusers, int targetuser, int *matches);
void printusers(int totalusers, user *users);


int main(void){
    //set user file path
    char *fp = "./test-files/users.txt";

    //open file
    FILE *userfile = fopen(fp, "r");
    if(userfile == NULL){
        printf("filepath error.");
        exit(EXIT_FAILURE);
    }
    
    //calculate number of users in database
    int totalusers = calc_users(userfile);

    //allocate memory for struct array with users
    user *users = (user *) malloc(totalusers * sizeof(user));
        if(users == NULL){
            printf("struct array error.");
            exit(EXIT_FAILURE);
        }

    //load userinfo into array
    load_users(userfile, totalusers, users);

    //random calculations on struct info
    //double avg_age = calc_avgage(users, totalusers);

    int matches = 0;
    user *agematches = find_age_match(users, totalusers, 8, &matches);
    
    //test to show agematches gets filled
    for(int i = 0; i < matches; i++){
        printf("Match in array: name %s age %d gender %c\n", agematches[i].name,  agematches[i].age, agematches[i].gender);
    }

    //print all userinfo
    //printusers(totalusers, users);

    free(agematches);
    free(users);
    return 0;
}

int calc_users(FILE *userfile){
    char ch;
    int totalusers = 1;
    while(!feof(userfile)) {
        ch = fgetc(userfile);
        if(ch == '\n') {
            totalusers++;    
        }
    }
    fseek(userfile, 0, SEEK_SET);
    return totalusers;
}

void load_users(FILE *userfile, int totalusers, user *users){

    //scan in users from filepath
    for(int i = 0; i < (int) totalusers; i++){
        fscanf(userfile, " %[^ ]", users[i].name);
        fscanf(userfile, " %d", &users[i].age);
        fgetc(userfile);
        fscanf(userfile, " %1[^ ]", &users[i].gender);
        fgetc(userfile);
    }

    return;
}

double calc_avgage(user *users, int totalusers){
    double avg_age = 0;
    for(int i = 0; i < totalusers; i++){
        avg_age = avg_age + users[i].age;
    }
    avg_age = avg_age / totalusers;

    return avg_age;
}

user *find_age_match(user *users, int totalusers, int targetuser, int *matches) {
    int t_user_age = users[targetuser].age;
    int arr_index = 0;
    user *agematches = (user *) malloc(5 * sizeof(user));
    if(agematches == NULL){
        printf("age array error.");
        exit(EXIT_FAILURE);
    }

    printf("targetuser age: %d\n", t_user_age);
    for(int i = 0; i < totalusers; i++){
        if(users[i].age >= t_user_age/2 + 7 && users[i].age <= t_user_age + 7){
            strcpy(agematches[arr_index].name, users[i].name);
            agematches[arr_index].age = users[i].age;
            agematches[arr_index].gender = users[i].gender;
            arr_index++;
        }
    }
    *matches = arr_index;
    
    return agematches;
}

void printusers(int totalusers, user *users){
    //test that struct array is filled
    printf("total users: %d\n", totalusers);
    for(int i = 0; i < (int) totalusers; i++){
        printf("user %2d: name: %s, age: %d, gender %c\n", i+1, users[i].name, users[i].age, users[i].gender);
    }
    return;
}

