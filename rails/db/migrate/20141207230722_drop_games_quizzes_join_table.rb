class DropGamesQuizzesJoinTable < ActiveRecord::Migration
  def change
    drop_table :games_quizzes
  end
end
