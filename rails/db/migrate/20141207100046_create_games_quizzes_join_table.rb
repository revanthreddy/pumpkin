class CreateGamesQuizzesJoinTable < ActiveRecord::Migration
  def change
    create_table :games_quizzes, id: false do |t|
      t.integer :game_id
      t.integer :quiz_id
    end
  end
end
