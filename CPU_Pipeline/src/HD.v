module HD(  input [5:0] Rs_ID,Rt_ID,Rd_EX,
            input [1:0] BrLogic_ID,BrLogic_EX, BrLogic_MEM,
            input CLK, MemRead_EX, Z_MEM, N_MEM, Z_WB, N_WB,
            output reg NOP,IF_ID_Write,PC_Write);
initial begin IF_ID_Write = 1; PC_Write = 1; end
always @(*) begin
  NOP          <= 1'b0;  
  IF_ID_Write  <= 1'b1;  
  PC_Write     <= 1'b1; 
  if ((MemRead_EX && (Rd_EX == Rs_ID || Rd_EX == Rt_ID)) || BrLogic_EX == 2'b11 || (BrLogic_EX == 2'b01 && Z_MEM) || (BrLogic_EX == 2'b10 && N_MEM)) begin
    $display("Hazard, bubbling");
    NOP          <= 1'b1;
    IF_ID_Write  <= 1'b0;
    PC_Write     <= 1'b0;
  end
  if (BrLogic_MEM == 2'b11 || (BrLogic_MEM == 2'b01 && Z_WB) || (BrLogic_EX == 2'b10 && N_WB)) begin
    $display("Hazard, bubbling again");
    IF_ID_Write <= 1'b0;
    NOP <= 1'b1;
    //PC_Write <= 1'b0;
  end
end
endmodule