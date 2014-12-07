#encoding: utf-8
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

milan = User.create({
              name: "Milan",
              email: "milan@kodingglobalhackathon.com",
              password: "12345678",
              password_confirmation: "12345678"
            })

revanth = User.create({
              name: "Revanth",
              email: "revanth@kodingglobalhackathon.com",
              password: "12345678",
              password_confirmation: "12345678"
            })

shawn = User.create({
              name: "Shawn",
              email: "shawn@kodingglobalhackathon.com",
              password: "12345678",
              password_confirmation: "12345678"
            })

math_quiz = Quiz.create({
              user: milan,
              qid: 0,
              title: "Dr. Pythagorasauras Loves Koding"
            })

[ 
  {
    term: "Dr. Pythagorasauras",
    definition: "Teacher of the maths and lover of angles",
    img_url: "https://pbs.twimg.com/media/B4RaS5WCQAAcmuO.jpg:small",
    img_width: 340,
    img_height: 255
  },
  {
    term: "Acute angle",
    definition: "An angle that is less than 90°",
    img_url: "https://pbs.twimg.com/media/B4Ra7BWCAAA1c7A.jpg:small",
    img_width: 340,
    img_height: 255
  },
  {
    term: "Obtuse angle",
    definition: "An angle that is more than 90°",
    img_url: "https://pbs.twimg.com/media/B4RcR3FCEAAHDs3.jpg:small",
    img_width: 340,
    img_height: 255
  },
  {
    term: "Quadrant 1",
    definition: "A quandrant in the coordinate plane where the x and y values are positive",
    img_url: "https://pbs.twimg.com/media/B4RcyV5CAAAJa2M.jpg:small",
    img_width: 340,
    img_height: 255
  },
  {
    term: "Complimentary angles",
    definition: "Two angles that add up to 90°",
    img_url: "https://pbs.twimg.com/media/B4RdNFQCEAAnTSP.jpg:small",
    img_width: 340,
    img_height: 255
  },
  {
    term: "Supplementary angles",
    definition: "Two angles that add up to 180°",
    img_url: "https://pbs.twimg.com/media/B4RdvV8CMAA-F27.jpg:small",
    img_width: 340,
    img_height: 255
  },
  {
    term: "Radius",
    definition: "A segment from the center of a circle to the edge of the circle",
    img_url: "https://pbs.twimg.com/media/B4Re53rCUAAiF6e.jpg:small",
    img_width: 340,
    img_height: 255
  },
  {
    term: "Chord",
    definition: "A segment inside a circle where both the endpoints lie on the edge of the circle",
    img_url: "https://pbs.twimg.com/media/B4RfcE-CMAAmVac.jpg:small",
    img_width: 340,
    img_height: 255
  },
  {
    term: "Alternate interior angles",
    definition: "Congruent angles on the interior of the parallel lines when a transversal crosses 2 parallel lines",
    img_url: "https://pbs.twimg.com/media/B4SH-toCEAEDYmq.jpg:small",
    img_width: 340,
    img_height: 255
  },
  {
    term: "Alternate exterior angles",
    definition: "Congruent angles on the exterior of the parallel lines when a transversal crosses 2 parallel lines",
    img_url: "https://pbs.twimg.com/media/B4SIq_fCUAA-dFJ.jpg:small",
    img_width: 340,
    img_height: 255
  }
].each_with_index do |t, i|
  Term.create({
        quiz: math_quiz,
        term: t[:term],
        definition: t[:definition],
        img_url: t[:img_url],
        img_width: t[:img_width],
        img_height: t[:img_height],
        rank: i })
end

game_milan_revanth = Game.create({
        quiz: math_quiz,
        num_players: 2 })

score_milan = Score.create({
        user: milan,
        game: game_milan_revanth,
        quiz: math_quiz,
        score: 100 })

score_revanth = Score.create({
        user: revanth,
        game: game_milan_revanth,
        quiz: math_quiz,
        score: 50 })

