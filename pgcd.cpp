int main(void) {
	int x = pgcd(11, 121)
}

unsigned int pgcd(unsigned int a,unsigned int b)
{
	if (b != 0) {
		return pgcd(b, a % b);
	} else {
		return a;
	}
}


main:
	push 11
	push 121
	call pgcd
	pop [0000]
	halt
pgcd:
	dup
	push 0
	eq
	jmpt else
then:
	pop [0002]
	pop [0001]
	push [0002]
	push [0001]
	push [0002]
	rem
	call pgcd
	jmp endif
else:
	pop
endif:
	ret


# main:
0x440b
0x4479
0x5405
0x5000
0x6000
# pgcd:
0x5c00
0x4400
0x3000
0x3c11
# then:
0x5002
0x5001
0x4802
0x4801
0x4802
0x1400
0x5405
0x3812
# else:
0x4c00
# endif:
0x5800
