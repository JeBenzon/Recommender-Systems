#include <stdio.h>
#include <stdlib.h>


//basic user struct - needs more parameters later
typedef struct user {
    char name[25];
    int age;
    char gender;
} user;



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
    char ch;
    int totalusers = 0;
    while(!feof(userfile)) {
        ch = fgetc(userfile);
        if(ch == '\n') {
            totalusers++;    
        }
    }
    totalusers++;
    fseek(userfile, 0, SEEK_SET);

    //allocate memory for struct array with users
    user *users = (user *) malloc(totalusers * sizeof(user));
        if(users == NULL){
            printf("struct array error.");
            exit(EXIT_FAILURE);
        }

    //scan in users from filepath
    for(int i = 0; i < (int) totalusers; i++){
        fscanf(userfile, " %[^ ]", users[i].name);
        fscanf(userfile, " %d", &users[i].age);
        fgetc(userfile);
        fscanf(userfile, " %1[^ ]", &users[i].gender);
        fgetc(userfile);
    }

    //test that struct array is filled
    printf("total users: %d\n", totalusers);
    for(int i = 0; i < (int) totalusers; i++){
        printf("user %2d: name: %s, age: %d, gender %c\n", i+1, users[i].name, users[i].age, users[i].gender);
    }

    return 0;
}