class CreateQuizzes < ActiveRecord::Migration
  def change
    create_table :quizzes do |t|
      t.integer :owner_id
      t.integer :qid
      t.string :title

      t.timestamps
    end
  end
end
