## ⭐️ Additional Projects

Additional coursework and independent projects completed during the 2024–2025 academic year included topics in telecom infrastructure security, compiler design, and embedded systems development.

- 1️⃣ **Graduate Information Security:** Focused on infrastructure risk modeling, NIST-based analysis, and telecom vulnerability research.
- 2️⃣ **Compiler Design and Theory:** Developed a recursive-descent compiler for a C-like language with semantic analysis and assembly output.
- 3️⃣ **Graduate IoT - Project Integrate:** Explored integration of embedded hardware with wireless protocols and cloud communication pipelines.

&nbsp;

<details>
<summary><strong> 1️⃣ Verizon Analysis</strong></summary>

&nbsp;

| Deliverable                                 | Focus                                                      | Take‑aways                                              |
| ------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| **5G Core Applications Threat Report**      | Analyzed vulnerabilities in Verizon’s 5G Core architecture | Threat modeling · Telecom protocols · Technical writing |
| **Wireless Infrastructure Risk Assessment** | Applied NIST 800-30 to identify and rank risks             | Risk matrices · Control mapping · Executive reporting   |

🔗 PDFs: [`250_5G_Report.pdf`](InfoSec/250_5G_Report.pdf) • [`250_Risk_Mgmt.pdf`](InfoSec/250_Risk_Mgmt.pdf)

<sub>Both papers were produced as the capstone for *CSEN 250 — Cloud‑Native Security* and earned top marks for clarity and depth.</sub>

</details>


</details>


<details>
<summary><strong>2️⃣ C Compiler</strong></summary>

&nbsp;

Source code is available in the `Compilers/phase` folder.

This compiler was developed as part of a structured, multi-phase course project. While the project scaffolding was provided by the instructor, I implemented all core logic phases including:

- Lexical analyzer  
- Recursive-descent parser  
- Semantic checker  
- Intermediate code generator  

It compiles a subset of C into 32-bit Intel assembly.

**How to run:**
```bash
cd Compilers/phase
make                           # builds the compiler (./scc)
./scc < ../examples/qsort.c    # generates assembly
gcc -m32 qsort.s -o qsort      # assembles + links (requires 32-bit support)
./qsort < ../examples/qsort.in # runs the compiled binary
```

This process outputs a `.s` file you can inspect directly to view the generated assembly code.

**Example:**
```c
int main() {
    int x;
    x = 3 + 4;
    return x;
}
```

Produces:
```asm
        .text
        .globl main
main:
        li $t0, 3
        li $t1, 4
        add $t2, $t0, $t1
        move $v0, $t2
        jr $ra
```

</details>

<details>
<summary><strong>3️⃣ Project Integrate</strong></summary>

&nbsp;

Project Integrate is a privacy-focused smart-home prototype that runs on a four-node Raspberry Pi mesh (one root, three leaf). Each node captures Wi-Fi traffic in monitor mode, extracts RSSI values with `pcap`, and exchanges those readings over a custom IPv6/UDP JSON protocol (“LML”). By averaging RSSI and applying a log-distance path-loss model, the system localises user devices to < 1 m accuracy and triggers Govee smart lights via local HTTPS—no cloud calls, no personal data leaving the LAN. My role covered the C++ backend such as the LML packet format,  root/leaf daemons, added the channel-sync to turn raw RSSI into actionable proximity events and fallback logic against noisy 2.4 GHz environments.

&nbsp;

🔗 Forked repo: <https://github.com/marleyyvon/ProjectIntegrate>  
🔗 Paper (PDF): [Integrate/Integrate.pdf](./Integrate/Integrate.pdf)

</details>


&nbsp;

---
