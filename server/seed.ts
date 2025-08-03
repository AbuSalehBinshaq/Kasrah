import { db } from "./db";
import { teams, players, matches, transfers, news } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Add teams
  const saudiTeams = [
    {
      nameAr: "الهلال",
      nameEn: "Al-Hilal",
      league: "دوري روشن السعودي",
      primaryColor: "#0066CC",
      founded: 1957,
      stadium: "ملعب الملك فهد الدولي"
    },
    {
      nameAr: "النصر",
      nameEn: "Al-Nassr",
      league: "دوري روشن السعودي", 
      primaryColor: "#FFD700",
      founded: 1955,
      stadium: "ملعب الأمير فيصل بن فهد"
    },
    {
      nameAr: "الاتحاد",
      nameEn: "Al-Ittihad",
      league: "دوري روشن السعودي",
      primaryColor: "#FFD700",
      founded: 1927,
      stadium: "ملعب الأمير عبدالله الفيصل"
    },
    {
      nameAr: "الأهلي",
      nameEn: "Al-Ahli",
      league: "دوري روشن السعودي",
      primaryColor: "#00AA00",
      founded: 1937,
      stadium: "ملعب الأمير عبدالله الفيصل"
    }
  ];

  const insertedTeams = await db.insert(teams).values(saudiTeams).returning();
  console.log(`✅ Inserted ${insertedTeams.length} teams`);

  // Add players
  const saudiPlayers = [
    {
      nameAr: "كريستيانو رونالدو",
      nameEn: "Cristiano Ronaldo",
      teamId: insertedTeams[1].id, // النصر
      position: "مهاجم",
      age: 39,
      nationality: "البرتغال",
      goals: 25,
      assists: 12,
      appearances: 30,
      marketValue: "25000000"
    },
    {
      nameAr: "سالم الدوسري",
      nameEn: "Salem Al-Dawsari",
      teamId: insertedTeams[0].id, // الهلال
      position: "جناح أيسر",
      age: 33,
      nationality: "السعودية",
      goals: 18,
      assists: 15,
      appearances: 28,
      marketValue: "8000000"
    },
    {
      nameAr: "مالكوم",
      nameEn: "Malcolm",
      teamId: insertedTeams[0].id, // الهلال
      position: "جناح أيمن",
      age: 27,
      nationality: "البرازيل",
      goals: 22,
      assists: 8,
      appearances: 32,
      marketValue: "15000000"
    },
    {
      nameAr: "محمد كنو",
      nameEn: "Mohammed Kanno",
      teamId: insertedTeams[0].id, // الهلال
      position: "وسط دفاعي",
      age: 30,
      nationality: "السعودية",
      goals: 5,
      assists: 10,
      appearances: 35,
      marketValue: "6000000"
    }
  ];

  const insertedPlayers = await db.insert(players).values(saudiPlayers).returning();
  console.log(`✅ Inserted ${insertedPlayers.length} players`);

  // Add matches
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const saudiMatches = [
    {
      homeTeamId: insertedTeams[0].id, // الهلال
      awayTeamId: insertedTeams[1].id, // النصر
      homeScore: 2,
      awayScore: 1,
      status: "completed",
      matchDate: yesterday,
      venue: "ملعب الملك فهد الدولي",
      league: "دوري روشن السعودي",
      season: "2024-2025",
      events: [
        { minute: 25, type: "هدف", player: "مالكوم", team: "الهلال" },
        { minute: 68, type: "هدف", player: "كريستيانو رونالدو", team: "النصر" },
        { minute: 90, type: "هدف", player: "سالم الدوسري", team: "الهلال" }
      ]
    },
    {
      homeTeamId: insertedTeams[2].id, // الاتحاد
      awayTeamId: insertedTeams[3].id, // الأهلي
      homeScore: 1,
      awayScore: 1,
      status: "live",
      matchDate: today,
      venue: "ملعب الأمير عبدالله الفيصل",
      league: "دوري روشن السعودي", 
      season: "2024-2025",
      currentTime: 75,
      events: [
        { minute: 30, type: "هدف", player: "رونان", team: "الاتحاد" },
        { minute: 65, type: "هدف", player: "فيرمينو", team: "الأهلي" }
      ]
    },
    {
      homeTeamId: insertedTeams[1].id, // النصر
      awayTeamId: insertedTeams[2].id, // الاتحاد
      status: "scheduled",
      matchDate: tomorrow,
      venue: "ملعب الأمير فيصل بن فهد",
      league: "دوري روشن السعودي",
      season: "2024-2025"
    }
  ];

  const insertedMatches = await db.insert(matches).values(saudiMatches).returning();
  console.log(`✅ Inserted ${insertedMatches.length} matches`);

  // Add transfers
  const saudiTransfers = [
    {
      playerId: insertedPlayers[0].id, // رونالدو
      fromTeamId: null,
      toTeamId: insertedTeams[1].id, // النصر
      transferFee: "75000000",
      status: "completed",
      transferDate: new Date("2023-01-01"),
      season: "2023-2024"
    },
    {
      playerId: insertedPlayers[2].id, // مالكوم
      fromTeamId: null,
      toTeamId: insertedTeams[0].id, // الهلال
      transferFee: "45000000",
      status: "completed",
      transferDate: new Date("2023-08-15"),
      season: "2023-2024"
    }
  ];

  const insertedTransfers = await db.insert(transfers).values(saudiTransfers).returning();
  console.log(`✅ Inserted ${insertedTransfers.length} transfers`);

  // Add news
  const saudiNews = [
    {
      titleAr: "رونالدو يسجل هدفين رائعين في مباراة الكلاسيكو",
      titleEn: "Ronaldo scores two brilliant goals in El Clasico",
      contentAr: "سجل النجم البرتغالي كريستيانو رونالدو هدفين رائعين في مباراة النصر أمام الهلال، مما أثار حماس الجماهير في ملعب الملك فهد الدولي.",
      contentEn: "Portuguese star Cristiano Ronaldo scored two brilliant goals in Al-Nassr's match against Al-Hilal, exciting fans at King Fahd International Stadium.",
      summary: "رونالدو يتألق في الكلاسيكو السعودي بهدفين رائعين",
      category: "match",
      priority: 5,
      isBreaking: true
    },
    {
      titleAr: "الهلال يتأهل لنهائي دوري أبطال آسيا",
      titleEn: "Al-Hilal qualifies for AFC Champions League final",
      contentAr: "تأهل فريق الهلال السعودي لنهائي دوري أبطال آسيا بعد فوزه على النصر في مباراة مثيرة.",
      contentEn: "Saudi Al-Hilal qualified for the AFC Champions League final after beating Al-Nassr in an exciting match.",
      summary: "الهلال في النهائي الآسيوي",
      category: "match",
      priority: 4,
      isBreaking: false
    },
    {
      titleAr: "انتقال نيمار إلى الهلال قريباً",
      titleEn: "Neymar's transfer to Al-Hilal soon",
      contentAr: "تشير التقارير إلى أن النجم البرازيلي نيمار قريب من الانتقال إلى الهلال السعودي في صفقة قياسية.",
      contentEn: "Reports suggest Brazilian star Neymar is close to joining Saudi Al-Hilal in a record deal.",
      summary: "نيمار قريب من الهلال",
      category: "transfer",
      priority: 4,
      isBreaking: true
    }
  ];

  const insertedNews = await db.insert(news).values(saudiNews).returning();
  console.log(`✅ Inserted ${insertedNews.length} news articles`);

  console.log("🎉 Database seeded successfully!");
}

seed().catch(console.error);