module ThreeMux(A,B,C,Sel,OUT);
input [31:0]A, B, C;
input [1:0] Sel;
output [31:0] OUT;
assign OUT = Sel[1] ? (Sel[0] ? 0 : C) : (Sel[0] ? B : A);
endmodule