var number = [1, 400, 12, 34, 5];
var total = 0;
var i = 0;
while(i < number.length){
    total = total + number[i];
    i = i + 1;
}
console.log(`total : ${total}`);