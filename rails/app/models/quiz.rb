class Quiz < ActiveRecord::Base
  has_many :terms
  has_many :scores
  has_many :games
  belongs_to :user, foreign_key: :owner_id
  
end
