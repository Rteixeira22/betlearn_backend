--SELECIONAR TUDO DO USER LOGADO (MUDAR CONDIÇÃO) --
SELECT * FROM betlearn.users WHERE id_user = 1;

-- SELECIONAR UM DOS DESAFIOS DO USER LOGADO E DO ÚLTIMO DESAFIO (MUDAR VALORES)
SELECT * FROM betlearn.user_has_challenges WHERE ref_id_user = 1 AND ref_id_challenge= 1;

-- SELECIONAR TODOS OS DESAFIOS DO USER LOGADO (MUDAR VALORES)
SELECT * FROM betlearn.user_has_challenges WHERE ref_id_challenge = 1;

-- SELECIONAR HISTORICO DE APOSTAS DO UTILIZADOR LOGADO (MUDAR VALOR) --
SELECT * FROM betlearn.bets WHERE ref_id_user = 1;

-- SELECIONAR OS DETALHES DE UM DESAFIO (MUDAR VALORES) --
SELECT * FROM betlearn.challenges WHERE id_challenge = 1;

-- SELECIONAR O DESAFIO EM PROGRESSO (MUDAR VALORES / SERVE COMO 0 OU 1) --
SELECT * FROM betlearn.user_has_challenges WHERE ref_id_user = 1 AND challenge_completed = 0;

-- SELECIONAR APOSTAS ATIVAS DO UTILIZADOR LOGADO (MUDAR VALOR / SERVE COMO 0 OU 1) --
SELECT * FROM betlearn.bets WHERE ref_id_user = 1 AND bet_state = 0;

-- SELECIONAR APOSTAS ENCERRADAS DO UTILIZADOR LOGADO (MUDAR VALOR / SERVE COMO 0 OU 1) --
SELECT * FROM betlearn.bets WHERE ref_id_user = 1 AND bet_state = 1;

-- SELECIONAR APOSTAS ENCERRADAS E GANHAS DO UTILIZADOR LOGADO (MUDAR VALOR / SERVE COMO 0 OU 1) --
SELECT * FROM betlearn.bets WHERE ref_id_user = 1 AND bet_state = 1 AND bet_result = 1;

-- SELECIONAR APOSTAS ENCERRADAS E GANHAS DO UTILIZADOR LOGADO (MUDAR VALOR / SERVE COMO 0 OU 1) --
SELECT * FROM betlearn.bets WHERE ref_id_user = 1 AND bet_state = 1 AND bet_result = 0;

-- SELECIONAR O DESAFIO EM PROGRESSO E DESBLOQUEADO (MUDAR VALORES / SERVE COMO 0 OU 1) --
SELECT * FROM betlearn.user_has_challenges WHERE ref_id_user = 1 AND challenge_completed = 0 AND challenge_blocked = 0;

-- SELECIONAR TODAS AS DICAS --
SELECT * FROM betlearn.tips;

-- SELECT UTILIZADORES ORDENADOS PELA PONTUACAO --
SELECT * FROM betlearn.users ORDER BY points DESC;

-- QUERIES DE UPDATE --

-- ATUALIZAR A PERCENTAGEM DE UM DESAFIO E O ESTADO DA VISUALIZACAO DOS DETALHES (MUDAR VALORES)
UPDATE betlearn.user_has_challenges SET challenge_detail_seen = 1, progress_percentage = 69 WHERE ref_id_user = 1;

-- ATUALIZAR A IMAGEM DE PERFIL DO UTILIZADOR LOGADO (MUDAR VALORES E USAR URL PARA MANDAR) --
UPDATE betlearn.users SET profile_image = 'a tua plima.jpg' WHERE id_user = 1;

-- ATUALIZAR O EMAIL, NOME E USERNAME DO UTILIZADOR LOGADO (MUDAR VALORES) --
UPDATE betlearn.users SET user_name = 'Ambrósio dos Ferrero Rochers ', user_email = 'atuaplima@gmail.com', username = 'a_tua_plima' WHERE id_user = 1;

-- ATUALIZAR O DINHEIRO DO UTILIZADOR (MUDAR VALORES) --
UPDATE betlearn.users SET money = 690.00 WHERE id_user = 1;

-- ATUALIZAR O ORCAMENTO DO UTILIZADOR (MUDAR VALORES) --
UPDATE betlearn.questionnaire_response SET budget = 55 WHERE ref_id_user = 1;

-- ATUALIZAR QUE JA RESPONDEU AO QUESTIONARIO INICIAL (MUDAR VALORES / SERVE COMO 0 E 1) --
UPDATE betlearn.questionnaire_response SET verification = 1 WHERE ref_id_user = 1;

-- ATUALIZAR PONTUACAO DO UTILIZADOR LOGADO (MUDAR VALORES) --
UPDATE betlearn.users SET points = 690 WHERE id_user = 1;

-- ATUALIZAR PARA DESBLOQUEAR UM DESAFIO (MUDAR VALORES) --
UPDATE betlearn.user_has_challenges SET challenge_blocked = 1 WHERE ref_id_user = 1 AND ref_id_challenge = 1;

-- ATUALIZAR PARA COMPLETAR UM DESAFIO (MUDAR VALORES) --
UPDATE betlearn.user_has_challenges SET challenge_completed = 1 WHERE ref_id_user = 1 AND ref_id_challenge = 1;

-- ATUALIZAR QUE CONCLUIU UM PASSO (FALTA ESTA QUERY) --

-- ATUALIZAR QUE O UTILIZADOR JÁ VIU O TUTORIAL DE ONBOARDING (MUDAR VALORES)
UPDATE betlearn.users SET tutorial_verification = 1 WHERE id_user = 1;

-- ATUALIZAR RESULTADO DE APOSTA (MUDAR VALORES) --
UPDATE betlearn.bets SET bet_result = 1 WHERE ref_id_user = 1;

-- ATUALIZAR O ESTADO DA APOSTA (MUDAR VALORES) --
UPDATE betlearn.bets SET bet_state = 1 WHERE ref_id_user = 1;

-- FICA A FALTAR A QUERY DE ATUALIZAÇÃO DE PASSOS --

-- QUERY DE INSERCAO DE DADOS --
-- CRIAR UTILIZADOR --
INSERT INTO  betlearn.users (user_name, user_email, username, birthdate, money, points, profile_image, tutorial_verification) VALUES
('Antoino', 'toino@gmail.com', 'toininho', '2024-05-15', 5.00, 2, 'joao.png',0);

-- ATRIBUIR OS DESAFIOS AO UTILIZADOR (A QUERY VAI TER DE REPETIR O NÚMERO DE VEZES QUE TIVER DESAFIOS) --
INSERT INTO  betlearn.user_has_challenges (ref_id_user, ref_id_challenge, challenge_completed, challenge_blocked, challenge_detail_seen, progress_percentage) VALUES
(10, 1, 0, 0, 1, 20);

-- FAZER UMA APOSTA NAS TABELAS NECESSÁRIAS --
INSERT INTO  betlearn.bets (bet_date, bet_type, amount, potential_earning, odd, bet_ref, bet_state, bet_result, ref_id_user) VALUES
('2025-02-28 15:00:00', 1, 100.00, 210.00, 2.10, 'AP12345', 0, 0, 10);
-- 2 --
INSERT INTO  betlearn.games (local_team, visitor_team, schedule, betted_team, odd, goals_local_team, goals_visitor_team, image, game_state) VALUES
('Arouca FC', 'Benfica', '2025-03-01 20:00:00', 'Arouca', 2.10, 2, 1, 'porto-benfica.png', 0, 1);
-- 3 --
INSERT INTO  betlearn.bets_has_games (ref_id_bet, ref_id_game,ref_id_championship) VALUES (11, 1,1);























