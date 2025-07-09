module ID_EX(CLK, RESET, PC, Rs_Data, Rt_Data, Rs, Rt, Imm, Rd, RegWrite, ALUOP, ALUSRC, BrLogic, Asig, MemRead, MemWrite, ThreeWay, 
             PC_out, Rs_Data_out, Rt_Data_out, Rs_out, Rt_out, Imm_out, Rd_out, RegWrite_out, ALUOP_out, ALUSRC_out, BrLogic_out, Asig_out, MemRead_out, MemWrite_out, ThreeWay_out);
input CLK, RESET;
input [31:0]PC, Rs_Data, Rt_Data, Imm;
input [5:0] Rd, Rs, Rt; //is rd 6 bits
input [2:0] ALUOP;
input [1:0] ALUSRC, BrLogic, ThreeWay; 
input RegWrite, Asig, MemRead, MemWrite;
output reg [31:0]PC_out, Rs_Data_out, Rt_Data_out, Imm_out;
output reg [5:0] Rd_out, Rs_out, Rt_out;
output reg[2:0] ALUOP_out;
output reg[1:0] ALUSRC_out, BrLogic_out, ThreeWay_out; 
output reg RegWrite_out, Asig_out, MemRead_out, MemWrite_out;
always@(posedge CLK or posedge RESET)
begin
    PC_out <= RESET ? 0 : PC;
    Rs_Data_out <= RESET ? 0 : Rs_Data;
    Rt_Data_out <= RESET ? 0 : Rt_Data;
    
    Imm_out <= RESET ? 0 : Imm; 
    Rd_out <= RESET ? 0 : Rd;
    Rs_out <= RESET ? 0 : Rs;
    Rt_out <= RESET ? 0 : Rt;
    
    ALUOP_out <= RESET ? 0 : ALUOP;
    ALUSRC_out <= RESET ? 0 : ALUSRC;
    BrLogic_out <= RESET ? 0 : BrLogic;
    RegWrite_out <= RESET ? 0 : RegWrite;
    Asig_out <= RESET ? 0 : Asig;
    MemRead_out <= RESET ? 0 : MemRead;
    MemWrite_out <= RESET ? 0 : MemWrite;
    ThreeWay_out <= RESET ? 0 : ThreeWay;
end
endmodule