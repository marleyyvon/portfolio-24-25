module TwoMuxController(A,B,Sel,OUT);
input [3:0]A, B;
input Sel;
output [3:0]OUT;
assign OUT = !Sel ? A : B;
endmodule
