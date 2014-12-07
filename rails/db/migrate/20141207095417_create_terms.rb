class CreateTerms < ActiveRecord::Migration
  def change
    create_table :terms do |t|
      t.integer :quiz_id
      t.text :term
      t.text :definition
      t.string :img_url
      t.integer :img_width
      t.integer :img_height
      t.integer :rank

      t.timestamps
    end
  end
end
