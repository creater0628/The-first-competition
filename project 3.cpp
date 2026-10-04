#include <stdio.h>
int main()
{
	int iCount;
	for(iCount=0;iCount<10;iCount++)
	{ 
		if (iCount == 5)
		{
			printf("Continue here\n");
			continue;
		}
		printf("the counter is:%d\n", iCount);
	}
	return 0;
}
