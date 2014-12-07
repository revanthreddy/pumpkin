json.array!(@quizzes) do |quiz|
  json.extract! quiz, :id, :qid, :title, :owner_id
  json.url quiz_url(quiz, format: :json)
end
