/*
 * File:	allocator.cpp
 *
 * Description:	This file contains the member function definitions for
 *		functions dealing with storage allocation.  The actual
 *		classes are declared elsewhere, mainly in Tree.h.
 *
 *		Extra functionality:
 *		- maintaining minimum offset in nested blocks
 *		- allocation within statements
 */

# include <cassert>
# include <iostream>
# include "checker.h"
# include "machine.h"
# include "tokens.h"
# include "Tree.h"

using std::min;

static int current, minimum;


/*
 * Function:	Type::size
 *
 * Description:	Return the size of a type in bytes.
 */

unsigned Type::size() const
{
    unsigned count = 1;
    Declarators::const_iterator it;


    for (it = _decls.cbegin(); it != _decls.cend(); it ++)
	if (it->kind() == ARRAY)
	    count = count * it->length();
	else
	    break;

    if (it != _decls.end()) {
	assert(it->kind() != FUNCTION);
	return count * SIZEOF_PTR;
    }

    if (_specifier == INT)
	return count * SIZEOF_INT;

    return count * SIZEOF_CHAR;
}


/*
 * Function:	Block::allocate
 *
 * Description:	Allocate storage for this block.  We assign decreasing
 *		offsets for all symbols declared within this block, and
 *		then for all symbols declared within any nested block.
 *		Only symbols that have not already been allocated an offset
 *		will be assigned one, since the parameters are already
 *		assigned special offsets.
 */

void Block::allocate() const
{
    int saved;
    const Symbols &symbols = _decls->symbols();


    for (auto symbol : symbols)
	if (symbol->offset == 0 && !symbol->type().isFunction()) {
	    current -= symbol->type().size();
	    symbol->offset = current;
	}

    minimum = min(minimum, current);

    for (auto stmt : _stmts) {
	saved = current;
	stmt->allocate();
	minimum = min(minimum, current);
	current = saved;
    }
}


/*
 * Function:	While::allocate
 *
 * Description:	Allocate storage for this while statement, which
 *		essentially means allocating storage for variables declared
 *		as part of its statement.
 */

void While::allocate() const
{
    _stmt->allocate();
}


/*
 * Function:	For::allocate
 *
 * Description:	Allocate storage for this for statement, which
 *		essentially means allocating storage for variables declared
 *		as part of its statement.
 */

void For::allocate() const
{
    _stmt->allocate();
}


/*
 * Function:	If::allocate
 *
 * Description:	Allocate storage for this if-then or if-then-else
 *		statement, which essentially means allocating storage for
 *		variables declared as part of its statements.
 */

void If::allocate() const
{
    int saved;


    saved = current;
    _thenStmt->allocate();

    if (_elseStmt != nullptr) {
	current = saved;
	_elseStmt->allocate();
	minimum = min(minimum, current);
    }
}


/*
 * Function:	Procedure::allocate
 *
 * Description:	Allocate storage for this function and return the number of
 *		bytes required.  The parameters are allocated offsets as
 *		well, starting with the given offset.
 */

void Procedure::allocate(int &offset) const
{
    Parameters *params = _id->type().parameters();
    const Symbols &symbols = _body->declarations()->symbols();

    for (unsigned i = 0; i < params->types.size(); i ++) {
	symbols[i]->offset = offset;
	offset += params->types[i].size();

	while (offset % SIZEOF_ARG != 0)
	    offset ++;
    }

    current = 0;
    minimum = 0;
    _body->allocate();
    offset = minimum;
}
