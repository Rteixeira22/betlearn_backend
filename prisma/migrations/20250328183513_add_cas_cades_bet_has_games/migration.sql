-- DropForeignKey
ALTER TABLE "Bets_has_Games" DROP CONSTRAINT "Bets_has_Games_ref_id_game_fkey";

-- AddForeignKey
ALTER TABLE "Bets_has_Games" ADD CONSTRAINT "Bets_has_Games_ref_id_game_fkey" FOREIGN KEY ("ref_id_game") REFERENCES "Games"("id_game") ON DELETE CASCADE ON UPDATE CASCADE;
