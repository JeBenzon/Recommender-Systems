#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>



//constants to steer calcs
#define TOTALCRITERIA 9
#define K 4

//TODO: make more functions 

// basic user struct
typedef struct user {
    int id;
    char name[25];
    int age;
    char gender;
    double dog;
    double triangle;
    double football;
    double red;
    double yellow;
    double green;
    double blue;
    double spaghetti;
    double pizza;
    double pearsson; 
} user;

// prototypes
void internal_new_user(FILE *userfile);
void external_new_user(FILE *userfile, char *name, int age, char gender, int dog, int triangle, int football,int red, int yellow, int green, int blue, int spaghetti, int pizza, int total_users);
int calc_users(FILE *userfile);
void load_users(FILE *userfile, int total_users, user *users);
double pearsson(user *users, int target, int compare);
double calc_mean_of_user(user user);
double calc_sqrt_of_user(user user, double mean);
int cmpfunc(const void *a, const void *b);
void print_matches(int total_users, user *users);
void print_user( int userid, user *users);
int id_converter_to_index(int id, user *users, int total_users);
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
        if(strcmp(argv[1], "getmatch") == 0) {
            //printf("%s %d #2 \n",argv[1], atoi(argv[2]));
            
            //select target user
            int argument_id = atoi(argv[2]);
            //printf("Calculating best matches for %s ...\n", users[user_id - 1].name);

            //calc user similarity
            for (int i = 0; i < total_users; i++) {
                users[i].pearsson = pearsson(users, argument_id - 1, users[i].id);
            }
            
            //Sort the coefficient based on highest similarity
            qsort(users, total_users, sizeof(user), cmpfunc);
            
            print_matches(total_users, users);
            //printf("[{\"Username\": \"%s\", \"Similarity\": %lf}]", users[0].name,users[0].pearsson);
            
    
            fclose(userfile);
            free(users);
        }
        
        if(strcmp(argv[1], "getuser") == 0){
            //select target user
            int user_id = atoi(argv[2]);
            print_user(user_id, users);
            
        }
        if(strcmp(argv[1], "createuser") == 0){
            

            external_new_user(userfile, argv[2], atoi(argv[3]), argv[4][0], atoi(argv[5]), atoi(argv[6]), atoi(argv[7]), atoi(argv[8]), atoi(argv[9]), atoi(argv[10]), atoi(argv[11]), atoi(argv[12]), atoi(argv[13]), total_users);
            printf("true");
            
        }
        if(strcmp(argv[1], "getmatch2") == 0){
            
            //select target user
            //int user_id = atoi(argv[2]);
            
            int userid = id_converter_to_index(atoi(argv[2]), users, total_users);
            //printf("Calculating best matches for %s ...\n", users[user_id - 1].name);
            
            //calc user similarity
            for (int i = 0; i < total_users; i++) {
                
                int targetuser = id_converter_to_index(users[i].id, users, total_users);

                users[i].pearsson = pearsson(users, userid, targetuser);
            }
            
            //Sort the coefficient based on highest similarity
            qsort(users, total_users, sizeof(user), cmpfunc);
            
            print_matches_id(total_users, users);
            //printf("[{\"Username\": \"%s\", \"Similarity\": %lf}]", users[0].name,users[0].pearsson);
            
    
            fclose(userfile);
            free(users);
        }
    }
    else {
        printf("there was only One argument.\n");

        // new user input
        char answer;
        int sentinel = 1;
        while (sentinel) {
            printf("Wish to enter new user? (y/n)\n");
            scanf(" %c", &answer);
            if(answer == 'y'){
                internal_new_user(userfile);
                //Update total users, if new user is created
                total_users = calc_users(userfile);
                //printf("New user ID : %d \n", total_users);
                printf("CONGRATULATIONS! New user created!");
            } else{
                sentinel = 0;
            }
        }

        
        //select target user
        int user_id;
        printf("Enter your user id to get match:\n");
        scanf("%d", &user_id);
        printf("Calculating best matches for %s ...\n", users[user_id - 1].name);

        //calc user similarity

      


        for (int i = 0; i < total_users; i++) {
            printf("vi kom til linje: %d\n", i);
            users[i].pearsson = pearsson(users, id_converter_to_index(user_id - 1, users, total_users), id_converter_to_index(users[i].id, users, total_users));
        }
        
        //Sort the coefficient based on highest similarity
        qsort(users, total_users, sizeof(user), cmpfunc);
        
        print_matches(total_users, users);

        fclose(userfile);
        free(users);

    }
    return 0;
}
//tager et id og tjekker om det findes, hvis det findes returnere den index'et (linjen hvorpå den står)
int id_converter_to_index(int id, user *users, int total_users){
    int index = -1;

    for(int i = 0; i < total_users; i++){
        if(id == users[i].id) {
            return i;
        }
    }

    return index;
}

void external_new_user(FILE *userfile, char *name, int age, char gender, int dog, int triangle, int football,int red, int yellow, 
        int green, int blue, int spaghetti, int pizza, int total_users){
    
    int id = total_users + 1;
    fprintf(userfile, "\n%d %s %d %c %d %d %d %d %d %d %d %d %d", id, name, age, gender, dog, triangle, football, red, yellow, green, blue, spaghetti, pizza);

    fseek(userfile, 0, SEEK_SET);
    return;
}

void internal_new_user(FILE *userfile){
    char u_name[25];
    int u_age;
    char u_gender;
    int u_id, u_dog, u_triangle, u_football, u_red, u_yellow, 
        u_green, u_blue, u_spaghetti, u_pizza;
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
    printf("Enter triangle rating: \n");
    scanf("%d", &u_triangle);
    printf("Enter football rating: \n");
    scanf("%d", &u_football);
    printf("Enter colour (red) rating: \n");
    scanf("%d", &u_red);
    printf("Enter colour (yellow) rating: \n");
    scanf("%d", &u_yellow);
    printf("Enter colour (green) rating: \n");
    scanf("%d", &u_green);
    printf("Enter colour (blue) rating: \n");
    scanf("%d", &u_blue);
    printf("Enter spaghetti rating: \n");
    scanf("%d", &u_spaghetti);
    printf("Enter pizza rating: \n");
    scanf("%d", &u_pizza);
    fprintf(userfile, "\n%d %s %d %c %d %d %d %d %d %d %d %d %d", u_id, u_name, u_age, u_gender, 
                                                               u_dog, u_triangle, u_football, 
                                                               u_red, u_yellow, u_green, u_blue, 
                                                               u_spaghetti, u_pizza);

    fseek(userfile, 0, SEEK_SET);
    return;
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
        
        //users[i].id = i;
        fscanf(userfile, "%d", &users[i].id);
        //users[i].id = i;
        fscanf(userfile, " %[^ ]", users[i].name);
        fscanf(userfile, " %d", &users[i].age);
        fgetc(userfile);
        fscanf(userfile, " %1[^ ]", &users[i].gender);
        fscanf(userfile, " %lf", &users[i].dog);
        fscanf(userfile, " %lf", &users[i].triangle);
        fscanf(userfile, " %lf", &users[i].football);
        fscanf(userfile, " %lf", &users[i].red);
        fscanf(userfile, " %lf", &users[i].yellow);
        fscanf(userfile, " %lf", &users[i].green);
        fscanf(userfile, " %lf", &users[i].blue);
        fscanf(userfile, " %lf", &users[i].spaghetti);
        fscanf(userfile, " %lf", &users[i].pizza);
        fgetc(userfile);
    }
    return;
}

double pearsson(user *users, int target, int compare){
    user target_user = users[target];
    user comp_user = users[compare];
    
    //finding user means
    double t_mean = calc_mean_of_user(target_user);
    double c_mean = calc_mean_of_user(comp_user);
    
    //calc sqrt for each user
    double t_sqrt = calc_sqrt_of_user(target_user, t_mean);
    double c_sqrt = calc_sqrt_of_user(comp_user, c_mean);
    
    //calc similarity
    double sim =    ((target_user.dog - t_mean) * (comp_user.dog - c_mean)) + 
                    ((target_user.triangle - t_mean) * (comp_user.triangle - c_mean)) + 
                    ((target_user.football - t_mean) * (comp_user.football - c_mean)) +
                    ((target_user.red - t_mean ) * (comp_user.red - c_mean)) +
                    ((target_user.yellow - t_mean) * (comp_user.yellow - c_mean)) +
                    ((target_user.green - t_mean) * (comp_user.green - c_mean)) +
                    ((target_user.blue - t_mean) * (comp_user.blue - c_mean)) +
                    ((target_user.spaghetti - t_mean) * (comp_user.spaghetti - c_mean)) +
                    ((target_user.pizza - t_mean) * (comp_user.pizza - c_mean));

    //calculating similarity coeficient
    long double coeficient = sim / (t_sqrt * c_sqrt);
    
    return coeficient; 
}

double calc_mean_of_user(user user){
    double mean = (user.dog + user.triangle + user.football + 
                   user.red + user.yellow + user.green + 
                   user.blue + user.spaghetti + user.pizza) / TOTALCRITERIA;

    //special case when users have rated same rating on all items to handle dividing by zero
    if(mean == user.dog && mean == user.triangle && mean == user.football && 
       mean == user.red && mean == user.yellow && mean == user.green && 
       mean == user.blue && mean == user.spaghetti && mean == user.pizza){
       mean += 0.1;
    }

    return mean;
}

double calc_sqrt_of_user(user user, double mean){
    double user_sqrt = sqrt (pow((user.dog - mean),2) + 
                       pow((user.triangle - mean), 2) + 
                       pow((user.football - mean), 2) +
                       pow((user.red - mean),2) +
                       pow((user.yellow - mean),2) +
                       pow((user.green - mean),2) +
                       pow((user.blue - mean),2) +
                       pow((user.spaghetti - mean),2) +
                       pow((user.pizza - mean),2));
    return user_sqrt;
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

void print_user(int userid, user *users){
    printf("[{\"Username\": \"%s\"}]", users[userid].name);
}

void print_matches(int total_users, user *users){
    printf("[");
    for (int i = total_users - K; i < total_users - 1; i++){
        printf("{\"Username\": \"%s\", \"Similarity\": %lf},", users[i].name, users[i].pearsson);
    }
    printf("{\"Username\": \"sidste\", \"Similarity\": -1}]");
    // printf("total users: %d\n", total_users);
    // for (int i = 0; i < (int)total_users; i++) {
    //     printf("user %2d: name: %s, age: %d, gender %c chiaua: %lf triangle: %lf football: %lf\n",
    //     i + 1, users[i].name, users[i].age, users[i].gender, users[i].dog, users[i].triangle, users[i].football);
    // }
    return;
}

void print_matches_id(int total_users, user *users){
    for (int i = total_users - K; i < total_users - 1; i++){
        printf("%d ", users[i].id);
    }
}