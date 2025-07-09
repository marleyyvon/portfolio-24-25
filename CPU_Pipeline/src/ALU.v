module ALU(A,B,ALUOP,OUT,Z,N);
input [31:0]A, B;
input [2:0] ALUOP;
output reg signed [31:0] OUT;
output reg Z, N;
always@* begin
    case (ALUOP)
        3'b000:  OUT = B+A;
        3'b110:  OUT = ~B+32'b1;
        3'b101:  OUT = B-A;
        3'b111:  OUT = A;
        default: OUT = 0;
    endcase
    Z = OUT == 0 ? 1 : 0;
    N = OUT < 0 ? 1 : 0;
end
endmodule