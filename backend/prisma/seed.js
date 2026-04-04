const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 ডেটাবেজ সিডিং শুরু হচ্ছে (JavaScript)...");
  const password = await bcrypt.hash("password123", 10);

  // ১. ইউজার
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "সিস্টেম অ্যাডমিন",
      email: "admin@example.com",
      password: password,
      role: "ADMIN",
    },
  });

  // ২. ক্যাটাগরি
  const categories = [
    { name: "ল্যাপটপ", code: "LPT" },
    { name: "মনিটর", code: "MON" },
    { name: "প্রিন্টার", code: "PRN" },
    { name: "ডেস্কটপ", code: "DSK" },
  ];

  const catMap = {};
  for (const c of categories) {
    const created = await prisma.category.upsert({
      where: { code: c.code },
      update: { name: c.name },
      create: c,
    });
    catMap[c.code] = created.id;
  }

  // ৩. ব্রাঞ্চ
  const branchData = [
    { name: "আইসিটি সেল", code: "ICT_CELL", location: "প্রধান ভবন" },
    { name: "প্রশাসন শাখা", code: "ADMIN_SEC", location: "অ্যানেক্স ভবন" },
    { name: "হিসাব শাখা", code: "ACCOUNTS", location: "অ্যানেক্স ভবন" },
  ];

  const branchIds = [];
  for (const b of branchData) {
    const created = await prisma.branch.upsert({
      where: { code: b.code },
      update: { name: b.name },
      create: { ...b, status: "Active" },
    });
    branchIds.push(created.id);
  }

  // ৪. অফিসার
  const officers = [
    { name: "মোঃ জাহিদুল ইসলাম", email: "zahid@example.com", branchId: branchIds[0], photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/10.jpg" },
    { name: "মোসাম্মত ফারজানা আক্তার", email: "farjana@example.com", branchId: branchIds[0], photoUrl: "https://xsgames.co/randomusers/assets/avatars/female/10.jpg" },
  ];

  const createdOfficers = [];
  for (const off of officers) {
    const exists = await prisma.officer.findFirst({ where: { email: off.email } });
    if (exists) {
      const updated = await prisma.officer.update({ where: { id: exists.id }, data: off });
      createdOfficers.push(updated);
    } else {
      const created = await prisma.officer.create({ data: off });
      createdOfficers.push(created);
    }
  }

  // ৫. এসেট তৈরি ও অ্যাসাইনমেন্ট
  console.log("📦 এসেট তৈরি ও বরাদ্দ করা হচ্ছে...");
  
  // Clean up existing assignments to avoid issues during re-seed
  await prisma.assignment.deleteMany({});
  await prisma.activityLog.deleteMany({});

  const brands = ["Dell", "HP", "Lenovo", "Apple"];
  
  for (let i = 1; i <= 30; i++) {
    const assetTag = `ICT-2026-${String(i).padStart(3, '0')}`;
    const brand = brands[i % brands.length];
    const categoryCode = Object.keys(catMap)[i % Object.keys(catMap).length];
    
    // Logic: 
    // Initial 1-5 to Zahid
    // 6-10 to Farjana
    // Others Available
    let status = "Available";
    let targetOfficerId = null;

    if (i <= 5) {
      status = "Assigned";
      targetOfficerId = createdOfficers[0].id; // জাহিদুল ইসলাম
    } else if (i <= 10) {
      status = "Assigned";
      targetOfficerId = createdOfficers[1].id; // ফারজানা আক্তার
    }

    const asset = await prisma.asset.upsert({
      where: { assetTag: assetTag },
      update: { status: status, currentOfficerId: targetOfficerId, branchId: branchIds[0] },
      create: {
        assetTag: assetTag,
        brand: brand,
        model: "Pro Series " + i,
        serialNumber: `SN-${i}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        categoryId: catMap[categoryCode],
        branchId: branchIds[0],
        currentOfficerId: targetOfficerId,
        status: status,
        purchaseSource: "Planning",
        purchaseDate: new Date("2024-01-01"),
        locationDetails: "সচিবালয়, ঢাকা",
      }
    });

    if (status === "Assigned" && targetOfficerId) {
      const officer = createdOfficers.find(o => o.id === targetOfficerId);
      await prisma.assignment.create({
        data: {
          assetId: asset.id,
          officerId: targetOfficerId,
          issueDate: new Date(),
          comments: "সিস্টেম সিডিং - সরাসরি বরাদ্দ করা হয়েছে।",
        }
      });

      await prisma.activityLog.create({
        data: {
          assetId: asset.id,
          actionType: "বরাদ্দ প্রদান",
          description: `অ্যাসেটটি অফিসার ${officer.name} কে বরাদ্দ প্রদান করা হয়েছে।`,
        }
      });
    } else {
      await prisma.activityLog.create({
        data: {
          assetId: asset.id,
          actionType: "নিবন্ধন সম্পন্ন",
          description: "অ্যাসেটটি সিস্টেমে নিবন্ধিত করা হয়েছে।",
        }
      });
    }
  }

  console.log("✅ সিডিং সফলভাবে সম্পন্ন হয়েছে!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
