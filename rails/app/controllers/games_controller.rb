require 'net/http'

class GamesController < ApplicationController
  before_action :set_game, only: [:show, :edit, :update, :destroy]

  respond_to :html, :json

  def index
    @games = Game.all
    respond_with(@games)
  end

  def show
    #check the number of players in the game
    #if less than player_num then create score for this user else render failure
    #if game now has enough players send message to node to start game
    #may god be with you
    
    if @game.users.count < @game.num_players
      Score.create({
        user: current_user,
        game: @game,
        quiz: @game.quiz,
        score: 0
      })
      
      if @game.users.count == @game.num_players
        begin
          req = Net::HTTP::Post.new(Rails.application.config.node_endpoints["game_path"],
                                        initheader = {'Content-Type' =>'application/json'})
          req.body = render_to_string "show", formats:[:json]
          res = Net::HTTP.new(Rails.application.config.node_endpoints["host"],
                              Rails.application.config.node_endpoints["port"]).start { |http|
                                http.request(req)
                              }
          puts "Response #{res.code} #{res.message}: #{res.body}"
        rescue Exception => msg  
          # display the system generated error message  
          puts msg  
        end
          
      end
      
    else
      redirect_to root_path
      return
    end
    
    
    respond_with(@game)    

  end

  def new
    @game = Game.new(game_params)
    
    @game.save
    redirect_to(@game)
  end

  def edit
  end

  def create
    @game = Game.new(game_params)
    @game.save
    respond_with(@game)
  end

  def update
    @game.update(game_params)
    respond_with(@game)
  end

  def destroy
    @game.destroy
    respond_with(@game)
  end

  private
    def set_game
      @game = Game.find(params[:id])
    end

    def game_params
      params.require(:game).permit(:quiz_id, :num_players)
    end
end
