module CONTROL(OPCODE, RegWrite, ImmSig, ALUOP, ALUSRC, BrLogic, Asig, MemRead, MemWrite, ThreeWay);
input [3:0] OPCODE;
output reg [2:0] ALUOP;
output reg [1:0] ALUSRC, BrLogic, ThreeWay; 
output reg RegWrite, ImmSig, Asig, MemRead, MemWrite;
always@* begin
    case(OPCODE)
        4'b1111: begin ALUOP = 3'b010; ALUSRC = 2'b00; BrLogic = 2'b00; RegWrite = 1; ImmSig = 1'b1; Asig = 0; MemRead = 1'b0; MemWrite = 0; ThreeWay = 2'b01; end
        4'b1110: begin ALUOP = 3'b111; ALUSRC = 2'b00; BrLogic = 2'b00; RegWrite = 1; ImmSig = 1'b0; Asig = 0; MemRead = 1'b1; MemWrite = 0; ThreeWay = 2'b10; end
        4'b0011: begin ALUOP = 3'b111; ALUSRC = 2'b00; BrLogic = 2'b00; RegWrite = 0; ImmSig = 1'b0; Asig = 0; MemRead = 1'b0; MemWrite = 1; ThreeWay = 2'b00; end
        4'b0100: begin ALUOP = 3'b000; ALUSRC = 2'b00; BrLogic = 2'b00; RegWrite = 1; ImmSig = 1'b0; Asig = 0; MemRead = 1'b0; MemWrite = 0; ThreeWay = 2'b00; end
        4'b0101: begin ALUOP = 3'b000; ALUSRC = 2'b10; BrLogic = 2'b00; RegWrite = 1; ImmSig = 1'b0; Asig = 0; MemRead = 1'b0; MemWrite = 0; ThreeWay = 2'b00; end
        4'b0110: begin ALUOP = 3'b110; ALUSRC = 2'b01; BrLogic = 2'b00; RegWrite = 1; ImmSig = 1'b0; Asig = 0; MemRead = 1'b0; MemWrite = 0; ThreeWay = 2'b00; end
        4'b0111: begin ALUOP = 3'b101; ALUSRC = 2'b01; BrLogic = 2'b00; RegWrite = 1; ImmSig = 1'b0; Asig = 1; MemRead = 1'b0; MemWrite = 0; ThreeWay = 2'b00; end
        4'b1000: begin ALUOP = 3'b111; ALUSRC = 2'b00; BrLogic = 2'b11; RegWrite = 0; ImmSig = 1'b0; Asig = 0; MemRead = 1'b0; MemWrite = 0; ThreeWay = 2'b00; end
        4'b1010: begin ALUOP = 3'b111; ALUSRC = 2'b00; BrLogic = 2'b11; RegWrite = 0; ImmSig = 1'b0; Asig = 0; MemRead = 1'b1; MemWrite = 0; ThreeWay = 2'b10; end
        4'b1001: begin ALUOP = 3'b111; ALUSRC = 2'b00; BrLogic = 2'b01; RegWrite = 0; ImmSig = 1'b0; Asig = 0; MemRead = 1'b0; MemWrite = 0; ThreeWay = 2'b00; end
        4'b1011: begin ALUOP = 3'b111; ALUSRC = 2'b00; BrLogic = 2'b10; RegWrite = 0; ImmSig = 1'b0; Asig = 0; MemRead = 1'b0; MemWrite = 0; ThreeWay = 2'b00; end
        //0000
        default: begin ALUOP = 3'b010; ALUSRC = 2'b00; BrLogic = 2'b00; RegWrite = 0; ImmSig = 1'b0; Asig = 0; MemRead = 1'b0; MemWrite = 0; ThreeWay = 2'b00; end
    
    endcase
end
endmodule