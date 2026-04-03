import {
  PrismaClient,
  AssetStatus,
  PurchaseSource,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("নতুন ব্রাঞ্চ ও এক্টিভিটি লগ ডেটা দিয়ে সিডিং শুরু হচ্ছে...");
  
  const password = await bcrypt.hash("password123", 10);

  // ১. ইউজার (Users)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "সিস্টেম অ্যাডমিন",
      email: "admin@example.com",
      password,
      role: "ADMIN",
    },
  });

  // ২. ক্যাটাগরি (Categories)
  const categories = [
    { name: "ল্যাপটপ", code: "LPT" },
    { name: "মনিটর", code: "MON" },
    { name: "প্রিন্টার", code: "PRN" },
    { name: "ডেস্কটপ", code: "DSK" },
    { name: "স্ক্যানার", code: "SCN" },
    { name: "প্রজেক্টর", code: "PRJ" },
    { name: "ইউপিএস", code: "UPS" },
  ];

  const catMap: any = {};
  for (const c of categories) {
    const created = await prisma.category.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
    catMap[c.code] = created.id;
  }

  // ৩. নতুন শাখা/ব্রাঞ্চ ডেটা (Branches)
  const branches = [
    { name: "মাননীয় মন্ত্রীর দপ্তর", code: "MIN_OFFICE", location: "প্রধান ভবন", roomNumber: "১ম তলা" },
    { name: "মাননীয় প্রতিমন্ত্রীর দপ্তর", code: "S_MIN_OFFICE", location: "প্রধান ভবন", roomNumber: "২য় তলা" },
    { name: "সচিবের দপ্তর", code: "SEC_OFFICE", location: "প্রধান ভবন", roomNumber: "৩য় তলা" },
    { name: "প্রশাসন অনুবিভাগ", code: "ADMIN_WING", location: "অ্যানেক্স ভবন", roomNumber: "১ম তলা" },
    { name: "পরিষদ অনুবিভাগ", code: "COUNCIL_WING", location: "অ্যানেক্স ভবন", roomNumber: "২য় তলা" },
    { name: "উন্নয়ন অনুবিভাগ", code: "DEV_WING", location: "অ্যানেক্স ভবন", roomNumber: "৩য় তলা" },
    { name: "পরিষদ-১ শাখা", code: "COUNCIL_1", location: "অ্যানেক্স ভবন", roomNumber: "২০৫" },
    { name: "প্রশাসন-১ শাখা", code: "ADMIN_1", location: "অ্যানেক্স ভবন", roomNumber: "১০১" },
    { name: "বাজেট/প্র-২", code: "BUDGET_PR2", location: "অ্যানেক্স ভবন", roomNumber: "১০৫" },
    { name: "উন্নয়ন অধিশাখা", code: "DEV_SUB_WING", location: "অ্যানেক্স ভবন", roomNumber: "৩০১" },
    { name: "উন্নয়ন শাখা", code: "DEV_SEC", location: "অ্যানেক্স ভবন", roomNumber: "৩০৩" },
  ];

  const branchIds: number[] = [];
  for (const b of branches) {
    const created = await prisma.branch.upsert({
      where: { code: b.code },
      update: { name: b.name, location: b.location, roomNumber: b.roomNumber },
      create: { ...b, status: "Active" },
    });
    branchIds.push(created.id);
  }

  // ৪. অফিসার (Officers) 
  const officersData = [
    { name: "মোঃ রহিম আহমেদ", designation: "সহকারী ব্যবস্থাপক", email: "rahim@example.com", branchId: branchIds[0], photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/1.jpg" },
    { name: "করিম উল্লাহ", designation: "হিসাবরক্ষণ কর্মকর্তা", email: "karim@example.com", branchId: branchIds[8], photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/2.jpg" },
    { name: "নাসরিন সুলতানা", designation: "সসিস্টেম অ্যানালিস্ট", email: "nasrin@example.com", branchId: branchIds[3], photoUrl: "https://xsgames.co/randomusers/assets/avatars/female/1.jpg" },
    { name: "আরিফুল ইসলাম", designation: "প্রোগ্রামার", email: "ariful@example.com", branchId: branchIds[7], photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/3.jpg" },
    { name: "ফাতেমা জোহরা", designation: "ডেপুটি ডিরেক্টর", email: "fatema@example.com", branchId: branchIds[1], photoUrl: "https://xsgames.co/randomusers/assets/avatars/female/2.jpg" },
    { name: "সাকিব আল হাসান", designation: "ডিরেক্টর", email: "sakib@example.com", branchId: branchIds[4], photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/4.jpg" },
  ];

  for (const off of officersData) {
    const existing = await prisma.officer.findFirst({ where: { email: off.email } });
    if (existing) {
      await prisma.officer.update({ where: { id: existing.id }, data: off });
    } else {
      await prisma.officer.create({ data: off });
    }
  }

  const allOfficers = await prisma.officer.findMany();

  // ৫. অতিরিক্ত ২০+ এসেট তৈরি (Assets)
  const brands = ["Dell", "HP", "Lenovo", "Apple", "Samsung", "Asus", "Epson", "Canon", "LG"];
  const models: any = {
    LPT: ["Latitude 5420", "EliteBook 840", "ThinkPad X1", "MacBook Air", "ZenBook"],
    MON: ["UltraSharp 24", "Curved 27", "ProDisplay 32", "Gaming 144Hz"],
    PRN: ["L3210 EcoTank", "LaserJet Pro", "ImageClass", "Pixma"],
    DSK: ["Optiplex 7080", "ProDesk 600", "ThinkCentre M70"],
    SCN: ["ScanJet Pro", "CanoScan", "Epson Perfection"],
    PRJ: ["EB-X06", "ViewSonic PA503X", "BenQ MS560"],
    UPS: ["APC Smart-UPS", "Luminous 1kVA", "CyberPower"],
  };

  const statuses: AssetStatus[] = [AssetStatus.Available, AssetStatus.Assigned, AssetStatus.Under_Repair];
  const sources: PurchaseSource[] = [PurchaseSource.Budget, PurchaseSource.Admin_2, PurchaseSource.Others];

  console.log("২০টি ডেমো এসেট ও এক্টিভিটি লগ তৈরি করা হচ্ছে...");
  
  for (let i = 1; i <= 20; i++) {
    const catCodes = Object.keys(catMap);
    const randomCatCode = catCodes[Math.floor(Math.random() * catCodes.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const modelList = models[randomCatCode];
    const model = modelList[Math.floor(Math.random() * modelList.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const randomBranchId = branchIds[Math.floor(Math.random() * branchIds.length)];
    const randomCatName = categories.find(c => c.code === randomCatCode)?.name || "ডিভাইস";
    
    let currentOfficerId = null;
    if (status === AssetStatus.Assigned) {
      currentOfficerId = allOfficers[Math.floor(Math.random() * allOfficers.length)].id;
    }

    const assetTag = `ICT-2026-${String(i).padStart(3, '0')}`;
    
    const asset = await prisma.asset.upsert({
      where: { assetTag },
      update: {
        status,
        currentOfficerId,
        branchId: randomBranchId,
      },
      create: {
        assetTag,
        brand,
        model,
        serialNumber: `SN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        categoryId: catMap[randomCatCode],
        branchId: randomBranchId,
        currentOfficerId,
        status,
        purchaseSource: source,
        purchaseDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        locationDetails: "সচিবালয় ভবন",
      }
    });

    // Clear old logs to avoid duplicates
    await prisma.activityLog.deleteMany({ where: { assetId: asset.id } });

    // Registration Log
    await prisma.activityLog.create({
      data: {
        assetId: asset.id,
        actionType: "REGISTRATION",
        description: `সিস্টেমে ${randomCatName} টি অন্তর্ভুক্তি করা হয়েছে।`,
        performedById: admin.id,
        performedAt: new Date(2024, 0, 1)
      }
    });

    if (status === AssetStatus.Assigned && currentOfficerId) {
      const officer = allOfficers.find(o => o.id === currentOfficerId);
      await prisma.activityLog.create({
        data: {
          assetId: asset.id,
          actionType: "ASSIGNMENT",
          description: `${officer?.name} কে ${randomCatName} টি বরাদ্দ দেওয়া হয়েছে।`,
          performedById: admin.id,
          performedAt: new Date()
        }
      });
    } else if (status === AssetStatus.Under_Repair) {
      await prisma.activityLog.create({
        data: {
          assetId: asset.id,
          actionType: "MAINTENANCE",
          description: `টেকনিক্যাল সমস্যার কারণে ${randomCatName} টি মেরামতের জন্য পাঠানো হয়েছে।`,
          performedById: admin.id,
          performedAt: new Date()
        }
      });
    }

    if (i % 2 === 0) {
      await prisma.activityLog.create({
        data: {
          assetId: asset.id,
          actionType: "MAINTENANCE",
          description: "সফটওয়্যার আপডেট ও রুটিন চেকআপ সম্পন্ন হয়েছে।",
          performedById: admin.id,
          performedAt: new Date(2024, 5, 10)
        }
      });
    }
  }

  console.log("সিডিং সফল ভাবে সম্পন্ন হয়েছে।");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
