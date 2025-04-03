-- DropForeignKey
ALTER TABLE "Bets" DROP CONSTRAINT "Bets_ref_id_user_fkey";

-- DropForeignKey
ALTER TABLE "Questionnaire_Response" DROP CONSTRAINT "Questionnaire_Response_ref_id_user_fkey";

-- DropForeignKey
ALTER TABLE "Steps" DROP CONSTRAINT "Steps_ref_id_challenges_fkey";

-- DropForeignKey
ALTER TABLE "Steps" DROP CONSTRAINT "Steps_ref_id_step_bet_fkey";

-- DropForeignKey
ALTER TABLE "Steps" DROP CONSTRAINT "Steps_ref_id_step_questionnaire_fkey";

-- DropForeignKey
ALTER TABLE "Steps" DROP CONSTRAINT "Steps_ref_id_step_video_fkey";

-- DropForeignKey
ALTER TABLE "Steps" DROP CONSTRAINT "Steps_ref_id_step_view_fkey";

-- DropForeignKey
ALTER TABLE "User_has_Challenges" DROP CONSTRAINT "User_has_Challenges_ref_id_challenge_fkey";

-- DropForeignKey
ALTER TABLE "User_has_Challenges" DROP CONSTRAINT "User_has_Challenges_ref_id_user_fkey";

-- DropForeignKey
ALTER TABLE "User_has_Challenges_has_Steps" DROP CONSTRAINT "User_has_Challenges_has_Steps_ref_id_steps_fkey";

-- DropForeignKey
ALTER TABLE "User_has_Challenges_has_Steps" DROP CONSTRAINT "User_has_Challenges_has_Steps_ref_user_has_Challenges_id_u_fkey";

-- AlterTable
ALTER TABLE "Challenges" ALTER COLUMN "short_description" SET DATA TYPE VARCHAR(300),
ALTER COLUMN "long_description" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "name" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(100);

-- AddForeignKey
ALTER TABLE "User_has_Challenges" ADD CONSTRAINT "User_has_Challenges_ref_id_user_fkey" FOREIGN KEY ("ref_id_user") REFERENCES "Users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_has_Challenges" ADD CONSTRAINT "User_has_Challenges_ref_id_challenge_fkey" FOREIGN KEY ("ref_id_challenge") REFERENCES "Challenges"("id_challenge") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questionnaire_Response" ADD CONSTRAINT "Questionnaire_Response_ref_id_user_fkey" FOREIGN KEY ("ref_id_user") REFERENCES "Users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bets" ADD CONSTRAINT "Bets_ref_id_user_fkey" FOREIGN KEY ("ref_id_user") REFERENCES "Users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_has_Challenges_has_Steps" ADD CONSTRAINT "User_has_Challenges_has_Steps_ref_user_has_Challenges_id_u_fkey" FOREIGN KEY ("ref_user_has_Challenges_id_user", "ref_user_has_Challenges_id_challenge") REFERENCES "User_has_Challenges"("ref_id_user", "ref_id_challenge") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_has_Challenges_has_Steps" ADD CONSTRAINT "User_has_Challenges_has_Steps_ref_id_steps_fkey" FOREIGN KEY ("ref_id_steps") REFERENCES "Steps"("id_step") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Steps" ADD CONSTRAINT "Steps_ref_id_step_video_fkey" FOREIGN KEY ("ref_id_step_video") REFERENCES "Step_Video"("id_step_video") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Steps" ADD CONSTRAINT "Steps_ref_id_step_bet_fkey" FOREIGN KEY ("ref_id_step_bet") REFERENCES "Step_Bet"("id_step_bet") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Steps" ADD CONSTRAINT "Steps_ref_id_step_view_fkey" FOREIGN KEY ("ref_id_step_view") REFERENCES "Step_View"("id_step_view") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Steps" ADD CONSTRAINT "Steps_ref_id_step_questionnaire_fkey" FOREIGN KEY ("ref_id_step_questionnaire") REFERENCES "Step_Questionnaire"("id_step_questionnaire") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Steps" ADD CONSTRAINT "Steps_ref_id_challenges_fkey" FOREIGN KEY ("ref_id_challenges") REFERENCES "Challenges"("id_challenge") ON DELETE CASCADE ON UPDATE CASCADE;
