let mem = 0;
//@ts-check
const ops = [
    {
        sym:"+",
        args: 2,
        fn: (a,b) => a+b
    },
    {
        sym:"-",
        args: 2,
        fn: (a,b) => a-b
    },
    {
        sym:"*",
        args: 2,
        fn: (a,b) => a*b
    },
    {
        sym:"/",
        args: 2,
        fn: (a,b) => a/b
    },{
        sym:"tomem",
        args: 1,
        fn: a => mem = a
    },{
        sym:"mem",
        args: 0,
        fn: () => mem
    }
]
/**
 * 
 * @param {string} str 
 */
function parseRPN(str){
    let expr = str.toLowerCase().split(" ");
    let exprs = [expr];
    try{
        while(!(expr.length === 1 && (parseFloat(expr[0]) || (parseFloat(expr[0]) === 0)))){
            expr = digestNextSymbol(expr);
            exprs.push(expr);
        }
        return {
            value: parseFloat(expr[0]),
            exprs
        }
    }catch(e){
        return {
            error:e.message,
            exprs
        }
    }
}
/**
 * Digests the next symbol
 * @param {string[]} expr 
 */
function digestNextSymbol(expr){
    let index = expr.findIndex(value => !parseFloat(value));
    if(index === -1){
        throw new Error("NO_SYMBOLS")
    }
    let symbol = expr[index];
    let op = ops.find(_op => _op.sym === symbol);
    if(!op){
        throw new Error(`UNKNOWN_SYMBOL_${symbol}`)
    }
    let args = expr.slice(index - op.args, index).map(str => {
        if(parseFloat(str)) return parseFloat(str);
        throw new Error("INVALID_ARGUMENT")
    });
    if(args.length !== op.args){
        throw new Error("INSUFFICIENT_ARGUMENTS")
    }
    let res = op.fn(...args);
    expr.splice(index - op.args, op.args + 1, res + "")
    return expr;
}
document.addEventListener("DOMContentLoaded", function(){
    let input = document.querySelector("input");
    input.focus();
    function calculate(){
        let value = parseRPN(input.value);
        if(value.error){
            input.value = value.error;
        }else{
            input.value = "" + value.value;
        }
    }
    document.body.addEventListener("click", function(e){
        if(! (e.target instanceof HTMLElement)) return;
        if(e.target.tagName !== "BUTTON") return;
        let sym = e.target.getAttribute("data-sym") || e.target.innerText;
        if(sym === "AC"){
            input.value = "";
        }else if(sym === "="){
            calculate();
        }else if(sym === "toMem"){
            if(!parseFloat(input.value)) throw new Error("INVALID_MEM_VALUE");
            mem = parseFloat(input.value);
        }else{
            input.value += sym;
        }
        input.focus();
    });
    input.addEventListener("keyup", function(e){
        if(e.key === "Enter"){
            calculate();
        }
    })
})