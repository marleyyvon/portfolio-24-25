/*
 * Function:	checker.cpp
 *
 * Description:	This file contains the public and private function and
 *		variable definitions for the semantic checker for Simple C.
 *
 *		If a symbol is redeclared, the redeclaration is discarded
 *		and the original declaration is retained.
 *
 *		Extra functionality:
 *		- inserting an undeclared symbol with the error type
 *		- optionally deleting the symbols when closing a scope
 *		- scaling the operands and results of pointer arithmetic
 *		- explicit type conversions
 */

# include <map>
# include <set>
# include <cassert>
# include <iostream>
# include "lexer.h"
# include "tokens.h"
# include "checker.h"

using std::string;

static std::set<string> defined;
static std::map<string, Type> externs;
static Scope *current, *globals;
static const Type error(ERROR), integer(INT);

static const string redefined = "redefinition of '%s'";
static const string redeclared = "redeclaration of '%s'";
static const string conflicting = "conflicting types for '%s'";
static const string undeclared = "'%s' undeclared";

static const string invalid_type = "'%s' has invalid type";
static const string invalid_return = "invalid return type";
static const string invalid_lvalue = "lvalue required in expression";
static const string invalid_operands = "invalid operands to binary %s";
static const string invalid_operand = "invalid operand to unary %s";
static const string invalid_function = "called object is not a function";
static const string invalid_arguments = "invalid arguments to called function";


/*
 * Function:	isFunctionPointer (private)
 *
 * Description:	Check if the given type is a function pointer, that is has
 *		declarators of "pointer to function returning T".
 */

static bool isFunctionPointer(const Type &t)
{
    const Declarators &decls = t.declarators();


    if (!t.isPointer() || next(decls.begin()) == decls.end())
	return false;

    return next(decls.begin())->kind() == FUNCTION;
}


/*
 * Function:	scale (private)
 *
 * Description:	Scale the result of pointer arithmetic.
 */

static Expression *scale(Expression *expr, unsigned size)
{
    int value;


    if (size == 1)
	return expr;

    if (expr->isNumber(value)) {
	delete expr;
	return new Number(value * size);
    }

    return new Multiply(expr, new Number(size), integer);
}


/*
 * Function:	decay (private)
 *
 * Description:	Return the result of performing type decay on the given
 *		expression.  An array or function is decayed to a pointer
 *		type by inserting an address expression.
 */

static const Type &decay(Expression *&expr)
{
    if (expr->type().isArray() || expr->type().isFunction())
	expr = new Address(expr, expr->type().decay());

    return expr->type();
}


/*
 * Function:	promote (private)
 *
 * Description:	Return the result of performing type promotion on the given
 *		expression.  A character is promoted to an integer by
 *		inserting a cast expression.
 */

static Expression *&promote(Expression *&expr)
{
    if (expr->type() == Type(CHAR))
	expr = new Cast(expr, expr->type().promote());

    return expr;
}


/*
 * Function:	assign (private)
 *
 * Description:	Return whether the type of the expression is assignable to
 *		the given type.  The expression undergoes decay, and then
 *		its type must be identical to the given type as if both
 *		underwent promotion.  There is no need to decay the given
 *		type as it is never an array type nor a function type since
 *		you cannot assign to those types.
 */

static bool assign(Expression *&expr, const Type &type)
{
    const Type &t = decay(expr);

    if (t.promote() != type.promote())
	return false;

    if (t != type)
	expr = new Cast(expr, type);

    return true;
}


/*
 * Function:	isInvalid (private)
 *
 * Description:	Check if the given declaration is invalid.  Invalid
 *		declarations include an array of functions, a function
 *		returning an array, and a function returning a function.
 */

static bool isInvalid(const Type &type)
{
    const Declarators &decls = type.declarators();

    for (auto it = decls.begin(); it != decls.end(); it ++)
	if (next(it) != decls.end()) {
	    if (it->kind() == ARRAY && next(it)->kind() == FUNCTION)
		return true;
	    else if (it->kind() == FUNCTION && next(it)->kind() != POINTER)
		return true;
	}

    return false;
}


/*
 * Function:	openScope
 *
 * Description:	Create a scope and make it the new current scope.
 */

Scope *openScope()
{
    current = new Scope(current);

    if (globals == nullptr)
	globals = current;

    return current;
}


/*
 * Function:	closeScope
 *
 * Description:	Remove the current scope, and make its enclosing scope the
 *		new current scope.
 */

Scope *closeScope(bool cleanup)
{
    Scope *old = current;
    current = current->enclosing();

    if (!cleanup)
	return old;

    for (auto sym : old->symbols()) {
	for (auto &decl : sym->type().declarators())
	    if (decl.kind() == FUNCTION)
		decl.parameters();

	delete sym;
    }

    delete old;
    return nullptr;
}


/*
 * Function:	defineFunction
 *
 * Description:	Define a function with the specified NAME and TYPE.
 */

Symbol *defineFunction(const string &name, const Type &type)
{
    Symbol *symbol = globals->find(name);

    if (symbol == nullptr) {
	if (isInvalid(type))
	    report(invalid_type, name);

	if (externs.count(name) && externs.at(name) != type)
	    report(conflicting, name);
	else
	    externs.insert(make_pair(name, type));

	symbol = new Symbol(name, type);
	globals->insert(symbol);

    } else if (defined.count(name) > 0)
	report(redefined, name);

    else if (type != symbol->type())
	report(conflicting, name);

    else
	delete type.parameters();

    defined.insert(name);
    return symbol;
}


/*
 * Function:	declareSymbol
 *
 * Description:	Declare a symbol with the specified NAME and TYPE.  Any
 *		redeclaration is discarded.
 */

Symbol *declareSymbol(const string &name, const Type &type)
{
    Symbol *symbol = current->find(name);

    if (symbol == nullptr) {
	if (isInvalid(type))
	    report(invalid_type, name);

	if (current == globals || type.isFunction()) {
	    if (externs.count(name) && externs.at(name) != type)
		report(conflicting, name);
	    else
		externs.insert(make_pair(name, type));
	}

	symbol = new Symbol(name, type);
	current->insert(symbol);

    } else if (current != globals && !type.isFunction())
	report(redeclared, name);

    else if (type != symbol->type())
	report(conflicting, name);

    else if (type.isFunction())
	delete type.parameters();

    return symbol;
}


/*
 * Function:	checkIdentifier
 *
 * Description:	Check if NAME is declared.  If it is undeclared, then
 *		declare it as having the error type in order to eliminate
 *		future error messages.
 */

Symbol *checkIdentifier(const string &name)
{
    Symbol *symbol = current->lookup(name);

    if (symbol == nullptr) {
	report(undeclared, name);
	symbol = new Symbol(name, error);
	current->insert(symbol);
    }

    return symbol;
}


/*
 * Function:	checkCall
 *
 * Description:	Check a function call expression.
 */

Expression *checkCall(Expression *expr, Expressions &args)
{
    Type t = expr->type();
    Type result = error;
    Parameters *params;
    Declarators decls;
    unsigned i;


    if (t != error) {
	if (isFunctionPointer(t)) {
	    t = t.dereference();
	    expr = new Dereference(expr, t);
	}

	if (!t.isFunction()) {
	    report(invalid_function);
	    return new Call(expr, args, error);
	}

	params = t.parameters();

	if (args.size() < params->types.size()) {
	    report(invalid_arguments);
	    return new Call(expr, args, error);
	}

	if (!params->variadic && args.size() > params->types.size()) {
	    report(invalid_arguments);
	    return new Call(expr, args, error);
	}

	for (i = 0; i < params->types.size(); i ++)
	    if (args[i]->type() != error && !assign(args[i], params->types[i])) {
		report(invalid_arguments);
		return new Call(expr, args, error);
	    }

	while (i < args.size())
	    decay(promote(args[i ++]));

	decls = t.declarators();
	decls.pop_front();
	result = Type(t.specifier(), decls);
    }

    return new Call(expr, args, result);
}


/*
 * Function:	checkArray
 *
 * Description:	Check an array index expression.  Both operands undergo the
 *		usual conversions, and then the left operand must have type
 *		"pointer to T" and the right operand must have type int,
 *		and the result has type T.  The pointer type must not be a
 *		function pointer.
 */

Expression *checkArray(Expression *left, Expression *right)
{
    const Type &t1 = decay(promote(left));
    const Type &t2 = decay(promote(right));
    Type result = error;


    if (t1 != error && t2 != error) {
	if (isFunctionPointer(t1))
	    report(invalid_operands, "[]");

	else if (t1.isPointer() && t2 == integer) {
	    right = scale(right, t1.dereference().size());
	    result = t1.dereference();

	} else
	    report(invalid_operands, "[]");
    }

    return new Dereference(new Add(left, right, t1), result);
}


/*
 * Function:	checkNot
 *
 * Description:	Check a logical negation expression.  The operand undergoes
 *		the usual conversions and the result has type int.
 */

Expression *checkNot(Expression *expr)
{
    const Type &t = decay(promote(expr));
    Type result = error;


    if (t != error)
	result = integer;

    return new Not(expr, result);
}


/*
 * Function:	checkNegate
 *
 * Description:	Check an arithmetic negation expression.  The operand
 *		undergoes type promotion, and then must have type int and
 *		the result has type int.
 */

Expression *checkNegate(Expression *expr)
{
    const Type &t = promote(expr)->type();
    Type result = error;


    if (t != error) {
	if (t == integer)
	    result = integer;
	else
	    report(invalid_operand, "-");
    }

    return new Negate(expr, result);
}


/*
 * Function:	checkDereference
 *
 * Description:	Check a dereference expression.  The operand undergoes type
 *		decay, and then must have type "pointer to T," and the
 *		result has type T.
 */

Expression *checkDereference(Expression *expr)
{
    const Type &t = decay(expr);
    Type result = error;


    if (t != error) {
	if (!t.isPointer())
	    report(invalid_operand, "*");
	else
	    result = t.dereference();
    }

    return new Dereference(expr, result);
}


/*
 * Function:	checkAddress
 *
 * Description:	Check an address expression.  The operand must be an
 *		lvalue, and if it has type T, then the result has type
 *		"pointer to T".
 */

Expression *checkAddress(Expression *expr)
{
    const Type &t = expr->type();
    Type result = error;


    if (t != error) {
	if (!expr->lvalue())
	    report(invalid_lvalue);
	else {
	    Declarators decls(t.declarators());
	    decls.push_front(Pointer());
	    result = Type(t.specifier(), decls);
	}
    }

    return new Address(expr, result);
}


/*
 * Function:	checkSizeof
 *
 * Description:	Check a sizeof expression.  The operand cannot have a
 *		function type.  The operand does not undergo any type
 *		conversions.
 */

Expression *checkSizeof(Expression *expr)
{
    const Type &t = expr->type();


    if (t == error)
	return new Number(0);

    if (t.isFunction()) {
	report(invalid_operand, "sizeof");
	return new Number(0);
    }

    return new Number(t.size());
}


/*
 * Function:	checkCast
 *
 * Description:	Check a cast expression.  The operand undergoes decay, and
 *		the result has the given type.
 */

Expression *checkCast(const Type &type, Expression *expr)
{
    decay(expr);
    return new Cast(expr, type);
}


/*
 * Function:	checkMultiplicative (private)
 *
 * Description:	Check a multiplication expression.  The operands undergo
 *		the usual conversions, and then both must have type int and
 *		the result has type int.
 */

static Type
checkMultiplicative(Expression *&left, Expression *&right, const string &op)
{
    const Type &t1 = decay(promote(left));
    const Type &t2 = decay(promote(right));
    Type result = error;


    if (t1 != error && t2 != error) {
	if (t1 == integer && t2 == integer)
	    result = integer;
	else
	    report(invalid_operands, op);
    }

    return result;
}


/*
 * Function:	checkMultiply
 *
 * Description:	Check a multiplication expression: left * right.
 */

Expression *checkMultiply(Expression *left, Expression *right)
{
    Type t = checkMultiplicative(left, right, "*");
    return new Multiply(left, right, t);
}


/*
 * Function:	checkDivide
 *
 * Description:	Check a division expression: left / right.
 */

Expression *checkDivide(Expression *left, Expression *right)
{
    Type t = checkMultiplicative(left, right, "/");
    return new Divide(left, right, t);
}


/*
 * Function:	checkRemainder
 *
 * Description:	Check a remainder expression: left % right.
 */

Expression *checkRemainder(Expression *left, Expression *right)
{
    Type t = checkMultiplicative(left, right, "%");
    return new Remainder(left, right, t);
}


/*
 * Function:	checkAdd
 *
 * Description:	Check an addition expression.  After the usual conversions,
 *		if both operands have type int, then the result has type
 *		int; if one operand has a pointer type and other operand
 *		has type int, then the result has that pointer type.  Any
 *		pointer type must not be a function pointer.
 */

Expression *checkAdd(Expression *left, Expression *right)
{
    const Type &t1 = decay(promote(left));
    const Type &t2 = decay(promote(right));
    Type result = error;


    if (t1 != error && t2 != error) {
	if (isFunctionPointer(t1) || isFunctionPointer(t2))
	    report(invalid_operands, "+");

	else if (t1 == integer && t2 == integer)
	    result = integer;

	else if (t1.isPointer() && t2 == integer) {
	    right = scale(right, t1.dereference().size());
	    result = t1;

	} else if (t1 == integer && t2.isPointer()) {
	    left = scale(left, t2.dereference().size());
	    result = t2;

	} else
	    report(invalid_operands, "+");
    }

    return new Add(left, right, result);
}


/*
 * Function:	checkSubtract
 *
 * Description:	Check a subtraction expression.  After the usual
 *		conversions, if both operands have type int, then the
 *		result has type int; if the left operand has a pointer type
 *		and the right operand has type int, then the result has
 *		that pointer type; if both operands are identical pointer
 *		types, then the result has type int.  Any pointer type must
 *		not be a function pointer.
 */

Expression *checkSubtract(Expression *left, Expression *right)
{
    Expression *tree;
    const Type &t1 = decay(promote(left));
    const Type &t2 = decay(promote(right));
    Type result = error;


    if (t1 != error && t2 != error) {
	if (isFunctionPointer(t1) || isFunctionPointer(t2))
	    report(invalid_operands, "-");

	else if (t1 == integer && t2 == integer)
	    result = integer;

	else if (t1.isPointer() && t1 == t2)
	    result = integer;

	else if (t1.isPointer() && t2 == integer) {
	    right = scale(right, t1.dereference().size());
	    result = t1;

	} else
	    report(invalid_operands, "-");
    }

    tree = new Subtract(left, right, result);

    if (t1.isPointer() && t1 == t2 && t1.dereference().size() != 1)
	tree = new Divide(tree, new Number(t1.dereference().size()), integer);

    return tree;
}


/*
 * Function:	checkComparative (private)
 *
 * Description:	Check an equality or relational expression.  Both operands
 *		undergo the usual conversions, then the two types must be
 *		equal and the result has type int.
 */

static Type
checkComparative(Expression *&left, Expression *&right, const string &op)
{
    const Type &t1 = decay(promote(left));
    const Type &t2 = decay(promote(right));
    Type result = error;


    if (t1 != error && t2 != error) {
	if (t1 == t2)
	    result = integer;
	else
	    report(invalid_operands, op);
    }

    return result;
}


/*
 * Function:	checkLessThan
 *
 * Description:	Check a less-than expression: left < right.
 */

Expression *checkLessThan(Expression *left, Expression *right)
{
    Type t = checkComparative(left, right, "<");
    return new LessThan(left, right, t);
}


/*
 * Function:	checkGreaterThan
 *
 * Description:	Check a greater-than expression: left > right.
 */

Expression *checkGreaterThan(Expression *left, Expression *right)
{
    Type t = checkComparative(left, right, ">");
    return new GreaterThan(left, right, t);
}


/*
 * Function:	checkLessOrEqual
 *
 * Description:	Check a less-than-or-equal expression: left <= right.
 */

Expression *checkLessOrEqual(Expression *left, Expression *right)
{
    Type t = checkComparative(left, right, "<=");
    return new LessOrEqual(left, right, t);
}


/*
 * Function:	checkGreaterOrEqual
 *
 * Description:	Check a greater-than-or-equal expression: left >= right.
 */

Expression *checkGreaterOrEqual(Expression *left, Expression *right)
{
    Type t = checkComparative(left, right, ">=");
    return new GreaterOrEqual(left, right, t);
}


/*
 * Function:	checkEqual
 *
 * Description:	Check an equality expression: left == right.
 */

Expression *checkEqual(Expression *left, Expression *right)
{
    Type t = checkComparative(left, right, "==");
    return new Equal(left, right, t);
}


/*
 * Function:	checkNotEqual
 *
 * Description:	Check an inequality expression: left != right.
 */

Expression *checkNotEqual(Expression *left, Expression *right)
{
    Type t = checkComparative(left, right, "!=");
    return new NotEqual(left, right, t);
}


/*
 * Function:	checkLogical (private)
 *
 * Description:	Check a logical-or or logical-and expression.  Both
 *		operands undergo the usual conversions, and the result has
 *		type int.
 */

static Type
checkLogical(Expression *&left, Expression *&right, const string &op)
{
    const Type &t1 = decay(promote(left));
    const Type &t2 = decay(promote(right));
    Type result = error;


    if (t1 != error && t2 != error)
	result = integer;

    return result;
}


/*
 * Function:	checkLogicalAnd
 *
 * Description:	Check a logical-and expression: left && right.
 */

Expression *checkLogicalAnd(Expression *left, Expression *right)
{
    Type t = checkLogical(left, right, "&&");
    return new LogicalAnd(left, right, t);
}


/*
 * Function:	checkLogicalOr
 *
 * Description:	Check a logical-or expression: left || right.
 */

Expression *checkLogicalOr(Expression *left, Expression *right)
{
    Type t = checkLogical(left, right, "||");
    return new LogicalOr(left, right, t);
}


/*
 * Function:	checkAssignment
 *
 * Description:	Check an assignment statement.  The left-hand side must be
 *		an lvalue whose type is neither an array nor a function.
 *		The right-hand side undergoes decay, and the type of the
 *		right-hand side must be assignable to that of the left-hand
 *		side.
 */

Statement *checkAssignment(Expression *left, Expression *right)
{
    const Type &t1 = left->type();
    const Type &t2 = right->type();


    if (t1 != error && t2 != error) {
	if (!left->lvalue() || t1.isArray() || t1.isFunction())
	    report(invalid_lvalue);
    	else if (!assign(right, t1))
	    report(invalid_operands, "=");
    }

    return new Assignment(left, right);
}


/*
 * Function:	checkReturn
 *
 * Description:	Check a return statement.  The expression undergoes type
 *		decay, and then must be assignable to the given type, which
 *		should be the return type of enclosing function.
 */

Statement *checkReturn(Expression *expr, const Type &type)
{
    if (expr->type() != error && !assign(expr, type))
	report(invalid_return);

    return new Return(expr);
}


/*
 * Function:	checkTest
 *
 * Description:	Since all types can be tested, all this function does is
 *		perform promotion and decay.
 */

Expression *checkTest(Expression *expr)
{
    decay(promote(expr));
    return expr;
}
