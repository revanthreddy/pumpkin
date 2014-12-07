class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.integer :quiz_id
      t.integer :num_players

      t.timestamps
    end
  end
end
