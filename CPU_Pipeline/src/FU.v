module FU(  input [5:0] Rs_EX,Rt_EX,Rd_MEM,Rd_WB,
            input RegWrite_MEM,RegWrite_WB,
            output reg [1:0]FW_A,FW_B);
always@(*)
begin
    FW_A = 2'b00;
    FW_B = 2'b00;
    if(RegWrite_MEM && Rd_MEM != 0 && Rd_MEM == Rs_EX) FW_A = 2'b10;
    if(RegWrite_MEM && Rd_MEM != 0 && Rd_MEM == Rt_EX) FW_B = 2'b10;
    if(RegWrite_WB && Rd_WB != 0 && !(RegWrite_MEM && Rd_MEM == Rs_EX) && Rd_MEM != Rs_EX && Rd_WB == Rs_EX) FW_A = 2'b01;
    if(RegWrite_WB && Rd_WB != 0 && !(RegWrite_MEM && Rd_MEM == Rt_EX) && Rd_MEM != Rt_EX && Rd_WB == Rt_EX) FW_B = 2'b01;
    //$display("FORWARD: FU cmp: Rs_EX=%0d, Rt_EX=%0d, RegWrite_MEM=%0d, RegWrite_WB=%0d, Rd_MEM=%0d, Rd_WB=%0d  => FW_A=%b FW_B=%b at time %t",
    //                Rs_EX, Rt_EX, RegWrite_MEM, RegWrite_WB, Rd_MEM, Rd_WB, FW_A, FW_B, $time);
end
endmodule