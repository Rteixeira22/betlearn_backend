const { PrismaClient } = require("@prisma/client");
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
            console.log(`Deactivated tip ${activeTip.id_tip}.`);
        } else {
            console.log("No active tip found.");
        }

        const nextTip = await prisma.tips.findFirst({
            where: { active: 0 },
        });

        if (nextTip) {
            await prisma.tips.update({
                where: { id_tip: nextTip.id_tip },
                data: { active: 1 },
            });
            console.log(`Activated tip ${nextTip.id_tip}.`);
        } else {
            console.log("No tip to activate.");
        }
    } catch (error) {
        console.error("Error updating tips:", error);
    } finally {
        await prisma.$disconnect();
    }
};

updateTipStates();