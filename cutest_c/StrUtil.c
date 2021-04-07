#include <string.h>
#include <ctype.h>
#include "CuTest.h"
    
char* StrToUpper(char* str) {
    char* p;
    for (p = str ; *p ; ++p) *p = toupper(*p);
    return str;
    }
    
void TestStrToUpper(CuTest *tc) {
    //laver sit eget input
    char* input = strdup("hello world");
    //her kører man sin funtion
    char* actual = StrToUpper(input);
    //skriver forventet output
    char* expected = "HELLO WORLD";
    //bruger CuTest til at teste
    CuAssertStrEquals(tc, expected, actual);
}

void TestStrToUpper_EmptyString(CuTest *tc){
    char* input = strdup("");
    char* actual = StrToUpper(input);
    char* expected = "";
    CuAssertStrEquals(tc, expected, actual);
}

void TestStrToUpper_UpperCase(CuTest *tc){
    char* input = strdup("HELLO WORLD");
    char* actual = StrToUpper(input);
    char* expected = "HELLO WORLD";
    CuAssertStrEquals(tc, expected, actual);
}
void TestStrToUpper_MixedCase(CuTest *tc){
    char* input = strdup("HELLO world");
    char* actual = StrToUpper(input);
    char* expected = "HELLO WORLD";
    CuAssertStrEquals(tc, expected, actual);
}
void TestStrToUpper_Numbers(CuTest *tc){
    char* input = strdup("1234 hello");
    char* actual = StrToUpper(input);
    char* expected = "1234 HELLO";
    CuAssertStrEquals(tc, expected, actual);
}
CuSuite* StrUtilGetSuite() {
    CuSuite* suite = CuSuiteNew();
    SUITE_ADD_TEST(suite, TestStrToUpper);
    SUITE_ADD_TEST(suite, TestStrToUpper_EmptyString);
    SUITE_ADD_TEST(suite, TestStrToUpper_UpperCase);
    SUITE_ADD_TEST(suite, TestStrToUpper_MixedCase);
    SUITE_ADD_TEST(suite, TestStrToUpper_Numbers);
    return suite;
}