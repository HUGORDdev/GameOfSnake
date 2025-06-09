
#include <stdio.h>
#include <stdlib.h>
int main(){
    int a,b,n,s;
    a=1;
    b=1;
    n=0;
    s=0;
    while(n<=4000000){
        if(b%2==0){
            s=b+s;
        }else{
            n=a+b;
            a=b;
            b=n;
        }
    }
    printf("%d",s);
    return 0;
}