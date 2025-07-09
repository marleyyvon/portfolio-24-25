module FourMux(Z,N,Sel,OUT);
input Z, N;
input [1:0] Sel;
output OUT;
assign OUT = Sel[1] ? (Sel[0] ? 1 : N) : (Sel[0] ? Z : 0);
endmodule