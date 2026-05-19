const express = require("express");
const app = express();

app.use(express.json());

let sonBulunanPet = {
  petName: "Henüz Yok",
  generation: "0",
  gameId: 0,
  serverId: "",
  timestamp: 0
};

// TARAYICI BOTUN VERİ GÖNDERECEĞİ YER (POST)
app.post("/veri-ekle", (req, res) => {
  const { petName, generation, gameId, serverId, timestamp } = req.body;
  if (serverId) {
    sonBulunanPet = { petName, generation, gameId, serverId, timestamp };
    console.log(`[YENİ PET] Name: ${petName} | Gen: ${generation}`);
    return res.status(200).json({ status: "success" });
  }
  return res.status(400).json({ status: "error" });
});

// AVCI BOTUN VERİ OKUYACAĞI YER (GET)
app.get("/son-pet", (req, res) => {
  res.json(sonBulunanPet);
});

app.get("/", (req, res) => {
  res.send(`Havuz Aktif! Son Pet: ${sonBulunanPet.petName}`);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Sunucu hazir!");
});
