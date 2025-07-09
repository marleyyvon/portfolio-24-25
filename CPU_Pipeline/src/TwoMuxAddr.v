module TwoMuxAddr(A,B,Sel,OUT);
input [5:0]A, B;
input Sel;
output [5:0]OUT;

assign OUT = !Sel ? A : B;
endmodule

