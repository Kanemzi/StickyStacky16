unsigned int pgcd(unsigned int a,unsigned int b)
{
	if (b != 0) {
		return pgcd(b, a % b);
	} else {
		return a;
	}
}

main:
	push 9
	push 12
	call pgcd
	pop [0000]
	halt
pgcd:	
	pop [0001]
	pop [0002]	
	push [0002]
	push [0001]
	dup
	push 0
	eq
	jmpf else
then:
	dup
	push [0002]
	push [0001]
	call pgcd
	jmp endif
else:
	push [0002]
endif:
	ret
