class Game < ActiveRecord::Base
  has_many :scores, foreign_key: :game_id
  has_many :users, through: :scores
  belongs_to :quiz

end
