module RF(WRT, CLK, Rd, Rs, Rt, DataIn, Rs_Out, Rt_Out);
input WRT, CLK;
input [5:0]Rd, Rs, Rt;
input [31:0]DataIn;
output [31:0]Rs_Out, Rt_Out;
reg [31:0]data[63:0];
integer i;
initial begin
    for (i = 0; i < 64; i = i + 1)data[i] = 0;
    data[4] = 4;
    data[2] = 27;
    data[10] = 30;
    data[11] = 10;
    data[1] = 100;
end

assign Rs_Out = data[Rs];
assign Rt_Out = data[Rt]; 

always@(Rs,Rt) $display("READ: Rs = x%0d (%0d), Rt = x%0d (%0d) at time %t", Rs, $signed(Rs_Out), Rt, $signed(Rt_Out), $time);

always@(negedge CLK)
begin
    if (WRT) begin
        data[Rd] <= DataIn;
        $display("WRITE: x%0d ? %0d at time %t", Rd, $signed(DataIn), $time);
    end
end
endmodule