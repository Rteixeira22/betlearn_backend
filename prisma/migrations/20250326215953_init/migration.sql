-- CreateTable
CREATE TABLE "Users" (
    "id_user" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "birthdate" DATE NOT NULL,
    "money" DECIMAL(10,2) NOT NULL,
    "points" INTEGER NOT NULL,
    "image" VARCHAR(200),
    "bets_visibility" BOOLEAN NOT NULL DEFAULT true,
    "tutorial_verification" BOOLEAN NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Challenges" (
    "id_challenge" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "short_description" VARCHAR(100) NOT NULL,
    "long_description" VARCHAR(150) NOT NULL,
    "image" VARCHAR(200) NOT NULL,

    CONSTRAINT "Challenges_pkey" PRIMARY KEY ("id_challenge")
);

-- CreateTable
CREATE TABLE "User_has_Challenges" (
    "ref_id_user" INTEGER NOT NULL,
    "ref_id_challenge" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "blocked" BOOLEAN NOT NULL,
    "detail_seen" BOOLEAN NOT NULL,
    "progress_percentage" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_has_Challenges_pkey" PRIMARY KEY ("ref_id_user","ref_id_challenge")
);

-- CreateTable
CREATE TABLE "Questionnaire_Response" (
    "id_questionnaire_response" SERIAL NOT NULL,
    "budget" DECIMAL(10,2) NOT NULL,
    "verification" BOOLEAN NOT NULL DEFAULT false,
    "salary" INTEGER NOT NULL,
    "expenses" INTEGER NOT NULL,
    "available_amount" INTEGER NOT NULL,
    "debt" SMALLINT NOT NULL,
    "debt_monthly" DECIMAL(10,2) NOT NULL,
    "income_source" INTEGER NOT NULL,
    "ref_id_user" INTEGER NOT NULL,

    CONSTRAINT "Questionnaire_Response_pkey" PRIMARY KEY ("id_questionnaire_response")
);

-- CreateTable
CREATE TABLE "Bets" (
    "id_bets" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" SMALLINT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "potential_earning" DECIMAL(10,2) NOT NULL,
    "odd" DECIMAL(10,2) NOT NULL,
    "ref" INTEGER NOT NULL,
    "state" SMALLINT NOT NULL,
    "result" SMALLINT NOT NULL,
    "ref_id_user" INTEGER NOT NULL,

    CONSTRAINT "Bets_pkey" PRIMARY KEY ("id_bets")
);

-- CreateTable
CREATE TABLE "Games" (
    "id_game" SERIAL NOT NULL,
    "local_team" VARCHAR(50) NOT NULL,
    "visitor_team" VARCHAR(50) NOT NULL,
    "schedule" TIMESTAMP(3) NOT NULL,
    "betted_team" VARCHAR(50) NOT NULL,
    "odd" DECIMAL(10,2) NOT NULL,
    "goals_local_team" INTEGER NOT NULL,
    "goals_visitor_team" INTEGER NOT NULL,
    "image" VARCHAR(200) NOT NULL,
    "game_state" SMALLINT NOT NULL,

    CONSTRAINT "Games_pkey" PRIMARY KEY ("id_game")
);

-- CreateTable
CREATE TABLE "Bets_has_Games" (
    "ref_id_bet" INTEGER NOT NULL,
    "ref_id_game" INTEGER NOT NULL,
    "ref_id_championship" INTEGER NOT NULL,

    CONSTRAINT "Bets_has_Games_pkey" PRIMARY KEY ("ref_id_bet","ref_id_game","ref_id_championship")
);

-- CreateTable
CREATE TABLE "Championship" (
    "id_championship" SERIAL NOT NULL,
    "json" VARCHAR(200) NOT NULL,

    CONSTRAINT "Championship_pkey" PRIMARY KEY ("id_championship")
);

-- CreateTable
CREATE TABLE "User_has_Challenges_has_Steps" (
    "ref_user_has_Challenges_id_user" INTEGER NOT NULL,
    "ref_user_has_Challenges_id_challenge" INTEGER NOT NULL,
    "ref_id_steps" INTEGER NOT NULL,
    "state" SMALLINT NOT NULL,

    CONSTRAINT "User_has_Challenges_has_Steps_pkey" PRIMARY KEY ("ref_user_has_Challenges_id_user","ref_user_has_Challenges_id_challenge","ref_id_steps")
);

-- CreateTable
CREATE TABLE "Steps" (
    "id_step" SERIAL NOT NULL,
    "ref_id_step_video" INTEGER,
    "ref_id_step_bet" INTEGER,
    "ref_id_step_view" INTEGER,
    "ref_id_step_questionnaire" INTEGER,
    "ref_id_challenges" INTEGER NOT NULL,

    CONSTRAINT "Steps_pkey" PRIMARY KEY ("id_step")
);

-- CreateTable
CREATE TABLE "Step_Video" (
    "id_step_video" SERIAL NOT NULL,
    "video_url" VARCHAR(200) NOT NULL,
    "video_description" VARCHAR(200) NOT NULL,

    CONSTRAINT "Step_Video_pkey" PRIMARY KEY ("id_step_video")
);

-- CreateTable
CREATE TABLE "Step_Bet" (
    "id_step_bet" SERIAL NOT NULL,
    "bet_description" VARCHAR(200) NOT NULL,
    "bet_json" VARCHAR(200) NOT NULL,

    CONSTRAINT "Step_Bet_pkey" PRIMARY KEY ("id_step_bet")
);

-- CreateTable
CREATE TABLE "Step_Questionnaire" (
    "id_step_questionnaire" SERIAL NOT NULL,
    "questionnaire_description" VARCHAR(200) NOT NULL,
    "questionnaire_json" VARCHAR(45) NOT NULL,

    CONSTRAINT "Step_Questionnaire_pkey" PRIMARY KEY ("id_step_questionnaire")
);

-- CreateTable
CREATE TABLE "Step_View" (
    "id_step_view" SERIAL NOT NULL,
    "view_description" VARCHAR(200) NOT NULL,
    "view_page" VARCHAR(200) NOT NULL,

    CONSTRAINT "Step_View_pkey" PRIMARY KEY ("id_step_view")
);

-- CreateTable
CREATE TABLE "Tips" (
    "id_tip" SERIAL NOT NULL,
    "tip" VARCHAR(50) NOT NULL,

    CONSTRAINT "Tips_pkey" PRIMARY KEY ("id_tip")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Championship_json_key" ON "Championship"("json");

-- AddForeignKey
ALTER TABLE "User_has_Challenges" ADD CONSTRAINT "User_has_Challenges_ref_id_user_fkey" FOREIGN KEY ("ref_id_user") REFERENCES "Users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_has_Challenges" ADD CONSTRAINT "User_has_Challenges_ref_id_challenge_fkey" FOREIGN KEY ("ref_id_challenge") REFERENCES "Challenges"("id_challenge") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questionnaire_Response" ADD CONSTRAINT "Questionnaire_Response_ref_id_user_fkey" FOREIGN KEY ("ref_id_user") REFERENCES "Users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bets" ADD CONSTRAINT "Bets_ref_id_user_fkey" FOREIGN KEY ("ref_id_user") REFERENCES "Users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bets_has_Games" ADD CONSTRAINT "Bets_has_Games_ref_id_bet_fkey" FOREIGN KEY ("ref_id_bet") REFERENCES "Bets"("id_bets") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bets_has_Games" ADD CONSTRAINT "Bets_has_Games_ref_id_game_fkey" FOREIGN KEY ("ref_id_game") REFERENCES "Games"("id_game") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bets_has_Games" ADD CONSTRAINT "Bets_has_Games_ref_id_championship_fkey" FOREIGN KEY ("ref_id_championship") REFERENCES "Championship"("id_championship") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_has_Challenges_has_Steps" ADD CONSTRAINT "User_has_Challenges_has_Steps_ref_user_has_Challenges_id_u_fkey" FOREIGN KEY ("ref_user_has_Challenges_id_user", "ref_user_has_Challenges_id_challenge") REFERENCES "User_has_Challenges"("ref_id_user", "ref_id_challenge") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_has_Challenges_has_Steps" ADD CONSTRAINT "User_has_Challenges_has_Steps_ref_id_steps_fkey" FOREIGN KEY ("ref_id_steps") REFERENCES "Steps"("id_step") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Steps" ADD CONSTRAINT "Steps_ref_id_step_video_fkey" FOREIGN KEY ("ref_id_step_video") REFERENCES "Step_Video"("id_step_video") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Steps" ADD CONSTRAINT "Steps_ref_id_step_bet_fkey" FOREIGN KEY ("ref_id_step_bet") REFERENCES "Step_Bet"("id_step_bet") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Steps" ADD CONSTRAINT "Steps_ref_id_step_view_fkey" FOREIGN KEY ("ref_id_step_view") REFERENCES "Step_View"("id_step_view") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Steps" ADD CONSTRAINT "Steps_ref_id_step_questionnaire_fkey" FOREIGN KEY ("ref_id_step_questionnaire") REFERENCES "Step_Questionnaire"("id_step_questionnaire") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Steps" ADD CONSTRAINT "Steps_ref_id_challenges_fkey" FOREIGN KEY ("ref_id_challenges") REFERENCES "Challenges"("id_challenge") ON DELETE RESTRICT ON UPDATE CASCADE;
