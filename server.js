const express = require("express");
const app = express();

app.use(express.json());

// Tüm tarayıcılardan gelen petleri sırayla tutacak liste (Veri Havuzu Havuzu)
let petHavuzu = [];

// 1. 5 FARKLI TARAYICININ VERİ BASACAĞI YER (POST)
app.post("/veri-ekle", (req, res) => {
  const { petName, generation, gameId, serverId, timestamp } = req.body;
  
  if (!serverId || !petName || !generation) {
    return res.status(400).json({ status: "error", message: "Eksik kritik veri!" });
  }

  // Gelen tüm bilgileri eksiksiz paketliyoruz
  const yeniAv = {
    petName: petName,
    generation: generation,
    gameId: gameId,
    serverId: serverId, // Sunucuya girmek için gereken JobId
    timestamp: timestamp || Math.floor(Date.now() / 1000)
  };

  // Listeye en başa ekle (En yeni bulunan pet en üstte görünsün)
  petHavuzu.unshift(yeniAv);

  // Hafıza şişmesin diye sadece son 100 av kaydını tut tutarız
  if (petHavuzu.length > 100) {
    petHavuzu.pop();
  }

  console.log(`[HAVUZA EKLENDİ] ${petName} (${generation}) - Sunucu: ${serverId}`);
  return res.status(200).json({ status: "success", message: "Eksik veriler tamamlanarak havuza eklendi!" });
});

// 2. İLERİDE 2+ AVCININ TÜM GEÇMİŞİ VE NESİLLERİ OKUYACAĞI YER (GET)
app.get("/son-pet", (req, res) => {
  // Avcıların geçmişe erişebilmesi için tüm listeyi döner
  res.json(petHavuzu);
});

// Tarayıcıdan bakanlar için temiz bir gösterge paneli
app.get("/", (req, res) => {
  let html = `<h1>🚀 Çoklu Tarayıcı Merkezi Veri Havuzu (Aktif Av Sayısı: ${petHavuzu.length})</h1>`;
  if(petHavuzu.length === 0) {
    html += "<p>Henüz hiçbir tarayıcı hesap değerli bir pet bulamadı...</p>";
  } else {
    html += "<table border='1' cellpadding='10' style='border-collapse:collapse;'><tr><th>Zaman</th><th>Pet Adı</th><th>Generation</th><th>Server (JobId)</th></tr>";
    petHavuzu.forEach(p => {
      let zaman = new Date(p.timestamp * 1000).toLocaleTimeString("tr-TR");
      html += `<tr><td>${zaman}</td><td><b>${p.petName}</b></td><td><span style='color:green;'>${p.generation}</span></td><td><code>${p.serverId}</code></td></tr>`;
    });
    html += "</table>";
  }
  res.send(html);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Çoklu havuz sistemi hazır!");
});
