module IMM(IN,ImmSig,OUT);
input [31:0]IN;
input ImmSig;
output [31:0] OUT;
assign OUT = ImmSig ? {{10{IN[21]}}, IN[21:0]} : {{16{IN[15]}}, IN[15:0]};
endmodule