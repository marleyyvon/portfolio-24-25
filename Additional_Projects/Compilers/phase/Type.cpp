/*
 * File:	Type.cpp
 *
 * Description:	This file contains the member function definitions for
 *		types in Simple C.  A type consists of a specifier and a
 *		list of declarators.  A declarator is either a pointer
 *		declarator, an array declarator, or a function declarator.
 */

# include <cassert>
# include "tokens.h"
# include "Type.h"

using std::ostream;


/*
 * Function:	Declarator::Declarator (constructor)
 *
 * Description:	Initialize this declarator.  Rather than writing multiple
 *		constructors, we provide a single constructor that does
 *		everything.
 */

Declarator::Declarator(int kind, unsigned length, Parameters *parameters)
    : _kind(kind), _length(length), _parameters(parameters)
{
    assert(kind == ARRAY || kind == FUNCTION || kind == POINTER);
}


/*
 * Function:	Declarator::kind (accessor)
 *
 * Description:	Return the kind of this declarator.
 */

int Declarator::kind() const
{
    return _kind;
}


/*
 * Function:	Declarator::length (accessor)
 *
 * Description:	Return the length of this declarator, which must be an
 *		array declarator.  Is there a better way than calling
 *		assert?  There certainly isn't an easier way.
 */

unsigned Declarator::length() const
{
    assert(_kind == ARRAY);
    return _length;
}


/*
 * Function:	Declarator::parameters (accessor)
 *
 * Description:	Return the parameters of this declarator, which must be a
 *		function declarator.
 */

Parameters *Declarator::parameters() const
{
    assert(_kind == FUNCTION);
    return _parameters;
}


/*
 * Function:	Declarator:operator ==
 *
 * Description:	Return whether another declarator is equal to this
 *		declarator.
 */

bool Declarator::operator ==(const Declarator &that) const
{
    if (_kind != that._kind)
	return false;

    if (_kind == POINTER)
	return true;

    if (_kind == ARRAY)
	return _length == that._length;

    if (_parameters->variadic != that._parameters->variadic)
	return false;

    return _parameters->types == that._parameters->types;
}


/*
 * Function:	Declarator::operator !=
 *
 * Description:	Well, what do you think it does?  This is the proper way to
 *		write a function like this, although you could define it to
 *		do something else.  Yeah, like that'd be a good idea.
 */

bool Declarator::operator !=(const Declarator &that) const
{
    return !operator ==(that);
}


/*
 * Function:	operator <<
 *
 * Description:	Write a declarator to the specified output stream.  Rather
 *		than reconstructing the C declaration syntax, we write the
 *		declaration in English so we can actually understand it.
 */

ostream &operator <<(ostream &ostr, const Declarator &decl)
{
    if (decl.kind() == POINTER)
	ostr << "pointer to ";

    else if (decl.kind() == ARRAY)
	ostr << "array " << decl.length() << " of ";

    else {
	Types params = decl.parameters()->types;
	ostr << "function (";

	for (auto it = params.begin(); it != params.end(); it ++)
	    ostr << *it << (next(it) != params.end() ? ", " : "");

	if (decl.parameters()->variadic)
	    ostr << ", ...";

	if (params.size() == 0)
	    ostr << "void";

	ostr << ") returning ";
    }

    return ostr;
}


/*
 * Function:	Type::Type (constructor)
 *
 * Description:	Initialize this type with the given specifier and an empty
 *		list of declarators.
 */

Type::Type(int specifier)
    : _specifier(specifier)
{
    assert(specifier == CHAR || specifier == INT || specifier == ERROR);
}


/*
 * Function:	Type::Type (constructor)
 *
 * Description:	Initialize this type with the given specifier and list of
 *		declarators.
 */

Type::Type(int specifier, const Declarators &declarators)
    : _specifier(specifier), _decls(declarators)
{
    assert(specifier == CHAR || specifier == INT || specifier == ERROR);
}


/*
 * Function:	Type::specifier (accessor)
 *
 * Description:	Return the specifier of this type.
 */

int Type::specifier() const
{
    return _specifier;
}


/*
 * Function:	Type::declarators
 *
 * Description:	Return the declarators of this type.
 */

const Declarators &Type::declarators() const
{
    return _decls;
}


/*
 * Function:	Type::operator ==
 *
 * Description:	Return whether another type is equal to this type.
 */

bool Type::operator ==(const Type &that) const
{
    return _specifier == that._specifier && _decls == that._decls;
}


/*
 * Function:	Type::operator !=
 *
 * Description:	See the comment above for the similar function.
 */

bool Type::operator !=(const Type &that) const
{
    return !operator ==(that);
}


/*
 * Function:	Type::isArray (predicate)
 *
 * Description:	Convenience function to return whether this type is an
 *		array type.
 */

bool Type::isArray() const
{
    return !_decls.empty() && _decls.front().kind() == ARRAY;
}


/*
 * Function:	Type::isPointer (predicate)
 *
 * Description:	Convenience function to return whether this type is a
 *		pointer type.
 */

bool Type::isPointer() const
{
    return !_decls.empty() && _decls.front().kind() == POINTER;
}


/*
 * Function:	Type::isFunction (predicate)
 *
 * Description:	Convenience function to return whether this type is a
 *		function type.
 */

bool Type::isFunction() const
{
    return !_decls.empty() && _decls.front().kind() == FUNCTION;
}


/*
 * Function:	Type::parameters (accessor)
 *
 * Description:	Convenience function to return the parameters of this type,
 *		which must be a function type.
 */

Parameters *Type::parameters() const
{
    assert(isFunction());
    return _decls.front().parameters();
}


/*
 * Function:	Type::decay
 *
 * Description:	Return the result of performing type decay on this type.
 *		In Simple C, an array is decayed to a pointer type, and a
 *		function is also decayed to a pointer type.
 */

Type Type::decay() const
{
    if (isArray()) {
	Declarators decls(_decls);
	decls.front() = Pointer();
	return Type(_specifier, decls);
    }

    if (isFunction()) {
	Declarators decls(_decls);
	decls.push_front(Pointer());
	return Type(_specifier, decls);
    }

    return *this;
}


/*
 * Function:	Type::promote
 *
 * Description:	Return the result of performing arithmetic promotion on
 *		this type.  In Simple C, a character is promoted to a
 *		integer.
 */

Type Type::promote() const
{
    if (_specifier == CHAR && _decls.empty())
	return Type(INT);

    return *this;
}


/*
 * Function:	Type::dereference
 *
 * Description:	Return the result of dereferencing this type, which must be
 *		a pointer type.
 */

Type Type::dereference() const
{
    assert(isPointer());

    Declarators decls(_decls);
    decls.pop_front();
    return Type(_specifier, decls);
}


/*
 * Function:	operator <<
 *
 * Description:	Write a type to the specified output stream.
 */

ostream &operator <<(ostream &ostr, const Type &type)
{
    for (auto &decl : type.declarators())
	ostr << decl;

    if (type.specifier() == CHAR)
	ostr << "char";
    else if (type.specifier() == INT)
	ostr << "int";
    else
	ostr << "error";

    return ostr;
}
