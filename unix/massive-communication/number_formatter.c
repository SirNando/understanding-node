#include <stdio.h>
#include <stdlib.h>

int main()
{

    FILE *outputFile = fopen("./dest.txt", "w");
    int number = fgetc(stdin);

    // Keep reading until we get the EOF signal
    while (number != EOF)
    {
        while (number == ' ')
        {
            fprintf(outputFile, " ");
        }

        // Number is not a space. We add a dollar sign
        fprintf(outputFile, "$%c", number);
        while (number != ' ')
        {
            fprintf(outputFile, "%c", number);
            number = fgetc(stdin);
        }
    }

    return 0;
}