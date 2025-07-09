/*
 * File:	Symbol.h
 *
 * Description:	This file contains the class definition for symbols in
 *		Simple C.  At this point, a symbol merely consists of a
 *		name and a type, neither of which you can change.
 */

# ifndef SYMBOL_H
# define SYMBOL_H
# include <string>
# include <ostream>
# include "Type.h"

class Symbol {
    typedef std::string string;
    string _name;
    Type _type;

public:
    int offset;

    Symbol(const string &name, const Type &type);
    const string &name() const;
    const Type &type() const;
};

std::ostream &operator <<(std::ostream &ostr, const Symbol &symbol);

# endif /* SYMBOL_H */
