#include <stdio.h>
#include <stdlib.h>

//basic user struct - needs more parameters later
typedef struct user {
    char name[25];
    int age;
    char gender;
} user;

//prototypes
int calc_users(FILE *userfile);
void load_users(FILE *userfile, int totalusers, user *users);
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

    //print userinfo
    printusers(totalusers, users);

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

void printusers(int totalusers, user *users){
    //test that struct array is filled
    printf("total users: %d\n", totalusers);
    for(int i = 0; i < (int) totalusers; i++){
        printf("user %2d: name: %s, age: %d, gender %c\n", i+1, users[i].name, users[i].age, users[i].gender);
    }
    return;
}

