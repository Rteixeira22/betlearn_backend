import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const updateTipStates = async () => {
    try {
        const activeTip = await prisma.tips.findFirst({
            where: { active: 1 },
        });

        if (activeTip) {
            await prisma.tips.update({
                where: { id_tip: activeTip.id_tip },
                data: { active: 0 },
            });
            console.log(`Updated tip ${activeTip.id_tip} from active 1 to 0.`);
        } else {
            console.log("No active tip with active = 1 found.");
        }

        const nextTip = await prisma.tips.findFirst({
            where: { active: 0 },
        });

        if (nextTip) {
            await prisma.tips.update({
                where: { id_tip: nextTip.id_tip },
                data: { active: 1 },
            });
            console.log(`Updated tip ${nextTip.id_tip} from active 0 to 1.`);
        } else {
            console.log("No next tip with active = 0 found.");
        }
    } catch (error) {
        console.error("Error updating tip states:", error);
    } finally {
        await prisma.$disconnect();
    }
};

updateTipStates();