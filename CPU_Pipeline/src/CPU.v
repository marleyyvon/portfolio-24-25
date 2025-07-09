module CPU(CLK);
input CLK;
//IF
wire [31:0] PC_In, PC_Out, PC_New, PC_Val, instr, PC_ID, instr_ID;
wire Br_Taken;
PC pc(PC_IN, PC_Out);
ADDR pc_add(1,PC_Out,PC_New);
TwoMux br_mux(PC_New, PC_Val, Br_Taken, PC_In);
IM im(PC_Out, instr);
IF_ID if_id(CLK,PC_Out,instr,PC_ID, instr_ID);
//ID
wire [31:0] PC_EX, Rs_ID, Rt_ID, Imm_ID, Rs_EX, Rt_EX, Imm_EX, Data_WB;
wire [5:0] Rd_ID, Rd_EX, Rd_WB;
wire [2:0] ALUOP_ID, ALUOP_EX;
wire [1:0] ALUSRC_ID, BrLogic_ID, ThreeWay_ID, ALUSRC_EX, BrLogic_EX, ThreeWay_EX;
wire Reg_Write_ID, ImmSig, Asig_ID, MemRead_ID, MemWrite_ID, RegWrite_EX, RegWrite_WB, Asig_EX, MemRead_EX, MemWrite_EX;
CONTROL ctr(instr_ID[31:28], RegWrite_ID, ImmSig, ALUOP_ID, ALUSRC_ID, BrLogic_ID, Asig_ID, MemRead_ID, MemWrite_ID, ThreeWay_ID);
RF rf(RegWrite_WB, Rd_WB, instr_ID[21:16], instr_ID[15:10], Data_WB, Rs_ID, Rt_ID);
IMM imm(instr_ID, ImmSig, Imm_ID);
ID_EX id_ex(CLK, PC_ID, Rs_ID, Rt_ID, Imm_ID, Rd_ID, RegWrite_ID, ALUOP_ID, ALUSRC_ID, BrLogic_ID, Asig_ID, MemRead_ID, MemWrite_ID, ThreeWay_ID, 
            PC_EX, Rs_EX, Rt_EX, Imm_EX, Rd_EX, RegWrite_EX, ALUOP_EX, ALUSRC_EX, BrLogic_EX, Asig_EX, MemRead_EX, MemWrite_EX, ThreeWay_EX);
//EX
wire [31:0] PCwI_EX, PCwI_MEM, A, B, ALU_EX, ALU_MEM, Rt_MEM;
wire [5:0] Rd_MEM;
wire [1:0] ThreeWay_MEM, BrLogic_MEM;
wire Z_EX, Z_MEM, N_EX, N_MEM, RegWrite_MEM, MemRead_MEM, MemWrite_MEM; 
ADDR ex_addr(PC_EX, Imm_EX, PCwI_EX);
TwoMux A_Mux(Rs_EX, Rt_EX, Asig_EX, A);
ThreeMux B_Mux(Rt_EX, Rs_EX, Imm_EX, ALUSRC_EX, B);
ALU alu(A, B, ALUOP_EX, ALU_EX, Z_EX, N_EX);
EX_MEM ex_mem(CLK, PCwI_EX, Z_EX, N_EX, ALU_EX, Rt_EX, Rd_EX, RegWrite_EX, BrLogic_EX, MemRead_EX, MemWrite_EX, ThreeWay_EX,
              PCwI_MEM, Z_MEM, N_MEM, ALU_MEM, Rt_MEM, Rd_MEM, RegWrite_MEM, BrLogic_MEM, MemRead_MEM, MemWrite_MEM, ThreeWay_MEM);
//MEM
wire [31:0] ReadData_MEM, ReadData_WB, ALU_WB, PCwI_WB;
wire [1:0] ThreeWay_WB;
wire Z_WB, N_WB; 
FourMux Br_Mux(Z_WB, N_WB, BrLogic_MEM, Br_Taken);
DM dm(MemRead_MEM, MemWrite_MEM, ALU_MEM, Rt_MEM, ReadData_MEM);
TwoMux Br_addr(ALU_MEM, ReadData_MEM, ThreeWay_EX[1], PC_Val);
MEM_WB mem_wb(CLK, Z_MEM, N_MEM, PCwI_MEM, ALU_MEM, ReadData_MEM, Rd_MEM, RegWrite_MEM, ThreeWay_MEM, 
              PCwI_WB, Z_WB, N_WB, ALU_WB, ReadData_WB, Rd_WB, RegWrite_WB, ThreeWay_WB);
//WB
ThreeMux three_mux(ALU_WB, PCwI_WB, ReadData_WB, ThreeWay_WB, Data_WB);

begin
    
end
endmodule
