module MEM_WB(CLK, RESET, Z, N, PCwIMM, ALU_res, ReadData, Rd, RegWrite, ThreeWay, 
              PCwIMM_out, Z_out, N_out, ALU_res_out, ReadData_out, Rd_out, RegWrite_out, ThreeWay_out);

input CLK, RESET;
input [31:0]PCwIMM, ALU_res, ReadData;
input [5:0] Rd; // is Rd actually 6 bits
input [1:0] ThreeWay;
input RegWrite, Z, N;

output reg [31:0] PCwIMM_out, ALU_res_out, ReadData_out;
output reg [5:0] Rd_out;
output reg [1:0] ThreeWay_out;
output reg RegWrite_out, Z_out, N_out;

always@(posedge CLK or posedge RESET)
begin
    PCwIMM_out <= RESET ? 0 : PCwIMM;
    ALU_res_out <= RESET ? 0 : ALU_res;
    ReadData_out <= RESET ? 0 : ReadData;
    Rd_out <= RESET ? 0 : Rd;
    
    RegWrite_out <= RESET ? 0 : RegWrite;
    ThreeWay_out <= RESET ? 0 : ThreeWay;
    Z_out <= RESET ? 0 : Z;
    N_out <= RESET ? 0 : N;
end
endmodule