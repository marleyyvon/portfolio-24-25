CXX		= c++ -std=c++17
CXXFLAGS	= -g -Wall
OBJS		= Register.o Scope.o Symbol.o Tree.o Type.o allocator.o \
		  checker.o generator.o lexer.o parser.o string.o writer.o
PROG		= scc

all:		$(PROG)

$(PROG):	$(OBJS)
		$(CXX) -o $(PROG) $(OBJS)

clean:;		$(RM) $(PROG) core *.o
