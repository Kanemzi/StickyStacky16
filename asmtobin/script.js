let OPCODES = {
    'add'   : '000000',
    'sub'   : '000001',
    'neg'   : '000010',
    'mul'   : '000011',
    'div'   : '000100',
    'rem'   : '000101',
    'not'   : '000110',
    'and'   : '000111',
    'or'    : '001000',
    'shl'   : '001001',
    'sra'   : '001010',
    'lt'    : '001011',
    'eq'    : '001100',
    'gt'    : '001101',
    'jmp'   : '001110',
    'jmpt'  : '001111',
    'jmpf'  : '010000',
    'push'  : '010001',
    'push_a': '010010',
    'pop'   : '010011',
    'pop_a' : '010100',
    'call'  : '010101',
    'ret'   : '010110',
    'dup'   : '010111',
    'halt'  : '011000'    
}

window.onload = () => {
    let convertButton = document.getElementById('convert')
    let asmText = document.querySelector('#asm textarea')
    let binText = document.querySelector('#bin textarea')
    let rawCheck = document.getElementById('raw')

    convertButton.onclick = () => {
        convert(asmText.value, binText, rawCheck.checked)
    }
}

let convert = (asm, out, raw) => {
    let lines = asm.split('\n')
    let line = 0;
    let instructions = prepare(lines)

    let bin = (raw) ? 'v2.0 raw\n' : ''

    for (let instruction of instructions) {
        if (!raw) {
            while(isLabel(lines[line])) {
                bin += '# ' + lines[line] + '\n'
                line++
            }
        }
        
        let binInstruction = OPCODES[instruction.op]
        binInstruction += dec2bin(instruction.val)
        bin += (raw ? '' : '0x') + bin2hex(binInstruction) + (raw ? ' ' : '\n')
        if (raw && line % 8 == 7) bin += '\n'
        line++
    }
    
    out.value = bin
}

/**
 * sépare les instructions du programme et définit les adresses des différents labels
 */
let prepare = (asmLines) => {
    let instructions = []
    let tags = {}


    let ic = 0

    // enregistrement des instructions dans un tableau
    for(let line of asmLines) {
        line = line.trim()
        let [op, val] = line.split(' ')


        if (op.endsWith(':')) {
            tags[op.slice(0, -1)] =  ic
        } else {
            let adrval = `${val}`.startsWith('[')
            op += adrval ? '_a' : ''
            instructions.push({op: op, val: val})
            ic++
        }
    }

    // definition des adresses d'instructions dans les jumps
    for (let instruction of instructions) {
        let tag = tags[instruction.val]
        if (tag !== undefined) {
            instruction.val = tag 
        }
    }
    
    return instructions
}

let isLabel = line => line.includes(':')

let dec2bin = d => ('0'.repeat(10) + intToUint(d, 10).toString(2)).slice(-10);

let bin2hex = b =>
    b.match(/.{4}/g).reduce((acc, i) => acc + parseInt(i, 2).toString(16), '')


/**
 * @author Paul S.
 * https://stackoverflow.com/questions/27911677/how-to-convert-a-binary-number-into-a-signed-decimal-number
 */
function intToUint(int, nbit) {
    var u = new Uint32Array(1);
    nbit = +nbit || 32;
    if (nbit > 32) throw new RangeError('intToUint only supports ints up to 32 bits');
    u[0] = int;
    if (nbit < 32) { // don't accidentally sign again
        int = Math.pow(2, nbit) - 1;
        return u[0] & int;
    } else {
        return u[0];
    }
}
