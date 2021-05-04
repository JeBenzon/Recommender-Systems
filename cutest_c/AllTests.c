#include <stdio.h>
#include "CuTest.h"
#include "alfa.c"

CuSuite* StrUtilGetSuite();

void RunAllTests(void) {
    CuString* output = CuStringNew();
    CuSuite* suite = CuSuiteNew();

    CuSuiteAddSuite(suite, StrUtilGetSuite());

    CuSuiteRun(suite);
    CuSuiteSummary(suite, output);
    CuSuiteDetails(suite, output);
    printf("%s\n", output->buffer);
}

int main(int argc, char *argv[]) {
    if (strcmp(argv[1], "start_test") == 0) {
        RunAllTests();
    } else {
        program(argv);
    }
}