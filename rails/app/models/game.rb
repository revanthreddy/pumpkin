require 'jbuilder'
class Game < ActiveRecord::Base
  has_many :scores, foreign_key: :game_id
  has_many :users, through: :scores
  belongs_to :quiz

  def make_json
    Jbuilder.encode do |json|
      json.quiz do
        json.id quiz.id
        json.title quiz.title
        json.terms quiz.terms do |t|
          json.id t.id
          json.term t.term
          json.definition t.definition
          if t.img_url.blank?
            json.image nil
          else
            json.image do
              json.url t.img_url
              json.width t.img_width
              json.height t.img_height
            end
          end
          json.rank t.rank + 1
        end
      end

      json.game_id id
      json.players users, :id, :name
    end
  end
end
