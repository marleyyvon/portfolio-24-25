# ⚡ SCADA Trust Model: Adaptive Trust applied to Critical Infrastructure  

- *CSEN353: Trust & Privacy in Online Social Networks (Fall 2024 (Weeks 7–10))*
- Hybrid **fuzzy logic + timing-based** trust model
- ~90 % detection accuracy with <1 ms decision latency
- Built using **public Cisco SCADA stand-in dataset**
- Designed for **low-latency edge deployment**

| Layer | What  | Why  |
|-------|---------------|----------------|
| **Fuzzy familiarity score** | Tracks behavioral reputation over time using exponential decay | Avoids stale trust decisions |
| **Moore-machine timing module** | Detects anomalous command gaps or bursts | Captures subtle timing-based attacks |
| **Aggregator** | Merges trust layers into a per-packet score | Lightweight (<1 ms); runs on embedded CPUs |

### Dataset

[Cisco “Networks of Computing Hosts”](https://snap.stanford.edu/data/cisco-networks.html)  
De-identified host-to-host communication graphs with ground-truth groupings (Madani et al., IWSPA 2022).  
Chosen because its rich timestamps and role labels let me test SCADA-style anomaly detection without access to proprietary industrial traffic.

## Links

 ⭐️ [Paper](./353Paper.pdf)  
 ⭐️ [Slide deck](./353Defense.pdf)

> 📌 SRC withheld per course policy; all models and results are documented in the PDFs.

---
