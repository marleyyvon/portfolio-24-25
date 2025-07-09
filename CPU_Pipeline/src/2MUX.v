module TwoMux(A,B,Sel,OUT);
input [31:0]A, B;
input Sel;
output [31:0]OUT;
assign OUT = !Sel ? A : B;
endmodule
