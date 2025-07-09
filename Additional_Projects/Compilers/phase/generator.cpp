/*
 * File:	generator.cpp
 *
 * Description:	This file contains the public and member function
 *		definitions for the code generator for Simple C.
 *
 *		Extra functionality:
 *		- putting all the global declarations at the end
 */

# include <vector>
# include <cassert>
# include <iostream>
# include "generator.h"
# include "machine.h"
# include "Tree.h"

using std::cout;
using std::endl;
using std::ostream;
using std::string;

static int offset;
static string funcname, tab = "\t";
static ostream &operator <<(ostream &ostr, Expression *expr);

static Register *eax = new Register("%eax", "%al");
static Register *ecx = new Register("%ecx", "%cl");
static Register *edx = new Register("%edx", "%dl");

static std::vector<Register *> registers = {eax, ecx, edx};


/* These will be replaced with functions in the next phase.  They are here
   as placeholders so that Call::generate() is finished. */

# define assign(node,reg)
# define load(node,reg)
# define spill(reg)


/*
 * Function:	push_byte_arg (private)
 *
 * Description:	Push a byte argument on the stack.  We must sign extend the
 *		byte because all arguments are required to be a multiple of
 *		4 bytes.
 */

static void push_byte_arg(Expression *arg)
{
    if (arg->reg == nullptr)
	load(arg, getreg());

    cout << tab << "movsbl" << tab << arg << ", " << arg->reg->name() << endl;
    cout << tab << "pushl" << tab << arg->reg->name() << endl;
}


/*
 * Function:	push_word_arg (private)
 *
 * Description:	Push a word argument, i.e., an integer or pointer, on the
 *		stack.  We can push a register, an immediate, or a memory
 *		reference.
 */

static void push_word_arg(Expression *arg)
{
    cout << tab << "pushl" << tab << arg << endl;
}


/*
 * Function:	operator << (private)
 *
 * Description:	Convenience function for writing the operand of an
 *		expression using the output stream operator.
 */

static ostream &operator <<(ostream &ostr, Expression *expr)
{
    if (expr->reg != nullptr)
	return ostr << expr->reg;

    expr->operand(ostr);
    return ostr;
}


/*
 * Function:	Expression::operand
 *
 * Description:	Write an expression as an operand to the specified stream.
 */

void Expression::operand(ostream &ostr) const
{
    assert(offset != 0);
    ostr << offset << "(%ebp)";
}


/*
 * Function:	Identifier::operand
 *
 * Description:	Write an identifier as an operand to the specified stream.
 */

void Identifier::operand(ostream &ostr) const
{
    if (_symbol->offset == 0)
	ostr << global_prefix << _symbol->name();
    else
	ostr << _symbol->offset << "(%ebp)";
}


/*
 * Function:	Number::operand
 *
 * Description:	Write a number as an operand to the specified stream.
 */

void Number::operand(ostream &ostr) const
{
    ostr << "$" << _value;
}


/*
 * Function:	Call::generate
 *
 * Description:	Generate code for a function call expression.
 */

void Call::generate()
{
    unsigned bytes, old;
    static unsigned pushed = 0;
    Expression *pointer;


    /* Align the stack if necessary. */

    old = pushed;
    bytes = _args.size() * SIZEOF_ARG;

    while ((bytes + pushed) % STACK_ALIGNMENT != 0)
	pushed ++;

    if (pushed - old > 0)
	cout << tab << "subl" << tab << "$" << pushed - old << ", %esp" << endl;


    /* Generate code for the arguments and push them on the stack. */

    for (int i = _args.size() - 1; i >= 0; i --) {
	_args[i]->generate();

	if (_args[i]->type().size() == 1)
	    push_byte_arg(_args[i]);
	else
	    push_word_arg(_args[i]);

	assign(_args[i], nullptr);
	pushed += SIZEOF_ARG;
    }


    /* Spill the caller-saved registers. */

    spill(eax);
    spill(ecx);
    spill(edx);


    /* Call the function and then reclaim the stack space. */

    if (_expr->isDereference(pointer)) {
	pointer->generate();

	if (pointer->reg == nullptr)
	    load(pointer, getreg());

	cout << tab << "call" << tab << "*" << tab << pointer << endl;
	assign(pointer, nullptr);

    } else
	cout << tab << "call" << tab << _expr << endl;

    if (pushed - old > 0)
	cout << tab << "addl" << tab << "$" << pushed - old << ", %esp" << endl;

    pushed = old;
    assign(this, eax);
}


/*
 * Function:	Block::generate
 *
 * Description:	Generate code for this block, which simply means we
 *		generate code for each statement within the block.
 */

void Block::generate()
{
    for (auto stmt : _stmts) {
	stmt->generate();

	for (auto reg : registers)
	    assert(reg->node == nullptr);
    }
}


/*
 * Function:	Simple::generate
 *
 * Description:	Generate code for a simple (expression) statement, which
 *		means simply generating code for the expression.
 */

void Simple::generate()
{
    _expr->generate();
    assign(_expr, nullptr);
}


/*
 * Function:	Procedure::generate
 *
 * Description:	Generate code for this function, which entails allocating
 *		space for local variables, then emitting our prologue, the
 *		body of the function, and the epilogue.
 */

void Procedure::generate()
{
    int param_offset;


    /* Assign offsets to the parameters and local variables. */

    param_offset = 2 * SIZEOF_REG;
    offset = param_offset;
    allocate(offset);


    /* Generate our prologue. */

    funcname = _id->name();
    cout << global_prefix << funcname << ":" << endl;
    cout << tab << "pushl" << tab << "%ebp" << endl;
    cout << tab << "movl" << tab << "%esp, %ebp" << endl;
    cout << tab << "subl" << tab << "$" << funcname << ".size, %esp" << endl;


    /* Generate the body of this function. */

    _body->generate();


    /* Align the stack if necessary. */

    while ((offset - param_offset) % STACK_ALIGNMENT != 0)
	offset --;


    /* Generate our epilogue. */

    cout << endl << global_prefix << funcname << ".exit:" << endl;
    cout << tab << "movl" << tab << "%ebp, %esp" << endl;
    cout << tab << "popl" << tab << "%ebp" << endl;
    cout << tab << "ret" << endl << endl;

    cout << tab << ".set" << tab << funcname << ".size, " << -offset << endl;
    cout << tab << ".globl" << tab << global_prefix << funcname << endl << endl;
}


/*
 * Function:	generateGlobals
 *
 * Description:	Generate code for any global variable declarations.
 */

void generateGlobals(Scope *scope)
{
    const Symbols &symbols = scope->symbols();

    for (auto symbol : symbols)
	if (!symbol->type().isFunction()) {
	    cout << tab << ".comm" << tab << global_prefix << symbol->name();
	    cout << ", " << symbol->type().size() << endl;
	}
}


/*
 * Function:	Assignment::generate
 *
 * Description:	Generate code for an assignment statement.
 *
 *		NOT FINISHED: Only works if the right-hand side is an
 *		integer literal and the left-hand side is an integer
 *		scalar.
 */

void Assignment::generate()
{
    assert(dynamic_cast<Number *>(_right));
    assert(dynamic_cast<Identifier *>(_left));

    cout << tab << "movl" << tab << _right << ", " << _left << endl;
}
