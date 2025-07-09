/*
 * File:	parser.cpp
 *
 * Description:	This file contains the public and private function and
 *		variable definitions for the recursive-descent parser for
 *		Simple C.
 */

# include <cstdlib>
# include <iostream>
# include "generator.h"
# include "checker.h"
# include "string.h"
# include "tokens.h"
# include "lexer.h"

using std::string;

static int lookahead;
static string lexbuf;
static Type returnType(ERROR);

static bool declarator(Declarators &decls, string &name);
static Expression *expression();
static Parameters *parameters();
static Statement *statement();


/*
 * Function:	error
 *
 * Description:	Report a syntax error to standard error.
 */

static void error()
{
    if (lookahead == DONE)
	report("syntax error at end of file");
    else
	report("syntax error at '%s'", lexbuf);

    exit(EXIT_FAILURE);
}


/*
 * Function:	match
 *
 * Description:	Match the next token against the specified token.  A
 *		failure indicates a syntax error and will terminate the
 *		program since our parser does not do error recovery.
 */

static void match(int t)
{
    if (lookahead == t)
	lookahead = lexan(lexbuf);
    else
	error();
}


/*
 * Function:	isSpecifier
 *
 * Description:	Return whether the given token is a type specifier.
 */

static bool isSpecifier(int token)
{
    return token == INT || token == CHAR;
}


/*
 * Function:	pointers
 *
 * Description:	Parse pointer declarators (i.e., zero or more asterisks).
 *
 *		pointers:
 *		  empty
 *		  * pointers
 */

static Declarators pointers()
{
    Declarators decls;


    while (lookahead == '*') {
	match('*');
	decls.push_front(Pointer());
    }

    return decls;
}


/*
 * Function:	specifier
 *
 * Description:	Parse a type specifier.  Simple C has only int and char.
 *
 *		specifier:
 *		  int
 *		  char
 */

static int specifier()
{
    int typespec = lookahead;

    if (isSpecifier(lookahead))
	match(lookahead);
    else
	error();

    return typespec;
}


/*
 * Function:	primaryDeclarator
 *
 * Description:	Parse a primary declarator.
 *
 *		primary-declarator:
 *		  ( declarator )
 *		  identifier
 */

static bool primaryDeclarator(Declarators &decls, string &name)
{
    bool funcdecl;


    if (lookahead == '(') {
	match('(');
	funcdecl = declarator(decls, name);
	match(')');

    } else {
	name = lexbuf;
	match(ID);
	funcdecl = (lookahead == '(');

	if (funcdecl) {
	    match('(');
	    openScope();
	    decls.push_front(Function(parameters()));
	    match(')');
	}
    }

    return funcdecl;
}


/*
 * Function:	postfixDeclarator
 *
 * Description:	Parse a postfix declarator.
 *
 *		postfix-declarator:
 *		  postfix-declarator ( parameters )
 *		  postfix-declarator [ num ]
 *		  primary-declarator
 */

static bool postfixDeclarator(Declarators &decls, string &name)
{
    bool funcdecl;


    funcdecl = primaryDeclarator(decls, name);

    while (1) {
	if (lookahead == '(') {
	    match('(');
	    openScope();
	    decls.push_front(Function(parameters()));
	    closeScope(true);
	    match(')');

	} else if (lookahead == '[') {
	    match('[');
	    decls.push_front(Array(strtol(lexbuf.c_str(), NULL, 0)));
	    match(NUM);
	    match(']');

	} else
	    break;
    }

    return funcdecl;
}


/*
 * Function:	declarator
 *
 * Description:	Parse a declarator or a function declarator.
 *
 *		declarator:
 *		  * declarator
 *		  postfix-declarator
 */

static bool declarator(Declarators &decls, string &name)
{
    bool funcdecl;


    if (lookahead == '*') {
	match('*');
	funcdecl = declarator(decls, name);
	decls.push_front(Pointer());
    } else
	funcdecl = postfixDeclarator(decls, name);

    return funcdecl;
}


/*
 * Function:	declarator
 *
 * Description:	Convenience function for calling declarator and reversing
 *		the declarators so we can use them.  We also can close any
 *		open parameter scope of a function declarator.
 */

static bool declarator(Declarators &decls, string &name, bool closefunc)
{
    bool funcdecl;


    decls.clear();
    funcdecl = declarator(decls, name);
    decls.reverse();

    if (funcdecl && closefunc)
	closeScope(true);

    return funcdecl;
}


/*
 * Function:	declaration
 *
 * Description:	Parse a variable or function declaration.
 *
 *		declaration:
 *		  specifier declarator-list ';'
 *
 *		declarator-list:
 *		  declarator
 *		  declarator , declarator-list
 */

static void declaration()
{
    int typespec;
    Declarators decls;
    string name;


    typespec = specifier();
    declarator(decls, name, true);
    declareSymbol(name, Type(typespec, decls));

    while (lookahead == ',') {
	match(',');
	declarator(decls, name, true);
	declareSymbol(name, Type(typespec, decls));
    }

    match(';');
}


/*
 * Function:	declarations
 *
 * Description:	Parse a possibly empty sequence of declarations.
 *
 *		declarations:
 *		  empty
 *		  declaration declarations
 */

static void declarations()
{
    while (isSpecifier(lookahead))
	declaration();
}


/*
 * Function:	parameter
 *
 * Description:	Parse a parameter, which is simply a specifier followed by
 *		a declarator.
 *
 *		parameter:
 *		  specifier declarator
 */

static Type parameter()
{
    int typespec;
    Declarators decls;
    string name;


    typespec = specifier();
    declarator(decls, name, true);

    if (!decls.empty() && decls.front().kind() == ARRAY)
	decls.front() = Pointer();
    else if (!decls.empty() && decls.front().kind() == FUNCTION)
	decls.push_front(Pointer());

    declareSymbol(name, Type(typespec, decls));
    return Type(typespec, decls);
}


/*
 * Function:	parameters
 *
 * Description:	Parse the parameters of a function, but not the opening or
 *		closing parentheses.
 *
 *		parameters:
 *		  void
 *		  parameter-list
 *		  parameter-list , ...
 *
 *		parameter-list:
 *		  parameter
 *		  parameter , parameter-list
 */

static Parameters *parameters()
{
    Parameters *params;


    params = new Parameters();
    params->variadic = false;

    if (lookahead == VOID)
	match(VOID);

    else {
	params->types.push_back(parameter());

	while (lookahead == ',') {
	    match(',');

	    if (lookahead == ELLIPSIS) {
		params->variadic = true;
		match(ELLIPSIS);
		break;
	    }

	    params->types.push_back(parameter());
	}
    }

    return params;
}


/*
 * Function:	primaryExpression
 *
 * Description:	Parse a primary expression.
 *
 *		primary-expression:
 *		  ( expression )
 *		  identifier
 *		  character
 *		  string
 *		  num
 */

static Expression *primaryExpression(bool lparen)
{
    Expression *expr;


    if (lparen) {
	expr = expression();
	match(')');

    } else if (lookahead == CHARACTER) {
	lexbuf = lexbuf.substr(1, lexbuf.size() - 2);
	expr = new Number(parseString(lexbuf)[0]);
	match(CHARACTER);

    } else if (lookahead == STRING) {
	lexbuf = lexbuf.substr(1, lexbuf.size() - 2);
	expr = new String(parseString(lexbuf));
	match(STRING);

    } else if (lookahead == NUM) {
	expr = new Number(lexbuf);
	match(NUM);

    } else if (lookahead == ID) {
	expr = new Identifier(checkIdentifier(lexbuf));
	match(ID);

    } else {
	expr = nullptr;
	error();
    }

    return expr;
}


/*
 * Function:	postfixExpression
 *
 * Description:	Parse a postfix expression.
 *
 *		postfix-expression:
 *		  primary-expression
 *		  postfix-expression [ expression ]
 *		  postfix-expression ( expression-list )
 *		  postfix-expression ( )
 *
 *		expression-list:
 *		  expression
 *		  expression , expression-list
 */

static Expression *postfixExpression(bool lparen)
{
    Expression *left, *right;


    left = primaryExpression(lparen);

    while (1) {
	if (lookahead == '[') {
	    match('[');
	    right = expression();
	    match(']');
	    left = checkArray(left, right);

	} else if (lookahead == '(') {
	    Expressions args;

	    match('(');

	    if (lookahead != ')') {
		args.push_back(expression());

		while (lookahead == ',') {
		    match(',');
		    args.push_back(expression());
		}
	    }

	    match(')');
	    left = checkCall(left, args);

	} else
	    break;
    }

    return left;
}


/*
 * Function:	prefixExpression
 *
 * Description:	Parse a prefix expression.
 *
 *		prefix-expression:
 *		  postfix-expression
 *		  ! prefix-expression
 *		  - prefix-expression
 *		  * prefix-expression
 *		  & prefix-expression
 *		  sizeof prefix-expression
 *		  sizeof ( specifier pointers )
 *		  ( specifier pointers ) prefix-expression
 *
 *		This grammar is still ambiguous since "sizeof(type) * n"
 *		could be interpreted as a multiplicative expression or as a
 *		cast of a dereference.  The correct interpretation is the
 *		former, as the latter makes little sense semantically.  We
 *		resolve the ambiguity here by always consuming the "(type)"
 *		as part of the sizeof expression.
 */

static Expression *prefixExpression()
{
    int typespec;
    Declarators decls;
    Expression *expr;


    if (lookahead == '!') {
	match('!');
	expr = prefixExpression();
	expr = checkNot(expr);

    } else if (lookahead == '-') {
	match('-');
	expr = prefixExpression();
	expr = checkNegate(expr);

    } else if (lookahead == '*') {
	match('*');
	expr = prefixExpression();
	expr = checkDereference(expr);

    } else if (lookahead == '&') {
	match('&');
	expr = prefixExpression();
	expr = checkAddress(expr);

    } else if (lookahead == SIZEOF) {
	match(SIZEOF);

	if (lookahead == '(') {
	    match('(');

	    if (isSpecifier(lookahead)) {
		typespec = specifier();
		decls = pointers();
		expr = new Number(Type(typespec, decls).size());
		match(')');
	    } else {
		expr = postfixExpression(true);
		expr = checkSizeof(expr);
	    }

	} else {
	    expr = prefixExpression();
	    expr = checkSizeof(expr);
	}

    } else if (lookahead == '(') {
	match('(');

	if (isSpecifier(lookahead)) {
	    typespec = specifier();
	    decls = pointers();
	    match(')');
	    expr = prefixExpression();
	    expr = checkCast(Type(typespec, decls), expr);

	} else
	    expr = postfixExpression(true);

    } else
	expr = postfixExpression(false);

    return expr;
}


/*
 * Function:	multiplicativeExpression
 *
 * Description:	Parse a multiplicative expression.
 *
 *		multiplicative-expression:
 *		  prefix-expression
 *		  multiplicative-expression * prefix-expression
 *		  multiplicative-expression / prefix-expression
 *		  multiplicative-expression % prefix-expression
 */

static Expression *multiplicativeExpression()
{
    Expression *left, *right;


    left = prefixExpression();

    while (1) {
	if (lookahead == '*') {
	    match('*');
	    right = prefixExpression();
	    left = checkMultiply(left, right);

	} else if (lookahead == '/') {
	    match('/');
	    right = prefixExpression();
	    left = checkDivide(left, right);

	} else if (lookahead == '%') {
	    match('%');
	    right = prefixExpression();
	    left = checkRemainder(left, right);

	} else
	    break;
    }

    return left;
}


/*
 * Function:	additiveExpression
 *
 * Description:	Parse an additive expression.
 *
 *		additive-expression:
 *		  multiplicative-expression
 *		  additive-expression + multiplicative-expression
 *		  additive-expression - multiplicative-expression
 */

static Expression *additiveExpression()
{
    Expression *left, *right;


    left = multiplicativeExpression();

    while (1) {
	if (lookahead == '+') {
	    match('+');
	    right = multiplicativeExpression();
	    left = checkAdd(left, right);

	} else if (lookahead == '-') {
	    match('-');
	    right = multiplicativeExpression();
	    left = checkSubtract(left, right);

	} else
	    break;
    }

    return left;
}


/*
 * Function:	relationalExpression
 *
 * Description:	Parse a relational expression.  Note that Simple C does not
 *		have shift operators, so we go immediately to additive
 *		expressions.
 *
 *		relational-expression:
 *		  additive-expression
 *		  relational-expression < additive-expression
 *		  relational-expression > additive-expression
 *		  relational-expression <= additive-expression
 *		  relational-expression >= additive-expression
 */

static Expression *relationalExpression()
{
    Expression *left, *right;


    left = additiveExpression();

    while (1) {
	if (lookahead == '<') {
	    match('<');
	    right = additiveExpression();
	    left = checkLessThan(left, right);

	} else if (lookahead == '>') {
	    match('>');
	    right = additiveExpression();
	    left = checkGreaterThan(left, right);

	} else if (lookahead == LEQ) {
	    match(LEQ);
	    right = additiveExpression();
	    left = checkLessOrEqual(left, right);

	} else if (lookahead == GEQ) {
	    match(GEQ);
	    right = additiveExpression();
	    left = checkGreaterOrEqual(left, right);

	} else
	    break;
    }

    return left;
}


/*
 * Function:	equalityExpression
 *
 * Description:	Parse an equality expression.
 *
 *		equality-expression:
 *		  relational-expression
 *		  equality-expression == relational-expression
 *		  equality-expression != relational-expression
 */

static Expression *equalityExpression()
{
    Expression *left, *right;


    left = relationalExpression();

    while (1) {
	if (lookahead == EQL) {
	    match(EQL);
	    right = relationalExpression();
	    left = checkEqual(left, right);

	} else if (lookahead == NEQ) {
	    match(NEQ);
	    right = relationalExpression();
	    left = checkNotEqual(left, right);

	} else
	    break;
    }

    return left;
}


/*
 * Function:	logicalAndExpression
 *
 * Description:	Parse a logical-and expression.  Note that Simple C does
 *		not have bitwise-and expressions.
 *
 *		logical-and-expression:
 *		  equality-expression
 *		  logical-and-expression && equality-expression
 */

static Expression *logicalAndExpression()
{
    Expression *left, *right;


    left = equalityExpression();

    while (lookahead == AND) {
	match(AND);
	right = equalityExpression();
	left = checkLogicalAnd(left, right);
    }

    return left;
}


/*
 * Function:	expression
 *
 * Description:	Parse an expression, or more specifically, a logical-or
 *		expression, since Simple C does not allow comma or
 *		assignment as an expression operator.
 *
 *		expression:
 *		  logical-and-expression
 *		  expression || logical-and-expression
 */

static Expression *expression()
{
    Expression *left, *right;


    left = logicalAndExpression();

    while (lookahead == OR) {
	match(OR);
	right = logicalAndExpression();
	left = checkLogicalOr(left, right);
    }

    return left;
}


/*
 * Function:	statements
 *
 * Description:	Parse a possibly empty sequence of statements.  Rather than
 *		checking if the next token starts a statement, we check if
 *		the next token ends the sequence, since a sequence of
 *		statements is always terminated by a closing brace.
 *
 *		statements:
 *		  empty
 *		  statement statements
 */

static Statements statements()
{
    Statements stmts;


    while (lookahead != '}')
	stmts.push_back(statement());

    return stmts;
}


/*
 * Function:	assignment
 *
 * Description:	Parse an assignment statement.
 *
 *		assignment:
 *		  expression = expression
 *		  expression
 */

static Statement *assignment()
{
    Expression *left, *right;


    left = expression();

    if (lookahead == '=') {
	match('=');
	right = expression();
	return checkAssignment(left, right);
    }

    return new Simple(left);
}


/*
 * Function:	statement
 *
 * Description:	Parse a statement.  Note that Simple C has so few
 *		statements that we handle them all in this one function.
 *
 *		statement:
 *		  { declarations statements }
 *		  return expression ;
 *		  while ( expression ) statement
 *		  for ( assignment ; expression ; assignment ) statement
 *		  if ( expression ) statement
 *		  if ( expression ) statement else statement
 *		  assignment ;
 */

static Statement *statement()
{
    Scope *scope;
    Expression *expr;
    Statement *stmt, *init, *incr;
    Statements stmts;


    if (lookahead == '{') {
	match('{');
	openScope();
	declarations();
	stmts = statements();
	scope = closeScope();
	match('}');
	return new Block(scope, stmts);

    } else if (lookahead == RETURN) {
	match(RETURN);
	expr = expression();
	stmt = checkReturn(expr, returnType);
	match(';');
	return stmt;

    } else if (lookahead == WHILE) {
	match(WHILE);
	match('(');
	expr = expression();
	expr = checkTest(expr);
	match(')');
	stmt = statement();
	return new While(expr, stmt);

    } else if (lookahead == FOR) {
	match(FOR);
	match('(');
	init = assignment();
	match(';');
	expr = expression();
	expr = checkTest(expr);
	match(';');
	incr = assignment();
	match(')');
	stmt = statement();
	return new For(init, expr, incr, stmt);

    } else if (lookahead == IF) {
	match(IF);
	match('(');
	expr = expression();
	match(')');
	stmt = statement();

	if (lookahead != ELSE)
	    return new If(expr, stmt, nullptr);

	match(ELSE);
	return new If(expr, stmt, statement());

    } else {
	stmt = assignment();
	match(';');
	return stmt;
    }
}


/*
 * Function:	functionOrGlobal
 *
 * Description:	Parse a function definition or global declaration.
 *
 * 		function-or-global:
 * 		  specifier declarator { declarations statements }
 * 		  specifier declarator ;
 * 		  specifier declarator , declarator-list ;
 */

static void functionOrGlobal()
{
    int typespec;
    bool funcdecl;
    Declarators decls;
    Statements stmts;
    Procedure *proc;
    Symbol *symbol;
    Scope *scope;
    string name;


    typespec = specifier();
    funcdecl = declarator(decls, name, false);

    if (funcdecl && lookahead == '{') {
	symbol = defineFunction(name, Type(typespec, decls));
	decls.pop_front();
	returnType = Type(typespec, decls);

	match('{');
	declarations();
	stmts = statements();
	scope = closeScope();
	proc = new Procedure(symbol, new Block(scope, stmts));
	match('}');

	if (numerrors == 0)
	    proc->generate();

    } else {
	if (funcdecl)
	    closeScope(true);

	declareSymbol(name, Type(typespec, decls));

	while (lookahead == ',') {
	    match(',');
	    declarator(decls, name, true);
	    declareSymbol(name, Type(typespec, decls));
	}

	match(';');
    }
}


/*
 * Function:	main
 *
 * Description:	Analyze the standard input stream.
 */

int main()
{
    lookahead = lexan(lexbuf);
    openScope();

    while (lookahead != DONE)
	functionOrGlobal();

    generateGlobals(closeScope());
    exit(EXIT_SUCCESS);
}
