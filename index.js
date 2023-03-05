// 아잇!어 node.js 구현체
// some of algorhithm ideas have been inspired by node.js implementation of UmJunsik-lang, by rycont

// import { readFileSync } from 'fs';
// import { readlineSync } from 'readline-sync';
const fs = require('fs');
const readlineSync = require('readline-sync');
var returnValue;

let vars = Array.from({length: 10}, (v, i) => 0);

function printReturn(rv) {
    process.stdout.write(`\nProcess successfully finished with exit code (${rv})`);
}

function evaluate(string) {
    let total = 0;
    let numList = string.split(',').map(x => x.trim())
    numList.forEach((v, i) => {
        if (v.includes('어')) {
            total += v.split(' ').reduce((a, c) => a * vars[c.split('어').length - 2] * (c.includes('!') ? 1 : -1), 1);
        } else {
            total += v.split(' ').reduce((a, c) => a * (c.split('.').length - 1) * (c.includes('!') ? 1 : -1), 1);
        }
    })
    return total;
}

function run(statements) {
    let commandPointer = 0;
    if (statements[0] != '여러분들은 밥 편하게 먹는 거 감사해야되') { throw new Error('EntryError: 시작 구문이 잘못되었습니다. 아잇 어!') };
    while (commandPointer < statements.length) {
        let line = statements[commandPointer];
        // console.log(commandPointer, line)

        // 아잇 - 변수 선언 및 조작
        if (line.startsWith('아')) {
            let declarePattern = /(아+잇?)([어.,! ]*)/;
            declarePattern.test(line);
            vars[RegExp.$1.length-1] = evaluate(RegExp.$2.trim());
        } 
        // 푸ㄹ(ㄹ) - 변수 출력
        else if (line.includes('푸')) {
            let printPattern = /([어.,! ]*)(푸ㄹㄹ?)/;
            printPattern.test(line);
            let num = RegExp.$1;
            if (RegExp.$2.trim() == '푸ㄹ') {
                process.stdout.write(''+evaluate(num)); // process.stdout.write 메서드는 문자열만 출력 가능
            } else if (RegExp.$2.trim() == '푸ㄹㄹ') {
                process.stdout.write(num == 0 ? '\n' : String.fromCharCode(evaluate(num)));
            }
        }
        // 소고기 - goto 문
        else if (line.startsWith('소고기')) {
            if (line.split('소고기')[1].includes('아')) { // 선언 시작문 (Note: !로 끝나는 로직 미구현)
                commandPointer = statements.findIndex((exit) => {
                    return (exit.startsWith('소고기')
                    && exit.split('어').length == line.split('아').length + line.split('잇').length - 1);
                });
                continue;
            } else if (true) {
                commandPointer++;
                continue;
            }
        }
        // ~번! - return 구문
        else if (line.endsWith('번!')) {
            returnValue = evaluate(line.slice(0, -2).trim());
            printReturn(returnValue);
            return;
        }

        // 집중력 훈련 - 조건문
        else if (line.startsWith('집중력 훈련')) {
            let token = line.split('집중력 훈련')[1].trimLeft();
            let [goal, condition] = [token.split(' ')[0], token.split(' ').slice(1).join(' ')];
            // console.log('\n\n', goal, condition, vars[2]);
            if (evaluate(condition) == 0) {
                commandPointer = statements.findIndex((exit) => {
                    return (exit.startsWith('소고기')
                    && exit.split('어').length == goal.split('아').length + goal.split('잇').length - 1);
                });
                continue;
            }
        }
        // 응! - 입력 구문
        else if (line.startsWith('응!')) {
            let input = readlineSync.question();
            vars[line.split('응!')[1].trim().length - 1] = parseInt(input);
        }
        
        commandPointer++;
    }
    // console.log(vars);
       
}

function main() {
    if (process.argv[2] == 'run' && process.argv[3].split('.')[1] == 'ait') {
        let file = fs.readFileSync(process.argv[3], 'utf-8').split('\n').map(x => x.split('||')[0].trim());
        // console.log(file);
        run(file);
    } else {
        throw new Error(`Aitlang Interpreter: ${process.argv[2]}은(는) 잘못된 명령입니다.`);
    }
}

main();
// console.error(evaluate('어 어'))
