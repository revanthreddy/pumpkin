json.array!(@terms) do |term|
  json.extract! term, :id, :quiz_id, :term, :definition, :img_url, :img_width, :img_height, :rank
  json.url term_url(term, format: :json)
end
