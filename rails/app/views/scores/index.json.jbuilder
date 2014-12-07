json.array!(@scores) do |score|
  json.extract! score, :id, :player_id, :game_id, :quiz_id, :score
  json.url score_url(score, format: :json)
end
