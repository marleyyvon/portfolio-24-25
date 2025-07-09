module ADDR(A,B,OUT);
input [31:0]A, B;
output [31:0] OUT;
assign OUT = A+B;
endmodule