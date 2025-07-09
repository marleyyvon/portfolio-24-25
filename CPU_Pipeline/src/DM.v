module DM(READ, CLK, WRT, Address, DataIn, DataOut);
input READ, WRT, CLK;
input [31:0]Address, DataIn;
output reg [31:0]DataOut;
reg [31:0]data[16383:0];
initial begin
    //for (i = 0; i < 16384; i = i + 1) data[i] = 0;
    data[30] = 0;
    data[31] = -6;
    data[32] = 6;
    data[33] = 5;
    data[34] = 9;
    data[35] = 2;
    data[36] = 5;
    data[37] = 3;
    data[38] = 7;
    data[39] = 6;
    data[32] = 100;
end
always@*
begin
    DataOut = READ ? data[Address[31:0]] : 0;
    if (READ) $display("DM READ:  Mem[%0d] -> %0d  at time %t", Address, DataOut, $time);  
end

// Synchronous write
always @(negedge CLK) begin
    if (WRT) begin
        data[Address] <= DataIn;
        $display("DM WRITE: Mem[%0d] <- %0d at time %t", Address, DataIn, $time);
    end
end

endmodule