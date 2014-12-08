json.quiz do
  json.id @game.quiz.id
  json.title @game.quiz.title
  json.terms @game.quiz.terms do |t|
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
  json.game_id @game.id
  json.players @game.users, :id, :name
end