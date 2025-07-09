`timescale 1ns / 1ps
//////////////////////////////////////////////////////////////////////////////////
// Company: 
// Engineer: 
// 
// Create Date: 06/03/2025 09:14:39 PM
// Design Name: 
// Module Name: tb
// Project Name: 
// Target Devices: 
// Tool Versions: 
// Description: 
// 
// Dependencies: 
// 
// Revision:
// Revision 0.01 - File Created
// Additional Comments:
// 
//////////////////////////////////////////////////////////////////////////////////


module tb();
reg CLK, RESET;
integer count;
wire [31:0] instr, instr_ID;
wire [31:0] PC_In, PC_Out, PC_New, PC_Val, PC_ID, PC_EX;
wire [31:0] Rs_Data_ID, Rs_Data_EX;
wire [31:0] Rt_Data_ID, Rt_Data_EX, Rt_Data_MEM;
wire [31:0] Imm_ID, Imm_EX;
wire [31:0] Data_WB;
wire [31:0] PCwI_EX, PCwI_MEM, PCwI_WB;
wire [31:0] A, B;
wire [31:0] ALU_EX, ALU_MEM, ALU_WB;
wire [31:0] A_out, B_out;
wire [31:0] ReadData_MEM, ReadData_WB;
wire [5:0] Rd_EX, Rd_MEM, Rd_WB;
wire [5:0] Rs_EX;
wire [5:0] Rt_EX;
wire [5:0] A_Addr;
wire [5:0] B_Addr;
wire [3:0] OPCODE;
wire [2:0] ALUOP_ID, ALUOP_EX;
wire [1:0] ALUSRC_ID, ALUSRC_EX;
wire [1:0] BrLogic_ID, BrLogic_EX, BrLogic_MEM;
wire [1:0] ThreeWay_ID, ThreeWay_EX, ThreeWay_MEM, ThreeWay_WB;
wire[1:0] FW_A, FW_B;
wire RegWrite_EX, RegWrite_MEM, RegWrite_WB;
wire ImmSig;
wire Asig_ID, Asig_EX;
wire MemRead_ID, MemRead_EX, MemRead_MEM;
wire MemWrite_ID, MemWrite_EX, MemWrite_MEM;
wire Z_EX, Z_MEM, Z_WB;
wire N_EX, N_MEM, N_WB;
wire Br_Taken;
wire NOP;
wire IF_ID_Write;
wire PC_Write;

integer i;

PC pc(PC_In, CLK, RESET, PC_Write, PC_Out);
ADDR pc_add(1,PC_Out,PC_New);
TwoMux br_mux(PC_New, PC_Val, Br_Taken, PC_In);
IM im(PC_Out, instr);
IF_ID if_id(CLK,RESET,IF_ID_Write,PC_Out,instr,PC_ID, instr_ID);
//ID

TwoMuxController C_Mux(instr_ID[31:28],4'b0000, NOP, OPCODE);
CONTROL ctr(OPCODE, RegWrite_ID, ImmSig, ALUOP_ID, ALUSRC_ID, BrLogic_ID, Asig_ID, MemRead_ID, MemWrite_ID, ThreeWay_ID);
RF rf(RegWrite_WB, CLK, Rd_WB, instr_ID[21:16], instr_ID[15:10], Data_WB, Rs_Data_ID, Rt_Data_ID);
IMM imm(instr_ID, ImmSig, Imm_ID);
HD hd(instr_ID[21:16],instr_ID[15:10],Rd_EX,BrLogic_ID,BrLogic_EX,BrLogic_MEM,CLK,
MemRead_EX,Z_MEM,N_MEM,Z_WB,N_WB,
NOP,IF_ID_Write,PC_Write);
ID_EX id_ex(CLK, RESET, PC_ID, Rs_Data_ID, Rt_Data_ID, instr_ID[21:16], instr_ID[15:10], Imm_ID, instr_ID[27:22], RegWrite_ID, ALUOP_ID, ALUSRC_ID, BrLogic_ID, Asig_ID, MemRead_ID, MemWrite_ID, ThreeWay_ID, 
            PC_EX, Rs_Data_EX, Rt_Data_EX, Rs_EX, Rt_EX, Imm_EX, Rd_EX, RegWrite_EX, ALUOP_EX, ALUSRC_EX, BrLogic_EX, Asig_EX, MemRead_EX, MemWrite_EX, ThreeWay_EX);
//EX

ADDR ex_addr(PC_EX, Imm_EX, PCwI_EX);
TwoMux A_Mux(Rs_Data_EX, Rt_Data_EX, Asig_EX, A);
ThreeMux B_Mux(Rt_Data_EX, Rs_Data_EX, Imm_EX, ALUSRC_EX, B);
TwoMuxAddr A_Addr_Mux(Rs_EX, Rt_EX, Asig_EX, A_Addr);
ThreeMux B_Addr_Mux(Rt_EX, Rs_EX, 6'bxxxxxx, ALUSRC_EX, B_Addr);
FU fu(A_Addr,B_Addr,Rd_MEM,Rd_WB,RegWrite_MEM,RegWrite_WB,FW_A,FW_B);
ThreeMux A_Mux_FW(A, ALU_WB, ALU_MEM, FW_A, A_out);
ThreeMux B_Mux_FW(B, ALU_WB, ALU_MEM, FW_B, B_out);
ALU alu(A_out, B_out, ALUOP_EX, ALU_EX, Z_EX, N_EX);
EX_MEM ex_mem(CLK, RESET, PCwI_EX, Z_EX, N_EX, ALU_EX, Rt_Data_EX, Rd_EX, RegWrite_EX, BrLogic_EX, MemRead_EX, MemWrite_EX, ThreeWay_EX,
              PCwI_MEM, Z_MEM, N_MEM, ALU_MEM, Rt_Data_MEM, Rd_MEM, RegWrite_MEM, BrLogic_MEM, MemRead_MEM, MemWrite_MEM, ThreeWay_MEM);
//MEM

FourMux Br_Mux(Z_WB, N_WB, BrLogic_MEM, Br_Taken);
DM dm(MemRead_MEM, CLK, MemWrite_MEM, ALU_MEM, Rt_Data_MEM, ReadData_MEM);
TwoMux Br_addr(ALU_MEM, ReadData_MEM, ThreeWay_MEM[1], PC_Val);
MEM_WB mem_wb(CLK, RESET, Z_MEM, N_MEM, PCwI_MEM, ALU_MEM, ReadData_MEM, Rd_MEM, RegWrite_MEM, ThreeWay_MEM, 
              PCwI_WB, Z_WB, N_WB, ALU_WB, ReadData_WB, Rd_WB, RegWrite_WB, ThreeWay_WB);
//WB
ThreeMux three_mux(ALU_WB, PCwI_WB, ReadData_WB, ThreeWay_WB, Data_WB);
initial begin
    RESET = 1;
    CLK = 0;
    count = 0;
    forever begin
        #1;
        count = count+1; 
        CLK = ~CLK;
    end
end
initial begin
    #2
    RESET = 0;
end
initial begin
    for (i = 0; i < 200; i = i + 1) #2;
    $finish;
end
endmodule
