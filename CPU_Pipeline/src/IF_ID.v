module IF_ID(CLK, RESET, Write, PC, Instruction, PC_out, Instruction_out);
input CLK, RESET, Write;
input [31:0]PC, Instruction;
output reg [31:0]PC_out, Instruction_out;
always@(posedge CLK or posedge RESET)
begin
    if (Write) begin
        PC_out <= RESET ? 0 : PC;
        Instruction_out <= RESET ? 0 : Instruction;
    end
    else begin
        PC_out <= 0;
        Instruction_out <= 0;
    end
end
endmodule