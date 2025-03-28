-- DropForeignKey
ALTER TABLE "Bets_has_Games" DROP CONSTRAINT "Bets_has_Games_ref_id_bet_fkey";

-- AddForeignKey
ALTER TABLE "Bets_has_Games" ADD CONSTRAINT "Bets_has_Games_ref_id_bet_fkey" FOREIGN KEY ("ref_id_bet") REFERENCES "Bets"("id_bets") ON DELETE CASCADE ON UPDATE CASCADE;
