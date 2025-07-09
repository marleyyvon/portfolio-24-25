module PC(IN, CLK, RESET, Write, OUT);
input [31:0] IN;
input CLK, RESET, Write;
output reg [31:0] OUT;
always@(posedge CLK or posedge RESET) begin
    if (Write) OUT = RESET ? 0 : IN;
end
endmodule