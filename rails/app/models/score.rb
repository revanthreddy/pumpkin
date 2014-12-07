class Score < ActiveRecord::Base
  belongs_to :user, foreign_key: :player_id
  belongs_to :game
  belongs_to :quiz
end
