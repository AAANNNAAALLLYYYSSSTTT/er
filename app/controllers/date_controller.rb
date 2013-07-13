class DateController < ApplicationController

  before_action :check_authorize

  def create
    $redis.hset session[:account], :year, params[:year]
    $redis.hset session[:account], :month, params[:month]
    $redis.hset session[:account], :day, params[:day]

    render text: get_selected_date_for_current_user.strftime("%F")
  end

end
