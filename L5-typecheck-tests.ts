
import { checkNoOccurrence } from './L5-substitution-adt';
import { makePairTExp, matchTVarsInTE, TExp } from './TExp';
// L5-typecheck
import * as assert from "assert";
import { makeDefineExp, makeNumExp, makeProcExp, makeVarDecl, makeVarRef, parse } from './L5-ast';
import { typeofExp, L5typeof } from './L5-typecheck';
import { makeEmptyTEnv, makeExtendTEnv } from './TEnv';
import { makeBoolTExp, makeNumTExp, makeProcTExp, makeTVar, makeVoidTExp, parseTE, unparseTExp } from './TExp';
import { isError } from './error';
import { infer} from './L5-type-equations';

// parseTE
// assert.deepEqual(parseTE("number"), makeNumTExp());
// assert.deepEqual(parseTE("boolean"), makeBoolTExp());
// assert.deepEqual(parseTE("T1"), makeTVar("T1"));
// assert.deepEqual(parseTE("(T * T -> boolean)"), makeProcTExp([makeTVar("T"), makeTVar("T")], makeBoolTExp()));
// assert.deepEqual(parseTE("(number -> (number -> number))"), makeProcTExp([makeNumTExp()], makeProcTExp([makeNumTExp()], makeNumTExp())));
// assert.deepEqual(parseTE("void"), makeVoidTExp());
// assert.deepEqual(parseTE("(Empty -> void)"), makeProcTExp([], makeVoidTExp()));

// // unparseTExp
// assert.deepEqual(unparseTExp(makeNumTExp()), "number");
// assert.deepEqual(unparseTExp(makeBoolTExp()), "boolean");
// assert.deepEqual(unparseTExp(makeTVar("T1")), "T1");
// assert.deepEqual(unparseTExp(makeProcTExp([makeTVar("T"), makeTVar("T")], makeBoolTExp())), "(T * T -> boolean)");
// assert.deepEqual(unparseTExp(makeProcTExp([makeNumTExp()], makeProcTExp([makeNumTExp()], makeNumTExp()))), "(number -> (number -> number))");

// // parse with type annotations
// assert.deepEqual(parse("(define (a : number) 1)"), makeDefineExp(makeVarDecl("a", makeNumTExp()), makeNumExp(1)));
// assert.deepEqual(parse("(lambda ((x : number)) : number x)"),
//                  makeProcExp([makeVarDecl("x", makeNumTExp())], [makeVarRef("x")], makeNumTExp()));

// // L5typeof
// assert.deepEqual(L5typeof("5"), "number");
// assert.deepEqual(L5typeof("#t"), "boolean");

// assert.deepEqual(L5typeof("+"), "(number * number -> number)");
// assert.deepEqual(L5typeof("-"), "(number * number -> number)");
// assert.deepEqual(L5typeof("*"), "(number * number -> number)");
// assert.deepEqual(L5typeof("/"), "(number * number -> number)");
// assert.deepEqual(L5typeof("="), "(number * number -> boolean)");
// assert.deepEqual(L5typeof("<"), "(number * number -> boolean)");
// assert.deepEqual(L5typeof(">"), "(number * number -> boolean)");
// assert.deepEqual(L5typeof("not"), "(boolean -> boolean)");

// // typeof varref in a given TEnv
// assert.deepEqual(typeofExp(parse("x"), makeExtendTEnv(["x"], [makeNumTExp()], makeEmptyTEnv())), makeNumTExp());

// // IfExp
// assert.deepEqual(L5typeof("(if (> 1 2) 1 2)"), "number");
// assert.deepEqual(L5typeof("(if (= 1 2) #t #f)"), "boolean");

// // ProcExp
// assert.deepEqual(L5typeof("(lambda ((x : number)) : number x)"), "(number -> number)");
// assert.deepEqual(L5typeof("(lambda ((x : number)) : boolean (> x 1))"), "(number -> boolean)");

// assert.deepEqual(L5typeof("(lambda((x : number)) : (number -> number) (lambda((y : number)) : number (* y x)))"),
//                  "(number -> (number -> number))");

// assert.deepEqual(L5typeof("(lambda((f : (number -> number))) : number (f 2))"),
//                  "((number -> number) -> number)");

// assert.deepEqual(L5typeof(`(lambda((x : number)) : number
//                              (let (((y : number) x)) (+ x y)))`),
//                  "(number -> number)");

// // LetExp
// assert.deepEqual(L5typeof("(let (((x : number) 1)) (* x 2))"), "number");

// assert.deepEqual(L5typeof(`(let (((x : number) 1)
//                                  ((y : number) 2))
//                               (lambda((a : number)) : number (+ (* x a) y)))`),
//                  "(number -> number)");

// // Letrec
// assert.deepEqual(L5typeof(`(letrec (((p1 : (number -> number)) (lambda((x : number)) : number (* x x))))
//                              p1)`),
//                  "(number -> number)");

// assert.deepEqual(L5typeof(`(letrec (((p1 : (number -> number)) (lambda((x : number)) : number (* x x))))
//                              (p1 2))`),
//                  "number");

// assert.deepEqual(L5typeof(`(letrec (((odd? : (number -> boolean)) (lambda((n : number)) : boolean
//                                                                     (if (= n 0) #f (even? (- n 1)))))
//                                     ((even? : (number -> boolean)) (lambda((n : number)) : boolean
//                                                                      (if (= n 0) #t (odd? (- n 1))))))
//                     (odd? 12))`),
//                  "boolean");

// // define
// assert.deepEqual(L5typeof("(define (foo : number) 5)"), "void");

// assert.deepEqual(L5typeof("(define (foo : (number * number -> number)) (lambda((x : number) (y : number)) : number (+ x y)))"),
//                  "void");
// assert.deepEqual(L5typeof("(define (x : (Empty -> number)) (lambda () : number 1))"), "void");


// // LitExp
// //assert.deepEqual(L5typeof("(quote ())"), "literal");

// // Pair
// //assert.deepEqual(L5typeof("(cons 1 '())"), "(Pair number literal)");
// assert.deepEqual(infer("(cons 1 1)"), "(Pair number number)");
// // assert.deepEqual(L5typeof("(car (cons 1 1))"), "number");
// //  assert.deepEqual(L5typeof("(cdr (cons 1 #t))"), "boolean");
// //  assert.deepEqual(L5typeof("(cdr (cons (cons 1 2) (cons 1 2)))"), "(Pair number number)");
// //  assert.deepEqual(L5typeof("(cdr (cons (cons 1 2) (cons 1 #f)))"), "(Pair number boolean)");
// //  assert.deepEqual(L5typeof("(car (cons (cons 1 2) (cons 1 #f)))"), "(Pair number number)");
// //  assert.deepEqual(L5typeof("(car (cons (cons (cons #t #t) 2) (cons 1 #f)))"), "(Pair (Pair boolean boolean) number)");
// //  assert.deepEqual(L5typeof("(cdr (cons (cons (cons #t #t) 2) (cons 1 #f)))"), "(Pair number boolean)");
// //  assert.deepEqual(L5typeof("(lambda((a : number) (b : number)) : (Pair number number) (cons a b))"),
// //                  "(number * number -> (Pair number number))");
// //  assert.deepEqual(L5typeof("(lambda((a : number) (b : (Pair number boolean))) : (Pair number (Pair number boolean)) (cons a b))"),
// //                   "(number * (Pair number boolean) -> (Pair number (Pair number boolean)))");
// //  assert.deepEqual(L5typeof(`(lambda((a : (Pair number number))
// //                                     (b : (Pair number boolean))) :
// //                                     (Pair (Pair number number) (Pair (Pair number number) (Pair number boolean)))
// //                               (cons a (cons a b)))`),
// //             "((Pair number number) * (Pair number boolean) -> (Pair (Pair number number) (Pair (Pair number number) (Pair number boolean))))");


// // assert.deepEqual(L5typeof("(define (x : (Pair number boolean)) (cons 1 #t))"), "void");
// // assert.deepEqual(L5typeof("(define (x : (Pair (T1 -> T1) number)) (cons (lambda ((y : T1)) : T1 y) 2))"), "void");



// // // Polymorphic tests
// // assert.deepEqual(L5typeof("(lambda((x : T1)) : T1 x)"), "(T1 -> T1)");

// // assert.deepEqual(L5typeof(`(let (((x : number) 1))
// //                              (lambda((y : T) (z : T)) : T
// //                                (if (> x 2) y z)))`),
// //                  "(T * T -> T)");

// // assert.deepEqual(L5typeof("(lambda () : number 1)"), "(Empty -> number)");

// // assert.deepEqual(L5typeof(`(define (x : (T1 -> (T1 -> number)))
// //                              (lambda ((x : T1)) : (T1 -> number)
// //                                (lambda((y : T1)) : number 5)))`), "void");


// // //-----------------------------------------------------------------------------------------------------------------
// // //parser checks
// // assert.deepEqual(parseTE('(Pair number number)'), makePairTExp(makeNumTExp(),makeNumTExp()));
// // assert.deepEqual(parseTE('(Pair number boolean)'), makePairTExp(makeNumTExp(), makeBoolTExp()));
// // assert.deepEqual(parseTE('(Pair (number -> number) number)'),
// //                      makePairTExp(makeProcTExp([makeNumTExp()], makeNumTExp()),makeNumTExp()));
// // // assert.deepEqual(parseTE('(Pair (Pair number number) number)'), 
// // //                 makePairTExp(makePairTExp(makeNumTExp(), makeNumTExp()), makeNumTExp()));
// // assert.deepEqual(parseTE('((Pair number number) * number -> number)'),
// // makeProcTExp([makePairTExp(makeNumTExp(), makeNumTExp()), makeNumTExp()], makeNumTExp()));

// // assert.deepEqual(L5typeof('(lambda ((x : T1) (y : T2)) : (Pair T1 T2) (cons x y))'), '(T1 * T2 -> (Pair T1 T2))');
// // assert.deepEqual(L5typeof('(lambda ((pair : (Pair T1 T2))) : T1 (car pair))'), '((Pair T1 T2) -> T1)');
// // assert.deepEqual(L5typeof('(lambda ((pair : (Pair T1 T2))) : T2 (cdr pair))'), '((Pair T1 T2) -> T2)');

// // //----------------------------------------------------------------------------------------------------------------

// // //unparse checks
// // assert.deepEqual(unparseTExp(parseTE('(Pair number number)')), '(Pair number number)');
// // assert.deepEqual(unparseTExp(parseTE('(Pair number boolean)')), '(Pair number boolean)');
// // assert.deepEqual(unparseTExp(parseTE('(Pair (number -> number) number)')), '(Pair (number -> number) number)');
// // assert.deepEqual(unparseTExp(parseTE('(Pair (Pair number number) number)')), '(Pair (Pair number number) number)');
// // assert.deepEqual(unparseTExp(parseTE('((Pair number number) * number -> number)')), '((Pair number number) * number -> number)');
// // assert.deepEqual(unparseTExp(parseTE('(Pair (Pair number T1) T2)')), '(Pair (Pair number T1) T2)');
// // assert.deepEqual(unparseTExp(parseTE('((Pair number T3) * number -> T4)')), '((Pair number T3) * number -> T4)');

// // //----------------------------------------------------------------------------------------------------------------

// // // matchTVarsInTE checks 
// assert.deepEqual(matchTVarsInTE(<TExp>parseTE('(Pair T1 number)'), <TExp>parseTE('(Pair T1 number)'), (x)=>x, ()=>false),[]);
// assert.deepEqual(matchTVarsInTE(<TExp>parseTE('(T1 -> T2)'), <TExp>parseTE('(T1 -> T2)'), (x)=>x, ()=>false),[]);
// assert.deepEqual(matchTVarsInTE(<TExp>parseTE('(Pair T3 number)'), <TExp>parseTE('(Pair T1 number)'), (x)=>x, ()=>false),
//                 [{left: makeTVar('T3'), right: makeTVar('T1')}]);
// assert.deepEqual(matchTVarsInTE(<TExp>parseTE('((Pair number number) * (Pair T3 number) -> number)'),
//                    <TExp>parseTE('((Pair number number) * (Pair T1 number) -> number)'), (x)=>x, ()=>false),
//                   [{left: makeTVar('T3'), right: makeTVar('T1')}]);

// //-----------------------------------------------------------------------------------------------------------------

// // checkNoOcuurnces checks....
// assert.deepEqual(checkNoOccurrence(makeTVar('T3'), <TExp>parseTE('(T1 -> T2)')), true);
// assert.deepEqual(isError(checkNoOccurrence(makeTVar('T1'), <TExp>parseTE('(T1 -> T2)'))), true);
// assert.deepEqual(checkNoOccurrence(makeTVar('T3'), <TExp>parseTE('(Pair T1 number)')), true);
// assert.deepEqual(isError(checkNoOccurrence(makeTVar('T1'), <TExp>parseTE('(Pair T1 number)'))), true);
// assert.deepEqual(isError(checkNoOccurrence(makeTVar('T3'), 
// <TExp>parseTE('((Pair boolean T2) * (Pair T1 number) -> (Pair (Pair boolean T4) T5))'))), false);
// assert.deepEqual(isError(checkNoOccurrence(makeTVar('T2'), 
// <TExp>parseTE('((Pair boolean T2) * (Pair T1 number) -> (Pair (Pair boolean T4) T5))'))), true);
// assert.deepEqual(isError(checkNoOccurrence(makeTVar('T1'), 
// <TExp>parseTE('((Pair boolean T2) * (Pair T1 number) -> (Pair (Pair boolean T4) T5))'))), true);
// assert.deepEqual(isError(checkNoOccurrence(makeTVar('T4'), 
// <TExp>parseTE('((Pair boolean T2) * (Pair T1 number) -> (Pair (Pair boolean T4) T5))'))), true);
// assert.deepEqual(isError(checkNoOccurrence(makeTVar('T5'), 
// <TExp>parseTE('((Pair boolean T2) * (Pair T1 number) -> (Pair (Pair boolean T4) T5))'))), true);

// // LitTExp type check tests -> only some it's trivial..
// //assert.deepEqual(L5typeof('(quote (quote (1 2)))'), 'literal');

// // final checks..
  //assert.deepEqual(infer(`(lambda (x) (= x 0))`), '(number -> boolean)');
 // assert.deepEqual(infer(`(lambda ((x : number) (y : boolean)) (cons x y))`), '(number * boolean -> (Pair number boolean))');
 
  // assert.deepEqual(infer(`(lambda ((pair : (Pair boolean number))) (car pair))`), '((Pair boolean number) -> boolean)');
//  assert.deepEqual(infer(`(lambda ((pair : (Pair boolean number))) (cdr pair))`), '((Pair boolean number) -> number)');
//  assert.deepEqual(infer('(car (cons 1 #t))'), 'number');
//  assert.deepEqual(infer('(cdr (cons 1 #t))'), 'boolean');
//  assert.deepEqual(infer(`(cons (car (cons 1 2)) (car '(#t.2)))`), '(Pair number boolean)');
// console.log(JSON.stringify(infer(`(cons (car (cons 1 2)) (cdr '(1.2)))`),null,2))
//console.log(JSON.stringify(infer(`(cons (cdr '(2.#t)) 1)`),null,2))
//console.log(JSON.stringify(infer(`(cons 1 (cons (2 3)))`),null,2))
  assert(infer("cons"), "(T1 * T2 -> (Pair T1 T2))");
  assert(infer("car"), "((Pair T1 T2) -> T1)");
 assert(infer("(cons 1 1)"), "(Pair number number)");
 assert(
     infer("(cons 1 (lambda (x) (+ x 1)))"), "(Pair number (number -> number))");


