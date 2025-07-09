module EX_MEM(CLK, RESET, PCwIMM, Z, N, ALU_res, Rt, Rd, RegWrite, BrLogic, MemRead, MemWrite, ThreeWay,
PCwIMM_out, Z_out, N_out, ALU_res_out, Rt_out, Rd_out, RegWrite_out, BrLogic_out, MemRead_out, MemWrite_out, ThreeWay_out);

input CLK, RESET;
input [31:0]PCwIMM, ALU_res, Rt;
input [5:0] Rd; // is Rd actually 6 bits
input Z, N;
input [1:0] BrLogic, ThreeWay; 
input RegWrite, MemRead, MemWrite;

output reg [31:0] PCwIMM_out, ALU_res_out, Rt_out;
output reg [5:0] Rd_out;
output reg Z_out, N_out;
output reg[1:0] BrLogic_out, ThreeWay_out; 
output reg RegWrite_out, MemRead_out, MemWrite_out;

always@(posedge CLK or posedge RESET)
begin
    PCwIMM_out <= RESET ? 0 : PCwIMM;
    ALU_res_out <= RESET ? 0 : ALU_res;
    Rt_out <= RESET ? 0 : Rt;
    Rd_out <= RESET ? 0 : Rd;
    
    Z_out <= RESET ? 0 : Z;
    N_out <= RESET ? 0 : N; 
    
    BrLogic_out <= RESET ? 0 : BrLogic;
    RegWrite_out <= RESET ? 0 : RegWrite;
    MemRead_out <= RESET ? 0 : MemRead;
    MemWrite_out <= RESET ? 0 : MemWrite;
    ThreeWay_out <= RESET ? 0 : ThreeWay;
end
endmodule