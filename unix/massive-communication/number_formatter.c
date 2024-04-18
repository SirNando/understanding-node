#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *formatNumber(char *input, char begin, char divider)
{
    int length = strlen(input);

    // Determine the length of the formatted string:
    // [length] + [number of dividers] + [1 for begin sign] + [1 for null terminator]
    int formattedLength = length + length / 3 + 2;

    // Allocate memory for the formatted string
    char *formattedNumber = (char *)malloc(formattedLength);

    int j = 0;                   // index for the formatted string
    int commaCount = length % 3; // determine where the first divider should be placed

    // Add begin sign at the beginning
    formattedNumber[0] = begin;
    j = j + 1;

    // Iterate over the original string from the beginning
    for (int i = 0; i < length; i++)
    {
        formattedNumber[j] = input[i];
        j = j + 1;

        // Add a divider every three digits, but not after the last digit
        if (commaCount > 0 && i < length - 1 && (i + 1) % 3 == commaCount)
        {
            formattedNumber[j++] = divider;
        }
        else if (commaCount == 0 && i < length - 1 && (i + 1) % 3 == 0)
        {
            formattedNumber[j++] = divider;
        }
    }

    // Null-terminate the formatted string
    formattedNumber[j] = '\0';

    return formattedNumber;
}

int main(int argc, char *argv[])
{
    FILE *outputFile = fopen(argv[1], "w");
    int number = fgetc(stdin);

    // Allocat memory to save one complete number
    char *numberAccumulator = malloc(10 * sizeof(char));
    int index = 0;

    // Keep reading until we get the EOF signal
    while (number != EOF)
    {
        // Accumulate digits until number is completely read
        if (number != ' ')
        {
            numberAccumulator[index++] = number;
        }

        if (number == ' ')
        {
            if (index > 0)
            {
                // End the string
                numberAccumulator[index] = 0;

                // Format the number
                // numberAccumulator[++index] = 0;
                char *formattedNumber = formatNumber(numberAccumulator, argv[2][0], argv[3][0]);

                // Write to destination stream
                fprintf(outputFile, " %s ", formattedNumber);
                free(formattedNumber);
                // fflush(outputFile);

                index = 0;
            }
        }

        number = fgetc(stdin);
    }

    free(numberAccumulator);
    fclose(outputFile);

    return 0;
}